import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './controllers/admin.controller';
import { AdminUserController } from './controllers/admin-user.controller';
import { AdminService } from './admin.service';

import { Admin } from './entities/admin.entity';
import { UserModule } from '../user/user.module';

// 관리자 모듈
@Module({
  imports: [TypeOrmModule.forFeature([Admin]), forwardRef(() => UserModule)],
  controllers: [AdminController, AdminUserController],
  providers: [AdminService],
  exports: [AdminService, TypeOrmModule]
})
export class AdminModule {}
