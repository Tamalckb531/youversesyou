import { ReflectionsGetController, ReflectionsGetOneController, ReflectionsPatchController, ReflectionsPostController } from "../controller/reflection.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const planningRoutes = createAuthenticatedRoute();

planningRoutes.get("/", ReflectionsGetController);
planningRoutes.post("/", ReflectionsPostController);
planningRoutes.get("/:id", ReflectionsGetOneController);
planningRoutes.patch("/:id", ReflectionsPatchController);

