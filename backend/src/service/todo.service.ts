import { responseMsg } from "../lib/constants";
import { HabitRepository } from "../repository/habit.repository";
import { PlanRepository } from "../repository/plan.repository";
import { TodoRepository } from "../repository/todo.repository";

export const TodoService = {
    async allTodos(userId: string) {
        return TodoRepository.findAllHabitsByUserId(userId);  
    },

    async oneTodo(userId: string, todoId: string) {
        const todo = await TodoRepository.oneTodo(todoId, userId);
        if (!todo) throw new Error(responseMsg.todo.error.NO_TODO_ID);
        return todo;
    },

    async createOne(userId: string, item: TodoCreateItem) {
        let plan = null;
        let habit = null;
        
        if(item.planId) plan = await PlanRepository.findOnePlanByUserIdWithoutCon(userId, item.planId);
        if (item.habitId) habit = await HabitRepository.findOneHabitByUserIdWithoutCon(userId, item.habitId);
        
        if (item.planId && !plan) throw new Error(responseMsg.todo.error.INVALID_PLAN_ID)
        if (item.habitId && !habit) throw new Error(responseMsg.todo.error.INVALID_HABIT_ID)
        
        const newItem = toNewTodo(item)
        
        return TodoRepository.createWithLinks(userId, newItem)
    },

    async updateTodo(userId: string, todoId: string, item: updateHabitSchemaType) {
        const currentHabit = await HabitRepository.findOneHabitByUserIdWithoutCon(todoId, userId);        
        if (!currentHabit) throw new Error(responseMsg.todo.error.NO_TODO_ID);
        return TodoRepository.updateOneTodo(item, todoId, userId);
    },

    async deleteTodo(userId: string, todoId: string) {
        const targetTodo = await TodoRepository.findOneTodoByUserId(todoId, userId);        
        if (!targetTodo) throw new Error(responseMsg.todo.error.NO_TODO_ID);
        const deletedTodo = await TodoRepository.deleteTodo(todoId, userId);
        return deletedTodo.id;
    },

    async markedTodo(userId: string, todoId: string) {
        const log = await TodoRepository.markTodo(todoId, userId);
        return log;
    }
}