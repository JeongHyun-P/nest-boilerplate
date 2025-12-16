import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { PagingDto } from 'src/common/dto/paging.dto';
import { CreateNotiDto } from 'src/modules/noti/dto/create-noti.dto';
import { NotiService } from 'src/modules/noti/noti.service';

@Controller('/admin/noti')
export class AdminNotiController {
  constructor(
    private readonly notiService: NotiService
  ) {}

  // 알림 목록
  @Get('list')
  async getNotiList(@Query() pagingDto: PagingDto) {
    return this.notiService.getNotiList(pagingDto);
  }

  // 알림 상세
  @Get(':id')
  async getNoti(@Param('id', ParseIntPipe) id: number) {
    return this.notiService.getNoti(id);
  }
}
