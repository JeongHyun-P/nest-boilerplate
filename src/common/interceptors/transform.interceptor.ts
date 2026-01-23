import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 표준 성공 응답 포맷
export interface SuccessResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// 성공 응답 변환 인터셉터
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, SuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // 모든 정상 응답의 HTTP status를 200으로 통일
        response.status(200);
        return {
          statusCode: 200,
          message: 'ok',
          data: data ?? null,
        };
      }),
    );
  }
}
