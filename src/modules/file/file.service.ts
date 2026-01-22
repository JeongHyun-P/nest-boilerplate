import { Injectable, HttpStatus } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileUploadResponseDto } from './dto/response.dto';
import { CustomException, ErrorCode } from '../../common/exceptions/custom.exception';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE, FileUploadKey, FILE_FOLDER_MAP, DEFAULT_UPLOAD_FOLDER } from './constants/file.constants';

// 파일 서비스
@Injectable()
export class FileService {
  constructor(private readonly s3Service: S3Service) {}

  // 파일 업로드 (단일/다중 통합) - fieldname 기반 폴더 매핑
  async uploadFiles(files: Express.Multer.File[]): Promise<FileUploadResponseDto[]> {
    if (!files || files.length === 0) {
      throw new CustomException({ statusCode: HttpStatus.BAD_REQUEST, ...ErrorCode.FILE_NOT_FOUND });
    }

    // 각 파일의 fieldname이 유효한 키인지 검증
    for (const file of files) {
      this.validateFieldName(file.fieldname);
      this.validateFile(file);
    }

    // 파일별로 fieldname에 매핑된 폴더에 업로드
    const uploadPromises = files.map((file) => {
      const folder = this.getFolderByFieldName(file.fieldname);
      return this.s3Service.upload(file, folder);
    });

    return Promise.all(uploadPromises);
  }

  // 파일 업로드 (내부용)
  async uploadFile(file: Express.Multer.File, folder: string): Promise<FileUploadResponseDto> {
    this.validateFile(file);
    return this.s3Service.upload(file, folder);
  }

  // 이미지 업로드 (내부용)
  async uploadImage(file: Express.Multer.File, folder: string): Promise<FileUploadResponseDto> {
    this.validateImageFile(file);
    return this.s3Service.upload(file, folder);
  }

  // 파일 삭제
  async deleteFile(key: string): Promise<void> {
    return this.s3Service.delete(key);
  }

  // fieldname 유효성 검사
  private validateFieldName(fieldname: string): void {
    const validKeys = Object.values(FileUploadKey) as string[];
    if (!validKeys.includes(fieldname)) {
      throw new CustomException({
        statusCode: HttpStatus.BAD_REQUEST,
        ...ErrorCode.INVALID_FILE_KEY,
        message: `유효하지 않은 파일 키: ${fieldname}`
      });
    }
  }

  // fieldname을 folder로 변환
  private getFolderByFieldName(fieldname: string): string {
    return FILE_FOLDER_MAP[fieldname as FileUploadKey] || DEFAULT_UPLOAD_FOLDER;
  }

  // 파일 유효성 검사
  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new CustomException({ statusCode: HttpStatus.BAD_REQUEST, ...ErrorCode.FILE_NOT_FOUND });
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new CustomException({ statusCode: HttpStatus.BAD_REQUEST, ...ErrorCode.FILE_TOO_LARGE });
    }
  }

  // 이미지 유효성 검사
  private validateImageFile(file: Express.Multer.File): void {
    this.validateFile(file);

    if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      throw new CustomException({ statusCode: HttpStatus.BAD_REQUEST, ...ErrorCode.INVALID_FILE_TYPE });
    }
  }
}
