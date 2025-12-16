## 버전 정보

| 항목          | 값        |
| ------------- | --------- |
| Node.js 버전  | `22.x`    |
| 패키지 매니저 | `Yarn`    |
| 실행          | `Yarn`    |
| ORM          | `TypeORM`    |

## 실행

| 명령어         | 설명                                     |
| -------------- | ---------------------------------------- |
| `yarn start:dev` | 개발 서버 실행 |


## 환경변수 (.env)

```dotenv
### APP
NODE_ENV=development
SERVICE_NAME=
PORT=
ADMIN_DEFAULT_PASSWORD=
CRYPTO_KEY=

### DB
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=

### JWT
JWT_SECRET=
JWT_HASH_ROUNDS=

### AWS S3
AWS_REGION=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_DEFAULT_BUCKET=
AWS_CLOUD_FRONT=

### MAIL
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=
```