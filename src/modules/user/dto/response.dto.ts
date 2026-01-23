import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UserStatus } from '../constants/user-status.enum';

// 유저 응답
export class UserResponseDto {
  @ApiProperty({ description: '유저 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  name: string;

  @ApiProperty({ description: '전화번호', example: '010-1234-5678', nullable: true })
  phone: string | null;

  @ApiProperty({ description: '유저 상태', enum: UserStatus, example: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty({ description: '생성일', example: '2026-01-22T10:00:00.000Z' })
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.phone = user.phone;
    this.status = user.status;
    this.createdAt = user.createdAt;
  }
}



