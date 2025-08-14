import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

mongoose.set('strictQuery', true);

export const connectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState >= 1) {
    logger.info('MongoDB already connected');
    return;
  }

  try {
    const mongoUri = config.get<string>('mongoUri');
    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');
  } catch (error) {
    logger.error(`MongoDB connection error: ${(error as Error).message}`);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState === 0) {
    logger.info('MongoDB already disconnected');
    return;
  }

  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error(`MongoDB disconnection error: ${(error as Error).message}`);
    throw error;
  }
};

// Optional: graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});
