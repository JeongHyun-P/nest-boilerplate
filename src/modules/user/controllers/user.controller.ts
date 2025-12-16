import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { UserService } from '../user.service';
import { JoinUserEmailDto } from '../dto/join-user-email.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { Role } from 'src/common/constants/roles.enum';
import { Public } from 'src/common/decorators/auth-public.decorator';
import type { Request } from 'express';
import { LoginEmailDto } from '../dto/login-email.dto';
import { EmailCodeDto } from '../dto/email-code.dto';
import { CreateInquiryDto } from 'src/modules/inquiry/dto/create-inquiry.dto';
import { InquiryService } from 'src/modules/inquiry/inquiry.service';
import { AuthUser } from 'src/common/decorators/auth-user.decorator';
import { User } from '../entities/user.entity';
import { JoinUserSocialDto } from '../dto/join-user-social.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly inquiryService: InquiryService,
  ) {}

  // 유저 회원가입 인증메일 발송
  @Public()
  @Post('email/code/send')
  async sendJoinEmailCode(@Body() sendEmailCodeDto: EmailCodeDto) {
    await this.userService.emailExists(sendEmailCodeDto.email);
    await this.authService.sendJoinEmailCode(sendEmailCodeDto);

    return true;
  }

  // 유저 회원가입 인증메일 검증
  @Public()
  @Post('email/code/verify')
  async verifyEmailCode(@Body() sendEmailCodeDto: EmailCodeDto) {
    await this.authService.verifyEmailCode(sendEmailCodeDto);

    return true;
  }

  // 유저 회원가입
  @Public()
  @Post('join')
  async join(@Body() joinUserEmailDto: JoinUserEmailDto) {
    joinUserEmailDto.password = await this.authService.hashPassword(joinUserEmailDto.password);
    const newUser = await this.userService.joinUserWithEmail(joinUserEmailDto);

    return await this.authService.generateToken(newUser.id, Role.USER);
  }

  // 이메일 로그인
  @Public()
  @Post('login/email')
  async loginWithEmail(@Body() loginEmailDto: LoginEmailDto) {
    const findUser = await this.userService.findUserByEmail(loginEmailDto.email);
    await this.authService.comparePassword(loginEmailDto.password, findUser.password);

    return await this.authService.generateToken(findUser.id, Role.USER);
  }

  // 소셜 로그인
  @Public()
  @Post('/login/social')
  async loginWithSocial(@Body() joinUserSocialDto: JoinUserSocialDto) {
    let socialUser = await this.userService.findUserBySocialId(joinUserSocialDto.socialId);

    if (!socialUser) {
      socialUser = await this.userService.joinUserWithSocial(joinUserSocialDto);
    }

    return await this.authService.generateToken(socialUser.id, Role.USER);
  }

  // 토큰 갱신
  @Public()
  @Post('token/refresh')
  async refreshToken(@Req() req: Request) {
    const refreshToken = this.authService.extractTokenFromHeader(req);

    return await this.authService.rotateToken(refreshToken);
  }

  // 아이디(이메일) 찾기
  @Public()
  @Post('find/id')
  async findUserId(@Body('name') name: string, @Body('phone') phone: string) {
    return await this.userService.findUserLoginId(name, phone);
  }

  // 비밀번호 찾기 재설정 이메일 발송
  @Public()
  @Post('find/password/email/send')
  async sendResetPasswordEmail(@Body() emailCodeDto: EmailCodeDto) {
    await this.userService.findUserByEmail(emailCodeDto.email);
    await this.authService.sendResetPasswordEmail(emailCodeDto);
  }

  // 비밀번호 찾기 재설정
  @Public()
  @Post('find/password/reset')
  async resetPassword(@Body() resetPasswordDto: { email: string; newPassword: string }) {
    const hashedPassword = await this.authService.hashPassword(resetPasswordDto.newPassword);
    return this.userService.resetUserPassword(resetPasswordDto.email, hashedPassword);
  }

  // 문의사항 목록
  @Get('inquiry/list')
  async getInquiryList(@AuthUser() user: User) {
    return this.inquiryService.getInquiryListByUser(user);
  }

  // 문의사항 상세
  @Get('inquiry/:id')
  async getInquiryDetail(@Param('id') id: number) {
    return this.inquiryService.getInquiryDetail(id);
  }

  // 문의사항 작성
  @Post('inquiry')
  async createInquiry(@Body() createInquiryDto: CreateInquiryDto, @AuthUser() user: User) {
    return this.inquiryService.createInquiry(createInquiryDto, user);
  }

  // 비밀번호 검증
  @Post('password/verify')
  async verifyPassword(@Body('password') password: string, @AuthUser() user: User) {
    const findUser = await this.userService.findUserById(user.id);
    return this.authService.comparePassword(password, findUser.password);
  }

  // 비밀번호 변경
  @Put('password/change')
  async changePassword(@Body('password') password: string, @AuthUser() user: User) {
    const hashedPassword = await this.authService.hashPassword(password);
    return await this.userService.changePassword(user, hashedPassword);
  }

  // 회원정보 조회
  @Get('profile')
  async getUserProfile(@AuthUser() user: User) {
    return this.userService.findUserById(user.id);
  }

  // 회원정보 변경
  @Put('profile')
  async updateUserProfile(@Body() updateUserDto: UpdateUserDto, @AuthUser() user: User) {
    return this.userService.updateUserInfo(user.id, updateUserDto);
  }

  // 회원 탈퇴
  @Delete('withdraw')
  async withdrawUser(@AuthUser() user: User) {
    return this.userService.deleteUserById([user.id]);
  }
}
