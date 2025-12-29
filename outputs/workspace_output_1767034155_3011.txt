import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import projectRoutes from '@/routes/projects';
import taskRoutes from '@/routes/tasks';
import teamRoutes from '@/routes/teams';
import dashboardRoutes from '@/routes/dashboard';

export const createApp = (prisma: PrismaClient) => {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  app.use('/api', limiter);

  // General middleware
  app.use(compression());
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/dashboard', dashboardRoutes);

  // API documentation
  app.get('/api/docs', (req, res) => {
    res.json({
      name: 'Enterprise Dashboard API',
      version: '1.0.0',
      description: 'RESTful API for enterprise project management dashboard',
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        projects: '/api/projects',
        tasks: '/api/tasks',
        teams: '/api/teams',
        dashboard: '/api/dashboard'
      }
    });
  });

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
};