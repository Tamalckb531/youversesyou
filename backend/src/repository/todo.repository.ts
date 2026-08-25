import { and, eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { habits, plans, todos } from "../db/schema";
import type { TodoCreateItem, updateTodoSchemaType } from "@tamaldip/uvsu-common";

export type NewTodo = typeof todos.$inferInsert;
export type Todo = typeof todos.$inferSelect;

export const TodoRepository = {
    async findAllHabitsByUserId(userId: string) {
        return await getDb()
            .select()
            .from(todos)
            .where(eq(todos.userId, userId));
    },

    async findOneTodoByUserId(todoId: string, userId: string) {
        const [todo] = await getDb()
            .select()
            .from(todos)
            .where(
                and(
                    eq(todos.id, todoId),
                    eq(todos.userId, userId),
                ),
            );

        return todo;
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

    async updateOneTodo(rows: updateTodoSchemaType, todoId: string, userId: string) {
        const [todo] = await getDb()
            .update(todos)
            .set(rows)
            .where(
                and(
                    eq(todos.userId, userId),
                    eq(todos.id, todoId)
                )
            )
            .returning();
        
        return todo;
    },

    async deleteTodo(todoId: string, userId: string) {
        const [todo] = await getDb()
            .delete(todos)
            .where(
                and(
                    eq(todos.id, todoId),
                    eq(todos.userId, userId),
                ),
            )
            .returning();

        return todo;
    },    

    async markTodo(todoId: string, userId: string) {
        const [todo] = await getDb()
            .update(todos)
            .set({
                isCompleted: sql`NOT ${todos.isCompleted}`,
            })
            .where(
            and(
                eq(todos.id, todoId),
                eq(todos.userId, userId),
            ),
            )
            .returning({
                id: todos.id,
                marked: todos.isCompleted,
            });

        return todo ?? null;
    }
}