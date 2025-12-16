import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationChannelService } from './notification-channel.service';
import { NotiStatus } from 'src/modules/noti/constants/noti-status.enum';
import { Noti } from 'src/modules/noti/entities/noti.entity';

@Injectable()
export class RetryNotification {
  private readonly MAX_RETRY_COUNT = 3; // 최대 재시도 횟수
  private readonly BATCH_SIZE = 100; // 한번에 처리할 알림 개수
  private readonly logger = new Logger(RetryNotification.name);

  constructor(
    @InjectRepository(Noti)
    private readonly notiRepo: Repository<Noti>,
    private readonly notificationChannelService: NotificationChannelService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleRetry() {
    const failedNotifications = await this.notiRepo.find({
      where: {
        status: NotiStatus.FAILED,
        retryCount: LessThan(this.MAX_RETRY_COUNT)
      },
      take: this.BATCH_SIZE
    });

    if (failedNotifications.length === 0) {
      return;
    }

    await Promise.allSettled(
      failedNotifications.map(async (notification) => {
        try {
          notification.retryCount++;

          await this.notificationChannelService.resend(notification);
          notification.status = NotiStatus.SUCCESS;
        } catch (error) {
          this.logger.error(`재발송 실패 ID: ${notification.id}, 시도횟수: ${notification.retryCount}`, error.stack);
        } finally {
          await this.notiRepo.save(notification);
        }
      })
    );
  }
}
