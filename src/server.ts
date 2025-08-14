import express from 'express';
import cors from 'cors';
import config from 'config';
import logger from './utils/logger';
import { connectDB } from './utils/database';
import routes from './routes/index';

const app = express();
const port = config.get<number>('port') || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info(`Server running on port http://localhost:${port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

startServer();
