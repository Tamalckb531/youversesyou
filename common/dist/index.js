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
