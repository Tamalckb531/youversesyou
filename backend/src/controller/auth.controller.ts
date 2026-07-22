import type { Context } from "hono";

export const authController = (c: Context) => {
    return c.res.json();
}