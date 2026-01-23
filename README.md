# NestJS Boilerplate

NestJS Boilerplate (Layered Architecture–based Modular Monolith)

## 기술 스택

- **Framework**: NestJS 11
- **ORM**: TypeORM
- **Database**: MySQL
- **Authentication**: JWT (Passport)
- **File Storage**: AWS S3
- **Mail**: Nodemailer (SMTP)
- **Documentation**: Swagger
- **Logging**: Winston

## 프로젝트 구조

```
src/
├── common/                    # 공통 모듈
│   ├── config/               # 환경설정
│   │   ├── configuration.ts  # 환경변수 로드 및 검증
│   │   └── winston.config.ts # 로깅 설정
│   ├── constants/            # 상수 정의
│   │   ├── role.enum.ts      # 유저 역할
│   │   └── error-message.constant.ts
│   ├── decorators/           # 커스텀 데코레이터
│   │   ├── current-user.decorator.ts
│   │   ├── public.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/                  # 공통 DTO
│   │   └── pagination.dto.ts
│   ├── entities/             # 공통 Entity
│   │   └── base.entity.ts
│   ├── filters/              # 예외 필터
│   │   └── http-exception.filter.ts
│   ├── guards/               # 인증/인가 가드
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   └── interceptors/         # 인터셉터
│       ├── logging.interceptor.ts
│       └── transform.interceptor.ts
├── database/                  # 데이터베이스 설정
│   ├── migrations/           # 마이그레이션 파일
│   ├── seeds/                # 초기 데이터 시딩
│   │   └── database-seeder.module.ts
│   ├── database.module.ts
│   ├── naming.strategy.ts    # 네이밍 전략
│   └── typeorm.config.ts     # TypeORM CLI 설정
├── modules/                   # 기능 모듈
│   ├── auth/                 # 인증 모듈
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── user/                 # 유저 모듈
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── user.entity.ts
│   ├── admin/                # 관리자 모듈
│   │   ├── admin.module.ts
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   ├── admin.repository.ts
│   │   ├── dto/
│   │   └── entities/
│   │       └── admin.entity.ts
│   ├── file/                 # 파일 모듈
│   │   ├── file.module.ts
│   │   ├── file.service.ts
│   │   ├── s3.service.ts
│   │   └── dto/
│   └── mail/                 # 메일 모듈
│       ├── mail.module.ts
│       └── mail.service.ts
├── scheduler/                 # 스케줄러
│   ├── scheduler.module.ts
│   └── mail.scheduler.ts
├── app.module.ts
└── main.ts
```

## 설치 및 실행

```bash
# 의존성 설치
yarn install

# 환경변수 설정
cp env.example .env

# 개발 서버 실행
yarn start:dev

# 프로덕션 빌드
yarn build
yarn start:prod
```

## API 문서

서버 실행 후 Swagger UI 접근:

```
http://localhost:3000/api-docs
```

## 데이터베이스 마이그레이션

```bash
# 마이그레이션 생성
yarn migration:generate src/database/migrations/MigrationName

# 마이그레이션 실행
yarn migration:run

# 마이그레이션 롤백
yarn migration:revert
```

## 응답 포맷

### 성공 응답

```json
{
  "statusCode": 200,
  "message": "ok",
  "data": { ... }
}
```

### 에러 응답

```json
{
  "statusCode": 400,
  "code": "BAD_REQUEST",
  "message": "에러 메시지"
}
```