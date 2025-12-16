import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto } from 'src/common/dto/paging.dto';
import { Notice } from './entities/notice.entity';
import { In, Like, Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepo: Repository<Notice>
  ) {}

  // 공지사항 목록 조회
  async getNoticeList(pagingDto: PagingDto) {
    const { page, limit, keyword, order, orderValue } = pagingDto;

    let where: any = {};
    if (keyword && keyword.trim()) {
      where = [{ title: Like(`%${keyword}%`) }, { content: Like(`%${keyword}%`) }];
    }

    let orderCondition: any = { id: 'DESC' };
    if (order) {
      orderCondition = { [order]: orderValue?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' };
    }

    const [items, total] = await this.noticeRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: orderCondition
    });

    return {
      items,
      total
    };
  }

  // 공지사항 상세 조회
  async getNoticeDetail(id: number) {
    return this.noticeRepo.findOneOrFail({ where: { id } });
  }

  // 공지사항 생성
  async createNotice(createNoticeDto: CreateNoticeDto) {
    const { title, content } = createNoticeDto;
    const newNotice = this.noticeRepo.create({ title, content });
    return this.noticeRepo.save(newNotice);
  }

  // 공지사항 수정
  async updateNotice(id: number, updateNoticeDto: UpdateNoticeDto) {
    const { title, content } = updateNoticeDto;

    await this.noticeRepo.findOneOrFail({ where: { id } });

    return this.noticeRepo.update({ id }, { title, content });
  }

  // 공지사항 삭제
  async deleteNotice(ids: number[]) {
    await this.noticeRepo.findOneOrFail({ where: { id: In(ids) } });

    return this.noticeRepo.softDelete({ id: In(ids) });
  }
}
