import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

// 민감 필드 목록
const SENSITIVE_FIELDS = [
  'password',
  'token',
  'refreshtoken',
  'accesstoken',
  'secret',
  'authorization',
  'cardnumber',
  'cvv',
  'ssn',
];

// 로깅 제외 경로
const EXCLUDED_PATHS = ['/health', '/ping', '/favicon.ico'];

// 민감 데이터 마스킹
function maskSensitiveData(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => maskSensitiveData(item));
  }

  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_FIELDS.some((field) => lowerKey.includes(field))) {
      masked[key] = '***';
    } else if (typeof value === 'object' && value !== null) {
      masked[key] = maskSensitiveData(value);
    } else {
      masked[key] = value;
    }
  }
  return masked;
}

// 요청/응답 로깅 인터셉터
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  private readonly isDev: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isDev = this.configService.get('nodeEnv') !== 'production';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, body, headers } = request;

    // 로깅 제외 경로 체크
    const path = url.split('?')[0];
    if (EXCLUDED_PATHS.includes(path)) {
      return next.handle();
    }

    // Request ID 생성 및 설정
    const requestId = (headers['x-request-id'] as string) || uuidv4();
    request.requestId = requestId;

    const userId = request.user?.id || 'anonymous';
    const startTime = Date.now();

    // multipart/form-data 체크 (파일 업로드)
    const contentType = headers['content-type'] || '';
    const isFileUpload = contentType.includes('multipart/form-data');

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - startTime;

          // Response 헤더에 Request ID 추가
          response.setHeader('x-request-id', requestId);

          this.logRequest({
            requestId,
            method,
            url,
            statusCode,
            duration,
            ip,
            userId,
            body: isFileUpload ? '[FILE_UPLOAD]' : body,
            responseBody,
          });
        },
        error: () => {
          // 에러는 HttpExceptionFilter에서 처리
        },
      }),
    );
  }

  private logRequest(params: {
    requestId: string;
    method: string;
    url: string;
    statusCode: number;
    duration: number;
    ip: string;
    userId: string | number;
    body: unknown;
    responseBody: unknown;
  }): void {
    const {
      requestId,
      method,
      url,
      statusCode,
      duration,
      ip,
      userId,
      body,
      responseBody,
    } = params;

    // 기본 로그 라인
    const lines: string[] = [
      `${method} ${url} ${statusCode} - ${duration}ms`,
      `  └─ ID: ${requestId}`,
      `  └─ IP: ${ip}`,
      `  └─ User: ${userId}`,
    ];

    // Development: 상세 로그
    if (this.isDev) {
      // Request Body
      if (body && typeof body === 'object' && Object.keys(body).length > 0) {
        const maskedBody = maskSensitiveData(body);
        lines.push(`  └─ Body: ${JSON.stringify(maskedBody)}`);
      }

      // Response Body (개발 환경만)
      if (responseBody !== undefined && responseBody !== null) {
        const maskedResponse = maskSensitiveData(responseBody);
        const responseStr = JSON.stringify(maskedResponse);
        // 너무 긴 응답은 truncate
        const truncated =
          responseStr.length > 500
            ? responseStr.substring(0, 500) + '...[truncated]'
            : responseStr;
        lines.push(`  └─ Response: ${truncated}`);
      }
    }

    this.logger.log(lines.join('\n'));
  }
}
