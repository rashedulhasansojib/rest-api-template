import type { Request, Response } from 'express';
import {
  loginUser,
  getCurrentUser,
  refreshToken,
  AuthServiceError,
} from '../services/auth.service';
import type { ILoginInput } from '../types/user.types';
import { sendSuccess, sendError } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import logger from '../utils/logger';

// Helper function to handle service errors
const handleAuthError = (res: Response, error: unknown): Response => {
  if (error instanceof AuthServiceError) {
    return sendError(res, error.statusCode, error.message);
  }

  logger.error({ error }, 'Unexpected authentication error');
  return sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    'Authentication failed'
  );
};

/**
 * Login user
 */
export const loginHandler = async (
  req: Request<Record<string, never>, unknown, ILoginInput>,
  res: Response
): Promise<Response> => {
  try {
    const authResponse = await loginUser(req.body);
    return sendSuccess(res, 'Login successful', authResponse);
  } catch (error) {
    return handleAuthError(res, error);
  }
};

/**
 * Get current user profile
 */
export const getMeHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return sendError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        'Authentication required'
      );
    }

    const user = await getCurrentUser(req.user.userId);
    if (!user) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'User not found');
    }

    return sendSuccess(res, 'User profile retrieved', user.toJSON());
  } catch (error) {
    return handleAuthError(res, error);
  }
};

/**
 * Logout user (client-side token removal)
 */
export const logoutHandler = async (
  _req: Request,
  res: Response
): Promise<Response> => {
  // Since JWT is stateless, logout is handled client-side by removing the token
  // This endpoint exists for consistency and can be extended for token blacklisting
  return sendSuccess(res, 'Logout successful');
};

/**
 * Refresh user token
 */
export const refreshTokenHandler = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return sendError(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        'Authentication required'
      );
    }

    const tokenData = await refreshToken(req.user.userId);
    return sendSuccess(res, 'Token refreshed successfully', tokenData);
  } catch (error) {
    return handleAuthError(res, error);
  }
};
