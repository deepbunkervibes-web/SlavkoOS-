/**
 * Enterprise Logger
 * Structured logging with Winston
 */

import winston from 'winston';
import { Request } from 'express';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

// Tell winston about the colors
winston.addColors(colors);

// Define the format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}${
          info.stack ? '\n' + info.stack : ''
        }${Object.keys(info).length > 3 ? '\n' + JSON.stringify(info, null, 2) : ''}`
      )
    )
  }),
  
  // Error log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5
  }),
  
  // Combined log file
  new winston.transports.File({
    filename: 'logs/combined.log',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 5
  })
];

// Create the logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports,
  exitOnError: false,
  defaultMeta: { service: 'enterprise-backend' }
});

// If not in production, also log to console with more details
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    })
  );
}

/**
 * Create a child logger with request context
 */
export const createRequestLogger = (req: Request) => {
  return logger.child({
    requestId: req.id,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
};

/**
 * Audit logging for sensitive operations
 */
export const auditLog = (
  action: string,
  userId: string,
  details: Record<string, unknown>,
  result: 'success' | 'failure'
): void => {
  logger.info('Audit Log', {
    action,
    userId,
    details,
    result,
    timestamp: new Date().toISOString()
  });
};

/**
 * Performance logging
 */
export const performanceLog = (
  operation: string,
  duration: number,
  metadata?: Record<string, unknown>
): void => {
  logger.info('Performance', {
    operation,
    duration: `${duration}ms`,
    ...metadata
  });
};

/**
 * Security event logging
 */
export const securityLog = (
  event: string,
  details: Record<string, unknown>,
  severity: 'low' | 'medium' | 'high' | 'critical'
): void => {
  const level = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
  
  logger[level]('Security Event', {
    event,
    severity,
    details,
    timestamp: new Date().toISOString()
  });
};

export default logger;