/**
 * Enterprise Error Handling System
 * Base error classes and type definitions
 */

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ErrorCode {
  // Validation Errors (400)
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Authentication Errors (401)
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  
  // Authorization Errors (403)
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  FORBIDDEN = 'FORBIDDEN',
  
  // Not Found Errors (404)
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  
  // Conflict Errors (409)
  CONFLICT_ERROR = 'CONFLICT_ERROR',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  
  // Rate Limiting (429)
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Server Errors (500)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Circuit Breaker (503)
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  CIRCUIT_BREAKER_OPEN = 'CIRCUIT_BREAKER_OPEN'
}

export interface ErrorContext {
  timestamp: string;
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  additionalData?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    severity: ErrorSeverity;
    context?: ErrorContext;
    stack?: string; // Only in development
  };
}

/**
 * Base Application Error Class
 * All custom errors should extend this class
 */
export abstract class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly severity: ErrorSeverity;
  public readonly statusCode: number;
  public readonly context: ErrorContext;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    statusCode: number = 500,
    context: Partial<ErrorContext> = {},
    isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.name = this.constructor.name;
    this.code = code;
    this.severity = severity;
    this.statusCode = statusCode;
    this.context = {
      timestamp: new Date().toISOString(),
      ...context
    };
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this);
  }

  toJSON(): ErrorResponse {
    return {
      success: false,
      error: {
        code: this.code,
        message: this.message,
        severity: this.severity,
        context: this.context,
        stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
      }
    };
  }
}

/**
 * Validation Error (400)
 * Used for input validation failures
 */
export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation failed',
    context: Partial<ErrorContext> = {}
  ) {
    super(
      message,
      ErrorCode.VALIDATION_ERROR,
      ErrorSeverity.LOW,
      400,
      context
    );
  }
}

/**
 * Authentication Error (401)
 * Used for failed authentication attempts
 */
export class AuthenticationError extends AppError {
  constructor(
    message: string = 'Authentication failed',
    context: Partial<ErrorContext> = {}
  ) {
    super(
      message,
      ErrorCode.AUTHENTICATION_ERROR,
      ErrorSeverity.HIGH,
      401,
      context
    );
  }
}

/**
 * Authorization Error (403)
 * Used for permission denied scenarios
 */
export class AuthorizationError extends AppError {
  constructor(
    message: string = 'Insufficient permissions',
    context: Partial<ErrorContext> = {}
  ) {
    super(
      message,
      ErrorCode.AUTHORIZATION_ERROR,
      ErrorSeverity.HIGH,
      403,
      context
    );
  }
}

/**
 * Not Found Error (404)
 * Used when a resource is not found
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    context: Partial<ErrorContext> = {}
  ) {
    super(
      message,
      ErrorCode.NOT_FOUND,
      ErrorSeverity.LOW,
      404,
      context
    );
  }
}

/**
 * Conflict Error (409)
 * Used for duplicate entries or conflicts
 */
export class ConflictError extends AppError {
  constructor(
    message: string = 'Resource conflict',
    context: Partial<ErrorContext> = {}
  ) {
    super(
      message,
      ErrorCode.CONFLICT_ERROR,
      ErrorSeverity.MEDIUM,
      409,
      context
    );
  }
}

/**
 * Rate Limit Error (429)
 * Used when rate limits are exceeded
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = 'Rate limit exceeded',
    context: Partial<ErrorContext> = {}
  ) {
    super(
      message,
      ErrorCode.RATE_LIMIT_EXCEEDED,
      ErrorSeverity.MEDIUM,
      429,
      context
    );
  }
}

/**
 * Database Error (500)
 * Used for database-related failures
 */
export class DatabaseError extends AppError {
  constructor(
    message: string = 'Database operation failed',
    context: Partial<ErrorContext> = {},
    isOperational: boolean = false
  ) {
    super(
      message,
      ErrorCode.DATABASE_ERROR,
      ErrorSeverity.CRITICAL,
      500,
      context,
      isOperational
    );
  }
}

/**
 * External Service Error (502/503)
 * Used for failures in external API calls
 */
export class ExternalServiceError extends AppError {
  constructor(
    message: string = 'External service unavailable',
    context: Partial<ErrorContext> = {}
  ) {
    super(
      message,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      ErrorSeverity.HIGH,
      502,
      context
    );
  }
}

/**
 * Circuit Breaker Error (503)
 * Used when circuit breaker is open
 */
export class CircuitBreakerError extends AppError {
  constructor(
    message: string = 'Service temporarily unavailable',
    context: Partial<ErrorContext> = {}
  ) {
    super(
      message,
      ErrorCode.CIRCUIT_BREAKER_OPEN,
      ErrorSeverity.HIGH,
      503,
      context
    );
  }
}

/**
 * Internal Server Error (500)
 * Generic server error
 */
export class InternalServerError extends AppError {
  constructor(
    message: string = 'Internal server error',
    context: Partial<ErrorContext> = {},
    originalError?: Error
  ) {
    const errorContext = {
      ...context,
      additionalData: {
        ...context.additionalData,
        originalError: originalError?.message,
        originalStack: originalError?.stack
      }
    };
    
    super(
      message,
      ErrorCode.INTERNAL_SERVER_ERROR,
      ErrorSeverity.CRITICAL,
      500,
      errorContext,
      false
    );
  }
}