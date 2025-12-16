import { Global, Module } from '@nestjs/common';
import { Noti } from './entities/noti.entity';
import { NotiService } from './noti.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationChannelModule } from 'src/services/notification-channel/notification-channel.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Noti,
    ]),
    NotificationChannelModule
  ],
  providers: [NotiService],
  exports: [NotiService]
})
export class NotiModule {}
