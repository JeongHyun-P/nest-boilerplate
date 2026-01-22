import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

// 관리자 Repository
@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(private readonly dataSource: DataSource) {
    super(Admin, dataSource.createEntityManager());
  }

  // 로그인 ID로 관리자 조회 (비밀번호 포함)
  async findByLoginIdWithPassword(loginId: string): Promise<Admin | null> {
    return this.createQueryBuilder('admin')
      .addSelect('admin.password')
      .where('admin.loginId = :loginId', { loginId })
      .andWhere('admin.isActive = :isActive', { isActive: true })
      .andWhere('admin.deletedAt IS NULL')
      .getOne();
  }

  // 로그인 ID 존재 여부 확인
  async existsByLoginId(loginId: string): Promise<boolean> {
    const count = await this.count({
      where: { loginId },
    });
    return count > 0;
  }
}
