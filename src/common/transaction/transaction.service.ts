import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // constructor(private readonly transactionService: TransactionService) {}
  
  // return this.transactionService.runInTransaction(async (tr) => {
  //   const createUser = tr.create(User, {
  //     email: 'test',
  //   });

  //   await tr.save(createUser);

  //   const createAdmin = tr.create(Admin, {
  //     loginId: 'test',
  //   });

  //   await tr.save(createAdmin);

  //   return { createUser, createAdmin };
  // });
  async runInTransaction<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
