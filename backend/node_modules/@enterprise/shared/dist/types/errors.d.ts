/**
 * Enterprise Error Handling System
 * Base error classes and type definitions
 */
export declare enum ErrorSeverity {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare enum ErrorCode {
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_INPUT = "INVALID_INPUT",
    MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",
    AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    TOKEN_INVALID = "TOKEN_INVALID",
    AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",
    CONFLICT_ERROR = "CONFLICT_ERROR",
    DUPLICATE_ENTRY = "DUPLICATE_ENTRY",
    RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
    DATABASE_ERROR = "DATABASE_ERROR",
    EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
    NETWORK_ERROR = "NETWORK_ERROR",
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
    CIRCUIT_BREAKER_OPEN = "CIRCUIT_BREAKER_OPEN"
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
        stack?: string;
    };
}
/**
 * Base Application Error Class
 * All custom errors should extend this class
 */
export declare abstract class AppError extends Error {
    readonly code: ErrorCode;
    readonly severity: ErrorSeverity;
    readonly statusCode: number;
    readonly context: ErrorContext;
    readonly isOperational: boolean;
    constructor(message: string, code: ErrorCode, severity?: ErrorSeverity, statusCode?: number, context?: Partial<ErrorContext>, isOperational?: boolean);
    toJSON(): ErrorResponse;
}
/**
 * Validation Error (400)
 * Used for input validation failures
 */
export declare class ValidationError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>);
}
/**
 * Authentication Error (401)
 * Used for failed authentication attempts
 */
export declare class AuthenticationError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>);
}
/**
 * Authorization Error (403)
 * Used for permission denied scenarios
 */
export declare class AuthorizationError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>);
}
/**
 * Not Found Error (404)
 * Used when a resource is not found
 */
export declare class NotFoundError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>);
}
/**
 * Conflict Error (409)
 * Used for duplicate entries or conflicts
 */
export declare class ConflictError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>);
}
/**
 * Rate Limit Error (429)
 * Used when rate limits are exceeded
 */
export declare class RateLimitError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>);
}
/**
 * Database Error (500)
 * Used for database-related failures
 */
export declare class DatabaseError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>, isOperational?: boolean);
}
/**
 * External Service Error (502/503)
 * Used for failures in external API calls
 */
export declare class ExternalServiceError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>);
}
/**
 * Circuit Breaker Error (503)
 * Used when circuit breaker is open
 */
export declare class CircuitBreakerError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>);
}
/**
 * Internal Server Error (500)
 * Generic server error
 */
export declare class InternalServerError extends AppError {
    constructor(message?: string, context?: Partial<ErrorContext>, originalError?: Error);
}
