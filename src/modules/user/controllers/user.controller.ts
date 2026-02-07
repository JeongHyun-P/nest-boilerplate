import { Controller, Delete, Get, Patch, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../user.service';
import { UserResponseDto } from '../dto/user.response.dto';
import { UpdateProfileRequestDto, ChangePasswordRequestDto } from '../dto/user.request.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/role.enum';
import { ApiOkResponseDto } from '../../../common/decorators/api-response.decorator';

// 유저 컨트롤러
@ApiTags('Users')
@ApiBearerAuth()
@Roles(Role.USER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({
    summary: '프로필 조회',
    description: '현재 로그인한 유저의 프로필 정보를 조회.',
  })
  @ApiOkResponseDto(UserResponseDto)
  async getProfile(@CurrentUser('id') userId: number): Promise<UserResponseDto> {
    return this.userService.getProfile(userId);
  }

  @Patch('me')
  @ApiOperation({
    summary: '프로필 수정',
    description: '현재 로그인한 유저의 이름, 전화번호 등 프로필 정보를 수정.',
  })
  @ApiOkResponseDto(UserResponseDto)
  async updateProfile(
    @CurrentUser('id') userId: number,
    @Body() dto: UpdateProfileRequestDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateProfile(userId, dto);
  }

  @Patch('me/password')
  @ApiOperation({
    summary: '비밀번호 변경',
    description: '현재 비밀번호를 확인하고 새 비밀번호로 변경.',
  })
  async changePassword(
    @CurrentUser('id') userId: number,
    @Body() dto: ChangePasswordRequestDto,
  ): Promise<void> {
    await this.userService.changePassword(userId, dto);
  }

  @Delete('me')
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '현재 로그인한 유저의 계정을 비활성화. 탈퇴된 계정은 복구 불가.',
  })
  @ApiOkResponseDto(UserResponseDto)
  async deactivateAccount(@CurrentUser('id') userId: number): Promise<UserResponseDto> {
    return this.userService.deactivateUser(userId);
  }
}
