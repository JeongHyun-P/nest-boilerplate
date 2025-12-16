import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ comment: '관리자' })
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, comment: '로그인 아이디' })
  loginId: string;

  @Column({ type: 'varchar', comment: '비밀번호' })
  @Exclude()
  password: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;
}
