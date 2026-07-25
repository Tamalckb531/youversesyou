
import type { Context } from "hono";
import { authService } from "../service/auth.service";
import { getAuthedUser, type AuthEnv } from "../middleware/auth.middleware";
import { meResponseSchema } from "@tamaldip/uvsu-common";

export const authController = {
  async me(c: Context<AuthEnv>) {
    const user = getAuthedUser(c);
    const body = meResponseSchema.parse(authService.toMeResponse(user));
    return c.json(body, 200);
  },

  async completeOnboarding(c: Context<AuthEnv>) {
    const user = getAuthedUser(c);
    const updated = await authService.completeOnboarding(user.id);
    const body = meResponseSchema.parse(authService.toMeResponse(updated as any));
    return c.json(body, 200);
  },
};
