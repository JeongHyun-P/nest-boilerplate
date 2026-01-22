import { ApiProperty } from '@nestjs/swagger';

// 파일 업로드 응답
export class FileUploadResponseDto {
  @ApiProperty({ description: '파일 키 (S3)', example: 'profiles/550e8400-e29b-41d4-a716-446655440000.png' })
  key: string;

  @ApiProperty({ description: '원본 파일명', example: 'profile.png' })
  originalName: string;

  @ApiProperty({ description: '파일 크기 (bytes)', example: 102400 })
  size: number;

  @ApiProperty({ description: '파일 MIME 타입', example: 'image/png' })
  contentType: string;
}

// 파일 삭제 응답
export class FileDeleteResponseDto {
  @ApiProperty({ description: '삭제 성공 여부', example: true })
  success: boolean;
}
