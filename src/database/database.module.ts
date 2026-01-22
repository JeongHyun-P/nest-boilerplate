import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CustomNamingStrategy } from './naming.strategy';

// 데이터베이스 모듈
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('nodeEnv') === 'development',
        logging: configService.get('nodeEnv') === 'development',
        namingStrategy: new CustomNamingStrategy(),
        // 타임아웃 설정
        extra: {
          connectionLimit: 10,
          connectTimeout: configService.get('externalApi.timeout') || 5000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
