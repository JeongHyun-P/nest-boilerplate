import { Injectable, ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { CustomException, ErrorCode } from '../exceptions/custom.exception';

// JWT 인증 가드
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Public 데코레이터 확인
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: Error | null, user: TUser | false, info: Error | null): TUser {
    // 토큰 만료
    if (info?.name === 'TokenExpiredError') {
      throw new CustomException({ statusCode: HttpStatus.UNAUTHORIZED, ...ErrorCode.TOKEN_EXPIRED });
    }

    // 유효하지 않은 토큰 (잘못된 형식, 시그니처 불일치 등)
    if (info?.name === 'JsonWebTokenError') {
      throw new CustomException({ statusCode: HttpStatus.UNAUTHORIZED, ...ErrorCode.INVALID_TOKEN });
    }

    // 그 외 에러 또는 user 없음
    if (err || !user) {
      throw new CustomException({ statusCode: HttpStatus.UNAUTHORIZED, ...ErrorCode.UNAUTHORIZED });
    }

    return user;
  }
}
