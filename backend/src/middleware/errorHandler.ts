/**
 * Enterprise Error Handler Middleware
 * Centralized error handling for Express.js
 */

import { Request, Response, NextFunction } from 'express';
import { 
  AppError, 
  ErrorCode, 
  ErrorResponse,
  ValidationError,
  InternalServerError,
  ErrorSeverity
} from '@enterprise/shared/types/errors';
import logger from '../utils/logger';

/**
 * Error handler middleware
 * Converts all errors to standardized format and logs them
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let appError: AppError;

  // Convert unknown errors to AppError
  if (!(err instanceof AppError)) {
    appError = new InternalServerError(
      err.message || 'An unexpected error occurred',
      {
        requestId: req.id,
        path: req.path,
        method: req.method,
        userAgent: req.get('user-agent')
      },
      err
    );
  } else {
    appError = err;
  }

  // Add request context to error
  appError.context.requestId = req.id;
  appError.context.path = req.path;
  appError.context.method = req.method;
  appError.context.userAgent = req.get('user-agent');

  // Log error based on severity
  const logLevel = getLogLevel(appError.severity);
  
  logger[logLevel](
    `${appError.code} - ${appError.message}`,
    {
      error: appError,
      request: {
        id: req.id,
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent')
      },
      body: sanitizeRequestBody(req.body),
      query: req.query
    }
  );

  // Send error response
  const statusCode = appError.statusCode || 500;
  const errorResponse: ErrorResponse = appError.toJSON();

  res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const error = new ValidationError(
    `Route ${req.method} ${req.path} not found`,
    {
      requestId: req.id,
      path: req.path,
      method: req.method
    }
  );

  res.status(404).json(error.toJSON());
};

/**
 * Async handler wrapper
 * Wraps async route handlers to automatically catch errors
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Get log level from error severity
 */
function getLogLevel(severity: string): 'error' | 'warn' | 'info' {
  switch (severity) {
    case 'CRITICAL':
    case 'HIGH':
      return 'error';
    case 'MEDIUM':
      return 'warn';
    case 'LOW':
    default:
      return 'info';
  }
}

/**
 * Sanitize request body for logging
 * Removes sensitive information like passwords
 */
function sanitizeRequestBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sanitized = { ...body };
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'api_key'];
  
  for (const field of sensitiveFields) {
    if (field in sanitized) {
      (sanitized as Record<string, unknown>)[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Validation error creator
 * Creates ValidationError with field-specific messages
 */
export const createValidationError = (
  field: string,
  message: string
): ValidationError => {
  return new ValidationError(
    `Validation failed for field '${field}': ${message}`,
    { additionalData: { field } }
  );
};

/**
 * Legacy error creator for backward compatibility
 * @deprecated Use specific error classes instead
 */
export const createError = (message: string, statusCode: number = 500): AppError => {
  return new InternalServerError(message, {}, new Error(message));
};