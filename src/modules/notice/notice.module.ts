import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notice } from './entities/notice.entity';
import { NoticeController } from './notice.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notice
    ])
  ],
  controllers: [NoticeController],
  providers: [NoticeService],
  exports: [NoticeService]
})
export class NoticeModule {}
