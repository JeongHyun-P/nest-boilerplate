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
│   │   ├── role.enum.ts      # 사용자 역할
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
│   ├── database.module.ts
│   ├── typeorm.config.ts     # TypeORM CLI 설정
│   └── migrations/           # 마이그레이션 파일
├── modules/                   # 기능 모듈
│   ├── auth/                 # 인증 모듈
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── user/                 # 사용자 모듈
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

## API 엔드포인트

### Users (사용자)

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | /users/signup | 회원가입 | - |
| POST | /users/login | 로그인 | - |
| POST | /users/token/refresh | 토큰 갱신 | - |
| GET | /users/profile | 프로필 조회 | Bearer |
| POST | /users/profile-image | 프로필 이미지 업로드 | Bearer |

### Admins (관리자)

| Method | URL | Description | Auth |
|--------|-----|-------------|------|
| POST | /admins/login | 관리자 로그인 | - |
| POST | /admins/token/refresh | 토큰 갱신 | - |
| GET | /admins/users | 사용자 목록 조회 | Bearer (ADMIN) |

## 데이터베이스 마이그레이션

```bash
# 마이그레이션 생성
yarn migration:generate src/database/migrations/MigrationName

# 마이그레이션 실행
yarn migration:run

# 마이그레이션 롤백
yarn migration:revert
```

## 환경변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| NODE_ENV | 환경 (development/production) | O |
| PORT | 서버 포트 | O |
| DB_HOST | 데이터베이스 호스트 | O |
| DB_PORT | 데이터베이스 포트 | O |
| DB_USERNAME | 데이터베이스 사용자명 | O |
| DB_PASSWORD | 데이터베이스 비밀번호 | O |
| DB_DATABASE | 데이터베이스명 | O |
| JWT_SECRET | JWT 시크릿 키 | O |
| JWT_ACCESS_EXPIRES_IN | Access Token 만료시간 | - |
| JWT_REFRESH_EXPIRES_IN | Refresh Token 만료시간 | - |
| AWS_REGION | AWS 리전 | - |
| AWS_ACCESS_KEY_ID | AWS Access Key | - |
| AWS_SECRET_ACCESS_KEY | AWS Secret Key | - |
| AWS_S3_BUCKET | S3 버킷명 | - |
| MAIL_HOST | SMTP 호스트 | - |
| MAIL_PORT | SMTP 포트 | - |
| MAIL_USER | SMTP 사용자 | - |
| MAIL_PASSWORD | SMTP 비밀번호 | - |
| MAIL_FROM | 발신자 주소 | - |

## 응답 포맷

### 성공 응답

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 에러 응답

```json
{
  "success": false,
  "statusCode": 400,
  "message": "에러 메시지",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```

## 설계 원칙

1. **Layered Architecture**: Controller → Service → Repository 책임 분리
2. **Module 기반 구조**: 기능 단위 모듈화
3. **DTO 사용**: Request/Response 분리, Entity 직접 노출 금지
4. **전역 설정**: Guard, Filter, Interceptor 전역 적용
5. **환경변수 검증**: Joi 스키마 기반 검증