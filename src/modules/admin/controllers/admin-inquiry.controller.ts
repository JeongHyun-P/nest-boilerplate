import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ParseIdsPipe } from 'src/common/pipes/parse-ids.pipe';
import { CreateInquiryReplyDto } from 'src/modules/inquiry/dto/create-inquiry-reply.dto';
import { InquiryPagingDto } from 'src/modules/inquiry/dto/inquiry-paging.dto';
import { InquiryService } from 'src/modules/inquiry/inquiry.service';

@Controller('/admin/inquiry')
export class AdminInquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  // 1:1 문의 조회
  @Get('list')
  async getInquiryList(@Query() inquiryPagingDto: InquiryPagingDto) {
    return this.inquiryService.getInquiryList(inquiryPagingDto);
  }

  // 1:1 문의 상세 조회
  @Get(':id')
  async getInquiryDetail(@Param('id') id: number) {
    return this.inquiryService.getInquiryDetail(id);
  }

  // 1:1 문의 답변 생성
  @Post('reply/:id')
  async createInquiryReply(@Param('id') id: number, @Body() createInquiryReplyDto: CreateInquiryReplyDto) {
    return this.inquiryService.createInquiryReply(id, createInquiryReplyDto);
  }

  // 1:1 문의 삭제
  @Delete(':ids')
  async deleteInquiry(@Param('ids', ParseIdsPipe) ids: number[]) {
    return this.inquiryService.deleteInquiry(ids);
  }
}
