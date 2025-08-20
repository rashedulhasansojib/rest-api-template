export default {
  port: 3000,
  logLevel: 'debug',
  mongoUri: 'mongodb://localhost:27017/rest-api-dev',
  jwtSecret: 'dev-jwt-secret-change-in-production',
  jwtExpiresIn: '7d',
  saltWorkFactor: 10, // Lower for faster development
  allowedOrigins: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
  ],
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 1000, // Higher limit for development
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};
