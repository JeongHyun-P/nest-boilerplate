import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PagingDto } from 'src/common/dto/paging.dto';
import { ParseIdsPipe } from 'src/common/pipes/parse-ids.pipe';
import { CreateNoticeDto } from 'src/modules/notice/dto/create-notice.dto';
import { UpdateNoticeDto } from 'src/modules/notice/dto/update-notice.dto';
import { NoticeService } from 'src/modules/notice/notice.service';

@Controller('/admin/notice')
export class AdminNoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  // 공지사항 생성
  @Post()
  async createNotice(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticeService.createNotice(createNoticeDto);
  }

  // 공지사항 수정
  @Put(':id')
  async updateNotice(@Param('id') id: number, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.noticeService.updateNotice(id, updateNoticeDto);
  }

  // 공지사항 삭제
  @Delete(':ids')
  async deleteNotice(@Param('ids', ParseIdsPipe) ids: number[]) {
    return this.noticeService.deleteNotice(ids);
  }
}
