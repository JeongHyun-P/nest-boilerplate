import { Controller } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from '../admin.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/role.enum';

// 관리자 컨트롤러
@ApiTags('Admins')
@ApiBearerAuth()
@Roles(Role.ADMIN)
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  
}
