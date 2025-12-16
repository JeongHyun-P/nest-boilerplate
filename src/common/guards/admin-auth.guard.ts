import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ErrorMessages } from '../constants/error-messages.enum';
import { Role } from '../constants/roles.enum';

@Injectable()
export class AdminJwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic || req.url.startsWith('/user')) {
      return true;
    }

    const token = this.authService.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException(ErrorMessages.ACCESS_DENIED);
    }
    
    const verifiedToken = this.authService.verifyToken(token, false);

    if (verifiedToken.role !== Role.ADMIN) {
        throw new UnauthorizedException(ErrorMessages.ACCESS_DENIED);
    }

    req['_admin'] = verifiedToken;

    return true;
  }
}
