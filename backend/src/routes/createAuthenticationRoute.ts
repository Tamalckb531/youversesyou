import { Hono } from "hono";
import {
  requireAuth,
  resolveSession,
  testMiddleware,
  type AuthEnv,
} from "../middleware/auth.middleware";

export function createAuthenticatedRoute() {
  const route = new Hono<AuthEnv>();

  if (process.env.NODE_ENV !== "test") {
    route.use("*", resolveSession, requireAuth);
  } else {
    route.use("*", testMiddleware);
  }

  return route;
}