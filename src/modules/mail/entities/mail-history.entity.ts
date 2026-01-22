import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

// 메일 발송 상태
export enum MailStatus {
  SUCCESS = 'success',   // 발송 성공
  FAILED = 'failed',     // 발송 실패
  RETRY = 'retry',       // 재시도 대기
}

// 메일 발송 내역 엔티티
@Entity('mail_history')
export class MailHistory extends BaseEntity {
  @Column({ length: 255 })
  to: string;

  @Column({ length: 500 })
  subject: string;

  @Column('text')
  html: string;

  @Column({
    type: 'enum',
    enum: MailStatus,
    default: MailStatus.FAILED,
  })
  status: MailStatus;

  @Column({ default: 0 })
  retryCount: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'datetime', nullable: true })
  sentAt: Date | null;
}
