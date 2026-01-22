import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupRequestDto, LoginRequestDto, AdminLoginRequestDto } from './dto/request.dto';
import { TokenResponseDto, RefreshTokenResponseDto } from './dto/response.dto';
import { Public } from '../../common/decorators/public.decorator';

// 인증 컨트롤러
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({ summary: '회원가입' })
  async signup(@Body() dto: SignupRequestDto, @Res({ passthrough: true }) res: Response): Promise<TokenResponseDto> {
    return this.authService.signup(dto, res);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: '사용자 로그인' })
  async login(@Body() dto: LoginRequestDto, @Res({ passthrough: true }) res: Response): Promise<TokenResponseDto> {
    return this.authService.login(dto, res);
  }

  @Public()
  @Post('admin/login')
  @ApiOperation({ summary: '관리자 로그인' })
  async adminLogin(@Body() dto: AdminLoginRequestDto, @Res({ passthrough: true }) res: Response): Promise<TokenResponseDto> {
    return this.authService.adminLogin(dto, res);
  }

  @Public()
  @Post('token/refresh')
  @ApiOperation({ summary: '토큰 갱신' })
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<RefreshTokenResponseDto> {
    const cookieName = this.authService.getRefreshTokenCookieName();
    const refreshToken = req.cookies?.[cookieName];
    return this.authService.refreshTokens(refreshToken, res);
  }

  @Post('logout')
  @ApiOperation({ summary: '로그아웃' })
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    this.authService.logout(res);
    return { message: 'ok' };
  }
}
