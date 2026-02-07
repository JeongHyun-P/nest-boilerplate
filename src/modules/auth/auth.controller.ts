import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupRequestDto, LoginRequestDto, AdminLoginRequestDto } from './dto/request.dto';
import { TokenResponseDto, RefreshTokenResponseDto } from './dto/response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ApiOkEmptyResponseDto, ApiOkResponseDto } from '../../common/decorators/api-response.decorator';

// 인증 컨트롤러
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('user/signup')
  @ApiOperation({
    summary: '유저 회원가입',
    description: '이메일과 비밀번호로 새로운 유저 계정을 생성하고, Access Token을 발급.',
  })
  @ApiOkResponseDto(TokenResponseDto)
  async signup(@Body() dto: SignupRequestDto, @Res({ passthrough: true }) res: Response): Promise<TokenResponseDto> {
    return this.authService.signup(dto, res);
  }

  @Public()
  @Post('user/login')
  @ApiOperation({
    summary: '유저 로그인',
    description: '이메일과 비밀번호로 인증하고, Access Token을 발급. Refresh Token은 쿠키로 설정.',
  })
  @ApiOkResponseDto(TokenResponseDto)
  async login(@Body() dto: LoginRequestDto, @Res({ passthrough: true }) res: Response): Promise<TokenResponseDto> {
    return this.authService.login(dto, res);
  }

  @Public()
  @Post('admin/login')
  @ApiOperation({
    summary: '관리자 로그인',
    description: '관리자 이메일과 비밀번호로 인증하고, Access Token을 발급. Refresh Token은 쿠키로 설정.',
  })
  @ApiOkResponseDto(TokenResponseDto)
  async adminLogin(@Body() dto: AdminLoginRequestDto, @Res({ passthrough: true }) res: Response): Promise<TokenResponseDto> {
    return this.authService.adminLogin(dto, res);
  }

  @Public()
  @Post('token/refresh')
  @ApiOperation({
    summary: '토큰 갱신',
    description: 'Refresh Token으로 새로운 Access Token을 발급.',
  })
  @ApiOkResponseDto(RefreshTokenResponseDto)
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<RefreshTokenResponseDto> {
    const cookieName = this.authService.getRefreshTokenCookieName();
    const refreshToken = req.cookies?.[cookieName];
    return this.authService.refreshTokens(refreshToken, res);
  }

  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '현재 세션을 종료하고 Refresh Token 쿠키를 삭제.',
  })
  @ApiOkEmptyResponseDto()
  logout(@Res({ passthrough: true }) res: Response): void {
    return this.authService.logout(res);
  }
}
