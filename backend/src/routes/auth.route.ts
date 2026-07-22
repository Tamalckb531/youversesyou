import { Hono } from "hono";
import { auth } from "../lib/auth";
import { authController } from "../controller/auth.controller";
import {
  resolveSession,
  requireAuth,
  type AuthEnv,
} from "../middleware/auth.middleware";

export const authRoutes = new Hono<AuthEnv>();

// Better Auth endpoints
authRoutes.on(["GET", "POST"], "/*", (c) => auth.handler(c.req.raw));

// Custom endpoints
authRoutes.use("*", resolveSession);

authRoutes.get("/me", requireAuth, authController.me);

authRoutes.post(
  "/onboarding/complete",
  requireAuth,
  authController.completeOnboarding
);