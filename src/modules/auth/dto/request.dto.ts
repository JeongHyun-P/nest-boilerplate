import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

// 회원가입 요청
export class SignupRequestDto {
  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아님' })
  @IsNotEmpty({ message: '이메일 필수' })
  email: string;

  @ApiProperty({ description: '비밀번호 (최소 8자)', example: 'password123' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상' })
  @MaxLength(50, { message: '비밀번호는 최대 50자 이하' })
  @IsNotEmpty({ message: '비밀번호 필수' })
  password: string;

  @ApiProperty({ description: '이름', example: '홍길동' })
  @IsString()
  @MinLength(2, { message: '이름은 최소 2자 이상' })
  @MaxLength(100, { message: '이름은 최대 100자 이하' })
  @IsNotEmpty({ message: '이름 필수' })
  name: string;
}

// 유저 로그인 요청
export class LoginRequestDto {
  @ApiProperty({ description: '이메일', example: 'user@example.com' })
  @IsEmail({}, { message: '올바른 이메일 형식이 아님' })
  @IsNotEmpty({ message: '이메일 필수' })
  email: string;

  @ApiProperty({ description: '비밀번호', example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호 필수' })
  password: string;
}

// 관리자 로그인 요청
export class AdminLoginRequestDto {
  @ApiProperty({ description: '로그인 ID', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '로그인 ID 필수' })
  loginId: string;

  @ApiProperty({ description: '비밀번호', example: 'admin1234' })
  @IsString()
  @IsNotEmpty({ message: '비밀번호 필수' })
  password: string;
}
