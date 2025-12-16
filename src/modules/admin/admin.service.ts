import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
    private readonly authService: AuthService
  ) {}

  async getAdminByLoginId(loginId: string) {
    const findAdmin = await this.adminRepo.findOne({
      select: ['id', 'password'],
      where: { loginId }
    });

    if (!findAdmin) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }

    return findAdmin;
  }
}
