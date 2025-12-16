import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';

export const AuthUser = createParamDecorator((data: keyof User | undefined, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();

  const user = req._user as User;

  if (data) {
    return user[data];
  }

  return user;
});
