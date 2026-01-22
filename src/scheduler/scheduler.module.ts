import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MailScheduler } from './mail.scheduler';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [MailScheduler],
})
export class SchedulerModule {}
