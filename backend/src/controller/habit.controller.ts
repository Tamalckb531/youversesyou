import type { Context } from "hono";
import { responseMsg } from "../lib/constants";
import { HabitService } from "../service/habit.service";
import { habitCreateItemBaseSchema } from "@tamaldip/uvsu-common";

export const HabitGetController = async (c: Context) => { 
    try {
        const user = c.get("user");
        const userId = user.id;

        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const items = await HabitService.allHabits(userId)
        
        return c.json({
            success: true,
            msg:responseMsg.habit.success.GET_ALL,
            data: items,
        })
    }
    catch (err) {
        return c.json({
            success: false,
            msg: err instanceof Error ? err.message : responseMsg.generic.error.GENERIC_500,
            data:null
        }, 500); 
    }
}
export const HabitGetOneController = async (c: Context) => { }
export const HabitCreateController = async (c: Context) => { 
    try {
        const user = c.get("user");
        const userId = user.id;

        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const body: unknown = await c.req.json();

        const result = habitCreateItemBaseSchema.safeParse(body);
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

        const created = await HabitService.createOne(userId, result.data);
        return c.json({
            success: true,
            msg:responseMsg.habit.success.CREATED_BULK,
            data: created
        }, 201);
    }
    catch (err) {
        return c.json(
            {
                success: false,
                msg: err instanceof Error ? err.message : responseMsg.generic.error.GENERIC_500, data: null
            },
            500,
        );
    }
}
export const HabitPatchController = async (c: Context) => { }
export const HabitDeleteController = async (c: Context) => { }
export const HabitMarkController = async (c: Context) => { }