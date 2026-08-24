import { HabitCreateController, HabitDeleteController, HabitGetController, HabitGetOneController, HabitMarkController, HabitPatchController } from "../controller/habit.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const habitRoute = createAuthenticatedRoute();

habitRoute.post("/", HabitCreateController);
habitRoute.get("/", HabitGetController);
habitRoute.patch("/:id", HabitPatchController);
habitRoute.delete("/:id", HabitDeleteController);
habitRoute.get("/:id", HabitGetOneController);
habitRoute.post("/:id/mark", HabitMarkController);
