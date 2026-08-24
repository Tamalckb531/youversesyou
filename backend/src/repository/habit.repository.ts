import { and, eq } from "drizzle-orm";
import { getDb } from "../db";
import { habitLogs, habits, habitStreaks, reflectionHabits } from "../db/schema";
import type { HabitLogCreateItem, HabitResponseDTO, updateHabitSchemaType } from "@tamaldip/uvsu-common";
import { responseMsg } from "../lib/constants";

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

    async logAndIncreaseStreak(
        habitId: string,
        userId: string,
        habitLog: HabitLogCreateItem,
    ) {
        return await getDb().transaction(async (tx) => {
            // Ownership check folded in here — no separate query needed.
            const [targetHabit] = await tx
                .select({ id: habits.id })
                .from(habits)
                .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));

            if (!targetHabit) throw new Error(responseMsg.habit.error.NO_HABIT_ID);

            const [existingLog] = await tx
                .select({ id: habitLogs.id })
                .from(habitLogs)
                .where(and(eq(habitLogs.habitId, habitId), eq(habitLogs.date, habitLog.date)));

            let log;

            if (existingLog) {
                // Toggle OFF
                [log] = await tx
                    .delete(habitLogs)
                    .where(eq(habitLogs.id, existingLog.id))
                    .returning();
            } else {
                // Toggle ON
                [log] = await tx
                    .insert(habitLogs)
                    .values({
                        habitId,
                        userId,
                        date: habitLog.date,
                    })
                    .returning();
            }

            // Recompute streaks from scratch — correct regardless of which
            // date was toggled (today, or an arbitrary backfilled date).
            // Cheap relative to write frequency; avoids incremental-math bugs
            // when a toggle happens in the middle of an existing streak.
            const allLogs = await tx
                .select({ date: habitLogs.date })
                .from(habitLogs)
                .where(eq(habitLogs.habitId, habitId))
                .orderBy(habitLogs.date);

            const { currentStreak, longestStreak } = calculateStreaks(
                allLogs.map((l) => l.date),
            );

            await tx
                .insert(habitStreaks)
                .values({
                    habitId,
                    currentStreak,
                    longestStreak,
                    lastCalculatedDate: new Date().toISOString().slice(0, 10),
                })
                .onConflictDoUpdate({
                    target: habitStreaks.habitId,
                    set: {
                        currentStreak,
                        longestStreak,
                        lastCalculatedDate: new Date().toISOString().slice(0, 10),
                        updatedAt: new Date(),
                    },
                });

            return log; // undefined on delete (nothing was "created") — see note below
        });
    },
}