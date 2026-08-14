import { Hono } from "hono";
import {
  requireAuth,
  resolveSession,
  testMiddleware,
  type AuthEnv,
} from "../middleware/auth.middleware";
import { ReflectionsGetController, ReflectionsGetOneController, ReflectionsPatchController, ReflectionsPostController } from "../controller/reflection.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const reflectionRoutes = createAuthenticatedRoute();

reflectionRoutes.get("/", ReflectionsGetController);
reflectionRoutes.post("/", ReflectionsPostController);
reflectionRoutes.get("/:id", ReflectionsGetOneController);
reflectionRoutes.patch("/:id", ReflectionsPatchController);

