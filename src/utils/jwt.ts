import jwt from 'jsonwebtoken';
import config from 'config';
import type { IUser } from '../types/user.types';
import logger from './logger';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token for user
 */
export const generateToken = (user: IUser): string => {
  try {
    const payload: JwtPayload = {
      userId: (user._id as string).toString(),
      email: user.email,
      role: user.role,
    };

    const secret = config.get<string>('jwtSecret');
    const expiresIn = config.get<string>('jwtExpiresIn');

    return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
  } catch (error) {
    logger.error({ error }, 'Error generating JWT token');
    throw new Error('Token generation failed');
  }
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const secret = config.get<string>('jwtSecret');
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    logger.error({ error }, 'Error verifying JWT token');
    throw new Error('Invalid token');
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
