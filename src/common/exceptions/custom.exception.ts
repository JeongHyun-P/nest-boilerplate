import { HttpException, HttpStatus } from '@nestjs/common';

// 커스텀 예외 옵션
interface CustomExceptionOptions {
  statusCode?: HttpStatus;
  code: string;
  message: string;
}

// 커스텀 예외 클래스 - 에러 코드 지원
export class CustomException extends HttpException {
  constructor(options: CustomExceptionOptions) {
    const { statusCode = HttpStatus.BAD_REQUEST, code, message } = options;
    super({ code, message }, statusCode);
  }
}

// 공통 에러 코드
export const ErrorCode = {
  // 인증 관련
  INVALID_CREDENTIALS: {
    code: 'AUTH_001',
    message: '이메일 또는 비밀번호가 올바르지 않음'
  },
  TOKEN_EXPIRED: {
    code: 'AUTH_002',
    message: '토큰이 만료됨'
  },
  INVALID_TOKEN: {
    code: 'AUTH_003',
    message: '유효하지 않은 토큰'
  },
  UNAUTHORIZED: {
    code: 'AUTH_004',
    message: '인증이 필요함'
  },
  FORBIDDEN: {
    code: 'AUTH_005',
    message: '접근 권한이 없음'
  },

  // 사용자 관련
  USER_NOT_FOUND: {
    code: 'USER_001',
    message: '사용자를 찾을 수 없음'
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_002',
    message: '이미 존재하는 이메일'
  },
  ADMIN_NOT_FOUND: {
    code: 'USER_003',
    message: '관리자를 찾을 수 없음'
  },

  // 파일 관련
  FILE_UPLOAD_FAILED: {
    code: 'FILE_001',
    message: '파일 업로드 실패'
  },
  FILE_NOT_FOUND: {
    code: 'FILE_002',
    message: '파일을 찾을 수 없음'
  },
  INVALID_FILE_TYPE: {
    code: 'FILE_003',
    message: '지원하지 않는 파일 형식'
  },
  FILE_TOO_LARGE: {
    code: 'FILE_004',
    message: '파일 크기 초과'
  },

  // 메일 관련
  MAIL_SEND_FAILED: {
    code: 'MAIL_001',
    message: '메일 발송 실패'
  },

  // 외부 API 관련 (EXT_xxx)
  EXTERNAL_S3_UPLOAD_FAILED: {
    code: 'EXT_001',
    message: 'S3 파일 업로드 실패 (외부 서비스 오류)'
  },
  EXTERNAL_S3_DELETE_FAILED: {
    code: 'EXT_002',
    message: 'S3 파일 삭제 실패 (외부 서비스 오류)'
  },
  EXTERNAL_S3_TIMEOUT: {
    code: 'EXT_003',
    message: 'S3 요청 타임아웃'
  },
  EXTERNAL_MAIL_FAILED: {
    code: 'EXT_004',
    message: '메일 발송 실패 (외부 서비스 오류)'
  },
  EXTERNAL_MAIL_TIMEOUT: {
    code: 'EXT_005',
    message: '메일 서버 연결 타임아웃'
  }
} as const;
