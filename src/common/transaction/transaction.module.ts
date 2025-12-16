import { Global, Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}
