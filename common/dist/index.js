// user.ts
import { z } from "zod";
//! Auth types and schemas 
export const userStatusSchema = z.enum(["pending", "dormant", "disrupted", "uncertain"]);
export const meResponseSchema = z.object({
    id: z.uuid(),
    email: z.email(),
    name: z.string(),
    status: userStatusSchema,
    onboardingCompletedAt: z.coerce.date().nullable(),
});
export const completeOnboardingSchema = z.object({});
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
//! Reflection types and schemas 
export const reflectionTypeSchema = z.enum(["goal", "pain_point", "dream"]);
export const entityStatusSchema = z.enum(["active", "archived"]);
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
export const bulkCreateReflectionSchema = z.array(createReflectionSchema).min(1);
//? updates
export const updateReflectionSchema = reflectionSchema.omit({
    id: true,
    userId: true,
    previousVersionId: true,
    createdAt: true,
    archivedAt: true,
}).partial();
