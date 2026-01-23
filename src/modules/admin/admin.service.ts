import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { UserResponseDto } from '../user/dto/response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

// 관리자 서비스
@Injectable()
export class AdminService {
  constructor(private readonly userService: UserService) {}

  // 유저 목록 조회
  async getUsers(page: number, limit: number): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.userService.getUsers(page, limit);
  }
}
