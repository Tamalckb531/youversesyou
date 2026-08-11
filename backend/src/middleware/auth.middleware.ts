
import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { auth, type AuthUser, type Session } from "../lib/auth";
import { TEST_MIDDLEWARE_USER } from "../test-data";

export type AuthEnv = {
  Variables: {
    user: AuthUser | null;
    session: Session | null;
  };
};

//! This is for testing
export const testMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  c.set("user", TEST_MIDDLEWARE_USER);
  return next();
});

//? Does this request belong to a logged-in user?
export const resolveSession = createMiddleware<AuthEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

//? Did resolveSession find a user?
export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json(
      { error: "UNAUTHENTICATED", message: "Sign in required." },
      401,
    );
  }
  return next();
});

//? Even though you're logged in, is your account allowed to use the app?
export const requireActiveStatus = createMiddleware<AuthEnv>(async (c, next) => {
  const user = c.get("user")!; 

  if (user.status === "suspended") {
    return c.json(
      { error: "ACCOUNT_SUSPENDED", message: "This account is suspended." },
      403,
    );
  }
  if (user.status === "banned" || user.status === "deleted") {
    return c.json(
      { error: "ACCOUNT_BANNED", message: "This account is no longer active." },
      403,
    );
  }
  return next();
});

//? Is user completed the onboarding queries (status) ?
export const requireOnboardingComplete = createMiddleware<AuthEnv>(async (c, next) => {
  const user = c.get("user")!;

  if (user.status === "pending") {
    return c.json(
      {
        error: "ONBOARDING_INCOMPLETE",
        message: "Complete onboarding before accessing this resource.",
      },
      403,
    );
  }
  return next();
});


export function getAuthedUser(c: Context<AuthEnv>): AuthUser {
  const user = c.get("user");
  if (!user) throw new Error("getAuthedUser called without requireAuth middleware");
  return user;
}
