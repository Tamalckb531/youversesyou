import { PlanGetController, PlanGetOneController, PlanPatchController, PlanPostController } from "../controller/plan.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const habitRoute = createAuthenticatedRoute();

habitRoute.post("/", PlanPostController);
habitRoute.get("/", PlanGetController);
habitRoute.patch("/:id", PlanPatchController);
habitRoute.get("/:id", PlanGetOneController);
habitRoute.put("/:id/mark", PlanGetOneController);
habitRoute.delete("/:id/mark", PlanGetOneController);

