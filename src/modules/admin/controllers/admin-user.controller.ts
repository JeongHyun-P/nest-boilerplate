import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../admin.service';
import { UserResponseDto } from '../../user/dto/response.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/role.enum';
import { ApiOkPaginatedResponseDto, ApiOkResponseDto } from '../../../common/decorators/api-response.decorator';
import { PaginatedResponseDto, PaginationDto } from 'src/common/dto/pagination.dto';

// 관리자용 유저 관리 컨트롤러
@ApiTags('Admin Users')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admins/users')
export class AdminUserController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({
    summary: '유저 목록 조회',
    description: '전체 유저 목록을 페이지네이션하여 조회',
  })
  @ApiOkPaginatedResponseDto(UserResponseDto)
  async getUsers(@Query() dto: PaginationDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.adminService.getUsers(dto.page, dto.limit);
  }

  @Get(':userId')
  @ApiOperation({
    summary: '유저 상세 조회',
    description: '특정 유저의 상세 정보를 조회',
  })
  @ApiOkResponseDto(UserResponseDto)
  async getUserDetail(@Param('userId', ParseIntPipe) userId: number): Promise<UserResponseDto> {
    return this.adminService.getUserDetail(userId);
  }
}
