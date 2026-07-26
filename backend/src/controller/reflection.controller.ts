import type { Context } from "hono";
import { db } from "../db";
import { reflections } from "../db/schema";
import { eq } from "drizzle-orm";

export const ReflectionsGetController = async (c:Context)=> {
    try {
        const userId = c.get("user");

        if (!userId) return c.json({ success: false, message: "No id detected" }, 400);

        const items = await db
            .select()
            .from(reflections)
            .where(eq(reflections.userId, userId));
        
        return c.json({
            success: true,
            data: items,
        })
    }
    catch (err) {
        return c.json({
            success: false,
            message: err instanceof Error ? err.message : "Something went wrong"
        }, 500); 
    }
}