/**
 * Enterprise Validation Middleware
 * Request validation using Zod schemas
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { ValidationError } from '@/types/errors';
import logger from '@/utils/logger';

/**
 * Validate request body against Zod schema
 */
export const validateBody = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new ValidationError(
          'Request body validation failed',
          {
            requestId: req.id || 'unknown',
            path: req.path,
            method: req.method,
            additionalData: {
              errors: error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message,
                code: err.code
              }))
            }
          }
        );

        logger.warn('Validation failed', {
          errors: error.errors,
          body: req.body,
          requestId: req.id || 'unknown'
        });

        res.status(400).json(validationError.toJSON());
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validate request query parameters against Zod schema
 */
export const validateQuery = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new ValidationError(
          'Query parameters validation failed',
          {
            requestId: req.id || 'unknown',
            path: req.path,
            method: req.method,
            additionalData: {
              errors: error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message,
                code: err.code
              }))
            }
          }
        );

        logger.warn('Query validation failed', {
          errors: error.errors,
          query: req.query,
          requestId: req.id || 'unknown'
        });

        res.status(400).json(validationError.toJSON());
      } else {
        next(error);
      }
    }
  };
};

/**
 * Validate request parameters against Zod schema
 */
export const validateParams = <T>(schema: ZodSchema<T>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new ValidationError(
          'URL parameters validation failed',
          {
            requestId: req.id || 'unknown',
            path: req.path,
            method: req.method,
            additionalData: {
              errors: error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message,
                code: err.code
              }))
            }
          }
        );

        logger.warn('Params validation failed', {
          errors: error.errors,
          params: req.params,
          requestId: req.id || 'unknown'
        });

        res.status(400).json(validationError.toJSON());
      } else {
        next(error);
      }
    }
  };
};

/**
 * Sanitize request body
 * Removes potentially dangerous content
 */
export const sanitizeBody = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

/**
 * Sanitize object recursively
 */
function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remove potentially dangerous content
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize string to prevent XSS and injection attacks
 */
function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
}

/**
 * Legacy validation for backward compatibility
 * @deprecated Use validateBody, validateQuery, or validateParams instead
 */
import Joi from 'joi';
import { createError } from './errorHandler';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const message = error.details.map(detail => detail.message).join(', ');
      return next(createError(message, 400));
    }
    
    next();
  };
};

// Common validation schemas
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10)
});

export const idSchema = Joi.object({
  id: Joi.string().required()
});