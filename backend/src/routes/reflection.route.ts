import { Hono } from "hono";
import { authController } from "../controller/auth.controller";
import {
  type AuthEnv,
} from "../middleware/auth.middleware";
import { ReflectionsGetController, ReflectionsPostController } from "../controller/reflection.controller";

export const reflectionRoutes = new Hono<AuthEnv>();

reflectionRoutes.get("/", ReflectionsGetController);
reflectionRoutes.post("/", ReflectionsPostController);
reflectionRoutes.get("/:id", authController.me);
reflectionRoutes.patch("/:id", authController.me);
reflectionRoutes.get("/type/:type", authController.me);

