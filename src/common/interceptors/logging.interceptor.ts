import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const KST = () => {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  return new Date(utc + koreaTimeDiff);
};

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, headers, body, query } = request;

    const isMultipart = typeof request.headers['content-type'] === 'string' && request.headers['content-type'].includes('multipart/form-data');

    const reqId = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(6, '0');
    const start = Date.now();

    const now = KST();
    const datetime = now.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const filteredHeaders = {
      authorization: headers['authorization'] || '-',
      'user-agent': headers['user-agent'] || '-',
      'content-type': headers['content-type'] || '-'
    };

    request.__logMeta = {
      reqId,
      datetime,
      filteredHeaders,
      ip,
      method,
      url,
      query,
      body
    };

    this.logger.log({
      level: 'info',
      message: `
=============================== Open =============================== [${reqId}]
Datetime       : ${datetime}
Headers        : ${JSON.stringify(filteredHeaders)}
IP             : ${ip}
Method         : ${method}
URL            : ${url}
Query          : ${JSON.stringify(query)}
Body           : ${isMultipart ? '[Multipart Form Data]' : JSON.stringify(body)}
`
    });

    return next.handle().pipe(
      tap((responseBody) => {
        const duration = (Date.now() - start).toFixed(3);
        const response = context.switchToHttp().getResponse();
        if (isMultipart) {
          this.logger.log({
            level: 'info',
            message: `
============================= FormData ============================= [${reqId}]
Fields         : ${JSON.stringify(request.body)}
Files          : ${this.formatFileMeta(request.files)}
`
          });
        }

        this.logger.log({
          level: 'info',
          message: `
============================= Response ============================= [${reqId}]
StatusCode     : ${response.statusCode}
Response-Time  : ${duration} ms
Response-Body  : ${JSON.stringify(responseBody)}
=============================== Close ============================== [${reqId}]
        `
        });
      })
    );
  }

  private formatFileMeta(files: any) {
    if (!files) return '-';

    if (Array.isArray(files)) {
      return JSON.stringify(
        files.map((f) => ({
          field: f.fieldname,
          name: f.originalname,
          size: f.size,
          type: f.mimetype
        }))
      );
    }

    return JSON.stringify(
      Object.entries(files).map(([field, list]: any) => ({
        field,
        count: list.length,
        files: list.map((f: any) => ({
          name: f.originalname,
          size: f.size,
          type: f.mimetype
        }))
      }))
    );
  }
}
