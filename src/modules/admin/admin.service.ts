import { Injectable, Logger } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CustomException, ErrorCode } from '../../common/exceptions/custom.exception';
// 관리자 서비스
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly userService: UserService,
  ) {}

  // 유저 목록 조회
  async getUsers(page: number, limit: number): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.userService.getUsers(page, limit);
  }

  // 유저 상세 조회
  async getUserDetail(userId: number): Promise<UserResponseDto> {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }
    return new UserResponseDto(user);
  }
}
