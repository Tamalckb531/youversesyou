import { Hono } from "hono";
import { auth } from "../lib/auth";
import { authController } from "../controller/auth.controller";
import {
  resolveSession,
  requireAuth,
  type AuthEnv,
} from "../middleware/auth.middleware";

export const authRoutes = new Hono<AuthEnv>();

