import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { MailHistory } from './entities/mail-history.entity';
import { MailStatus } from './constants/mail-status.enum';

// 메일 서비스
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter | null = null;
  private from: string;
  private timeout: number;
  private maxRetry: number;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(MailHistory)
    private readonly mailHistoryRepository: Repository<MailHistory>,
  ) {
    const host = this.configService.get<string>('mail.host');
    const port = this.configService.get<number>('mail.port');
    const user = this.configService.get<string>('mail.user');
    const password = this.configService.get<string>('mail.password');
    const from = this.configService.get<string>('mail.from');
    this.timeout = this.configService.get<number>('externalApi.timeout') || 5000;
    this.maxRetry = 3;  // 재발송 시도 횟수

    // 메일 설정이 있는 경우에만 트랜스포터 생성
    if (host && user && password) {
      this.transporter = nodemailer.createTransport({
        host,
        port: port || 587,
        secure: port === 465,
        auth: { user, pass: password },
        connectionTimeout: this.timeout,
        greetingTimeout: this.timeout,
        socketTimeout: this.timeout * 2,
      });
      this.from = from || user;
    } else {
      this.logger.warn('SMTP 설정이 없어 메일 발송 비활성화');
    }
  }

  // 메일 발송 (즉시 발송 시도, 실패 시 내역에 기록)
  async send(to: string, subject: string, html: string): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn('메일 발송 스킵 (SMTP 미설정)');
      return false;
    }

    try {
      // 즉시 발송 시도
      await this.sendDirect(to, subject, html);

      // 성공 내역 기록
      await this.saveHistory(to, subject, html, MailStatus.SUCCESS);
      this.logger.log(`메일 발송 성공: ${to}`);
      return true;
    } catch (error) {
      // 실패 시 재시도 대상으로 기록
      const errorMessage = this.getErrorMessage(error);
      await this.saveHistory(to, subject, html, MailStatus.RETRY, errorMessage);
      this.logger.warn(`메일 발송 실패, 재시도 대기: ${to} - ${errorMessage}`);
      return false;
    }
  }

  // 실제 메일 발송
  async sendDirect(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      throw new Error('SMTP 미설정');
    }

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject,
      html,
    });
  }

  // 발송 내역 저장
  private async saveHistory(
    to: string,
    subject: string,
    html: string,
    status: MailStatus,
    errorMessage?: string,
  ): Promise<MailHistory> {
    const history = this.mailHistoryRepository.create({
      to,
      subject,
      html,
      status,
      errorMessage: errorMessage || null,
      sentAt: status === MailStatus.SUCCESS ? new Date() : null,
    });
    return this.mailHistoryRepository.save(history);
  }

  // 재시도 대상 메일 조회
  async findRetryMails(): Promise<MailHistory[]> {
    return this.mailHistoryRepository.find({
      where: {
        status: MailStatus.RETRY,
        retryCount: LessThan(this.maxRetry),
      },
      order: { createdAt: 'ASC' },
      take: 10,
    });
  }

  // 재시도 성공 처리
  async markAsSuccess(history: MailHistory): Promise<void> {
    history.status = MailStatus.SUCCESS;
    history.sentAt = new Date();
    await this.mailHistoryRepository.save(history);
  }

  // 재시도 실패 처리
  async markAsRetryFailed(history: MailHistory, error: string): Promise<void> {
    history.retryCount += 1;
    history.errorMessage = error;

    // 최대 재시도 횟수 초과 시 최종 실패 처리
    if (history.retryCount >= this.maxRetry) {
      history.status = MailStatus.FAILED;
    }

    await this.mailHistoryRepository.save(history);
  }

  // SMTP 설정 여부 확인
  isConfigured(): boolean {
    return this.transporter !== null;
  }

  // 에러 메시지 추출
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  // 회원가입 완료 메일 발송
  async sendWelcomeMail(email: string, name: string): Promise<boolean> {
    const subject = '회원가입을 환영합니다';
    const html = this.getWelcomeTemplate(name);
    return this.send(email, subject, html);
  }

  // 관리자 알림 메일 발송
  async sendAdminNotification(
    adminEmail: string,
    title: string,
    content: string,
  ): Promise<boolean> {
    const subject = `[관리자 알림] ${title}`;
    const html = this.getAdminNotificationTemplate(title, content);
    return this.send(adminEmail, subject, html);
  }

  // 회원가입 완료 템플릿
  private getWelcomeTemplate(name: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Apple SD Gothic Neo', sans-serif; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; padding: 20px 0; border-bottom: 1px solid #eee; }
          .content { padding: 30px 0; }
          .footer { text-align: center; padding: 20px 0; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>환영합니다!</h1>
          </div>
          <div class="content">
            <p>${name}님, 회원가입을 축하합니다.</p>
            <p>서비스를 자유롭게 이용하실 수 있습니다.</p>
          </div>
          <div class="footer">
            <p>본 메일은 발신 전용입니다.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 관리자 알림 템플릿
  private getAdminNotificationTemplate(title: string, content: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Apple SD Gothic Neo', sans-serif; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: #333; color: #fff; padding: 15px; }
          .content { padding: 20px; background: #f9f9f9; }
          .footer { text-align: center; padding: 15px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${title}</h2>
          </div>
          <div class="content">
            <p>${content}</p>
          </div>
          <div class="footer">
            <p>관리자 알림 메일</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
