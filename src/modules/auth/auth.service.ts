import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/constants/roles.enum';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/services/notification-channel/mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailAuth } from '../user/entities/email-auth.entity';
import { Repository } from 'typeorm';
import { EmailCodeDto } from '../user/dto/email-code.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(EmailAuth)
    private readonly emailAuthRepo: Repository<EmailAuth>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  // 이메일 인증 코드 생성
  private createEmailCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 이메일 인증 코드 저장
  private saveEmailCode(email: string, code: string) {
    return this.emailAuthRepo.save({
      email,
      code,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000)
    });
  }

  // 이메일 인증 코드 전송
  async sendJoinEmailCode(emailCodeDto: EmailCodeDto) {
    const code = this.createEmailCode();
    const serviceName = this.configService.get('app.serviceName');
    const title = `[${serviceName}] 이메일 인증 코드입니다.`;
    const content = `
      <div style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #F05923; margin: 0; font-size: 24px; font-weight: bold;">${serviceName}</h1>
        </div>
        <div style="background-color: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 40px 20px; text-align: center;">
          <h2 style="margin: 0 0 20px; font-size: 20px; color: #333;">이메일 인증 안내</h2>
          <p style="margin: 0 0 30px; line-height: 1.6; color: #666; font-size: 14px;">
            안녕하세요.<br>
            아래의 인증 코드를 입력하여 회원가입을 완료해주세요.
          </p>
          <div style="background-color: #f8f9fa; border-radius: 4px; padding: 15px; margin: 0 auto 30px; width: fit-content; min-width: 200px;">
            <span style="color: #F05923; font-size: 24px; font-weight: bold; letter-spacing: 5px;">${code}</span>
          </div>
          <p style="margin: 0; color: #999; font-size: 12px;">
            인증 코드는 5분간 유효합니다.<br>
            본인이 요청하지 않은 경우 이 메일을 무시해주세요.
          </p>
        </div>
        <div style="text-align: center; margin-top: 20px;">
          <p style="color: #bbb; font-size: 11px;">
            © ${serviceName}. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await this.mailService.send(emailCodeDto.email, title, content);
    return this.saveEmailCode(emailCodeDto.email, code);
  }

  // 이메일 인증 코드 검증
  async verifyEmailCode(emailCodeDto: EmailCodeDto) {
    const emailAuth = await this.emailAuthRepo.findOne({
      where: { email: emailCodeDto.email, code: emailCodeDto.code },
      order: { createdAt: 'DESC' }
    });

    if (!emailAuth) {
      throw new UnauthorizedException(ErrorMessages.INVALID_EMAIL_CODE);
    }

    if (emailAuth.expiredAt < new Date()) {
      throw new UnauthorizedException(ErrorMessages.EXPIRED_EMAIL_CODE);
    }

    await this.emailAuthRepo.softDelete({ id: emailAuth.id });

    return true;
  }

  // 비밀번호 재설정 이메일 전송
  async sendResetPasswordEmail(emailCodeDto: EmailCodeDto) {
    const code = this.createEmailCode();
    const serviceName = this.configService.get('APP_NAME');
    const title = `[${serviceName}] 비밀번호 재설정 인증 코드입니다.`;
    const content = code;

    await this.mailService.send(emailCodeDto.email, title, content);
    return this.saveEmailCode(emailCodeDto.email, code);
  }

  // Authorization 헤더에서 토큰 추출
  extractTokenFromHeader(req: any) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
      return null;
    }

    return authHeader.split(' ')[1];
  }

  // JWT 토큰 생성
  private signToken(id: number, role: Role, isRefresh: boolean = false) {
    const payload = {
      id,
      role
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('jwt.secret'),
      // expiresIn: isRefresh ? '30d' : '15m'
      expiresIn: isRefresh ? '30d' : '1d'
    });
  }

  // JWT 토큰 검증
  verifyToken(token: string, isRefresh: boolean) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret')
      });

      return payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError' && !isRefresh) {
        throw new UnauthorizedException(ErrorMessages.EXPIRED_TOKEN);
      }

      throw new UnauthorizedException(ErrorMessages.INVALID_TOKEN);
    }
  }

  // 토큰 발급
  async generateToken(userId: number, role: Role) {
    const accessToken = this.signToken(userId, role);
    const refreshToken = this.signToken(userId, role, true);

    return { accessToken, refreshToken };
  }

  // 토큰 갱신
  async rotateToken(oldRefreshToken: string) {
    const payload = this.verifyToken(oldRefreshToken, true);

    const now = Math.floor(Date.now() / 1000);
    const timeToExpire = payload.exp - now;

    const accessToken = this.signToken(payload.id, payload.role);
    let newRefreshToken = '';
    if (timeToExpire < 24 * 60 * 60) {
      newRefreshToken = this.signToken(payload.id, payload.role, true);
    }

    return { accessToken, newRefreshToken };
  }

  // 비밀번호 해싱
  async hashPassword(plainPassword: string) {
    const hashRounds = this.configService.get('jwt.hashRounds', 10);
    const hashedPassword = await bcrypt.hash(plainPassword, hashRounds);

    return hashedPassword;
  }

  // 비밀번호 검증
  async comparePassword(plainPassword: string, hashedPassword: string) {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    if (!isMatch) {
      throw new UnauthorizedException(ErrorMessages.NOT_FOUND_USER);
    }

    return true;
  }
}
