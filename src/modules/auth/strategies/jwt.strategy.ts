import { Injectable, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from '../../../common/constants/role.enum';
import { CustomException, ErrorCode } from '../../../common/exceptions/custom.exception';

// JWT 페이로드 타입
export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

// JWT 인증 전략
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get<string>('jwt.secret');
    if (!secret) {
      throw new Error('JWT_SECRET 환경변수 설정 필요');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  // 토큰 검증 후 유저 정보 반환
  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.role) {
      throw new CustomException({
        statusCode: HttpStatus.UNAUTHORIZED,
        ...ErrorCode.INVALID_TOKEN,
      });
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
