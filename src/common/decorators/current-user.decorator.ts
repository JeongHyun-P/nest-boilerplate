import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// 현재 인증된 사용자 정보 추출 데코레이터
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
