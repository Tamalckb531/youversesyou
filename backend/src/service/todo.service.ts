import { responseMsg } from "../lib/constants";

export const TodoService = {
    async allTodos(userId: string) {
        return TodoRepository.findAllHabitsByUserId(userId);  
    },

    async oneTodo(userId: string, habitId: string) {
        const todo = await TodoRepository.oneTodo(habitId, userId);
        if (!todo) throw new Error(responseMsg.todo.error.NO_TODO_ID);
        return todo;
    },
}