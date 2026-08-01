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
