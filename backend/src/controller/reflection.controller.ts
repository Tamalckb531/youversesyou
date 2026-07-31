import type { Context } from "hono";
import { createReflectionSchema, type createReflectionType } from "@tamaldip/uvsu-common";
import { reflectionService } from "../service/reflection.service";

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

// export const ReflectionsPostController = async (c: Context) => {
//     try {
//         const body:createReflectionType = await c.req.json();
//         const userId:string = c.get("user");

//         if (!userId) return c.json({ success: false, message: "No id detected" }, 400);

//         const result = createReflectionSchema.safeParse(body);
//         if (!result.success) {
//             const issue = result.error.issues[0];
//             return c.json(
//                 {
//                     success: false,
//                     message: `${issue.message} on field: ${issue.path.join(".")}`
//                 },
//                 400
//             );
//         }

//         const { type, title, description, targetDate, metadata, slotIndex } = result.data;

//         const [newItem] = await db
//             .insert(reflections)
//             .values({
//                 userId,
//                 type,
//                 title,
//                 description: description || null,
//                 targetDate: targetDate ? targetDate.toISOString().slice(0, 10) : null,
//                 status: "active",
//                 metadata: metadata || null,
//                 slotIndex,
//                 previousVersionId: null,
//                 archivedAt: null
//             } as any)
//             .returning();

//     }
//     catch (err) {
//         return c.json({
//             success: false,
//             message: err instanceof Error ? err.message : "Something went wrong"
//         }, 500); 
//     }
// }