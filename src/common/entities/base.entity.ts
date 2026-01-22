import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn
} from 'typeorm';

// 공통 Base Entity
export abstract class BaseEntity {
  @PrimaryGeneratedColumn({ comment: '고유 식별자' })
  id: number;

  @CreateDateColumn({ comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true, comment: '삭제일시 (Soft Delete)' })
  deletedAt: Date | null;
}
