import { Hono } from "hono";
import {
  requireAuth,
  resolveSession,
  type AuthEnv,
} from "../middleware/auth.middleware";
import { ReflectionsGetController, ReflectionsGetOneController, ReflectionsPatchController, ReflectionsPostController } from "../controller/reflection.controller";

export const reflectionRoutes = new Hono<AuthEnv>();

reflectionRoutes.use("*", resolveSession, requireAuth);

reflectionRoutes.get("/", ReflectionsGetController);
reflectionRoutes.post("/", ReflectionsPostController);
reflectionRoutes.get("/:id", ReflectionsGetOneController);
reflectionRoutes.patch("/:id", ReflectionsPatchController);

