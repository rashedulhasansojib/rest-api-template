import express from 'express';
import cors from 'cors';
import config from 'config';
import type { Server } from 'http';
import logger from './utils/logger';
import { connectDB } from './utils/database';
import routes from './routes/routes';

const app = express();
const port = config.get<number>('port') || 3000;

// Security middleware
app.use(
  cors({
    origin:
      process.env['NODE_ENV'] === 'production'
        ? config.get<string[]>('allowedOrigins') || []
        : true,
    credentials: true,
  })
);

// Body parsing middleware
app.use(
  express.json({
    limit: '10mb',
    type: 'application/json',
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Routes
routes(app);

// Global error handler
app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    logger.error({ error }, 'Unhandled error');

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error:
        process.env['NODE_ENV'] === 'development'
          ? error.message
          : 'Something went wrong',
    });
  }
);

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    const server: Server = app.listen(port, () => {
      logger.info(`🚀 Server running on http://localhost:${port}`);
      logger.info(
        `📚 Health check available at http://localhost:${port}/health-check`
      );
      logger.info(
        `👥 Users API available at http://localhost:${port}/api/users`
      );
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      // Close server
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        logger.error(
          'Could not close connections in time, forcefully shutting down'
        );
        process.exit(1);
      }, 10000);
    };

    // Handle graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

// Export for testing
export { app };

// Start server if not in test environment
if (process.env['NODE_ENV'] !== 'test') {
  startServer();
}
