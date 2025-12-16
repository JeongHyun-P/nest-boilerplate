import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry])],
  providers: [InquiryService],
  exports: [InquiryService]
})
export class InquiryModule {}
