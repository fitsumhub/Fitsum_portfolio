import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import mongoose from 'mongoose';
import User from './models/User.js';
import logger from './middleware/logger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { validateEnv } from './utils/envValidator.js';

// Import routes
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import projectRoutes from './routes/projects.js';
import youtubeRoutes from './routes/youtube.js';
import testimonialRoutes from './routes/testimonials.js';
import imageRoutes from './routes/images.js';
import healthRoutes from './routes/health.js';
import adminRoutes from './routes/admin.js';
import frontendSyncRoutes from './routes/frontend-sync.js';

// Load environment variables
dotenv.config();

// Validate environment variables
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
app.use('/api/', apiLimiter);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route (before other routes)
app.use('/api/health', healthRoutes);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/frontend-sync', frontendSyncRoutes);

// Initialize default admin user
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const admin = new User({
        username: 'admin',
        password: 'admin123' // Change this in production!
      });
      await admin.save();
      logger.info('Default admin user created: username=admin, password=admin123');
      logger.warn('WARNING: Change the default admin password in production.');
    }
  } catch (error) {
    logger.error('Error initializing admin user:', error);
  }
};

// 404 handler (must be before error handler)
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  logger.info('═══════════════════════════════════════════════════════════');
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📡 API available at http://localhost:${PORT}/api`);
  logger.info(`🏥 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info('═══════════════════════════════════════════════════════════');

  // Wait a bit for database connection to establish
  const checkDBAndInit = async () => {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      if (mongoose.connection && mongoose.connection.readyState === 1) {
        try {
          // Verify connection with a ping
          await mongoose.connection.db.admin().ping();
          logger.info('✅ Database connection verified');
          await initializeAdmin();
          return;
        } catch (error) {
          logger.warn('⚠️  Database ping failed, retrying...');
        }
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    logger.warn('⚠️  MongoDB not connected after 10 seconds. Skipping admin initialization.');
    logger.warn('⚠️  Server will continue, but database features will not work.');
    logger.warn('⚠️  Please check MongoDB connection and restart the server.');
  };

  // Check database connection and initialize admin
  checkDBAndInit();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', err);
  process.exit(1);
});

export default app;

