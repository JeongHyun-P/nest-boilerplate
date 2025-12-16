import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ParseIdsPipe } from 'src/common/pipes/parse-ids.pipe';
import { CreateFaqDto } from 'src/modules/faq/dto/create-faq.dto';
import { UpdateFaqDto } from 'src/modules/faq/dto/update-faq.dto';
import { FaqService } from 'src/modules/faq/faq.service';

@Controller('/admin/faq')
export class AdminFaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ 생성
  @Post()
  async createFaq(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.createFaq(createFaqDto);
  }

  // FAQ 조회
  @Get(':id')
  async getFaq(@Param('id') id: number) {
    return this.faqService.getFaq(id);
  }

  // FAQ 수정
  @Put(':id')
  async updateFaq(@Param('id') id: number, @Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.updateFaq(id, updateFaqDto);
  }

  // FAQ 삭제
  @Delete(':ids')
  async deleteFaq(@Param('ids', ParseIdsPipe) ids: number[]) {
    return this.faqService.deleteFaq(ids);
  }
}
