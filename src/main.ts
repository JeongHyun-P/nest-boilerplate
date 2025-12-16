import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';
import cookieParser from 'cookie-parser';
import { validationExceptionFactory } from './common/exceptions/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig)
  });

  const isProd = process.env.NODE_ENV === 'production';

  const allowedOrigins = isProd ? [process.env.SERVICE_URL] : true;

  app.enableCors({
    origin: allowedOrigins,
    credentials: true
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      exceptionFactory: (errors) => validationExceptionFactory(errors)
    })
  );

  app.use(cookieParser());
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on port ${port}`);
}
bootstrap();
