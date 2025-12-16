import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto } from 'src/common/dto/paging.dto';
import { Like, Repository } from 'typeorm';
import { Noti } from './entities/noti.entity';

@Injectable()
export class NotiService {
  constructor(
    @InjectRepository(Noti)
    private readonly notiRepo: Repository<Noti>,
  ) {}

  // 알림 발송 내역 조회
  async getNotiList(pagingDto: PagingDto) {
    const { page, limit, keyword, order, orderValue } = pagingDto;

    let where: any = {};
    if (keyword && keyword.trim()) {
      where = [{ title: Like(`%${keyword}%`) }, { content: Like(`%${keyword}%`) }];
    }

    let orderCondition: any = { id: 'DESC' };
    if (order) {
      orderCondition = { [order]: orderValue?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' };
    }

    const [items, total] = await this.notiRepo.findAndCount({
      select: {
        id: true,
        title: true,
        content: true,
        isSchedule: true,
        isOptIn: true,
        status: true,
        retryCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true
        }
      },
      relations: {
        user: true
      },
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

  // 알림 상세 조회
  async getNoti(id: number) {
    const noti = await this.notiRepo.findOne({
      select: {
        id: true,
        title: true,
        content: true,
        isSchedule: true,
        isOptIn: true,
        status: true,
        retryCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          id: true,
          name: true
        }
      },
      where: { id },
      relations: {
        user: true
      }
    });

    return noti;
  }
}
