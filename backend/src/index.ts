import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { authRoutes } from './routes/auth.route';
import { reflectionRoutes } from './routes/reflection.route';
import { planRoutes } from './routes/plan.route';

export const app = new Hono()

app.get('/health', (c) => {
  return c.text('Backend is running healthy')
});

//? routes
app.route("/api/v1/auth/", authRoutes);
app.route("/api/v1/reflections/", reflectionRoutes);
app.route("/api/v1/plans/", planRoutes);

if (process.env.NODE_ENV !== "test") {
  serve({
    fetch: app.fetch,
    port: 3000,
  }, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  });
}