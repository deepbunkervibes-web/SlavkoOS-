/**
 * Audit Logging Middleware
 * Logs all sensitive operations for security and compliance
 */

import { Request, Response, NextFunction } from 'express';
import { auditLog } from '../utils/logger';

/**
 * Audit log sensitive operations
 */
export const auditLogMiddleware = (action: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Capture original end function
    const originalEnd = res.end.bind(res);

    // Override end to log after response
    res.end = (...args: unknown[]) => {
      const userId = (req as any).user?.id || 'anonymous';
      const result = res.statusCode >= 200 && res.statusCode < 400 ? 'success' : 'failure';

      auditLog(
        action,
        userId,
        {
          method: req.method,
          path: req.path,
          ip: req.ip,
          userAgent: req.get('user-agent'),
          statusCode: res.statusCode
        },
        result
      );

      originalEnd.apply(res, args as unknown[]);
    };

    next();
  };
};

/**
 * List of sensitive operations to audit
 */
export const SENSITIVE_OPERATIONS = {
  LOGIN: 'USER_LOGIN',
  LOGOUT: 'USER_LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  ACCOUNT_CREATE: 'ACCOUNT_CREATE',
  ACCOUNT_DELETE: 'ACCOUNT_DELETE',
  ACCOUNT_UPDATE: 'ACCOUNT_UPDATE',
  DATA_EXPORT: 'DATA_EXPORT',
  DATA_IMPORT: 'DATA_IMPORT',
  SETTINGS_CHANGE: 'SETTINGS_CHANGE',
  API_KEY_CREATE: 'API_KEY_CREATE',
  API_KEY_DELETE: 'API_KEY_DELETE',
  PERMISSION_CHANGE: 'PERMISSION_CHANGE'
};