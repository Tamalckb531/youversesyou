import { ReflectionsGetController, ReflectionsGetOneController, ReflectionsPatchController, ReflectionsPostController } from "../controller/reflection.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const planRoutes = createAuthenticatedRoute();

planRoutes.get("/", ReflectionsGetController);
planRoutes.post("/", ReflectionsPostController);
planRoutes.get("/:id", ReflectionsGetOneController);
planRoutes.patch("/:id", ReflectionsPatchController);

