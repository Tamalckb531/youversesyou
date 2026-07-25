import { betterAuth } from "better-auth";
import { db } from "../db/index"
import * as schema from "../db/schema"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.users,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        },
    }),

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account",
        },
    },

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 120, 
        },
    },

    user: {
        modelName: "users", 
        additionalFields: {
        status: {
            type: "string",
            input: false, 
            returned: true,
        },
        onboardingCompletedAt: {
            type: "date",
            input: false,
            returned: true,
            required: false,
        },
        },
    },

    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                return {
                    data: {
                    ...user,
                    status: "pending",
                    },
                };
                },
            },
        },
    },

  advanced: {
    database: {
      generateId: "uuid",
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/social": { window: 60, max: 10 },
      "/callback/google": { window: 60, max: 10 },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;