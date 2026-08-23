import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { habits } from "../db/schema";

export const HabitRepository = {
    async findAllHabitsByUserId(userId: string) {
        return await getDb()
            .select()
            .from(habits)
            .where(eq(habits.userId, userId));
    },
}