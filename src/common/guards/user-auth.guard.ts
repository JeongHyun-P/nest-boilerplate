import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ErrorMessages } from '../constants/error-messages.enum';
import { Role } from '../constants/roles.enum';

@Injectable()
export class UserJwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (req.url.startsWith('/admin')) {
      return true;
    }

    const token = this.authService.extractTokenFromHeader(req);
    if (!token || req.url.startsWith('/common')) {
      if (isPublic) {
        req['_user'] = null;
        return true;
      }
      throw new UnauthorizedException(ErrorMessages.ACCESS_DENIED);
    }

    const verifiedToken = this.authService.verifyToken(token, false);

    if (verifiedToken.role !== Role.USER) {
      throw new UnauthorizedException(ErrorMessages.ACCESS_DENIED);
    }

    req['_user'] = verifiedToken;
    return true;
  }
}
