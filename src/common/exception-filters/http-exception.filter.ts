import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ErrorMessages } from '../constants/error-messages.enum';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    /**
     * HTTP 컨텍스트에서 request / response 객체 추출
     */
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    /**
     * 기본 응답값 세팅 (예외 미분류 시 fallback)
     */
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = ErrorMessages.INTERNAL_SERVER_ERROR;
    let code: string = 'INTERNAL_SERVER_ERROR';

    /**
     * Error 인스턴스일 경우 stack trace 확보 (로그용)
     */
    const stack = exception instanceof Error ? exception.stack : '';

    /**
     * ======================================================
     * DB 계층 예외 처리 (TypeORM)
     * ======================================================
     */
    if (exception instanceof QueryFailedError) {
      const msg = exception.message;

      // DB 에러 원본 메시지 로그
      this.logger.error(`[${request.method} ${request.url}] QueryFailedError Message: ${msg}`, stack);

      // 중복 데이터 에러 매핑
      if (msg.startsWith('Duplicate')) {
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessages.DUP;
      }

      // 필수 컬럼 누락 에러 매핑
      if (msg.includes(`doesn't have a default value`)) {
        status = HttpStatus.BAD_REQUEST;
        message = ErrorMessages.INVALID_REQUEST_PARAMETER;
      }
    }

    /**
     * 엔티티 조회 실패 (findOneOrFail 등)
     */
    if (exception instanceof EntityNotFoundError) {
      message = ErrorMessages.NOT_FOUND_DATA;
    }

    /**
     * ======================================================
     * NestJS HttpException 처리
     * ======================================================
     */
    if (exception instanceof HttpException) {
      // HttpException에 정의된 상태 코드 사용
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'object' && res !== null) {
        const { message: resMessage, isExternal } = res as any;

        // 외부 API 에러는 그대로 노출
        if (isExternal) {
          message = resMessage;
          code = 'EXTERNAL_API_ERROR';
        } else {
          message = resMessage;
        }
      }
    }

    /**
     * ======================================================
     * 404 기본 Nest 메시지 치환
     * ======================================================
     */
    if (status === 404) {
      const isDefaultNotFound = typeof message === 'string' && message.startsWith('Cannot ');

      // 라우트 미존재 시 사용자 친화 메시지로 변경
      if (isDefaultNotFound) {
        message = ErrorMessages.NOT_FOUND_REQUEST;
      }
    }

    /**
     * ======================================================
     * 메시지 화이트리스트 & 정규화
     * ======================================================
     */
    if (Array.isArray(message)) {
      message = message.map((msg) => {
        const enumKey = Object.keys(ErrorMessages).find((key) => ErrorMessages[key as keyof typeof ErrorMessages] === msg);
        if (enumKey) {
          return msg;
        } else {
          return ErrorMessages.INTERNAL_SERVER_ERROR;
        }
      });
    } else if (typeof message === 'string') {
      if (code === 'EXTERNAL_API_ERROR') {
      } else {
        const enumKey = Object.keys(ErrorMessages).find((key) => ErrorMessages[key as keyof typeof ErrorMessages] === message);
        if (enumKey) {
          code = enumKey;
        } else {
          message = ErrorMessages.INTERNAL_SERVER_ERROR;
          code = 'INTERNAL_SERVER_ERROR';
        }
      }
    }

    /**
     * ======================================================
     * 요청 메타 로그 (LoggingInterceptor에서 주입)
     * ======================================================
     */
    const logMeta = request.__logMeta;

    let errorReqeustAndResponseLog: string = '';
    if (logMeta) {
      errorReqeustAndResponseLog = `
============================= Exception ============================ [${logMeta.reqId}]
Datetime       : ${logMeta.datetime}
Headers        : ${JSON.stringify(logMeta.filteredHeaders)}
IP             : ${logMeta.ip}
Method         : ${logMeta.method}
URL            : ${logMeta.url}
Query          : ${JSON.stringify(logMeta.query)}
Body           : ${JSON.stringify(logMeta.body)}
StatusCode     : ${status}
code           : ${code}
Message        : ${status >= 500 ? stack : JSON.stringify(message)}
=============================== Close ============================== [${logMeta.reqId}]
`;
    } else {
      errorReqeustAndResponseLog = `[${request.method} ${request.url}] StatusCode: ${status} Code: ${code} Message: ${JSON.stringify(message)}`;
    }

    /**
     * ======================================================
     * 로그 레벨 분기
     * ======================================================
     */
    if (status >= 500) {
      this.logger.error('SERVER ERROR', errorReqeustAndResponseLog);
    } else {
      this.logger.warn(errorReqeustAndResponseLog);
    }

    /**
     * ======================================================
     * 클라이언트 응답 반환
     * ======================================================
     */
    response.status(status).json({
      statusCode: status,
      code,
      message
    });
  }
}
