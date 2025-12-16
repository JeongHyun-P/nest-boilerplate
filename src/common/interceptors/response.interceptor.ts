import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Observable, map } from 'rxjs';

export interface ResponseFormat<T = any> {
  statusCode: number;
  message: string;
  data?: T | null | Record<string, any>;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: response.statusCode,
          message: 'Success',
          data: data ? instanceToPlain(data) : null
        };
      })
    );
  }
}
