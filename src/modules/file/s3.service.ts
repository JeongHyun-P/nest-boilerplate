import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as https from 'https';
import { FileUploadResponseDto } from './dto/file.response.dto';
import { CustomException, ErrorCode } from '../../common/exceptions/custom.exception';

// S3 서비스
@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private s3Client: S3Client | null = null;
  private bucket: string;
  private region: string;
  private timeout: number;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('aws.region');
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    const secretAccessKey = this.configService.get<string>('aws.secretAccessKey');
    const bucket = this.configService.get<string>('aws.s3Bucket');
    this.timeout = this.configService.get<number>('externalApi.timeout') || 5000;

    if (region && accessKeyId && secretAccessKey && bucket) {
      this.s3Client = new S3Client({
        region,
        credentials: { accessKeyId, secretAccessKey },
        requestHandler: new NodeHttpHandler({
          requestTimeout: this.timeout,
          httpsAgent: new https.Agent({
            timeout: this.timeout,
            keepAlive: true,
          }),
        }),
      });
      this.bucket = bucket;
      this.region = region;
    } else {
      this.logger.warn('AWS S3 설정이 없어 파일 업로드 비활성화');
    }
  }

  // 파일 업로드
  async upload(file: Express.Multer.File, folder: string): Promise<FileUploadResponseDto> {
    if (!this.s3Client) {
      throw new CustomException(ErrorCode.FILE_UPLOAD_FAILED);
    }

    try {
      const ext = path.extname(file.originalname);
      const key = `${folder}/${uuidv4()}${ext}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype
        })
      );

      return {
        key,
        originalName: file.originalname,
        size: file.size,
        contentType: file.mimetype
      };
    } catch (error) {
      this.logger.error('S3 업로드 실패', error);

      // 타임아웃 에러 감지
      if (this.isTimeoutError(error)) {
        throw new CustomException(ErrorCode.EXTERNAL_S3_TIMEOUT);
      }

      throw new CustomException(ErrorCode.EXTERNAL_S3_UPLOAD_FAILED);
    }
  }

  // 파일 삭제
  async delete(key: string): Promise<void> {
    if (!this.s3Client) return;

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key
        })
      );
    } catch (error) {
      this.logger.error('S3 삭제 실패', error);

      // 타임아웃 에러 감지
      if (this.isTimeoutError(error)) {
        throw new CustomException(ErrorCode.EXTERNAL_S3_TIMEOUT);
      }

      throw new CustomException(ErrorCode.EXTERNAL_S3_DELETE_FAILED);
    }
  }

  // 타임아웃 에러 여부 확인
  private isTimeoutError(error: unknown): boolean {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      return (
        errorMessage.includes('timeout') ||
        errorMessage.includes('timed out') ||
        errorMessage.includes('etimedout') ||
        error.name === 'TimeoutError'
      );
    }
    return false;
  }
}
