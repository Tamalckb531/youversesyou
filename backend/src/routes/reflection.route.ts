import { Hono } from "hono";
import { authController } from "../controller/auth.controller";
import {
  type AuthEnv,
} from "../middleware/auth.middleware";

export const reflectionRoutes = new Hono<AuthEnv>();

reflectionRoutes.get("/", authController.me);
reflectionRoutes.post("/", authController.me);
reflectionRoutes.get("/:id", authController.me);
reflectionRoutes.patch("/:id", authController.me);
reflectionRoutes.get("/type/:type", authController.me);

