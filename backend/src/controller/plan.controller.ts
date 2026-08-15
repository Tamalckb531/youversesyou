import type { Context } from "hono";
import { planBulkCreateSchema } from "@tamaldip/uvsu-common";
import { PlanService, PlanValidationError } from "../service/plan.service";
import { responseMsg } from "../lib/constants";

export const PlanningPostController = async (c: Context) => {
  try {
    const user = c.get("user");
    const userId = user.id;

    const body = await c.req.json().catch(() => null);
    if (body === null) {
      return c.json(
        { success: false, msg: responseMsg.plan.error.INVALID_BODY, data: null },
        400,
      );
    }

    const parsed = planBulkCreateSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        {
          success: false,
          msg: responseMsg.plan.error.INVALID_BODY,
          data: null,
          issues: parsed.error.flatten(),
        },
        400,
      );
    }

    const created = await PlanService.bulkCreate(userId, parsed.data);

    return c.json(
      { success: true, msg: responseMsg.plan.success.BULK_CREATE, data: created },
      201,
    );
  } catch (err) {
    if (err instanceof PlanValidationError) {
      const msg =
        responseMsg.plan.error[err.message as keyof typeof responseMsg.plan.error] ??
        responseMsg.generic.GENERIC_500;
      return c.json({ success: false, msg, data: null }, 400);
    }
    return c.json({ success: false, msg: responseMsg.generic.GENERIC_500, data: null }, 500);
  }
};