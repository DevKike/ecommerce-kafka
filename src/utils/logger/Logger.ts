import winston from 'winston';
import { CONSTANT } from '../../config/constants/constants';

export class Logger {
  private static logger = winston.createLogger({
    level: CONSTANT.ENVIRONMENT.LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize(),
      winston.format.printf(({ level, message, timestamp, ...meta }) => {
        const metaString =
          Object.keys(meta).length && !meta.error
            ? `\n${JSON.stringify(meta, null, 2)}`
            : meta.error
            ? `\n${JSON.stringify(meta.error, null, 2)}`
            : '';
        return `${timestamp} ${level}: ${message}${metaString}`;
      })
    ),
    transports: [new winston.transports.Console()],
  });

  public static info(message: string, meta?: Record<string, unknown>): void {
    this.logger.info(message, meta);
  }

  public static error(message: string, error?: Error | unknown): void {
    this.logger.error(
      message,
      error instanceof Error
        ? {
            error: {
              message: error.message,
              stack: error.stack,
            },
          }
        : { error }
    );
  }

  public static warn(message: string, meta?: Record<string, unknown>): void {
    this.logger.warn(message, meta);
  }

  public static debug(message: string, meta?: Record<string, unknown>): void {
    this.logger.debug(message, meta);
  }
}
