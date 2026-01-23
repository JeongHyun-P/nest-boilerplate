import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from '../../modules/admin/entities/admin.entity';
import { AdminStatus } from '../../modules/admin/constants/admin-status.enum';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async onModuleInit() {
    this.logger.log('초기 데이터 시딩 시작...');
    await this.seedAdmin();
    this.logger.log('초기 데이터 시딩 완료.');
  }

  // 관리자 초기 데이터 시딩
  private async seedAdmin() {
    const loginId = this.configService.get<string>('admin.initialLoginId');
    const password = this.configService.get<string>('admin.initialPassword');

    if (!loginId || !password) {
      this.logger.warn('초기 관리자 설정이 없어 생성을 건너뜁니다.');
      return;
    }

    const count = await this.adminRepository.count({ where: { loginId } });
    if (count === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = this.adminRepository.create({
        loginId,
        password: hashedPassword,
        name: 'Initial Admin',
        status: AdminStatus.ACTIVE,
      });
      await this.adminRepository.save(admin);
      this.logger.log(`초기 관리자 계정 생성 완료: ${loginId}`);
    }
  }
}
