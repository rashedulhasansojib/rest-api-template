import pino from 'pino';
import dayjs from 'dayjs';
import path from 'path';
import fs from 'fs';
import config from 'config';

// Ensure log directory exists
const logDir = path.resolve('./logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// File transport for persistent logs
const fileTransport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: path.join(logDir, 'app.log') },
      level: 'info', // logs info and above to file
    },
    {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: false, // use our custom timestamp
        ignore: 'pid,hostname',
      },
      level: 'info',
    },
  ],
});

const logger = pino(
  {
    base: { pid: false },
    timestamp: () => `,"time":"${dayjs().format()}"`,
    level: config.get<string>('logLevel') || 'info',
  },
  fileTransport
);

export default logger;
