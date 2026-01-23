import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Swagger 설정
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('NestJS Boilerplate (Modular Monolith)')
    .setDescription(
      `
      NestJS Boilerplate with Layered Architecture–based Modular Monolith

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
    .setContact('DevHounds', 'https://devhounds.com', 'kayn@devhounds.com')
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
    .addTag('Users', '유저 API')
    .addTag('Admins', '관리자 API')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true
    }
  });
}
