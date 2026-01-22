import { ApiProperty } from '@nestjs/swagger';

// 파일 업로드 응답
export class FileUploadResponseDto {
  @ApiProperty({ description: '파일 키 (S3)' })
  key: string;

  @ApiProperty({ description: '파일 URL' })
  url: string;

  @ApiProperty({ description: '원본 파일명' })
  originalName: string;

  @ApiProperty({ description: '파일 크기 (bytes)' })
  size: number;

  @ApiProperty({ description: '파일 MIME 타입' })
  mimeType: string;
}
