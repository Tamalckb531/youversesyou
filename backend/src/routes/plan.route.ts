import { PlanPostController } from "../controller/plan.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const planRoutes = createAuthenticatedRoute();

planRoutes.get("/", PlanPostController);
planRoutes.post("/", PlanPostController);
planRoutes.get("/:id", PlanPostController);
planRoutes.patch("/:id", PlanPostController);

