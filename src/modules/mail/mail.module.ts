import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './mail.service';
import { MailHistory } from './entities/mail-history.entity';

// 메일 모듈 (전역)
@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MailHistory])],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
