import type { Context } from "hono";
import { reflectionService } from "../service/reflection.service";
import { bulkCreateReflectionSchema } from "@tamaldip/uvsu-common";

export const ReflectionsGetController = async (c:Context)=> {
    try {
        const userId = c.get("user");

        if (!userId) return c.json({ success: false, message: "No id detected" }, 400);

        const items = reflectionService.listForUser(userId)
        
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

export const ReflectionsGetOneController = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const userId = c.get("user");

        if (!id) return c.json({ success: false, message: "No reflection detected" }, 400);
        if (!userId) return c.json({ success: false, message: "No id detected" }, 400);

        const items = reflectionService.oneForUser(id, userId)
        
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

export const ReflectionsPostController = async (c: Context) => {
    try {
        const userId = c.get("user");
        if (!userId) return c.json({ success: false, message: "No id detected" }, 400);

        const body: unknown = await c.req.json();

        const result = bulkCreateReflectionSchema.safeParse(body);
        if (!result.success) {
            const issue = result.error.issues[0];
            return c.json(
                { success: false, message: `${issue.message} on field: ${issue.path.join(".")}` },
                400,
            );
        }

        const created = await reflectionService.bulkCreate(userId, result.data);
        return c.json({ success: true, data: created }, 201);
    }
    catch (err) {
        return c.json(
        { success: false, message: err instanceof Error ? err.message : "Something went wrong" },
        500,
        );
    }
}