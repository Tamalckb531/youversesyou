import { db } from "../db";
import { reflections } from "../db/schema";
import { and, eq } from "drizzle-orm";

export type NewReflection = typeof reflections.$inferInsert;
export type PartialReflection = Partial<NewReflection>;

export const ReflectionRepository = {
    async findAllByUserId(userId: string) {
        return await db
            .select()
            .from(reflections)
            .where(eq(reflections.userId, userId));
    },

    async findOneByUserId(reflectionId: string, userId: string) {
        const [reflection] = await db
            .select()
            .from(reflections)
            .where(
            and(
                eq(reflections.userId, userId),
                eq(reflections.id, reflectionId)
            )
            );

        return reflection;
    },

    async bulkCreate(rows: NewReflection[]) {
        return db.insert(reflections).values(rows).returning();
    },

    async updateOne(rows: PartialReflection, reflectionId: string, userId: string) {
        const reflection = await db
            .update(reflections)
            .set(rows)
            .where(
                and(
                    eq(reflections.userId, userId),
                    eq(reflections.id, reflectionId)
                )
            );
        
        return reflection;
    }
}