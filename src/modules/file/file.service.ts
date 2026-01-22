import { Injectable, HttpStatus } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileUploadResponseDto } from './dto/response.dto';
import { CustomException, ErrorCode } from '../../common/exceptions/custom.exception';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 파일 서비스
@Injectable()
export class FileService {
  constructor(private readonly s3Service: S3Service) {}

  // 파일 업로드
  async uploadFile(file: Express.Multer.File, folder: string): Promise<FileUploadResponseDto> {
    this.validateFile(file);
    return this.s3Service.upload(file, folder);
  }

  // 이미지 업로드
  async uploadImage(file: Express.Multer.File, folder: string): Promise<FileUploadResponseDto> {
    this.validateImageFile(file);
    return this.s3Service.upload(file, folder);
  }

  // 파일 삭제
  async deleteFile(key: string): Promise<void> {
    return this.s3Service.delete(key);
  }

  // 파일 유효성 검사
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        ...ErrorCode.FILE_NOT_FOUND
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        ...ErrorCode.FILE_TOO_LARGE
      });
    }
  }

  // 이미지 유효성 검사
  private validateImageFile(file: Express.Multer.File): void {
    this.validateFile(file);

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        ...ErrorCode.INVALID_FILE_TYPE
      });
    }
  }
}
