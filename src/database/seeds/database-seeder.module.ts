import { Module } from '@nestjs/common';
import { DatabaseSeederService } from './database-seeder.service';
import { AdminModule } from '../../modules/admin/admin.module';

@Module({
  imports: [AdminModule],
  providers: [DatabaseSeederService],
})
export class DatabaseSeederModule {}
