import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AdminJwtAuthGuard } from 'src/common/guards/admin-auth.guard';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './admin.service';
import { AdminNoticeController } from './controllers/admin-notice.controller';
import { NoticeModule } from '../notice/notice.module';
import { FaqModule } from '../faq/faq.module';
import { AdminFaqController } from './controllers/admin-faq.controller';
import { InquiryModule } from '../inquiry/inquiry.module';
import { AdminInquiryController } from './controllers/admin-inquiry.controller';
import { NotiModule } from '../noti/noti.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    AuthModule,
    NoticeModule,
    FaqModule,
    InquiryModule,
    NotiModule
  ],
  controllers: [
    AdminController,
    AdminNoticeController,
    AdminFaqController,
    AdminInquiryController,
  ],
  providers: [
    AdminService,
    {
      provide: APP_GUARD,
      useClass: AdminJwtAuthGuard
    }
  ]
})
export class AdminModule {}
