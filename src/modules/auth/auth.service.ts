import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/constants/role.enum';
import { CustomException, ErrorCode } from '../../common/exceptions/custom.exception';
import { TokenResponseDto, RefreshTokenResponseDto } from './dto/response.dto';
import { SignupRequestDto, LoginRequestDto, AdminLoginRequestDto } from './dto/request.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { User } from '../user/entities/user.entity';
import { UserRepository } from '../user/user.repository';
import { AdminRepository } from '../admin/admin.repository';
import { MailService } from '../mail/mail.service';

// 인증 서비스
@Injectable()
export class AuthService {
  private readonly refreshTokenCookie: string;
  private readonly refreshTokenMaxAge: number;
  private readonly renewalThresholdMs: number;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly adminRepository: AdminRepository,
    private readonly mailService: MailService,
  ) {
    const serviceName = this.configService.get<string>('serviceName') || 'nest-app';
    this.refreshTokenCookie = `${serviceName}_URT`;
    this.refreshTokenMaxAge = this.parseDuration(this.configService.get('jwt.refreshExpiresIn') || '30d');
    this.renewalThresholdMs = this.parseDuration(this.configService.get('jwt.refreshTokenRenewalThreshold') || '7d');
  }

  // 회원가입
  async signup(dto: SignupRequestDto, res: Response): Promise<TokenResponseDto> {
    const { email, password, name } = dto;

    const exists = await this.userRepository.existsByEmail(email);
    if (exists) {
      throw new CustomException({
        statusCode: HttpStatus.CONFLICT,
        ...ErrorCode.USER_ALREADY_EXISTS
      });
    }

    const hashedPassword = await this.hashPassword(password);

    const user = await this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const newUser = userRepo.create({
        email,
        password: hashedPassword,
        name
      });
      return userRepo.save(newUser);
    });

    this.mailService.sendWelcomeMail(user.email, user.name).catch(() => {});

    return this.generateTokensWithCookie(user.id, user.email, Role.USER, res);
  }

  // 사용자 로그인
  async login(dto: LoginRequestDto, res: Response): Promise<TokenResponseDto> {
    const { email, password } = dto;

    const user = await this.userRepository.findActiveByEmailWithPassword(email);
    if (!user) {
      throw new CustomException({
        statusCode: HttpStatus.UNAUTHORIZED,
        ...ErrorCode.INVALID_CREDENTIALS
      });
    }

    await this.validatePassword(password, user.password);

    return this.generateTokensWithCookie(user.id, user.email, Role.USER, res);
  }

  // 관리자 로그인
  async adminLogin(dto: AdminLoginRequestDto, res: Response): Promise<TokenResponseDto> {
    const { loginId, password } = dto;

    const admin = await this.adminRepository.findByLoginIdWithPassword(loginId);
    if (!admin) {
      throw new CustomException({
        statusCode: HttpStatus.UNAUTHORIZED,
        ...ErrorCode.INVALID_CREDENTIALS
      });
    }

    await this.validatePassword(password, admin.password);

    return this.generateTokensWithCookie(admin.id, admin.loginId, Role.ADMIN, res);
  }

  // 토큰 갱신 (쿠키에서 Refresh Token 읽기)
  refreshTokens(refreshToken: string, res: Response): RefreshTokenResponseDto {
    if (!refreshToken) {
      throw new CustomException({
        statusCode: HttpStatus.UNAUTHORIZED,
        ...ErrorCode.INVALID_TOKEN,
      });
    }

    try {
      const payload = this.jwtService.verify<JwtPayload & { exp: number }>(refreshToken, {
        secret: this.configService.get('jwt.secret'),
      });

      const newPayload: JwtPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      // Refresh Token 남은 시간 확인 후 갱신 여부 결정
      const now = Math.floor(Date.now() / 1000);
      const remainingTime = (payload.exp - now) * 1000;

      if (remainingTime < this.renewalThresholdMs) {
        // 남은 기간이 threshold 미만이면 Refresh Token도 재발급
        const newRefreshToken = this.generateRefreshToken(newPayload);
        this.setRefreshTokenCookie(res, newRefreshToken);
      }

      return {
        accessToken: this.generateAccessToken(newPayload),
      };
    } catch {
      this.clearRefreshTokenCookie(res);
      throw new CustomException({
        statusCode: HttpStatus.UNAUTHORIZED,
        ...ErrorCode.INVALID_TOKEN,
      });
    }
  }

  // 로그아웃 (쿠키 삭제)
  logout(res: Response): void {
    this.clearRefreshTokenCookie(res);
  }

  // Refresh Token 쿠키 이름 반환
  getRefreshTokenCookieName(): string {
    return this.refreshTokenCookie;
  }

  // Access Token 생성
  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.accessExpiresIn')
    });
  }

  // Refresh Token 생성
  private generateRefreshToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn')
    });
  }

  // 토큰 발급 + 쿠키 설정
  private generateTokensWithCookie(
    userId: number,
    email: string,
    role: Role,
    res: Response
  ): TokenResponseDto {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Refresh Token을 쿠키에 설정
    this.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  // Refresh Token 쿠키 설정
  private setRefreshTokenCookie(res: Response, token: string): void {
    const isProduction = this.configService.get('nodeEnv') === 'production';

    res.cookie(this.refreshTokenCookie, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: this.refreshTokenMaxAge,
      path: '/',
    });
  }

  // Refresh Token 쿠키 삭제
  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(this.refreshTokenCookie, { path: '/' });
  }

  // Duration 문자열을 밀리초로 변환 (예: '15m', '7d', '30d')
  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 30 * 24 * 60 * 60 * 1000; // 기본값 30일

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return 30 * 24 * 60 * 60 * 1000;
    }
  }

  // 비밀번호 해싱
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // 비밀번호 비교
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // 비밀번호 검증
  async validatePassword(password: string, hashedPassword: string): Promise<void> {
    const isValid = await this.comparePassword(password, hashedPassword);
    if (!isValid) {
      throw new CustomException({
        statusCode: HttpStatus.UNAUTHORIZED,
        ...ErrorCode.INVALID_CREDENTIALS
      });
    }
  }
}
