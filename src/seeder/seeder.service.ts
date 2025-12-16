import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { runSeeder, Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    this.logger.log({
      level: 'info',
      message: 'Running seeders...'
    });

    try {
      // const seederDir = path.join(__dirname);
      const seederDir = path.join(__dirname, '..', 'seeder', 'entities');
      const seederFiles = fs.readdirSync(seederDir).filter((file) => file.endsWith('.seeder.ts') || file.endsWith('.seeder.js'));

      const seeders = await Promise.all(
        seederFiles.map(async (file) => {
          const seederModule = await import(path.join(seederDir, file));
          const SeederClass = seederModule[Object.keys(seederModule)[0]];
          const priority = SeederClass.priority ?? 99;
          return { SeederClass, priority, file };
        })
      );

      // 실행 순서대로 정렬
      seeders.sort((a, b) => a.priority - b.priority);

      for (const { SeederClass, file } of seeders) {
        this.logger.log({
          level: 'info',
          message: `Running ${file}...`
        });
        await runSeeder(this.dataSource, SeederClass);
      }

      this.logger.log({
        level: 'info',
        message: 'All seeders completed successfully'
      });
    } catch (error) {
      this.logger.error('Seeder failed', error);
    }
  }
}
