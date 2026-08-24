import { HabitCreateController, HabitDeleteController, HabitGetController, HabitGetOneController, HabitMarkController, HabitPatchController } from "../controller/habit.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const todoRoute = createAuthenticatedRoute();

todoRoute.post("/", HabitCreateController);
todoRoute.get("/", HabitGetController);
todoRoute.patch("/:id", HabitPatchController);
todoRoute.delete("/:id", HabitDeleteController);
todoRoute.get("/:id", HabitGetOneController);
todoRoute.put("/:id/mark", HabitMarkController);
