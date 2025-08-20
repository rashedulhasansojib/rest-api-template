import type { Express, Request, Response } from 'express';
import {
  createUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
} from '../controllers/user.controller';
import {
  loginHandler,
  getMeHandler,
  logoutHandler,
  refreshTokenHandler,
} from '../controllers/auth.controller';
import validate from '../middleware/validateResource';
import {
  authenticate,
  authorize,
  authorizeOwnerOrAdmin,
} from '../middleware/auth';
import {
  createUserValidation,
  updateUserValidation,
  getUserValidation,
  deleteUserValidation,
} from '../schemas/user.schema';
import { loginValidation } from '../schemas/auth.schema';
import { UserRole } from '../types/user.types';
import { getHealthStatus } from '../utils/health';

const routes = (app: Express): void => {
  // Health check endpoint
  app.get('/health-check', (_req: Request, res: Response) => {
    const healthStatus = getHealthStatus();
    res.status(healthStatus.status === 'healthy' ? 200 : 503).json({
      success: healthStatus.status === 'healthy',
      message: `Server is ${healthStatus.status}`,
      data: healthStatus,
    });
  });

  // Authentication routes
  const authRoutes = '/api/auth';

  // Login
  app.post(`${authRoutes}/login`, validate(loginValidation), loginHandler);

  // Get current user profile
  app.get(`${authRoutes}/me`, authenticate, getMeHandler);

  // Logout (client-side token removal)
  app.post(`${authRoutes}/logout`, authenticate, logoutHandler);

  // Refresh token
  app.post(`${authRoutes}/refresh`, authenticate, refreshTokenHandler);

  // User routes
  const userRoutes = '/api/users';

  // Create user (public registration or admin only)
  app.post(userRoutes, validate(createUserValidation), createUserHandler);

  // Get all users (admin and moderator only)
  app.get(
    userRoutes,
    authenticate,
    authorize(UserRole.ADMIN, UserRole.MODERATOR),
    getAllUsersHandler
  );

  // Get user by ID (owner or admin)
  app.get(
    `${userRoutes}/:id`,
    authenticate,
    validate(getUserValidation),
    authorizeOwnerOrAdmin,
    getUserHandler
  );

  // Update user (owner or admin)
  app.put(
    `${userRoutes}/:id`,
    authenticate,
    validate(updateUserValidation),
    authorizeOwnerOrAdmin,
    updateUserHandler
  );

  // Delete user (admin only)
  app.delete(
    `${userRoutes}/:id`,
    authenticate,
    validate(deleteUserValidation),
    authorize(UserRole.ADMIN),
    deleteUserHandler
  );

  // 404 handler for undefined routes
  app.all('*', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
      error: 'The requested endpoint does not exist',
    });
  });
};

export default routes;
