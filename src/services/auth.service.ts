import UserModel from '../models/user.model';
import type {
  ILoginInput,
  IAuthResponse,
  IUser,
  IUserResponse,
} from '../types/user.types';
import { generateToken } from '../utils/jwt';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import config from 'config';

// Service-specific error classes
export class AuthServiceError extends AppError {}
export class InvalidCredentialsError extends AuthServiceError {
  constructor() {
    super('Invalid email or password', 401);
  }
}
export class AccountSuspendedError extends AuthServiceError {
  constructor() {
    super('Account is suspended', 403);
  }
}
export class AccountInactiveError extends AuthServiceError {
  constructor() {
    super('Account is inactive', 403);
  }
}

/**
 * Login user with email and password
 */
export const loginUser = async (input: ILoginInput): Promise<IAuthResponse> => {
  try {
    const { email, password } = input;

    // Find user with password field
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Check account status
    if (user.status === 'suspended') {
      throw new AccountSuspendedError();
    }
    if (user.status === 'inactive') {
      throw new AccountInactiveError();
    }

    // Generate token
    const token = generateToken(user);
    const expiresIn = config.get<string>('jwtExpiresIn');

    logger.info(`User logged in successfully: ${user.email}`);

    return {
      user: user.toJSON() as IUserResponse,
      token,
      expiresIn,
    };
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }

    logger.error({ error }, 'Error during login');
    throw new AuthServiceError('Login failed');
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (userId: string): Promise<IUser | null> => {
  try {
    return await UserModel.findById(userId);
  } catch (error) {
    logger.error({ error }, 'Error fetching current user');
    throw new AuthServiceError('Failed to fetch user profile');
  }
};

/**
 * Refresh user token (optional - for token refresh functionality)
 */
export const refreshToken = async (
  userId: string
): Promise<{ token: string; expiresIn: string }> => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AuthServiceError('User not found', 404);
    }

    if (user.status !== 'active') {
      throw new AuthServiceError('Account is not active', 403);
    }

    const token = generateToken(user);
    const expiresIn = config.get<string>('jwtExpiresIn');

    return { token, expiresIn };
  } catch (error) {
    if (error instanceof AuthServiceError) {
      throw error;
    }

    logger.error({ error }, 'Error refreshing token');
    throw new AuthServiceError('Token refresh failed');
  }
};
