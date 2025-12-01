import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

// Define environment bindings
export interface Env {
  DATABASE_URL: string;
  JWT_SECRET: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_PREMIUM_PRICE_ID?: string;
  R2_BUCKET: R2Bucket;
  R2_PUBLIC_URL: string;
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
import servicesRoutes from './routes-hono/services.js';
import bookingsRoutes from './routes-hono/bookings.js';
import profilesRoutes from './routes-hono/profiles.js';
import favoritesRoutes from './routes-hono/favorites.js';
import messagesRoutes from './routes-hono/messages.js';
import invoicesRoutes from './routes-hono/invoices.js';
import adminRoutes from './routes-hono/admin.js';
import availabilityRoutes from './routes-hono/availability.js';
import uploadsRoutes from './routes-hono/uploads.js';
import materialsRoutes from './routes-hono/materials.js';
import timeSlotsRoutes from './routes-hono/timeSlots.js';
import languagesRoutes from './routes-hono/languages.js';
import stripeRoutes from './routes-hono/stripe.js';

// Register routes
app.route('/api', authRoutes);
app.route('/api', servicesRoutes);
app.route('/api', bookingsRoutes);
app.route('/api', profilesRoutes);
app.route('/api', favoritesRoutes);
app.route('/api', messagesRoutes);
app.route('/api', invoicesRoutes);
app.route('/api', adminRoutes);
app.route('/api', materialsRoutes);
app.route('/api', availabilityRoutes);
app.route('/api/time-slots', timeSlotsRoutes);
app.route('/api', uploadsRoutes);
app.route('/api', languagesRoutes);
app.route('/api', stripeRoutes);

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
