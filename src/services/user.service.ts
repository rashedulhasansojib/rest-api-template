import mongoose from 'mongoose';
import UserModel from '../models/user.model';
import type {
  IUser,
  IUserResponse,
  ICreateUserInput,
  IUpdateUserInput,
} from '../types/user.types';
import logger from '../utils/logger';

import { AppError, NotFoundError, ConflictError } from '../utils/errors';

// Service-specific error classes
export class UserServiceError extends AppError {}
export class UserNotFoundError extends NotFoundError {}
export class UserAlreadyExistsError extends ConflictError {}

// Service functions
export const createUser = async (
  input: ICreateUserInput
): Promise<IUserResponse> => {
  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: input.email });
    if (existingUser) {
      throw new UserAlreadyExistsError('User with this email already exists');
    }

    // Set default role if not provided
    const userData = {
      ...input,
      role: input.role ?? 'user',
    };

    const user = await UserModel.create(userData);
    logger.info(`User created successfully: ${user.email}`);

    return user.toJSON() as IUserResponse;
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new UserServiceError(
        `Validation error: ${messages.join(', ')}`,
        400
      );
    }

    if (
      error instanceof mongoose.Error &&
      error.message.includes('duplicate key')
    ) {
      throw new UserAlreadyExistsError('User with this email already exists');
    }

    logger.error({ error }, 'Error creating user');
    throw new UserServiceError('Failed to create user');
  }
};

export const getUserById = async (id: string): Promise<IUserResponse> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new UserServiceError('Invalid user ID format', 400);
    }

    const user = await UserModel.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }

    return user.toJSON() as IUserResponse;
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error;
    }

    logger.error({ error }, 'Error fetching user');
    throw new UserServiceError('Failed to fetch user');
  }
};

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    return await UserModel.findByEmail(email);
  } catch (error) {
    logger.error({ error }, 'Error fetching user by email');
    throw new UserServiceError('Failed to fetch user');
  }
};

export const updateUser = async (
  id: string,
  input: IUpdateUserInput
): Promise<IUserResponse> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new UserServiceError('Invalid user ID format', 400);
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: input },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new UserNotFoundError();
    }

    logger.info(`User updated successfully: ${user.email}`);
    return user.toJSON() as IUserResponse;
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      throw new UserServiceError(
        `Validation error: ${messages.join(', ')}`,
        400
      );
    }

    logger.error({ error }, 'Error updating user');
    throw new UserServiceError('Failed to update user');
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new UserServiceError('Invalid user ID format', 400);
    }

    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      throw new UserNotFoundError();
    }

    logger.info(`User deleted successfully: ${user.email}`);
  } catch (error) {
    if (error instanceof UserServiceError) {
      throw error;
    }

    logger.error({ error }, 'Error deleting user');
    throw new UserServiceError('Failed to delete user');
  }
};

export const getAllUsers = async (
  page = 1,
  limit = 10
): Promise<{
  users: IUserResponse[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      UserModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      UserModel.countDocuments({}),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users.map((user) => user.toJSON() as IUserResponse),
      total,
      page,
      totalPages,
    };
  } catch (error) {
    logger.error({ error }, 'Error fetching users');
    throw new UserServiceError('Failed to fetch users');
  }
};
