import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { authRoutes } from './routes/auth.route';

const app = new Hono()

app.get('/health', (c) => {
  return c.text('Backend is running healthy')
});

//? routes
app.route("/api/v1//auth/", authRoutes);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
