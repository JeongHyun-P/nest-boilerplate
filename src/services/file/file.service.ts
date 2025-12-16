import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';

@Injectable()
export class FileService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(files: Record<string, Express.Multer.File[]>) {
    return this.s3Service.uploadFile(files);
  }

  async deleteFile(key: string) {
    return this.s3Service.deleteFile(key);
  }
}
