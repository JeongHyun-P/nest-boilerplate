import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';

// 관리자 엔티티
@Entity({ comment: '관리자' })
export class Admin extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true, comment: '로그인 ID' })
  loginId: string;

  @Column({ type: 'varchar', length: 255, comment: '비밀번호 (암호화)' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 100, comment: '관리자 이름' })
  name: string;

  @Column({ type: 'boolean', default: true, comment: '활성화 여부' })
  isActive: boolean;
}
