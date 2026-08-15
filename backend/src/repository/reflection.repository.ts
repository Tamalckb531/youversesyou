import { getDb } from "../db";
import { reflections } from "../db/schema";
import { and, eq, inArray } from "drizzle-orm";

export type NewReflection = typeof reflections.$inferInsert;
export type PartialReflection = Partial<NewReflection>;

export const ReflectionRepository = {
    async findAllByUserId(userId: string) {
        return await getDb()
            .select()
            .from(reflections)
            .where(eq(reflections.userId, userId));
    },

    async findOneByUserId(reflectionId: string, userId: string) {
        const [reflection] = await getDb()
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

    async findReflectionsByIds(userId: string, ids: string[]) {
        if (ids.length === 0) return [];

        return await getDb()
        .select({ id: reflections.id })
        .from(reflections)
        .where(and(eq(reflections.userId, userId), inArray(reflections.id, ids)));
    },

    async bulkCreate(rows: NewReflection[]) {
        return getDb().insert(reflections).values(rows).returning();
    },

    async updateOne(rows: PartialReflection, reflectionId: string, userId: string) {
        const [reflection] = await getDb()
            .update(reflections)
            .set(rows)
            .where(
                and(
                    eq(reflections.userId, userId),
                    eq(reflections.id, reflectionId)
                )
            )
            .returning();
        
        return reflection;
    }
}