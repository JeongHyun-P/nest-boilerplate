import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './admin.service';
import { AdminRepository } from './admin.repository';
import { Admin } from './entities/admin.entity';
import { UserModule } from '../user/user.module';

// 관리자 모듈
@Module({
  imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => UserModule)],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
  exports: [AdminService, AdminRepository]
})
export class AdminModule {}
