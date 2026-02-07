import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

// 프로필 수정 요청 DTO
export class UpdateProfileRequestDto {
  @ApiPropertyOptional({ description: '이름', example: '홍길동', minLength: 2, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ description: '전화번호', example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  @Matches(/^01[0-9]-[0-9]{3,4}-[0-9]{4}$/, { message: '올바른 전화번호 형식이 아닙니다.' })
  phone?: string;
}

// 비밀번호 변경 요청 DTO
export class ChangePasswordRequestDto {
  @ApiProperty({ description: '현재 비밀번호', example: 'currentPassword123!' })
  @IsString()
  @MinLength(8)
  currentPassword: string;

  @ApiProperty({ description: '새 비밀번호 (8자 이상, 영문/숫자/특수문자 포함)', example: 'newPassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: '비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해야 합니다.',
  })
  newPassword: string;
}
