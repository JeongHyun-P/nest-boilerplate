import { Injectable, HttpStatus } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { UserResponseDto } from './dto/response.dto';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';
import { CustomException, ErrorCode } from '../../common/exceptions/custom.exception';
import { FileService } from '../file/file.service';

// 사용자 서비스
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileService: FileService
  ) {}

  // 프로필 조회
  async getProfile(userId: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        ...ErrorCode.USER_NOT_FOUND
      });
    }

    return new UserResponseDto(user);
  }

  // 프로필 이미지 업로드
  async uploadProfileImage(userId: number, file: Express.Multer.File): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new CustomException({
        statusCode: HttpStatus.NOT_FOUND,
        ...ErrorCode.USER_NOT_FOUND
      });
    }

    const uploadedFile = await this.fileService.uploadFile(file, 'profile');

    if (user.profileImage) {
      await this.fileService.deleteFile(user.profileImage).catch(() => {});
    }

    user.profileImage = uploadedFile.key;
    await this.userRepository.save(user);

    return new UserResponseDto(user);
  }

  // 사용자 목록 조회 (관리자용)
  async getUsers(page: number, limit: number): Promise<PaginatedResponseDto<UserResponseDto>> {
    const [users, total] = await this.userRepository.findWithPagination(page, limit);
    const items = users.map((user) => new UserResponseDto(user));
    return new PaginatedResponseDto(items, total, page, limit);
  }

  // ID로 사용자 조회
  async findById(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }
}
