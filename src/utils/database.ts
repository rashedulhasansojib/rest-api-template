import mongoose from 'mongoose';
import config from 'config';
import logger from './logger';

export const connectDB = async (): Promise<void> => {
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
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (error) {
    logger.error(`MongoDB disconnection error: ${(error as Error).message}`);
    throw error;
  }
};
