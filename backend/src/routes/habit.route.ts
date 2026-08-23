import { HabitGetController } from "../controller/habit.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const habitRoute = createAuthenticatedRoute();

habitRoute.post("/", HabitGetController);
habitRoute.get("/", HabitGetController);
habitRoute.patch("/:id", HabitGetController);
habitRoute.get("/:id", HabitGetController);
habitRoute.put("/:id/mark", HabitGetController);
habitRoute.delete("/:id/mark", HabitGetController);

