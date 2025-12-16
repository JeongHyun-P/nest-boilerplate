import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'src/common/naming-strategy/snake-naing.strategy';

export const typeOrmConfigFactory = async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
  type: 'mysql',
  host: configService.get('db.host'),
  port: configService.get('db.port'),
  username: configService.get('db.username'),
  password: configService.get('db.password'),
  database: configService.get('db.database'),
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  // dropSchema: true
  // logging: true

  extra: {
    connectTimeout: 5000
  }
});
