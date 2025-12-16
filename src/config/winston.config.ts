import * as winston from 'winston';
import { WinstonModuleOptions } from 'nest-winston';
import 'winston-daily-rotate-file';

const isProd = process.env.NODE_ENV === 'production';

/**
 * 공통 로그 포맷
 */
const logFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
  return `[${timestamp}] [${level}] ${stack || message}`;
});

/**
 * 파일 로그용 공통 포맷
 */
const fileFormat = winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston.format.errors({ stack: true }), logFormat);

/**
 * 콘솔 로그용 포맷
 */
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({ format: 'HH:mm:ss' }), logFormat);

export const winstonConfig: WinstonModuleOptions = {
  transports: [
    /**
     * =========================
     * Console (개발/배포 공통)
     * =========================
     */
    new winston.transports.Console({
      level: isProd ? 'info' : 'debug',
      format: consoleFormat
    }),

    /**
     * =========================
     * 전체 로그 (info 이상)
     * logs/app/
     * =========================
     */
    new (winston.transports as any).DailyRotateFile({
      dirname: 'logs/app',
      filename: 'app-%DATE%.log',
      level: 'info',
      datePattern: 'YYYY-MM-DD',

      maxSize: '20m', // 파일 하나당 최대 용량
      maxFiles: '14d', // 14일 지난 로그 자동 삭제
      zippedArchive: true,

      format: fileFormat
    }),

    /**
     * =========================
     * Warning 로그 (warn + error)
     * logs/warn/
     * =========================
     */
    new (winston.transports as any).DailyRotateFile({
      dirname: 'logs/warn',
      filename: 'warn-%DATE%.log',
      level: 'warn',
      datePattern: 'YYYY-MM-DD',

      maxSize: '10m',
      maxFiles: '14d',
      zippedArchive: true,

      format: fileFormat
    }),

    /**
     * =========================
     * Error 로그 (error only)
     * logs/error/
     * =========================
     */
    new (winston.transports as any).DailyRotateFile({
      dirname: 'logs/error',
      filename: 'error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',

      maxSize: '10m',
      maxFiles: '14d',
      zippedArchive: true,

      format: fileFormat
    })
  ]
};
