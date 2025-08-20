export default {
  port: process.env['PORT'] ? parseInt(process.env['PORT'], 10) : 3000,
  logLevel: process.env['LOG_LEVEL'] ?? 'info',
  mongoUri: process.env['MONGO_URI'] ?? '',
  jwtSecret: process.env['JWT_SECRET'] ?? '',
  jwtExpiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
  saltWorkFactor: process.env['SALT_WORK_FACTOR']
    ? parseInt(process.env['SALT_WORK_FACTOR'], 10)
    : 12,
  allowedOrigins: process.env['ALLOWED_ORIGINS']?.split(',') ?? [],
  rateLimit: {
    windowMs: process.env['RATE_LIMIT_WINDOW_MS']
      ? parseInt(process.env['RATE_LIMIT_WINDOW_MS'], 10)
      : 15 * 60 * 1000,
    max: process.env['RATE_LIMIT_MAX']
      ? parseInt(process.env['RATE_LIMIT_MAX'], 10)
      : 100,
  },
  pagination: {
    defaultLimit: process.env['PAGINATION_DEFAULT_LIMIT']
      ? parseInt(process.env['PAGINATION_DEFAULT_LIMIT'], 10)
      : 10,
    maxLimit: process.env['PAGINATION_MAX_LIMIT']
      ? parseInt(process.env['PAGINATION_MAX_LIMIT'], 10)
      : 100,
  },
};
