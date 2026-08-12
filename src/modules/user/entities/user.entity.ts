import { Entity, Column, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UniqScopedEntity } from '../../../common/entities/base.entity';
import { UserStatus } from '../constants/user-status.enum';

// 유저 엔티티
@Entity({ comment: '유저' })
@Unique('uq_users_email', ['email', 'uniqScope'])
@Unique('uq_users_phone', ['phone', 'uniqScope'])
export class User extends UniqScopedEntity {
  @Column({ type: 'varchar', length: 255, comment: '이메일 (로그인 ID)' })
  email: string;

  @Column({ type: 'varchar', length: 255, comment: '비밀번호 (암호화)' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 100, comment: '유저 이름' })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true, comment: '전화번호' })
  phone: string | null;

  @Column({ type: 'varchar', length: 20, default: UserStatus.ACTIVE, comment: '유저 상태' })
  status: UserStatus;
}
