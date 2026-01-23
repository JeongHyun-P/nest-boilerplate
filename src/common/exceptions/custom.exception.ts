import { HttpException, HttpStatus } from '@nestjs/common';

// 에러 코드 타입 정의
export interface ErrorCodeType {
  statusCode: HttpStatus;
  code: string;
  message: string;
}

// 공통 에러 코드 정의
export const ErrorCode = {
  // 인증 관련
  TOKEN_EXPIRED: {
    statusCode: HttpStatus.UNAUTHORIZED,
    code: 'TOKEN_EXPIRED',
    message: '토큰이 만료되었습니다.',
  },
  INVALID_TOKEN: {
    statusCode: HttpStatus.UNAUTHORIZED,
    code: 'INVALID_TOKEN',
    message: '유효하지 않은 토큰입니다.',
  },
  UNAUTHORIZED: {
    statusCode: HttpStatus.UNAUTHORIZED,
    code: 'UNAUTHORIZED',
    message: '인증이 필요합니다.',
  },
  FORBIDDEN: {
    statusCode: HttpStatus.FORBIDDEN,
    code: 'FORBIDDEN',
    message: '접근 권한이 없습니다.',
  },

  // 유저 관련
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    code: 'USER_NOT_FOUND',
    message: '유저를 찾을 수 없습니다.',
  },
  USER_ALREADY_EXISTS: {
    statusCode: HttpStatus.CONFLICT,
    code: 'USER_ALREADY_EXISTS',
    message: '이미 존재하는 이메일입니다.',
  },
  PHONE_ALREADY_EXISTS: {
    statusCode: HttpStatus.CONFLICT,
    code: 'PHONE_ALREADY_EXISTS',
    message: '이미 사용 중인 전화번호입니다.',
  },
  INVALID_CURRENT_PASSWORD: {
    statusCode: HttpStatus.BAD_REQUEST,
    code: 'INVALID_CURRENT_PASSWORD',
    message: '현재 비밀번호가 일치하지 않습니다.',
  },
  USER_NOT_ACTIVE: {
    statusCode: HttpStatus.FORBIDDEN,
    code: 'USER_NOT_ACTIVE',
    message: '비활성화된 계정입니다.',
  },
  ADMIN_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    code: 'ADMIN_NOT_FOUND',
    message: '관리자를 찾을 수 없습니다.',
  },
  LOGIN_FAILED: {
    statusCode: HttpStatus.UNAUTHORIZED,
    code: 'LOGIN_FAILED',
    message: '이메일 또는 비밀번호가 잘못되었습니다.',
  },

  // 파일 관련
  FILE_UPLOAD_FAILED: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    code: 'FILE_UPLOAD_FAILED',
    message: '파일 업로드에 실패했습니다.',
  },
  FILE_NOT_FOUND: {
    statusCode: HttpStatus.BAD_REQUEST, // 비즈니스 로직상 Bad Request가 많음
    code: 'FILE_NOT_FOUND',
    message: '파일을 찾을 수 없습니다.',
  },
  INVALID_FILE_TYPE: {
    statusCode: HttpStatus.BAD_REQUEST,
    code: 'INVALID_FILE_TYPE',
    message: '지원하지 않는 파일 형식입니다.',
  },
  FILE_TOO_LARGE: {
    statusCode: HttpStatus.BAD_REQUEST,
    code: 'FILE_TOO_LARGE',
    message: '파일 크기가 초과되었습니다.',
  },
  INVALID_FILE_KEY: {
    statusCode: HttpStatus.BAD_REQUEST,
    code: 'INVALID_FILE_KEY',
    message: '잘못된 파일 키입니다.',
  },

  // 메일 관련
  MAIL_SEND_FAILED: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    code: 'MAIL_SEND_FAILED',
    message: '메일 발송에 실패했습니다.',
  },

  // 외부 API 관련
  EXTERNAL_S3_UPLOAD_FAILED: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    code: 'EXTERNAL_S3_UPLOAD_FAILED',
    message: 'S3 파일 업로드에 실패했습니다.',
  },
  EXTERNAL_S3_DELETE_FAILED: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    code: 'EXTERNAL_S3_DELETE_FAILED',
    message: 'S3 파일 삭제에 실패했습니다.',
  },
  EXTERNAL_S3_TIMEOUT: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    code: 'EXTERNAL_S3_TIMEOUT',
    message: 'S3 요청 시간이 초과되었습니다.',
  },
  EXTERNAL_MAIL_FAILED: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    code: 'EXTERNAL_MAIL_FAILED',
    message: '메일 발송에 실패했습니다.',
  },
  EXTERNAL_MAIL_TIMEOUT: {
    statusCode: HttpStatus.SERVICE_UNAVAILABLE,
    code: 'EXTERNAL_MAIL_TIMEOUT',
    message: '메일 서버 연결 시간이 초과되었습니다.',
  },
} as const;

// 커스텀 예외 클래스
export class CustomException extends HttpException {
  constructor(errorCode: ErrorCodeType) {
    super(
      {
        code: errorCode.code,
        message: errorCode.message,
      },
      errorCode.statusCode,
    );
  }
}
