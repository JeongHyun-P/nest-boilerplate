import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { MailService } from './mail/mail.service';
import { NotiStatus } from 'src/modules/noti/constants/noti-status.enum';
import { NotiType } from 'src/modules/noti/constants/noti-type.enum';
import { Noti } from 'src/modules/noti/entities/noti.entity';

interface CreateNotiOptions {
  type: NotiType;
  title: string;
  content: string;
  userId?: number;
  email?: string;
  phone?: string;
  appToken?: string;
  isSchedule?: number;
  status?: NotiStatus;
  scheduledAt?: Date;
  sentAt?: Date;
}
@Injectable()
export class NotificationChannelService {
  private readonly logger = new Logger(NotificationChannelService.name);

  constructor(
    private readonly mailService: MailService,
    @InjectRepository(Noti)
    private readonly notiRepo: Repository<Noti>,
  ) {}

  // 알림 발송 로그 저장
  async saveNoti(options: CreateNotiOptions) {
    const { type, title, content, userId, email, phone, appToken, isSchedule = 0, status = NotiStatus.SUCCESS, scheduledAt, sentAt } = options;

    const notification = this.notiRepo.create({
      type,
      title,
      content,
      isSchedule,
      status,
      email,
      phone,
      appToken,
      scheduledAt,
      sentAt,
      user: { id: userId }
    });

    await this.notiRepo.save(notification);
    return true;
  }

  // 재발송 처리
  async resend(notification: Noti) {
    if (notification.type === NotiType.EMAIL) {
      await this.mailService.send(notification.email, notification.title, notification.content);
    } else if (notification.type === NotiType.SMS) {
    } else if (notification.type === NotiType.APP_PUSH) {
    }
  }

  // 이메일 발송
  async sendMail(email: string, title: string, content: string, userId?: number) {
    try {
      await this.mailService.send(email, title, content);
      await this.saveNoti({ type: NotiType.EMAIL, title, content, email, userId });
    } catch (e) {
      throw e;
    }
  }
}
