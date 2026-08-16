import { z } from "zod";
export declare const userStatusSchema: z.ZodEnum<{
    disrupted: "disrupted";
    dormant: "dormant";
    pending: "pending";
    uncertain: "uncertain";
}>;
export type userStatus = z.infer<typeof userStatusSchema>;
export declare const meResponseSchema: z.ZodObject<{
    id: z.ZodUUID;
    email: z.ZodEmail;
    name: z.ZodString;
    status: z.ZodEnum<{
        disrupted: "disrupted";
        dormant: "dormant";
        pending: "pending";
        uncertain: "uncertain";
    }>;
    onboardingCompletedAt: z.ZodNullable<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type MeResponse = z.infer<typeof meResponseSchema>;
export declare const completeOnboardingSchema: z.ZodObject<{}, z.core.$strip>;
export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
export declare const authErrorSchema: z.ZodObject<{
    error: z.ZodEnum<{
        ACCOUNT_BANNED: "ACCOUNT_BANNED";
        ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED";
        ONBOARDING_ALREADY_COMPLETE: "ONBOARDING_ALREADY_COMPLETE";
        ONBOARDING_INCOMPLETE: "ONBOARDING_INCOMPLETE";
        UNAUTHENTICATED: "UNAUTHENTICATED";
    }>;
    message: z.ZodString;
}, z.core.$strip>;
export type AuthError = z.infer<typeof authErrorSchema>;
export declare const reflectionTypeSchema: z.ZodEnum<{
    dream: "dream";
    goal: "goal";
    pain_point: "pain_point";
}>;
export type reflectionTypeType = z.infer<typeof reflectionTypeSchema>;
export declare const entityStatusSchema: z.ZodEnum<{
    active: "active";
    archived: "archived";
}>;
export type entityStatusType = z.infer<typeof entityStatusSchema>;
export declare const reflectionMetadataSchema: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
export declare const reflectionSchema: z.ZodObject<{
    id: z.ZodUUID;
    userId: z.ZodUUID;
    type: z.ZodEnum<{
        dream: "dream";
        goal: "goal";
        pain_point: "pain_point";
    }>;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    targetDate: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    status: z.ZodEnum<{
        active: "active";
        archived: "archived";
    }>;
    slotIndex: z.ZodNumber;
    previousVersionId: z.ZodNullable<z.ZodOptional<z.ZodUUID>>;
    createdAt: z.ZodCoercedDate<unknown>;
    updatedAt: z.ZodCoercedDate<unknown>;
    archivedAt: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
}, z.core.$strip>;
export type reflectionType = z.infer<typeof reflectionSchema>;
export declare const createReflectionSchema: z.ZodObject<{
    type: z.ZodEnum<{
        dream: "dream";
        goal: "goal";
        pain_point: "pain_point";
    }>;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    targetDate: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    slotIndex: z.ZodNumber;
}, z.core.$strip>;
export type createReflectionType = z.infer<typeof createReflectionSchema>;
export declare const bulkCreateReflectionSchema: z.ZodArray<z.ZodObject<{
    type: z.ZodEnum<{
        dream: "dream";
        goal: "goal";
        pain_point: "pain_point";
    }>;
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    targetDate: z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    slotIndex: z.ZodNumber;
}, z.core.$strip>>;
export type bulkCreateReflectionType = z.infer<typeof bulkCreateReflectionSchema>;
export declare const updateReflectionSchema: z.ZodObject<{
    type: z.ZodOptional<z.ZodEnum<{
        dream: "dream";
        goal: "goal";
        pain_point: "pain_point";
    }>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    targetDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodCoercedDate<unknown>>>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>>;
    status: z.ZodOptional<z.ZodEnum<{
        active: "active";
        archived: "archived";
    }>>;
    slotIndex: z.ZodOptional<z.ZodNumber>;
    updatedAt: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export type updateReflectionSchemaType = z.infer<typeof updateReflectionSchema>;
export declare const planTypeSchema: z.ZodEnum<{
    monthly: "monthly";
    overall: "overall";
    weekly: "weekly";
    yearly: "yearly";
}>;
export type PlanType = z.infer<typeof planTypeSchema>;
export declare const planCreateItemSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodEnum<{
        monthly: "monthly";
        overall: "overall";
        weekly: "weekly";
        yearly: "yearly";
    }>;
    time: z.ZodNullable<z.ZodString>;
    junctionIdArray: z.ZodArray<z.ZodUUID>;
}, z.core.$strip>;
export declare const planBulkCreateSchema: z.ZodArray<z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    type: z.ZodEnum<{
        monthly: "monthly";
        overall: "overall";
        weekly: "weekly";
        yearly: "yearly";
    }>;
    time: z.ZodNullable<z.ZodString>;
    junctionIdArray: z.ZodArray<z.ZodUUID>;
}, z.core.$strip>>;
export declare const updatePlanSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export type PlanCreateItem = z.infer<typeof planCreateItemSchema>;
export type PlanBulkCreateInput = z.infer<typeof planBulkCreateSchema>;
export type updatePlanSchema = z.infer<typeof updatePlanSchema>;
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
    linkedIds: string[];
}
export type PlanBulkCreateResponseDTO = PlanResponseDTO[];
