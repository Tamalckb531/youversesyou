import { HabitCreateController, HabitGetController, HabitGetOneController, HabitMarkController, HabitPatchController, HabitUnMarkController } from "../controller/habit.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const habitRoute = createAuthenticatedRoute();

habitRoute.post("/", HabitCreateController);
habitRoute.get("/", HabitGetController);
habitRoute.patch("/:id", HabitPatchController);
habitRoute.get("/:id", HabitGetOneController);
habitRoute.put("/:id/mark", HabitMarkController);
habitRoute.delete("/:id/mark", HabitUnMarkController);

