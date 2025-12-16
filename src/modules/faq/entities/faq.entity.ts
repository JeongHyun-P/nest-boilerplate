import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ comment: 'FAQ' })
export class Faq {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '제목' })
  title: string;

  @Column({ type: 'text', comment: '내용' })
  content: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;
}
