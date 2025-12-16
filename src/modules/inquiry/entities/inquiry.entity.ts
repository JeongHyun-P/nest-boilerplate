import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { InquiryType } from '../constants/inquiry-type.enum';
import { Exclude } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';

@Entity({ comment: '문의' })
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '유형 (MEMBER: 회원, SERVICE: 서비스/오류, ETC: 기타)' })
  type: InquiryType;

  @Column({ type: 'varchar', comment: '제목' })
  title: string;

  @Column({ type: 'text', comment: '내용' })
  content: string;

  @Column({ type: 'text', nullable: true, comment: '답변' })
  reply: string;

  @Column({ type: 'timestamp', nullable: true, comment: '답변일시' })
  repliedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.inquiries, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;
}
