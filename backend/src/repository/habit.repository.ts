import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { habits, reflectionHabits } from "../db/schema";
import type { HabitResponseDTO, updateHabitSchemaType } from "@tamaldip/uvsu-common";

export type NewHabit = typeof habits.$inferInsert;
export type Habit = typeof habits.$inferSelect;

export const HabitRepository = {
    async findAllHabitsByUserId(userId: string) {
        return await getDb()
            .select()
            .from(habits)
            .where(eq(habits.userId, userId));
    },

    async createWithJunctions(
        userId: string,
        item: {
            habit: Omit<NewHabit, "userId">;
            junctionIdArray: string[];
        }
    ): Promise<Habit & { linkedIds: string[] }> {
        const db = getDb();
        
        return await db.transaction(async (tx) => {
            let result: Habit & { linkedIds: string[] };
        
            const [inserted] = await tx
                .insert(habits)
                .values({ ...item.habit, userId })
                .returning();
    
            if (item.junctionIdArray.length > 0) {
                await tx.insert(reflectionHabits).values(
                    item.junctionIdArray.map((reflectionId) => ({
                        reflectionId,
                        habitId: inserted.id,
                    })),
                );
            }
    
            result = { ...inserted, linkedIds: item.junctionIdArray };
        
            return result;
        });
    },

    async findOneHabitByUserIdWithoutCon(habitId: string, userId: string) {
        const [habit] = await getDb()
            .select()
            .from(habits)
            .where(
                and(
                    eq(habits.id, habitId),
                    eq(habits.userId, userId),
                ),
            );

        return habit;
    },

    async updateOneHabit(rows: updateHabitSchemaType, habitId: string, userId: string) {
        const [habit] = await getDb()
            .update(habits)
            .set(rows)
            .where(
                and(
                    eq(habits.userId, userId),
                    eq(habits.id, habitId)
                )
            )
            .returning();
        
        return habit;
    },

    async deleteHabit(habitId: string, userId: string) {
        const [habit] = await getDb()
            .delete(habits)
            .where(
                and(
                    eq(habits.id, habitId),
                    eq(habits.userId, userId),
                ),
            )
            .returning();

        return habit;
    },
}