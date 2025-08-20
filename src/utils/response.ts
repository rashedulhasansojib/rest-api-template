import type { Response } from 'express';
import type { IApiResponse } from '../types/user.types.js';
import { HTTP_STATUS } from './constants.js';

/**
 * Simple response utilities - Keep it minimal and focused
 */

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  error?: string
): Response => {
  const response: IApiResponse<T> = {
    success,
    message,
    ...(data !== undefined && { data }),
    ...(error && { error }),
  };
  return res.status(statusCode).json(response);
};

// Convenience functions for common responses
export const sendSuccess = <T>(res: Response, message: string, data?: T) =>
  sendResponse(res, HTTP_STATUS.OK, true, message, data);

export const sendCreated = <T>(res: Response, message: string, data?: T) =>
  sendResponse(res, HTTP_STATUS.CREATED, true, message, data);

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  error?: string
) => sendResponse(res, statusCode, false, message, undefined, error);
