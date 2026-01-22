import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';

import configuration, { validationSchema } from './common/config/configuration';
import { winstonConfig } from './common/config/winston.config';
import { DatabaseModule } from './database/database.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { AdminModule } from './modules/admin/admin.module';
import { FileModule } from './modules/file/file.module';
import { MailModule } from './modules/mail/mail.module';

import { HealthController } from './common/controllers/health.controller';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// 앱 루트 모듈
@Module({
  imports: [
    // 환경변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      validationOptions: {
        abortEarly: true
      }
    }),

    // Winston 로거
    WinstonModule.forRoot(winstonConfig),

    // 데이터베이스
    DatabaseModule,

    // 스케줄러 (모든 스케줄러를 한 곳에서 관리)
    SchedulerModule,

    // 기능 모듈
    AuthModule,
    UserModule,
    AdminModule,
    FileModule,
    MailModule
  ],
  controllers: [HealthController],
  providers: [
    // 전역 예외 필터
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    // 전역 JWT 인증 가드
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    // 전역 역할 가드
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    // 전역 응답 변환 인터셉터
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    },
    // 전역 로깅 인터셉터
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
export class AppModule {}
