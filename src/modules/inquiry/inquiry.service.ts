import { Injectable, NotFoundException } from '@nestjs/common';
import { Inquiry } from './entities/inquiry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { CreateInquiryReplyDto } from './dto/create-inquiry-reply.dto';
import { InquiryPagingDto } from './dto/inquiry-paging.dto';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiryRepo: Repository<Inquiry>
  ) {}

  // 1:1 문의 목록 조회
  async getInquiryList(inquiryPagingDto: InquiryPagingDto) {
    const { type, page, limit, keyword } = inquiryPagingDto;

    let where: any = {};
    if (keyword && keyword.trim()) {
      where = [
        { title: Like(`%${keyword}%`), ...(type ? { type } : {}) },
        { content: Like(`%${keyword}%`), ...(type ? { type } : {}) }
      ];
    } else if (type) {
      where = { type };
    }

    let order: any = { id: 'DESC' };
    if (inquiryPagingDto.order) {
      order = { [inquiryPagingDto.order]: inquiryPagingDto.orderValue?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' };
    }

    const [items, total] = await this.inquiryRepo.findAndCount({
      select: {
        id: true,
        type: true,
        title: true,
        content: true,
        reply: true,
        createdAt: true,
        user: {
          name: true
        }
      },
      where,
      relations: { user: true },
      skip: (page - 1) * limit,
      take: limit,
      order
    });

    return {
      items,
      total
    };
  }

  // 1:1 문의 상세 조회
  async getInquiryDetail(id: number) {
    const findInquiry = await this.inquiryRepo.findOne({
      select: {
        id: true,
        type: true,
        title: true,
        content: true,
        reply: true,
        createdAt: true,
        repliedAt: true,
        user: {
          name: true,
          email: true
        }
      },
      relations: { user: true },
      where: { id }
    });

    if (!findInquiry) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_DATA);
    }
    return findInquiry;
  }

  // 유저 1:1 문의 목록 조회
  async getInquiryListByUser(user: User) {
    return this.inquiryRepo.find({
      select: {
        id: true,
        type: true,
        title: true,
        content: true,
        reply: true,
        createdAt: true,
        repliedAt: true
      },
      where: { user: { id: user.id } },
      order: { id: 'DESC' }
    });
  }

  // 1:1 문의 생성
  async createInquiry(createInquiryDto: CreateInquiryDto, user: User) {
    const inquiry = this.inquiryRepo.create({
      type: createInquiryDto.type,
      title: createInquiryDto.title,
      content: createInquiryDto.content,
      user: {
        id: user.id
      }
    });

    return this.inquiryRepo.save(inquiry);
  }

  // 1:1 문의 답변 생성
  async createInquiryReply(id: number, createInquiryReplyDto: CreateInquiryReplyDto) {
    const repliedAt = new Date();
    return this.inquiryRepo.update({ id }, { reply: createInquiryReplyDto.reply, repliedAt });
  }

  // 1:1 문의 삭제
  async deleteInquiry(ids: number[]) {
    return this.inquiryRepo.softDelete({ id: In(ids) });
  }
}
