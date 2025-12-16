import { Global, Module } from '@nestjs/common';
import { NotificationChannelService } from './notification-channel.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { SmtpService } from './mail/smtp.service';
import { MailService } from './mail/mail.service';
import { RetryNotification } from './retry.scheduler';
import { Noti } from 'src/modules/noti/entities/noti.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([
    Noti
  ]), ScheduleModule.forRoot()],
  providers: [NotificationChannelService, MailService, SmtpService, RetryNotification],
  exports: [NotificationChannelService]
})
export class NotificationChannelModule {}
