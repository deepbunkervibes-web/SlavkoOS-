/**
 * Enterprise Security Middleware
 * Security headers, rate limiting, and protection mechanisms
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { RateLimitError } from '@/types/errors';

// Extend Express Request type to include id property
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
import logger from '../utils/logger';

/**
 * Security headers configuration
 * Uses Helmet.js for security HTTP headers
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:'],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
});

/**
 * CORS configuration
 */
export const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
  maxAge: 86400, // 24 hours
});

/**
 * Rate limiting configuration
 * Different limits for different endpoint types
 */

// General API rate limit
export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, _res: Response, _next: NextFunction) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      requestId: req.id || 'unknown'
    });
    throw new RateLimitError('Rate limit exceeded', {
      requestId: req.id || 'unknown',
      path: req.path,
      method: req.method
    });
  },
  skip: (req: Request) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Strict rate limit for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, _res: Response, _next: NextFunction) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      requestId: req.id || 'unknown'
    });
    throw new RateLimitError('Authentication rate limit exceeded', {
      requestId: req.id || 'unknown',
      path: req.path,
      method: req.method
    });
  }
});

// Rate limit for AI endpoints (expensive operations)
export const aiRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 AI requests per hour
  message: {
    success: false,
    error: 'Too many AI requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, _res: Response, _next: NextFunction) => {
    logger.warn('AI rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      requestId: req.id || 'unknown'
    });
    throw new RateLimitError('AI rate limit exceeded', {
      requestId: req.id || 'unknown',
      path: req.path,
      method: req.method
    });
  }
});

/**
 * Request ID middleware
 * Adds unique request ID for tracing
 */
export const requestId = (req: Request, _res: Response, next: NextFunction): void => {
  req.id = req.headers['x-request-id'] as string || generateRequestId();
  next();
};

/**
 * Remove sensitive data from requests
 */
export const removeSensitiveData = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body) {
    delete req.body.password;
    delete req.body.token;
    delete req.body.apiKey;
    delete req.body.secret;
  }
  next();
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log request
  logger.info('Incoming request', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response when finished
  _res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('Request completed', {
      requestId: req.id,
      method: req.method,
      path: req.path,
      statusCode: _res.statusCode,
      duration: `${duration}ms`
    });
  });

  next();
};

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Trust proxy configuration
 * Required for correct IP detection behind proxies
 */
export const trustProxy = (_req: Request, _res: Response, next: NextFunction): void => {
  // Trust the first proxy
  next();
};

/**
 * Content type validation
 * Ensures request has appropriate content type
 */
export const validateContentType = (expectedType: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.method !== 'GET' && req.method !== 'DELETE') {
      const contentType = req.headers['content-type'];
      
      if (!contentType || !contentType.includes(expectedType)) {
        res.status(415).json({
          success: false,
          error: `Unsupported media type. Expected: ${expectedType}`
        });
        return;
      }
    }
    next();
  };
};

/**
 * Body size limit
 */
export const bodySizeLimit = (maxSize: string = '1mb') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxBytes = parseSize(maxSize);
    
    if (contentLength > maxBytes) {
      return res.status(413).json({
        success: false,
        error: `Request body too large. Maximum size: ${maxSize}`
      });
    }
    
    next();
  };
};

/**
 * Parse size string to bytes
 */
function parseSize(size: string): number {
  const units: Record<string, number> = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024
  };
  
  const match = size.toLowerCase().match(/^(\d+)(b|kb|mb|gb)$/);
  
  if (!match) {
    return 1024 * 1024; // Default to 1MB
  }
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  return value * units[unit];
}