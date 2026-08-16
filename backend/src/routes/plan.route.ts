import { PlanGetController, PlanPostController } from "../controller/plan.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const planRoutes = createAuthenticatedRoute();

planRoutes.get("/", PlanGetController);
planRoutes.post("/", PlanPostController);
planRoutes.get("/:id", PlanPostController);
planRoutes.patch("/:id", PlanPostController);

