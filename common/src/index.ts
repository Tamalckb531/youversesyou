// user.ts

import { z } from "zod";

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
  archivedAt: z.coerce.date().optional().nullable(),
});
export type reflectionType = z.infer<typeof reflectionSchema>;

export const createReflectionSchema = reflectionSchema.omit({
  id: true,
  userId: true,
  status: true,
  previousVersionId: true,
  createdAt: true,
  archivedAt: true,
});
export type createReflectionType = z.infer<typeof createReflectionSchema>;

export const bulkCreateReflectionSchema = z.array(createReflectionSchema).min(1);
export type bulkCreateReflectionType = z.infer<typeof bulkCreateReflectionSchema>;