import type { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt';
import { UserRole } from '../types/user.types';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import logger from '../utils/logger';

/**
 * Middleware to authenticate JWT token
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Access token required');
      return;
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error({ error }, 'Authentication failed');
    sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Invalid or expired token');
  }
};

/**
 * Middleware to authorize specific roles
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Authentication required');
      return;
    }

    if (!roles.includes(req.user.role as UserRole)) {
      sendError(res, HTTP_STATUS.FORBIDDEN, 'Insufficient permissions');
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user owns resource or is admin
 */
export const authorizeOwnerOrAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    sendError(res, HTTP_STATUS.UNAUTHORIZED, 'Authentication required');
    return;
  }

  const resourceUserId = req.params['id'];
  const currentUserId = req.user.userId;
  const userRole = req.user.role as UserRole;

  if (currentUserId === resourceUserId || userRole === UserRole.ADMIN) {
    next();
  } else {
    sendError(res, HTTP_STATUS.FORBIDDEN, 'Access denied');
  }
};
