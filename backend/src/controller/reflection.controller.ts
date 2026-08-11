import type { Context } from "hono";
import { reflectionService } from "../service/reflection.service";
import { bulkCreateReflectionSchema, updateReflectionSchema } from "@tamaldip/uvsu-common";
import { responseMsg } from "../lib/constants";

export const ReflectionsGetController = async (c:Context)=> {
    try {
        const user = c.get("user");
        const userId = user.id;

        if (!userId) return c.json({
            success: false,
            msg: responseMsg.reflection.error.NO_USER_ID,
            data: null
        }, 400);

        const items = await reflectionService.listForUser(userId)
        
        return c.json({
            success: true,
            msg:responseMsg.reflection.success.GET_ALL,
            data: items,
        })
    }
    catch (err) {
        return c.json({
            success: false,
            msg: err instanceof Error ? err.message : responseMsg.reflection.error.GENERIC_500,
            data:null
        }, 500); 
    }
}

export const ReflectionsGetOneController = async (c: Context) => {
    try {
        const id = c.req.param("id");
        
        const user = c.get("user");
        const userId = user.id;

        if (!id) return c.json({
            success: false,
            msg: responseMsg.reflection.error.NO_REFLECTION_ID,
            data: null
        }, 400);
        if (!userId) return c.json({
            success: false,
            msg: responseMsg.reflection.error.NO_USER_ID,
            data: null
        }, 400);

        const item = await reflectionService.oneForUser(id, userId)
        
        return c.json({
            success: true,
            msg: responseMsg.reflection.success.GET_ONE,
            data: item,
        })
    }
    catch (err) {
        return c.json({
            success: false,
            msg: err instanceof Error ? err.message : responseMsg.reflection.error.GENERIC_500, data:null
        }, 500); 
    }
}

export const ReflectionsPostController = async (c: Context) => {
    try {
        const user = c.get("user");
        const userId = user.id;

        if (!userId) return c.json({
            success: false,
            msg: responseMsg.reflection.error.NO_USER_ID,
            data: null
        }, 400);

        const body: unknown = await c.req.json();

        const result = bulkCreateReflectionSchema.safeParse(body);
        if (!result.success) {
            const issue = result.error.issues[0];
            return c.json(
                {
                    success: false,
                    msg: `${issue.message} on field: ${issue.path.join(".")}`,
                    data: null
                },
                400,
            );
        }

        const created = await reflectionService.bulkCreate(userId, result.data);
        return c.json({
            success: true,
            msg:responseMsg.reflection.success.CREATED_BULK,
            data: created
        }, 201);
    }
    catch (err) {
        return c.json(
            {
                success: false,
                msg: err instanceof Error ? err.message : responseMsg.reflection.error.GENERIC_500, data: null
            },
            500,
        );
    }
}

export const ReflectionsPatchController = async (c: Context) => {
    try {
        const id = c.req.param("id");

        const user = c.get("user");
        const userId = user.id;

        if (!id) return c.json({
            success: false,
            msg: responseMsg.reflection.error.NO_REFLECTION_ID,
            data: null
        }, 400);
        if (!userId) return c.json({
            success: false,
            msg: responseMsg.reflection.error.NO_USER_ID,
            data: null
        }, 400);

        const body: unknown = await c.req.json();

        const result = updateReflectionSchema.safeParse(body);
        if (!result.success) {
            const issue = result.error.issues[0];
            return c.json(
                {
                    success: false,
                    msg: `${issue.message} on field: ${issue.path.join(".")}`,
                    data: null
                },
                400,
            );
        }

        const updated = await reflectionService.updateOne(userId, id, result.data);

        if (!updated.success) throw new Error(updated.msg);
        return c.json({
            success: true,
            msg: responseMsg.reflection.success.UPDATE_ONE,
            data: updated
        }, 201);
    }
    catch (err) {
        return c.json(
            {
                success: false,
                msg: err instanceof Error ? err.message : responseMsg.reflection.error.GENERIC_500, data: null
            },
            500,
        );
    }
}