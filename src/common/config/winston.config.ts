import { WinstonModuleOptions, utilities } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// 파일 로그 포맷
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, context }) => {
    return `[${timestamp}] [${level.toUpperCase()}]${context ? ` [${context}]` : ''} ${message}`;
  })
);

// Winston 설정
export const winstonConfig: WinstonModuleOptions = {
  transports: [
    // 콘솔 출력 - nest-winston 기본 포맷 사용
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        utilities.format.nestLike('App', {
          prettyPrint: true,
          colors: true
        })
      )
    }),

    // 에러 로그 파일
    new DailyRotateFile({
      level: 'error',
      dirname: 'logs/error',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      format: fileFormat
    }),

    // 전체 로그 파일
    new DailyRotateFile({
      level: 'info',
      dirname: 'logs/app',
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      format: fileFormat
    })
  ]
};
