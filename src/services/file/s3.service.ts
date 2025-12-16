import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { FileDto } from './dto/file.dto';

@Injectable()
export class S3Service {
  private s3: S3Client;
  private bucket: string;

  constructor(private readonly configService: ConfigService) {
    const region = configService.get<string>('aws.region');
    const accessKeyId = configService.get<string>('aws.accessKey');
    const secretAccessKey = configService.get<string>('aws.secretKey');
    const bucket = configService.get<string>('aws.defaultBucket');

    if (!region || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error('AWS S3 configuration is missing in environment variables');
    }

    this.s3 = new S3Client({
      region,
      credentials: { accessKeyId, secretAccessKey }
    });
    this.bucket = bucket;
  }

  /**
   * fields 방식 파일 업로드
   * ex) @UseInterceptors(FileFieldsInterceptor([{ name: 'file1' }, { name: 'file2', maxCount: 5 }]))
   */
  async uploadFile(files: Record<string, Express.Multer.File[]>) {
    try {
      const uploadedFiles: FileDto[] = [];

      for (const fieldName in files) {
        const fieldFiles = files[fieldName];
        for (const file of fieldFiles) {
          const ext = path.extname(file.originalname);
          const uuidName = `${uuidv4()}${ext}`;
          const key = `${fieldName}/${uuidName}`;
          const originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

          await this.s3.send(
            new PutObjectCommand({
              Bucket: this.bucket,
              Key: key,
              Body: file.buffer,
              ContentType: file.mimetype
            })
          );

          uploadedFiles.push({
            fieldName,
            key,
            url: `https://${this.bucket}.s3.amazonaws.com/${key}`,
            originalname
          });
        }
      }

      return uploadedFiles;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('S3 multiple upload failed');
    }
  }

  /**
   * 파일 삭제
   * ex) await s3Service.deleteFile(key);
   */
  async deleteFile(key: string) {
    try {
      if (!key) {
        throw new BadRequestException('File key is required');
      }

      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key
        })
      );

      return { deleted: true, key };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('S3 delete failed');
    }
  }
}
