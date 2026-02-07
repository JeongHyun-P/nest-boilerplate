import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/user.response.dto';
import { UpdateProfileRequestDto, ChangePasswordRequestDto } from './dto/user.request.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CustomException, ErrorCode } from '../../common/exceptions/custom.exception';
import { UserStatus } from './constants/user-status.enum';

// 유저 서비스
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 프로필 조회
  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.findActiveUserById(userId);
    return new UserResponseDto(user);
  }

  // 프로필 수정
  async updateProfile(userId: number, dto: UpdateProfileRequestDto): Promise<UserResponseDto> {
    const user = await this.findActiveUserById(userId);

    // 전화번호 중복 체크
    if (dto.phone && dto.phone !== user.phone) {
      const existingUser = await this.userRepository.findOne({ where: { phone: dto.phone } });
      if (existingUser) {
        throw new CustomException(ErrorCode.PHONE_ALREADY_EXISTS);
      }
    }

    // 필드 업데이트
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;

    await this.userRepository.save(user);
    return new UserResponseDto(user);
  }

  // 비밀번호 변경
  async changePassword(userId: number, dto: ChangePasswordRequestDto): Promise<void> {
    const user = await this.findActiveUserById(userId);

    // 현재 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new CustomException(ErrorCode.INVALID_CURRENT_PASSWORD);
    }

    // 새 비밀번호로 변경
    user.password = await bcrypt.hash(dto.newPassword, 10);
    await this.userRepository.save(user);
  }

  // 회원 탈퇴 (비활성화)
  async deactivateUser(userId: number): Promise<UserResponseDto> {
    const user = await this.findActiveUserById(userId);
    user.status = UserStatus.DELETED;
    await this.userRepository.save(user);
    return new UserResponseDto(user);
  }

  // 유저 목록 조회 (관리자용)
  async getUsers(page: number, limit: number): Promise<PaginatedResponseDto<UserResponseDto>> {
    const [users, total] = await this.userRepository.findAndCount({
      where: { status: UserStatus.ACTIVE },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    const items = users.map((user) => new UserResponseDto(user));
    return new PaginatedResponseDto(items, total, page, limit);
  }

  // ID로 유저 조회
  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  // 활성 유저 조회 (공통 헬퍼)
  private async findActiveUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new CustomException(ErrorCode.USER_NOT_FOUND);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new CustomException(ErrorCode.USER_NOT_ACTIVE);
    }

    return user;
  }
}
