import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { MailStatus } from '../constants/mail-status.enum';

// 메일 발송 내역 엔티티
@Entity('mail_history', { comment: '메일 발송 내역' })
export class MailHistory extends BaseEntity {
  @Column({ length: 255, comment: '수신자 이메일' })
  to: string;

  @Column({ length: 500, comment: '메일 제목' })
  subject: string;

  @Column({ type: 'text', comment: '메일 본문 (HTML)' })
  html: string;

  @Column({
    type: 'enum',
    enum: MailStatus,
    default: MailStatus.FAILED,
    comment: '발송 상태 (success: 성공, failed: 실패, retry: 재시도 대기)',
  })
  status: MailStatus;

  @Column({ default: 0, comment: '재시도 횟수' })
  retryCount: number;

  @Column({ type: 'text', nullable: true, comment: '에러 메시지' })
  errorMessage: string | null;

  @Column({ type: 'datetime', nullable: true, comment: '발송 완료 일시' })
  sentAt: Date | null;
}
