import { db } from "../db";
import { reflections } from "../db/schema";
import { and, eq } from "drizzle-orm";

export type NewReflection = typeof reflections.$inferInsert;

export const ReflectionRepository = {
    async findAllByUserId(userId: string) {
        return await db
            .select()
            .from(reflections)
            .where(eq(reflections.userId, userId));
    },

    async findOneByUserId(reflectionId:string, userId: string) {
        return await db
            .select()
            .from(reflections)
            .where(and(eq(reflections.userId, userId), eq(reflections.id, reflectionId)));
    },

    async bulkCreate(rows: NewReflection[]) {
        return db.insert(reflections).values(rows).returning();
    }
}