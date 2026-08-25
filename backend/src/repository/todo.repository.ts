import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { todos } from "../db/schema";

export type NewTodo = typeof todos.$inferInsert;
export type Todo = typeof todos.$inferSelect;

export const TodoRepository = {
    async findAllHabitsByUserId(userId: string) {
        return await getDb()
            .select()
            .from(todos)
            .where(eq(todos.userId, userId));
    },
}