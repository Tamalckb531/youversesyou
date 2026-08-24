import { TodoCreateController, TodoDeleteController, TodoGetController, TodoGetOneController, TodoMarkController, TodoPatchController } from "../controller/todo.controller";
import { createAuthenticatedRoute } from "./createAuthenticationRoute";

export const todoRoute = createAuthenticatedRoute();

todoRoute.post("/", TodoCreateController);
todoRoute.get("/", TodoGetController);
todoRoute.patch("/:id", TodoPatchController);
todoRoute.delete("/:id", TodoDeleteController);
todoRoute.get("/:id", TodoGetOneController);
todoRoute.put("/:id/mark", TodoMarkController);
