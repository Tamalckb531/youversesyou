import { Hono } from "hono";
import {
  type AuthEnv,
} from "../middleware/auth.middleware";
import { ReflectionsGetController, ReflectionsGetOneController, ReflectionsPatchController, ReflectionsPostController } from "../controller/reflection.controller";

export const reflectionRoutes = new Hono<AuthEnv>();

reflectionRoutes.get("/", ReflectionsGetController);
reflectionRoutes.post("/", ReflectionsPostController);
reflectionRoutes.get("/:id", ReflectionsGetOneController);
reflectionRoutes.patch("/:id", ReflectionsPatchController);

