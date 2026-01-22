import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { winstonConfig } from './common/config/winston.config';
import { setupSwagger } from './common/config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig)
  });

  const logger = new Logger('Bootstrap');

  // 보안 헤더 설정 (Helmet)
  app.use(helmet());

  // 쿠키 파서
  app.use(cookieParser());

  // CORS 설정
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGINS?.split(',') || [] : true,
    credentials: true
  });

  // 전역 ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  // Swagger 설정
  setupSwagger(app);

  // 서버 시작
  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`Server running on port: http://localhost:${port}`);
  logger.log(`API Docs: http://localhost:${port}/api-docs`);
}

bootstrap();
