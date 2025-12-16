import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/services/notification-channel/mail/mail.service';
import { SmtpService } from 'src/services/notification-channel/mail/smtp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailAuth } from '../user/entities/email-auth.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailAuth]),
    JwtModule.register({}),
  ],
  providers: [AuthService, MailService, SmtpService],
  exports: [AuthService],
})
export class AuthModule {}
