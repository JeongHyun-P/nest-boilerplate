import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../admin.service';
import { UserResponseDto } from '../../user/dto/response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../../common/dto/pagination.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/role.enum';
import { ApiPaginatedResponse, ApiCommonErrorResponses } from '../../../common/decorators/api-response.decorator';

// 관리자 컨트롤러
@ApiTags('Admins')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiOperation({ summary: '유저 목록 조회' })
  @ApiPaginatedResponse(UserResponseDto)
  @ApiCommonErrorResponses()
  async getUsers(@Query() dto: PaginationDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.adminService.getUsers(dto.page, dto.limit);
  }
}
