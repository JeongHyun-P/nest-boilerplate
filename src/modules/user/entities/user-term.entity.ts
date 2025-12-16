import { TermType } from 'src/modules/term/constants/term-type.enum';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Term } from 'src/modules/term/entities/term.entity';
import { Exclude } from 'class-transformer';

@Entity({ comment: '유저 약관 동의 내역' })
export class UserTerm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '약관 (SERVICE: 서비스 이용약관, PRIVACY: 개인정보처리방침)' })
  type: TermType;

  @Column({ type: 'int', comment: '동의 시점 약관 버전' })
  version: number;

  @Column({ type: 'text', comment: '동의 시점 약관 내용' })
  content: string;

  @Column({ type: 'tinyint', comment: '동의 여부' })
  isAgreed: number;

  @Column({ type: 'timestamp', nullable: true, comment: '동의 일시' })
  agreedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.userTerms, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Term, (term) => term.userTerms, { nullable: false, createForeignKeyConstraints: false })
  @JoinColumn()
  term: Term;
}
