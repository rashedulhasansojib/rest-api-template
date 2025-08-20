import type { Express, Request, Response } from 'express';
import {
  createUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler,
  getAllUsersHandler,
} from '../controllers/user.controller';
import validate from '../middleware/validateResource';
import {
  createUserValidation,
  updateUserValidation,
  getUserValidation,
  deleteUserValidation,
} from '../schemas/user.schema';
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

  // User routes
  const userRoutes = '/api/users';

  // Create user
  app.post(userRoutes, validate(createUserValidation), createUserHandler);

  // Get all users (with pagination)
  app.get(userRoutes, getAllUsersHandler);

  // Get user by ID
  app.get(`${userRoutes}/:id`, validate(getUserValidation), getUserHandler);

  // Update user
  app.put(
    `${userRoutes}/:id`,
    validate(updateUserValidation),
    updateUserHandler
  );

  // Delete user
  app.delete(
    `${userRoutes}/:id`,
    validate(deleteUserValidation),
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
