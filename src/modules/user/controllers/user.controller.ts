import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../user.service';
import { UserResponseDto } from '../dto/response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/role.enum';
import { ApiSuccessResponse, ApiCommonErrorResponses } from '../../../common/decorators/api-response.decorator';

// 사용자 컨트롤러
@ApiTags('Users')
@ApiBearerAuth()
@Roles(Role.USER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: '프로필 조회' })
  @ApiSuccessResponse(UserResponseDto)
  @ApiCommonErrorResponses()
  async getProfile(@CurrentUser('id') userId: number): Promise<UserResponseDto> {
    return this.userService.getProfile(userId);
  }
}
