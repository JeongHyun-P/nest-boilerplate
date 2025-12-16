import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { UserJwtAuthGuard } from 'src/common/guards/user-auth.guard';
import { UserTerm } from './entities/user-term.entity';
import { InquiryModule } from '../inquiry/inquiry.module';
import { TermModule } from '../term/term.module';
import { Noti } from '../noti/entities/noti.entity';
import { NotiModule } from '../noti/noti.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserTerm,
      Noti,
    ]),
    AuthModule,
    InquiryModule,
    TermModule,
    NotiModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: UserJwtAuthGuard
    }
  ],
  exports: [UserService]
})
export class UserModule {}
