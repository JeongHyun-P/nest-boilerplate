import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity({ comment: '이메일 인증' })
export class EmailAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '이메일' })
  email: string;

  @Column({ type: 'varchar', comment: '인증 코드' })
  code: string;

  @Column({ type: 'timestamp', comment: '만료일시' })
  expiredAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;
}
