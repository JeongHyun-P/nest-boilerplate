import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Response, Request } from 'express';

// 표준 에러 응답 포맷
interface ErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  requestId?: string;
}

// Request 확장 타입
interface RequestWithMeta extends Request {
  requestId?: string;
  user?: { id: number | string };
}

// 전역 HTTP 예외 필터
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithMeta>();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = this.getErrorMessage(exception);
    const code = this.getErrorCode(statusCode, exception);

    // 에러 로깅
    const errorLog = this.formatErrorLog(request, statusCode, message, exception);

    if (statusCode >= 500) {
      this.logger.error(errorLog);
    } else if (statusCode >= 400) {
      this.logger.warn(errorLog);
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      code,
      message
    };

    response.status(statusCode).json(errorResponse);
  }

  // 에러 로그 포맷
  private formatErrorLog(request: RequestWithMeta, statusCode: number, message: string, exception: unknown): string {
    const { method, url, body, user, requestId } = request;
    const userId = user?.id || 'anonymous';

    const lines: string[] = [`[${method}] ${url} - ${statusCode}: ${message}`];

    if (requestId) {
      lines.push(`  └─ Request ID: ${requestId}`);
    }
    lines.push(`  └─ User: ${userId}`);

    // 요청 Body (민감정보 제외)
    if (body && Object.keys(body).length > 0) {
      const safeBody = this.sanitizeBody(body);
      lines.push(`  └─ Body: ${JSON.stringify(safeBody)}`);
    }

    // 스택 트레이스 (src/ 경로만 필터링)
    if (exception instanceof Error && exception.stack) {
      const relevantStack = this.filterStack(exception.stack);
      if (relevantStack) {
        lines.push(`  └─ Stack:\n${relevantStack}`);
      }
    }

    return lines.join('\n');
  }

  // 스택 트레이스에서 프로젝트 코드만 필터링
  private filterStack(stack: string): string {
    const lines = stack.split('\n');
    const filtered = lines
      .filter((line) => {
        return line.includes('/src/') || line.includes('/dist/');
      })
      .map((line) => `      ${line.trim()}`)
      .slice(0, 5);

    return filtered.length > 0 ? filtered.join('\n') : '';
  }

  // 민감정보 마스킹
  private sanitizeBody(body: Record<string, unknown>): Record<string, unknown> {
    const sensitiveKeys = ['password', 'token', 'refreshtoken', 'accesstoken', 'secret', 'authorization'];
    const sanitized = { ...body };

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = '***';
      }
    }

    return sanitized;
  }

  private getErrorMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'string') {
        return response;
      }
      if (typeof response === 'object' && response !== null) {
        const responseObj = response as Record<string, unknown>;
        if (Array.isArray(responseObj.message)) {
          return responseObj.message.join(', ');
        }
        return (responseObj.message as string) || exception.message;
      }
    }

    // DB 쿼리 에러 (TypeORM QueryFailedError)
    if (this.isQueryFailedError(exception)) {
      return this.getQueryErrorMessage(exception);
    }

    return '서버 내부 오류가 발생했습니다.';
  }

  // TypeORM QueryFailedError 판별
  private isQueryFailedError(exception: unknown): exception is Error & { errno?: number } {
    return exception instanceof Error && exception.constructor.name === 'QueryFailedError';
  }

  // MySQL 에러 코드별 클라이언트 메시지 매핑
  private getQueryErrorMessage(exception: Error & { errno?: number; sql?: string }): string {
    switch (exception.errno) {
      case 1062:
        return '이미 존재하는 데이터입니다.';
      case 1452:
        return '참조하는 데이터가 존재하지 않습니다.';
      case 1451:
        return '다른 데이터에서 참조 중이므로 삭제할 수 없습니다.';
      default:
        this.logger.error(`[QueryFailedError] errno: ${exception.errno}, message: ${exception.message}, sql: ${exception.sql}`);
        return '데이터 처리 중 오류가 발생했습니다.';
    }
  }

  private getErrorCode(statusCode: number, exception: unknown): string {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && response !== null) {
        const responseObj = response as Record<string, unknown>;
        if (responseObj.code) {
          return responseObj.code as string;
        }
      }
    }

    // DB 쿼리 에러 코드 매핑
    if (this.isQueryFailedError(exception)) {
      return this.getQueryErrorCode(exception);
    }

    const errorCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      500: 'INTERNAL_SERVER_ERROR'
    };

    return errorCodes[statusCode] || 'UNKNOWN_ERROR';
  }

  // MySQL 에러 코드별 응답 코드 매핑
  private getQueryErrorCode(exception: Error & { errno?: number }): string {
    switch (exception.errno) {
      case 1062:
        return 'DUPLICATE_ENTRY';
      case 1452:
        return 'FOREIGN_KEY_VIOLATION';
      case 1451:
        return 'FOREIGN_KEY_CONSTRAINT';
      default:
        return 'DATABASE_ERROR';
    }
  }
}
