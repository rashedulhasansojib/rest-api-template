export default {
  port: 1337,
  logLevel: 'info',
  mongoUri:
    'mongodb+srv://rashedulhasan:S01673591736s@cluster0.kf0u1d6.mongodb.net/build-rest-api?retryWrites=true&w=majority&appName=Cluster0',
  jwtSecret: 'your-jwt-secret-here-change-in-production',
  jwtExpiresIn: '7d',
  saltWorkFactor: 12,
  allowedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 100,
  },
};
