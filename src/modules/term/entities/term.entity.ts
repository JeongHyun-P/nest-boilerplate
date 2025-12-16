import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { TermType } from '../constants/term-type.enum';
import { UserTerm } from 'src/modules/user/entities/user-term.entity';
import { Exclude } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

@Entity({ comment: '약관' })
@Unique(['type', 'version'])
export class Term {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', comment: '약관 (SERVICE: 서비스 이용약관, PRIVACY: 개인정보처리방침)' })
  type: TermType;

  @Column({ type: 'text', comment: '약관 내용' })
  content: string;

  @Column({ type: 'int', default: 1, comment: '버전' })
  version: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Exclude()
  deletedAt: Date;

  @OneToMany(() => UserTerm, (userTerm) => userTerm.term)
  userTerms: UserTerm[];
}
