import { Body, Controller, Get, Query } from '@nestjs/common';
import { Public } from 'src/common/decorators/auth-public.decorator';
import { PagingDto } from 'src/common/dto/paging.dto';
import { TermService } from './term.service';

@Controller('common/term')
export class TermController {
  constructor(private readonly termService: TermService) {}

  // 약관 리스트 전체 조회
  @Public()
  @Get('list/all')
  async getTermListAll(@Query() pagingDto: PagingDto) {
    return this.termService.getTermListAll(pagingDto);
  }
}
