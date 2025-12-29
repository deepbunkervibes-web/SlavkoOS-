"use strict";
/**
 * Enterprise Error Handling System
 * Base error classes and type definitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.CircuitBreakerError = exports.ExternalServiceError = exports.DatabaseError = exports.RateLimitError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = exports.ErrorCode = exports.ErrorSeverity = void 0;
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "LOW";
    ErrorSeverity["MEDIUM"] = "MEDIUM";
    ErrorSeverity["HIGH"] = "HIGH";
    ErrorSeverity["CRITICAL"] = "CRITICAL";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
var ErrorCode;
(function (ErrorCode) {
    // Validation Errors (400)
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["INVALID_INPUT"] = "INVALID_INPUT";
    ErrorCode["MISSING_REQUIRED_FIELD"] = "MISSING_REQUIRED_FIELD";
    // Authentication Errors (401)
    ErrorCode["AUTHENTICATION_ERROR"] = "AUTHENTICATION_ERROR";
    ErrorCode["INVALID_CREDENTIALS"] = "INVALID_CREDENTIALS";
    ErrorCode["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    ErrorCode["TOKEN_INVALID"] = "TOKEN_INVALID";
    // Authorization Errors (403)
    ErrorCode["AUTHORIZATION_ERROR"] = "AUTHORIZATION_ERROR";
    ErrorCode["INSUFFICIENT_PERMISSIONS"] = "INSUFFICIENT_PERMISSIONS";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    // Not Found Errors (404)
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["RESOURCE_NOT_FOUND"] = "RESOURCE_NOT_FOUND";
    // Conflict Errors (409)
    ErrorCode["CONFLICT_ERROR"] = "CONFLICT_ERROR";
    ErrorCode["DUPLICATE_ENTRY"] = "DUPLICATE_ENTRY";
    // Rate Limiting (429)
    ErrorCode["RATE_LIMIT_EXCEEDED"] = "RATE_LIMIT_EXCEEDED";
    // Server Errors (500)
    ErrorCode["INTERNAL_SERVER_ERROR"] = "INTERNAL_SERVER_ERROR";
    ErrorCode["DATABASE_ERROR"] = "DATABASE_ERROR";
    ErrorCode["EXTERNAL_SERVICE_ERROR"] = "EXTERNAL_SERVICE_ERROR";
    ErrorCode["NETWORK_ERROR"] = "NETWORK_ERROR";
    // Circuit Breaker (503)
    ErrorCode["SERVICE_UNAVAILABLE"] = "SERVICE_UNAVAILABLE";
    ErrorCode["CIRCUIT_BREAKER_OPEN"] = "CIRCUIT_BREAKER_OPEN";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * Base Application Error Class
 * All custom errors should extend this class
 */
class AppError extends Error {
    constructor(message, code, severity = ErrorSeverity.MEDIUM, statusCode = 500, context = {}, isOperational = true) {
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
    toJSON() {
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
exports.AppError = AppError;
/**
 * Validation Error (400)
 * Used for input validation failures
 */
class ValidationError extends AppError {
    constructor(message = 'Validation failed', context = {}) {
        super(message, ErrorCode.VALIDATION_ERROR, ErrorSeverity.LOW, 400, context);
    }
}
exports.ValidationError = ValidationError;
/**
 * Authentication Error (401)
 * Used for failed authentication attempts
 */
class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed', context = {}) {
        super(message, ErrorCode.AUTHENTICATION_ERROR, ErrorSeverity.HIGH, 401, context);
    }
}
exports.AuthenticationError = AuthenticationError;
/**
 * Authorization Error (403)
 * Used for permission denied scenarios
 */
class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions', context = {}) {
        super(message, ErrorCode.AUTHORIZATION_ERROR, ErrorSeverity.HIGH, 403, context);
    }
}
exports.AuthorizationError = AuthorizationError;
/**
 * Not Found Error (404)
 * Used when a resource is not found
 */
class NotFoundError extends AppError {
    constructor(message = 'Resource not found', context = {}) {
        super(message, ErrorCode.NOT_FOUND, ErrorSeverity.LOW, 404, context);
    }
}
exports.NotFoundError = NotFoundError;
/**
 * Conflict Error (409)
 * Used for duplicate entries or conflicts
 */
class ConflictError extends AppError {
    constructor(message = 'Resource conflict', context = {}) {
        super(message, ErrorCode.CONFLICT_ERROR, ErrorSeverity.MEDIUM, 409, context);
    }
}
exports.ConflictError = ConflictError;
/**
 * Rate Limit Error (429)
 * Used when rate limits are exceeded
 */
class RateLimitError extends AppError {
    constructor(message = 'Rate limit exceeded', context = {}) {
        super(message, ErrorCode.RATE_LIMIT_EXCEEDED, ErrorSeverity.MEDIUM, 429, context);
    }
}
exports.RateLimitError = RateLimitError;
/**
 * Database Error (500)
 * Used for database-related failures
 */
class DatabaseError extends AppError {
    constructor(message = 'Database operation failed', context = {}, isOperational = false) {
        super(message, ErrorCode.DATABASE_ERROR, ErrorSeverity.CRITICAL, 500, context, isOperational);
    }
}
exports.DatabaseError = DatabaseError;
/**
 * External Service Error (502/503)
 * Used for failures in external API calls
 */
class ExternalServiceError extends AppError {
    constructor(message = 'External service unavailable', context = {}) {
        super(message, ErrorCode.EXTERNAL_SERVICE_ERROR, ErrorSeverity.HIGH, 502, context);
    }
}
exports.ExternalServiceError = ExternalServiceError;
/**
 * Circuit Breaker Error (503)
 * Used when circuit breaker is open
 */
class CircuitBreakerError extends AppError {
    constructor(message = 'Service temporarily unavailable', context = {}) {
        super(message, ErrorCode.CIRCUIT_BREAKER_OPEN, ErrorSeverity.HIGH, 503, context);
    }
}
exports.CircuitBreakerError = CircuitBreakerError;
/**
 * Internal Server Error (500)
 * Generic server error
 */
class InternalServerError extends AppError {
    constructor(message = 'Internal server error', context = {}, originalError) {
        const errorContext = {
            ...context,
            additionalData: {
                ...context.additionalData,
                originalError: originalError?.message,
                originalStack: originalError?.stack
            }
        };
        super(message, ErrorCode.INTERNAL_SERVER_ERROR, ErrorSeverity.CRITICAL, 500, errorContext, false);
    }
}
exports.InternalServerError = InternalServerError;
