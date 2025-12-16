import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserType } from '../constants/user-type.enum';
import { Usertatus } from '../constants/user-status.enum';
import { Noti } from 'src/modules/noti/entities/noti.entity';
import { UserTerm } from './user-term.entity';
import { Exclude } from 'class-transformer';
import { Inquiry } from 'src/modules/inquiry/entities/inquiry.entity';
import { EncryptTransformer } from 'src/common/crypto/encrypt.transformer';

@Entity({ comment: '유저' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '소셜타입' })
  userType: UserType;

  @Column({ type: 'varchar', nullable: true, comment: '소셜로그인 ID' })
  socialId: string;

  @Column({ type: 'varchar', nullable: true, comment: '소셜로그인 리프레시토큰' })
  @Exclude()
  socialRefreshToken: string;

  @Column({ type: 'varchar', nullable: true, comment: '로그인 아이디(이메일)', transformer: new EncryptTransformer() })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  emailHash: string;

  @Column({ type: 'varchar', nullable: true, comment: '비밀번호' })
  @Exclude()
  password: string;

  @Column({ type: 'varchar', nullable: true, comment: '이름' })
  name: string;

  @Column({ type: 'varchar', nullable: true, comment: '연락처', transformer: new EncryptTransformer() })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  phoneHash: string;

  @Column({ type: 'varchar', nullable: true, comment: '우편번호' })
  zipcode: string;

  @Column({ type: 'varchar', nullable: true, comment: '주소', transformer: new EncryptTransformer() })
  address: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  addressHash: string;

  @Column({ type: 'varchar', nullable: true, comment: '상세 주소', transformer: new EncryptTransformer() })
  addressDetail: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  addressDetailHash: string;

  @Column({ type: 'varchar', default: Usertatus.ACTIVE, comment: '계정 활성화 여부' })
  status: Usertatus;

  @Column({ type: 'tinyint', default: 1, comment: '서비스 알림 수신 여부' })
  notificationReceivingStatus: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @OneToMany(() => Noti, (noti) => noti.user)
  notis: Noti[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.user)
  inquiries: Inquiry[];

  @OneToMany(() => UserTerm, (userTerm) => userTerm.user)
  userTerms: UserTerm[];
}
