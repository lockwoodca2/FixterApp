import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './lib/prisma.js';
import authRoutes from './routes/auth.js';
import servicesRoutes from './routes/services.js';
import bookingsRoutes from './routes/bookings.js';
import profilesRoutes from './routes/profiles.js';
import messagesRoutes from './routes/messages.js';
import favoritesRoutes from './routes/favorites.js';
import invoicesRoutes from './routes/invoices.js';
import adminRoutes from './routes/admin.js';
import availabilityRoutes from './routes/availability.js';
import uploadRoutes from './routes/uploads.js';
import stripeRoutes from './routes/stripe.js';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'], // React app URLs
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
try {
  await prisma.$connect();
  console.log('✅ Connected to Supabase PostgreSQL database');
} catch (error) {
  console.error('❌ Failed to connect to database:', error);
  process.exit(1);
}

// Routes
app.use('/api', authRoutes);
app.use('/api', servicesRoutes);
app.use('/api', bookingsRoutes);
app.use('/api', profilesRoutes);
app.use('/api', messagesRoutes);
app.use('/api', favoritesRoutes);
app.use('/api', invoicesRoutes);
app.use('/api', adminRoutes);
app.use('/api', availabilityRoutes);
app.use('/api', uploadRoutes);
app.use('/api', stripeRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'FixterConnect API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 FixterConnect API Server is running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/login\n`);
});

export default app;
