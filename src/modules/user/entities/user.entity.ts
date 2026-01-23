import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../common/entities/base.entity';

// 유저 엔티티
@Entity({ comment: '유저' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true, comment: '이메일 (로그인 ID)' })
  email: string;

  @Column({ type: 'varchar', length: 255, comment: '비밀번호 (암호화)' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', length: 100, comment: '유저 이름' })
  name: string;

  @Column({ type: 'boolean', default: true, comment: '활성화 여부' })
  isActive: boolean;
}
