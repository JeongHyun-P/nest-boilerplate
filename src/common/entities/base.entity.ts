import {
  Column,
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

// 유니크 제약이 필요한 엔티티용 Base Entity
// 엔티티에 @Unique('uq_<테이블>_<컬럼>', ['대상컬럼', 'uniqScope']) 를 건다.
// 유니크가 필요 없는 엔티티는 BaseEntity 를 그대로 상속한다.
export abstract class UniqScopedEntity extends BaseEntity {
  @Column({
    type: 'tinyint',
    nullable: true,
    asExpression: 'IF(`deleted_at` IS NULL, 0, NULL)',
    generatedType: 'STORED',
    insert: false,
    update: false,
    select: false,
    comment: '유니크 제약 범위 (활성행 0 / 삭제행 NULL)'
  })
  uniqScope: number | null;
}
