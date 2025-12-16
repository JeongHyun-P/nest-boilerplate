import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { NotiType } from '../constants/noti-type.enum';
import { NotiStatus } from '../constants/noti-status.enum';
import { User } from 'src/modules/user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity({ comment: '알림 발송 로그' })
export class Noti {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '알림 타입 (APP_PUSH: 앱 푸시, EMAIL: 이메일, SMS: 문자)' })
  type: NotiType;

  @Column({ type: 'varchar', comment: '제목' })
  title: string;

  @Column({ type: 'text', comment: '내용' })
  content: string;

  @Column({ type: 'tinyint', default: false, comment: '예약 발송 여부' })
  isSchedule: number;

  @Column({ type: 'tinyint', default: false, comment: '수신 허용자에게만 발송' })
  isOptIn: number;

  @Column({ type: 'varchar', comment: '상태(PENDING: 대기, SUCCESS: 성공, FAILED: 실패)' })
  status: NotiStatus;

  @Column({ type: 'int', default: 0, comment: '재발송 횟수' })
  retryCount: number;

  @Column({ type: 'varchar', nullable: true, comment: '이메일' })
  email: string;

  @Column({ type: 'varchar', nullable: true, comment: '앱토큰' })
  appToken: string;

  @Column({ type: 'varchar', nullable: true, comment: '연락처' })
  phone: string;

  @Column({ type: 'timestamp', nullable: true, comment: '예약 발송 일시' })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true, comment: '알림 발송 일시' })
  sentAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.notis, { nullable: true, createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;
}
