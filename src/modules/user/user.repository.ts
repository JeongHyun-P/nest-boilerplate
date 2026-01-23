import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

// 유저 Repository
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  // 이메일로 유저 조회
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email },
    });
  }

  // 활성 유저 이메일로 조회 (비밀번호 포함)
  async findActiveByEmailWithPassword(email: string): Promise<User | null> {
    return this.createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  // 이메일 존재 여부 확인
  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.count({
      where: { email },
    });
    return count > 0;
  }

  // 페이지네이션으로 유저 목록 조회
  async findWithPagination(
    page: number,
    limit: number,
  ): Promise<[User[], number]> {
    return this.findAndCount({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
