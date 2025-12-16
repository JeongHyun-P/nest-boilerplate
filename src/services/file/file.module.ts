import { Global, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { S3Service } from './s3.service';

@Global()
@Module({
  providers: [FileService, S3Service],
  exports: [FileService]
})
export class FileModule {}