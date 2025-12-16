import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto } from 'src/common/dto/paging.dto';
import { In, Like, Repository } from 'typeorm';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepo: Repository<Faq>
  ) {}

  // FAQ 목록 조회
  async getFaqList(pagingDto: PagingDto) {
    const { page, limit, keyword, order, orderValue } = pagingDto;

    let where: any = {};
    if (keyword && keyword.trim()) {
      where = [{ title: Like(`%${keyword}%`) }, { content: Like(`%${keyword}%`) }];
    }

    let orderCondition: any = { id: 'DESC' };
    if (order) {
      orderCondition = { [order]: orderValue?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' };
    }

    const [items, total] = await this.faqRepo.findAndCount({
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

  // FAQ 생성
  async createFaq(createFaqDto: CreateFaqDto) {
    const { title, content } = createFaqDto;
    const newFaq = this.faqRepo.create({ title, content });
    return this.faqRepo.save(newFaq);
  }

  // FAQ 조회
  async getFaq(id: number) {
    const faq = await this.faqRepo.findOneOrFail({ where: { id } });

    return faq;
  }

  // FAQ 수정
  async updateFaq(id: number, updateFaqDto: UpdateFaqDto) {
    const { title, content } = updateFaqDto;

    await this.faqRepo.findOneOrFail({ where: { id } });

    return this.faqRepo.update({ id }, { title, content });
  }

  // FAQ 삭제
  async deleteFaq(ids: number[]) {
    return this.faqRepo.softDelete({ id: In(ids) });
  }
}
