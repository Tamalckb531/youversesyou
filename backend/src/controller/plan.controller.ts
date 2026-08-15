import type { Context } from "hono";
import { planBulkCreateSchema } from "@tamaldip/uvsu-common";
import { PlanService, PlanValidationError } from "../service/plan.service";
import { responseMsg } from "../lib/constants";

export const PlanPostController = async (c: Context) => {
    try {
        const user = c.get("user");
        const userId = user.id;

        if (!userId) return c.json({
            success: false,
            msg: responseMsg.generic.error.NO_USER_ID,
            data: null
        }, 400);

        const body: unknown = await c.req.json();
            
        const result = planBulkCreateSchema.safeParse(body);
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

        const created = await PlanService.bulkCreate(userId, result.data);

        return c.json(
            { success: true, msg: responseMsg.plan.success.CREATED_BULK, data: created },
            201,
        );
    }
    catch (err) {
        if (err instanceof PlanValidationError) {
            const msg =
            responseMsg.plan.error[err.message as keyof typeof responseMsg.plan.error] ??
            responseMsg.generic.error.GENERIC_500;
            return c.json({ success: false, msg, data: null }, 400);
        }
        return c.json({ success: false, msg: responseMsg.generic.error.GENERIC_500, data: null }, 500);
    }
};