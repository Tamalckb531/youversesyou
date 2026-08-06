import { Hono } from "hono";
import {
  requireAuth,
  resolveSession,
  testMiddleware,
  type AuthEnv,
} from "../middleware/auth.middleware";
import { ReflectionsGetController, ReflectionsGetOneController, ReflectionsPatchController, ReflectionsPostController } from "../controller/reflection.controller";

export const reflectionRoutes = new Hono<AuthEnv>();

{process.env.NODE_ENV!=="test" && reflectionRoutes.use("*", resolveSession, requireAuth);}
{process.env.NODE_ENV==="test" && reflectionRoutes.use("*", testMiddleware);}

reflectionRoutes.get("/", ReflectionsGetController);
reflectionRoutes.post("/", ReflectionsPostController);
reflectionRoutes.get("/:id", ReflectionsGetOneController);
reflectionRoutes.patch("/:id", ReflectionsPatchController);

