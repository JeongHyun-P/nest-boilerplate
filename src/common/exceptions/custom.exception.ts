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
  TOKEN_EXPIRED: {
    code: 'TOKEN_EXPIRED',
    message: '토큰이 만료되었습니다.'
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: '유효하지 않은 토큰입니다.'
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: '인증이 필요합니다.'
  },
  FORBIDDEN: {
    code: 'FORBIDDEN',
    message: '접근 권한이 없습니다.'
  },

  // 사용자 관련
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다.'
  },
  USER_ALREADY_EXISTS: {
    code: 'USER_ALREADY_EXISTS',
    message: '이미 존재하는 이메일입니다.'
  },
  ADMIN_NOT_FOUND: {
    code: 'ADMIN_NOT_FOUND',
    message: '관리자를 찾을 수 없습니다.'
  },

  // 파일 관련
  FILE_UPLOAD_FAILED: {
    code: 'FILE_UPLOAD_FAILED',
    message: '파일 업로드에 실패했습니다.'
  },
  FILE_NOT_FOUND: {
    code: 'FILE_NOT_FOUND',
    message: '파일을 찾을 수 없습니다.'
  },
  INVALID_FILE_TYPE: {
    code: 'INVALID_FILE_TYPE',
    message: '지원하지 않는 파일 형식입니다.'
  },
  FILE_TOO_LARGE: {
    code: 'FILE_TOO_LARGE',
    message: '파일 크기가 초과되었습니다.'
  },
  INVALID_FILE_KEY: {
    code: 'INVALID_FILE_KEY',
    message: '잘못된 파일 키입니다.'
  },

  // 메일 관련
  MAIL_SEND_FAILED: {
    code: 'MAIL_SEND_FAILED',
    message: '메일 발송에 실패했습니다.'
  },

  // 외부 API 관련
  EXTERNAL_S3_UPLOAD_FAILED: {
    code: 'EXTERNAL_S3_UPLOAD_FAILED',
    message: 'S3 파일 업로드에 실패했습니다.'
  },
  EXTERNAL_S3_DELETE_FAILED: {
    code: 'EXTERNAL_S3_DELETE_FAILED',
    message: 'S3 파일 삭제에 실패했습니다.'
  },
  EXTERNAL_S3_TIMEOUT: {
    code: 'EXTERNAL_S3_TIMEOUT',
    message: 'S3 요청 시간이 초과되었습니다.'
  },
  EXTERNAL_MAIL_FAILED: {
    code: 'EXTERNAL_MAIL_FAILED',
    message: '메일 발송에 실패했습니다.'
  },
  EXTERNAL_MAIL_TIMEOUT: {
    code: 'EXTERNAL_MAIL_TIMEOUT',
    message: '메일 서버 연결 시간이 초과되었습니다.'
  }
} as const;
