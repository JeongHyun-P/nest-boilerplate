import { Entity, Column, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UniqScopedEntity } from '../../../common/entities/base.entity';
import { AdminStatus } from '../constants/admin-status.enum';

// 관리자 엔티티
@Entity({ comment: '관리자' })
@Unique('uq_admins_login_id', ['loginId', 'uniqScope'])
export class Admin extends UniqScopedEntity {
  @Column({ type: 'varchar', length: 100, comment: '로그인 ID' })
  loginId: string;

  @Column({ type: 'varchar', length: 255, comment: '비밀번호 (암호화)' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 100, comment: '관리자 이름' })
  name: string;

  @Column({ type: 'varchar', length: 20, default: AdminStatus.ACTIVE, comment: '관리자 상태' })
  status: AdminStatus;
}
