import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Term } from './entities/term.entity';
import { Repository } from 'typeorm';
import { PagingDto } from 'src/common/dto/paging.dto';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { UpdateTermDto } from './dto/update-term.dto';
import { TransactionService } from 'src/common/transaction/transaction.service';

@Injectable()
export class TermService {
  constructor(
    @InjectRepository(Term)
    private readonly termRepository: Repository<Term>,
    private readonly transactionService: TransactionService
  ) {}

  // 약관 리스트 전체 조회
  async getTermListAll(pagingDto?: PagingDto) {
    let result: Term[] = await this.termRepository.query(`
      SELECT t.*
      FROM terms t
      INNER JOIN (
          SELECT type, MAX(version) as maxVersion
          FROM terms
          GROUP BY type
      ) tm ON t.type = tm.type AND t.version = tm.maxVersion
  `);

    const keyword = pagingDto?.keyword ?? '';
    if (keyword.length > 0) {
      result = result.filter((term: Term) => term.content.includes(keyword));
    }

    return result;
  }

  // 약관 상세
  async getTermDetail(id: number) {
    const findTerm = await this.termRepository.findOneOrFail({ where: { id } });
    return findTerm;
  }

  // 약관 수정
  /**
   * 약관은 버전관리를 위해 기존 데이터를 수정하지 않고 새로운 버전을 생성.
   */
  async updateTerm(id: number, updateTermDto: UpdateTermDto) {
    const findTerm = await this.termRepository.findOneOrFail({ where: { id } });

    return this.transactionService.runInTransaction(async (tr) => {
      if (!findTerm.type) {
        throw new NotFoundException(ErrorMessages.NOT_FOUND_DATA);
      }

      const lastVersion = await tr.getRepository(Term).findOne({
        where: { type: findTerm.type },
        order: { version: 'DESC' }
      });

      const createTerm = tr.getRepository(Term).create({
        ...updateTermDto,
        type: findTerm.type,
        version: (lastVersion?.version || 0) + 1
      });

      await tr.getRepository(Term).save(createTerm);

      return true;
    });
  }
}
