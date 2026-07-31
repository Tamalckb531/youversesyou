import { db } from "../db";
import { reflections } from "../db/schema";
import { eq } from "drizzle-orm";

export const ReflectionRepository = {
    async findAllByUserId(userId: string) {
        return await db
            .select()
            .from(reflections)
            .where(eq(reflections.userId, userId));
    }
}