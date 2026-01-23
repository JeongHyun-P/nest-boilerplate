import { Controller, Delete, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../user.service';
import { UserResponseDto } from '../dto/response.dto';
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

  @Delete('me')
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '현재 로그인한 유저의 계정을 비활성화. 탈퇴된 계정은 복구 불가.',
  })
  @ApiOkResponseDto(UserResponseDto)
  async deactivateAccount(@CurrentUser('id') userId: number) {
    return this.userService.deactivateUser(userId);
  }
}
