import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { habits, plans, todos } from "../db/schema";
import { PlanRepository } from "./plan.repository";
import { HabitRepository } from "./habit.repository";
import type { TodoCreateItem } from "@tamaldip/uvsu-common";

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
        const [result] = await getDb()
            .select({
                todo: todos,
                plan: plans,
                habit: habits
            })
            .from(todos)
            .leftJoin(
                plans,
                and(
                    eq(todos.planId, plans.id),
                    eq(plans.userId, userId),
                )
            )
            .leftJoin(
                habits,
                and(
                    eq(todos.habitId, habits.id),
                    eq(habits.userId, userId),
                )
            )
            .where(
                and(
                    eq(todos.id, todoId),
                    eq(todos.userId, userId),
                )
            );
        
        if (!result) return null;

        return {
            ...result.todo,
            plan: result.plan,
            habit: result.habit,
        }
    },

    async createWithLinks(
        userId: string,
        item: TodoCreateItem
    ) {
        const db = getDb();
        
        return await db
            .insert(todos)
            .values({ ...item, userId })
            .returning();
        
    },
}