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
