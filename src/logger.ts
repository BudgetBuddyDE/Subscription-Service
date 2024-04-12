import winston from 'winston';

/**
 * The logger instance for the subscription service.
 */
export const logger = winston.createLogger({
  level: 'info',
  defaultMeta: {
    application: 'subscription-service',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({stack: true}),
        winston.format.colorize({all: true}),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss.SSS',
        }),
        winston.format.align(),
        winston.format.printf(info => {
          let logObject = {...info};
          // @ts-expect-error
          delete logObject.level;
          delete logObject.message;
          delete logObject.timestamp;
          return `[${info.timestamp}] ${info.level}: ${info.message} (${JSON.stringify(logObject)})`;
        }),
      ),
      level: 'info',
    }),
    new winston.transports.File({
      dirname: 'logs',
      filename: 'error.log',
    }),
  ],
});
