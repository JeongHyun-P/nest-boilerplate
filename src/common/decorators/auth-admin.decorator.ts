import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Admin } from 'typeorm';

export const AuthAdmin = createParamDecorator((data: keyof Admin | undefined, context: ExecutionContext) => {
  const req = context.switchToHttp().getRequest();

  const admin = req._admin as Admin;

  if (data) {
    return admin[data];
  }

  return admin;
});
