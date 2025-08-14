import pino from 'pino';
import config from 'config';

const logger = pino({
  level: config.get<string>('logLevel') || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    },
  },
});

export default logger;
