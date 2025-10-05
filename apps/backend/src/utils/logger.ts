import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';
import { LOG_DIR } from '../config';

// logs dir (resolve relative to compiled dist folder)
const logDir: string = join(__dirname, LOG_DIR);

// Do not crash if filesystem is read-only (e.g. Vercel serverless). If we can't create
// the log directory, skip file transports and fall back to console-only logging.
let canWriteLogs = true;
try {
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }
} catch (err) {
  // EROFS on platforms like Vercel will surface here. Use console fallback.
  canWriteLogs = false;
  // eslint-disable-next-line no-console
  console.warn(`Logger: cannot create log directory ${logDir}, file logging disabled. Reason: ${err}`);
}

// Define log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [],
});

// Conditionally add file transports only when log directory is writable and we're not
// running in environments like Vercel where writing to the filesystem is disallowed.
if (canWriteLogs && !process.env.VERCEL) {
  logger.add(
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/debug', // log file /logs/debug/*.log
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),
  );

  logger.add(
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error', // log file /logs/error/*.log
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  );
} else {
  // If file logging is disabled, ensure we at least log to console.
  // This covers environments like Vercel where the filesystem is read-only.
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
    }),
  );
}

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };
