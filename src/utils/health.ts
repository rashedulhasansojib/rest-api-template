import mongoose from 'mongoose';

/**
 * Simple health check utilities
 */

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  database: 'connected' | 'disconnected';
  memory: {
    used: string;
    total: string;
  };
}

export const getHealthStatus = (): HealthStatus => {
  const memoryUsage = process.memoryUsage();

  return {
    status: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
    },
  };
};
