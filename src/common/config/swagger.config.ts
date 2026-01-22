import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Swagger 설정
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('NestJS Boilerplate API')
    .setDescription(
      `
## API 응답 형식

### 성공 응답
\`\`\`json
{
  "statusCode": 200,
  "message": "ok",
  "data": { ... }
}
\`\`\`

### 에러 응답
\`\`\`json
{
  "statusCode": 400,
  "code": "USER_001",
  "message": "에러 메시지"
}
\`\`\`
      `
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT 인증 토큰 입력'
      },
      'access-token'
    )
    .addTag('Auth', '인증 API')
    .addTag('Users', '사용자 API')
    .addTag('Admins', '관리자 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });
}
