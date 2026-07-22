import { Hono } from "hono"
import { authController } from "../controller/auth.controller";

export const authRoutes = new Hono();
authRoutes.post('/login', authController)