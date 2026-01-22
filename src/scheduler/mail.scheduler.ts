import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailService } from '../modules/mail/mail.service';
import { MailHistory } from '../modules/mail/entities/mail-history.entity';

// 메일 재시도 스케줄러
@Injectable()
export class MailScheduler {
  private readonly logger = new Logger(MailScheduler.name);
  private isProcessing = false;

  constructor(private readonly mailService: MailService) {}

  // 30초마다 실패한 메일 재시도
  @Cron(CronExpression.EVERY_30_SECONDS)
  async retryFailedMails(): Promise<void> {
    // SMTP 미설정 시 스킵
    if (!this.mailService.isConfigured()) {
      return;
    }

    // 중복 실행 방지
    if (this.isProcessing) {
      this.logger.debug('메일 재시도 처리 중... 스킵');
      return;
    }

    this.isProcessing = true;

    try {
      const retryMails = await this.mailService.findRetryMails();

      if (retryMails.length === 0) {
        return;
      }

      this.logger.log(`메일 재시도 시작: ${retryMails.length}건`);

      for (const mail of retryMails) {
        await this.attemptRetry(mail);
      }

      this.logger.log('메일 재시도 처리 완료');
    } catch (error) {
      this.logger.error('메일 재시도 처리 중 오류', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // 메일 재시도 시도
  private async attemptRetry(mail: MailHistory): Promise<void> {
    try {
      await this.mailService.sendDirect(mail.to, mail.subject, mail.html);
      await this.mailService.markAsSuccess(mail);
      this.logger.log(`메일 재시도 성공: ${mail.to} (ID: ${mail.id})`);
    } catch (error) {
      const errorMessage = this.getErrorMessage(error);
      await this.mailService.markAsRetryFailed(mail, errorMessage);

      if (this.isTimeoutError(error)) {
        this.logger.warn(`메일 재시도 타임아웃: ${mail.to} (ID: ${mail.id}, 재시도: ${mail.retryCount + 1})`);
      } else {
        this.logger.warn(`메일 재시도 실패: ${mail.to} (ID: ${mail.id}, 재시도: ${mail.retryCount + 1}) - ${errorMessage}`);
      }
    }
  }

  // 타임아웃 에러 여부 확인
  private isTimeoutError(error: unknown): boolean {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      return errorMessage.includes('timeout') || errorMessage.includes('timed out') || errorMessage.includes('etimedout') || errorMessage.includes('esocket');
    }
    return false;
  }

  // 에러 메시지 추출
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
}
