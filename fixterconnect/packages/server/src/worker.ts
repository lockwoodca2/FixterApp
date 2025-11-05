import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// Define environment bindings
export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  STRIPE_SECRET_KEY?: string;
  UPLOADS_BUCKET?: R2Bucket;
}

// Define context variables
type Variables = {
  prisma: ReturnType<typeof createPrismaClient>;
};

function createPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());
}

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// CORS middleware
app.use('/*', cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3002',
    'https://1079739b.fixterapp.pages.dev', // Your Cloudflare Pages URL
    'https://fixterapp.pages.dev' // Add your custom domain when ready
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Initialize Prisma with Accelerate
app.use('*', async (c, next) => {
  const prisma = createPrismaClient(c.env.DATABASE_URL);

  // Attach prisma to context
  c.set('prisma', prisma);

  await next();
});

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'FixterConnect API is running on Cloudflare Workers',
    timestamp: new Date().toISOString()
  });
});

// Import Hono route handlers
import authRoutes from './routes-hono/auth.js';

// Register routes
app.route('/api', authRoutes);

// TODO: Import and register remaining route handlers
// app.route('/api', servicesRoutes);
// app.route('/api', bookingsRoutes);
// app.route('/api', profilesRoutes);
// app.route('/api', messagesRoutes);
// app.route('/api', favoritesRoutes);
// app.route('/api', invoicesRoutes);
// app.route('/api', adminRoutes);
// app.route('/api', availabilityRoutes);
// app.route('/api', uploadRoutes);

// Global error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    success: false,
    error: err.message || 'Internal server error'
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: 'Not found'
  }, 404);
});

export default app;
