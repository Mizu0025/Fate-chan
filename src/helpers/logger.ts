import winston from 'winston';

let logger: winston.Logger | null = null;
const logFilename: string = 'log.txt';

export function getLogger(): winston.Logger {
  if (!logger) {
    logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf((info) => `${info.timestamp} - ${info.message}`),
        winston.format.colorize(), // Enable colorization of log levels
        winston.format.simple(), // Simple format: timestamp level message
      ),
      transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: logFilename }),
      ],
    });
  }

  return logger;
}

export const winstonLogger: winston.Logger = getLogger();
