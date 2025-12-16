import { Controller, Get, Param, Query } from '@nestjs/common';
import { PagingDto } from 'src/common/dto/paging.dto';
import { NoticeService } from './notice.service';
import { Public } from 'src/common/decorators/auth-public.decorator';

@Controller('common/notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 공지사항 목록 조회
  @Public()
  @Get('list')
  async getNoticeList(@Query() pagingDto: PagingDto) {
    return this.noticeService.getNoticeList(pagingDto);
  }

  // 공지사항 상세 조회
  @Public()
  @Get(':id')
  async getNoticeDetail(@Param('id') id: number) {
    return this.noticeService.getNoticeDetail(id);
  }
}
