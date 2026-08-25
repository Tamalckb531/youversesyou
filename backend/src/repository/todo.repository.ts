import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { todos } from "../db/schema";
import { PlanRepository } from "./plan.repository";
import { HabitRepository } from "./habit.repository";

export type NewTodo = typeof todos.$inferInsert;
export type Todo = typeof todos.$inferSelect;

export const TodoRepository = {
    async findAllHabitsByUserId(userId: string) {
        return await getDb()
            .select()
            .from(todos)
            .where(eq(todos.userId, userId));
    },
    async oneTodo(todoId: string, userId: string) {
        const [todo] = await getDb()
            .select()
            .from(todos)
            .where(and(eq(todos.id, todoId), eq(todos.userId, userId)));

        if (!todo) return null;

        let plan = null;
        let habit=  null;

        if (todo.planId) plan = await PlanRepository.findOnePlanByUserIdWithoutCon(todo.planId, userId);
        if (todo.habitId) habit = await HabitRepository.findOneHabitByUserIdWithoutCon(todo.habitId, userId);

        return {
            ...todo,
            plan,
            habit
        };
    },
}