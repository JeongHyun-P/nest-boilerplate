import { ApiProperty } from '@nestjs/swagger';

// 로그인/회원가입 응답 (Access Token만 반환, Refresh Token은 쿠키)
export class TokenResponseDto {
  @ApiProperty({ description: 'Access Token' })
  accessToken: string;
}

// 토큰 갱신 응답
export class RefreshTokenResponseDto {
  @ApiProperty({ description: '새로운 Access Token' })
  accessToken: string;
}
