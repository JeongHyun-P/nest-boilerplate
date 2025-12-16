import { Controller, Get, Query } from '@nestjs/common';
import { PagingDto } from 'src/common/dto/paging.dto';
import { FaqService } from './faq.service';
import { Public } from 'src/common/decorators/auth-public.decorator';

@Controller('common/faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  // FAQ 목록 조회
  @Public()
  @Get('list')
  async getFaqList(@Query() pagingDto: PagingDto) {
    return this.faqService.getFaqList(pagingDto);
  }
}
