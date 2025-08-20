import type { Request, Response } from 'express';
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  UserServiceError,
} from '../services/user.service';
import type { ICreateUserInput, IUpdateUserInput } from '../types/user.types';
import { sendSuccess, sendCreated, sendError } from '../utils/response';
import { MESSAGES, HTTP_STATUS, PAGINATION } from '../utils/constants';
import logger from '../utils/logger';

// Helper function to handle service errors
const handleServiceError = (res: Response, error: unknown): Response => {
  if (error instanceof UserServiceError) {
    return sendError(res, error.statusCode, error.message);
  }

  logger.error({ error }, 'Unexpected error');
  return sendError(
    res,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    MESSAGES.INTERNAL_ERROR
  );
};

export const createUserHandler = async (
  req: Request<Record<string, never>, unknown, ICreateUserInput>,
  res: Response
): Promise<Response> => {
  try {
    const newUser = await createUser(req.body);
    return sendCreated(res, MESSAGES.USER_CREATED, newUser);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

export const getUserHandler = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    const user = await getUserById(req.params.id);
    return sendSuccess(res, MESSAGES.USER_RETRIEVED, user);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

export const updateUserHandler = async (
  req: Request<{ id: string }, unknown, IUpdateUserInput>,
  res: Response
): Promise<Response> => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    return sendSuccess(res, MESSAGES.USER_UPDATED, updatedUser);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

export const deleteUserHandler = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<Response> => {
  try {
    await deleteUser(req.params.id);
    return sendSuccess(res, MESSAGES.USER_DELETED);
  } catch (error) {
    return handleServiceError(res, error);
  }
};

export const getAllUsersHandler = async (
  req: Request<
    Record<string, never>,
    unknown,
    Record<string, never>,
    { page?: string; limit?: string }
  >,
  res: Response
): Promise<Response> => {
  try {
    const page = parseInt(
      req.query.page ?? String(PAGINATION.DEFAULT_PAGE),
      10
    );
    const limit = parseInt(
      req.query.limit ?? String(PAGINATION.DEFAULT_LIMIT),
      10
    );

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > PAGINATION.MAX_LIMIT) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Invalid pagination parameters'
      );
    }

    const result = await getAllUsers(page, limit);
    return sendSuccess(res, MESSAGES.USERS_RETRIEVED, result);
  } catch (error) {
    return handleServiceError(res, error);
  }
};
