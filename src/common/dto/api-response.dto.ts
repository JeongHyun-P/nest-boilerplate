import { ApiProperty } from '@nestjs/swagger';

// 공통 성공 응답 DTO
export class ApiResponseDto<T> {
  @ApiProperty({ description: 'HTTP 상태 코드', example: 200 })
  statusCode: number;

  @ApiProperty({ description: '응답 메시지', example: 'ok' })
  message: string;

  @ApiProperty({ description: '응답 데이터' })
  data: T;
}

// 공통 에러 응답 DTO
export class ApiErrorResponseDto {
  @ApiProperty({ description: 'HTTP 상태 코드', example: 400 })
  statusCode: number;

  @ApiProperty({ description: '에러 코드', example: 'INVALID_INPUT' })
  code: string;

  @ApiProperty({ description: '에러 메시지', example: '잘못된 입력값입니다.' })
  message: string;
}

// 파일 삭제 성공 응답
export class DeleteSuccessResponseDto {
  @ApiProperty({ description: '삭제 성공 여부', example: true })
  success: boolean;
}
