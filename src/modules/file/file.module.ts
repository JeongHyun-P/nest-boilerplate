import { Module, Global } from '@nestjs/common';
import { FileService } from './file.service';
import { S3Service } from './s3.service';

// 파일 모듈 (전역)
@Global()
@Module({
  providers: [FileService, S3Service],
  exports: [FileService],
})
export class FileModule {}
