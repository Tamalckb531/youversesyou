// user.ts

import { boolean, z } from "zod";

//! Auth types and schemas 
export const userStatusSchema = z.enum(["pending", "dormant", "disrupted","uncertain"]);
export type userStatus = z.infer<typeof userStatusSchema>;

export const meResponseSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string(),
  status: userStatusSchema,
  onboardingCompletedAt: z.coerce.date().nullable(),
});
export type MeResponse = z.infer<typeof meResponseSchema>;

export const completeOnboardingSchema = z.object({});
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;

export const authErrorSchema = z.object({
  error: z.enum([
    "UNAUTHENTICATED",
    "ACCOUNT_SUSPENDED",
    "ACCOUNT_BANNED",
    "ONBOARDING_INCOMPLETE",
    "ONBOARDING_ALREADY_COMPLETE",
  ]),
  message: z.string(),
});
export type AuthError = z.infer<typeof authErrorSchema>;


//! Reflection types and schemas 
export const reflectionTypeSchema = z.enum(["goal", "pain_point", "dream"]);
export type reflectionTypeType = z.infer<typeof reflectionTypeSchema>;

export const entityStatusSchema = z.enum(["active", "archived"]);
export type entityStatusType = z.infer<typeof entityStatusSchema>;

export const reflectionMetadataSchema = z.record(z.string(), z.unknown()).optional().nullable();

export const reflectionSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  type: reflectionTypeSchema,
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  targetDate: z.coerce.date().optional().nullable(),
  metadata: reflectionMetadataSchema,
  status: entityStatusSchema,
  slotIndex: z.number().int().min(1).max(5),
  previousVersionId: z.uuid().optional().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  archivedAt: z.coerce.date().optional().nullable(),
});
export type reflectionType = z.infer<typeof reflectionSchema>;

//? Creation
export const createReflectionSchema = reflectionSchema.omit({
  id: true,
  userId: true,
  status: true,
  previousVersionId: true,
  createdAt: true,
  updatedAt: true,
  archivedAt: true,
});
export type createReflectionType = z.infer<typeof createReflectionSchema>;

export const bulkCreateReflectionSchema = z.array(createReflectionSchema).min(1);
export type bulkCreateReflectionType = z.infer<typeof bulkCreateReflectionSchema>;

//? updates
export const updateReflectionSchema = reflectionSchema.omit({
  id: true,
  userId: true,
  previousVersionId: true,
  createdAt: true,
  archivedAt: true,
}).partial();

export type updateReflectionSchemaType = z.infer<typeof updateReflectionSchema>;

//! Planning types and schemas 
export const planTypeSchema = z.enum(["overall", "yearly", "monthly", "weekly"]);
export type PlanType = z.infer<typeof planTypeSchema>;
export const planStatusSchema = z.enum(["active", "completed", "abandoned"]);

// null only for "overall"; "20**" year for "yearly"; "Jan".."Dec" for "monthly";
// "Week1".."Week52" (no leading zero, no Week0/Week53+) for "weekly".
// Cross-field consistency (time shape must match `type`) is enforced via superRefine below,
// not here, since a single field regex can't see its sibling `type` field.
const yearRegex = /^20\d{2}$/;
const monthRegex = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/;
const weekRegex = /^Week([1-9]|[1-4][0-9]|5[0-2])$/;

const planTimeSchema = z.string().nullable();

const planCreateItemBaseSchema = z
  .object({
    title: z.string().trim().min(1, "title is required").max(200),
    description: z.string().trim().max(2000).nullable().optional(),
    type: planTypeSchema,
    time: planTimeSchema,
    status: planStatusSchema,
    // ids of one-level-up entities to link: reflections (if type === "overall")
    // or parent plans (if type !== "overall"). Deduped server-side.
    junctionIdArray: z
      .array(z.uuid("junctionIdArray must contain valid uuids"))
      .min(1, "at least one parent/reflection link is required")
      .max(5),
  });

export const planCreateItemSchema = planCreateItemBaseSchema
  .superRefine((val, ctx) => {
    if (val.type === "overall") {
      if (val.time !== null) {
        ctx.addIssue({
          code: "custom",
          path: ["time"],
          message: "time must be null for overall plans",
        });
      }
      return;
    }
    if (val.time === null) {
      ctx.addIssue({
        code: "custom",
        path: ["time"],
        message: `time is required for ${val.type} plans`,
      });
      return;
    }
    const isValid =
      (val.type === "yearly" && yearRegex.test(val.time)) ||
      (val.type === "monthly" && monthRegex.test(val.time)) ||
      (val.type === "weekly" && weekRegex.test(val.time));
    if (!isValid) {
      ctx.addIssue({
        code: "custom",
        path: ["time"],
        message: `time "${val.time}" does not match expected format for type "${val.type}"`,
      });
    }
  });

export const planBulkCreateSchema = z
  .array(planCreateItemSchema)
  .min(1, "at least one plan is required")
  .max(50, "cannot create more than 50 plans at once")
  .refine(
    (items) => items.every((i) => i.type === items[0].type),
    { message: "all plans in a single bulk request must share the same type" },
  );

export const updatePlanSchema = planCreateItemBaseSchema.omit({
  type: true,
  time: true,
  junctionIdArray: true
}).partial();

export type PlanCreateItem = z.infer<typeof planCreateItemSchema>;
export type PlanBulkCreateInput = z.infer<typeof planBulkCreateSchema>;
export type updatePlanSchemaType = z.infer<typeof updatePlanSchema>;

export interface PlanResponseDTO {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  type: PlanType;
  time: string | null;
  status: "active" | "completed" | "abandoned";
  createdAt: string;
  updatedAt: string;
  // ids actually linked after validation — echoes back what was connected,
  // useful for the frontend to reconcile optimistic state
  linkedIds: string[];
}
 
export type PlanBulkCreateResponseDTO = PlanResponseDTO[];

//! Habit types and schemas 
export const habitCreateItemBaseSchema = z
  .object({
    name: z.string().trim().min(1, "name is required").max(200),
    description: z.string().trim().max(2000).nullable().optional(),
    color: z.string().trim().max(10).nullable().optional(),
    isArchived: z.boolean().optional(),
    junctionIdArray: z
      .array(z.uuid("junctionIdArray must contain valid uuids"))
      .min(1, "at least one parent/reflection link is required")
      .max(5, "Can not insert more then 5 reflections for a single habit"),
  });

export const updateHabitSchema = habitCreateItemBaseSchema.omit({
  junctionIdArray: true
}).partial();

export type HabitCreateItem = z.infer<typeof habitCreateItemBaseSchema>;
export type updateHabitSchemaType = z.infer<typeof updateHabitSchema>;

export interface HabitResponseDTO {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  color: string | null;
  isArchived: boolean | undefined;
  createdAt: string;
  updatedAt: string;
  linkedIds: string[];
}

export const habitLogCreateSchema = z.object({
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format")
    .refine((val) => {
      const parsed = new Date(val + "T00:00:00Z");
      return !isNaN(parsed.getTime());
    }, "date is not a valid calendar date")
    .refine((val) => {
      const today = new Date().toISOString().slice(0, 10);
      return val <= today;
    }, "date cannot be in the future"),
});
 
export type HabitLogCreateItem = z.infer<typeof habitLogCreateSchema>;
