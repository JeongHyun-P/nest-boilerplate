import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

// 사용자 응답
@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ description: '사용자 ID' })
  id: number;

  @Expose()
  @ApiProperty({ description: '이메일' })
  email: string;

  @Expose()
  @ApiProperty({ description: '이름' })
  name: string;

  @Expose()
  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  profileImage: string | null;

  @Expose()
  @ApiProperty({ description: '생성일' })
  createdAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
