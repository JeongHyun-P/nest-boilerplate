import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { CustomNamingStrategy } from './naming.strategy';

config();

// TypeORM 데이터소스 설정 (CLI용)
export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  namingStrategy: new CustomNamingStrategy(),
  extra: {
    connectionLimit: 10,
    connectTimeout: parseInt(process.env.EXTERNAL_API_TIMEOUT || '5000', 10),
  },
};

// CLI용 데이터소스
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
