import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { JoinUserEmailDto } from './dto/join-user-email.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { ErrorMessages } from 'src/common/constants/error-messages.enum';
import { JoinUserSocialDto } from './dto/join-user-social.dto';
import { UserType } from './constants/user-type.enum';
import { PagingDto } from 'src/common/dto/paging.dto';
import { TransactionService } from 'src/common/transaction/transaction.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Inquiry } from '../inquiry/entities/inquiry.entity';
import { maskEmail } from 'src/common/utils/string';
import { TermService } from '../term/term.service';
import { UserTerm } from './entities/user-term.entity';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { Noti } from '../noti/entities/noti.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly transactionService: TransactionService,
    private readonly termService: TermService
  ) {}

  // 이메일 중복 체크
  async emailExists(email: string) {
    const emailHash = CryptoService.getInstance().digest(email);

    const exists = await this.userRepo.exists({
      where: { emailHash }
    });

    if (exists) throw new BadRequestException(ErrorMessages.EXISTED_EMAIL);
  }

  // 전화번호 중복 체크
  private async phoneExists(phone: string) {
    const phoneHash = CryptoService.getInstance().digest(phone);

    const exists = await this.userRepo.exists({
      where: { phoneHash }
    });

    if (exists) throw new BadRequestException(ErrorMessages.EXISTED_PHONE);
  }

  // 본인 제외한 전화번호 중복 체크
  async phoneExistsExceptUser(phone: string, userId: number) {
    const phoneHash = CryptoService.getInstance().digest(phone);

    const exists = await this.userRepo.exists({
      where: { phoneHash, id: Not(userId) }
    });

    if (exists) throw new BadRequestException(ErrorMessages.EXISTED_PHONE);
  }

  // 회원 가입
  async joinUserWithEmail(joinUserEmailDto: JoinUserEmailDto) {
    const { email, password, name, phone, zipcode, address, addressDetail } = joinUserEmailDto;

    await this.emailExists(email);
    await this.phoneExists(phone);
    const terms = await this.termService.getTermListAll();

    const user = await this.transactionService.runInTransaction(async (tr) => {
      const userRepo = tr.getRepository(User);
      const userTermRepo = tr.getRepository(UserTerm);

      const userObject = userRepo.create({
        userType: UserType.EMAIL,
        email,
        emailHash: CryptoService.getInstance().digest(email),
        password,
        name,
        phone,
        phoneHash: CryptoService.getInstance().digest(phone),
        zipcode,
        address,
        addressHash: CryptoService.getInstance().digest(address),
        addressDetail,
        addressDetailHash: CryptoService.getInstance().digest(addressDetail),
      });

      const newUser = await userRepo.save(userObject);

      for (const term of terms) {
        const userTerm = userTermRepo.create({
          type: term.type,
          version: term.version,
          content: term.content,
          isAgreed: 1,
          agreedAt: new Date(),
          user: newUser,
          term: term
        });

        await userTermRepo.save(userTerm);
      }

      return newUser;
    });

    return user;
  }

  // 소셜 회원 가입
  async joinUserWithSocial(joinUserSocialDto: JoinUserSocialDto) {
    const { userType, socialId, email, name, phone, socialRefreshToken } = joinUserSocialDto;

    if (email) {
      await this.emailExists(email);
    }

    if (phone) {
      await this.phoneExists(phone);
    }

    const terms = await this.termService.getTermListAll();

    const user = await this.transactionService.runInTransaction(async (tr) => {
      const userRepo = tr.getRepository(User);
      const userTermRepo = tr.getRepository(UserTerm);

      const userObject = userRepo.create({
        userType,
        socialId,
        email,
        emailHash: email ? CryptoService.getInstance().digest(email) : undefined,
        name,
        phone,
        phoneHash: phone ? CryptoService.getInstance().digest(phone) : undefined,
        socialRefreshToken
      });

      const newUser = await userRepo.save(userObject);

      for (const term of terms) {
        const userTerm = userTermRepo.create({
          type: term.type,
          version: term.version,
          content: term.content,
          isAgreed: 1,
          agreedAt: new Date(),
          user: newUser,
          term: term
        });

        await userTermRepo.save(userTerm);
      }

      return newUser;
    });

    return user;
  }

  // 이메일로 유저 조회
  async findUserByEmail(email: string) {
    const findUser = await this.userRepo.findOne({
      select: ['id', 'password'],
      where: { emailHash: CryptoService.getInstance().digest(email) }
    });

    if (!findUser) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }

    return findUser;
  }

  // 소셜 아이디로 유저 조회
  async findUserBySocialId(socialId: string) {
    const findUser = await this.userRepo.findOne({
      select: ['id'],
      where: { socialId }
    });

    return findUser;
  }

  // 아이디로 유저 조회
  async findUserById(id: number) {
    const findUser = await this.userRepo.findOne({
      where: { id },
      withDeleted: true
    });

    if (!findUser) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }

    if (findUser.deletedAt) {
      throw new BadRequestException(ErrorMessages.WITHDRAWAL_USER);
    }

    return findUser;
  }

  // 유저 아이디(로그인ID) 찾기
  async findUserLoginId(name: string, phone: string) {
    const findUser = await this.userRepo.findOne({
      select: ['email'],
      where: {
        name,
        phoneHash: CryptoService.getInstance().digest(phone)
      }
    });

    if (!findUser) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }

    const maskedEmail = maskEmail(findUser.email);

    return { email: maskedEmail };
  }

  // 유저 비밀번호 재설정 (비밀번호 찾기)
  async resetUserPassword(email: string, hashedPassword: string) {
    const findUser = await this.userRepo.findOne({
      where: { emailHash: CryptoService.getInstance().digest(email) }
    });

    if (!findUser) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }

    await this.userRepo.update(
      { id: findUser.id },
      {
        password: hashedPassword
      }
    );

    return true;
  }

  // 유저 비밀번호 변경 (마이페이지)
  async changePassword(user: User, hashedPassword: string) {
    const findUser = await this.userRepo.findOne({
      where: { id: user.id }
    });

    if (!findUser) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }

    await this.userRepo.update(
      { id: findUser.id },
      {
        password: hashedPassword
      }
    );

    return true;
  }

  // 모든 유저 조회
  async getUserListAll() {
    return await this.userRepo.find({});
  }

  // 유저 조회
  async getUserList(pagingDto: PagingDto) {
    const { page, limit, keyword, order, orderValue } = pagingDto;

    let where: any = {};
    if (keyword && keyword.trim()) {
      where = [{ name: Like(`%${keyword}%`) }, { emailHash: Like(`%${CryptoService.getInstance().digest(keyword)}%`) }];
    }

    let orderCondition: any = { id: 'DESC' };
    if (order) {
      orderCondition = { [order]: orderValue?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC' };
    }

    const [items, total] = await this.userRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: orderCondition
    });

    return {
      items,
      total
    };
  }

  // 유저 삭제
  async deleteUserById(userId: number[]) {
    const findUser = await this.userRepo.findOne({ where: { id: In(userId) } });

    if (!findUser) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }

    return this.transactionService.runInTransaction(async (tr) => {
      await tr.getRepository(User).softDelete({ id: In(userId) });

      await tr.getRepository(Inquiry).softDelete({
        user: { id: In(userId) }
      });

      return true;
    });
  }

  // 유저 정보 수정
  async updateUserInfo(userId: number, updateUserDto: UpdateUserDto) {
    const { email, name, phone, zipcode, address, addressDetail } = updateUserDto;

    const findUser = await this.userRepo.findOne({ where: { id: userId } });
    if (!findUser) {
      throw new NotFoundException(ErrorMessages.NOT_FOUND_USER);
    }

    await this.phoneExistsExceptUser(phone, userId); 

    await this.userRepo.update(
      { id: userId },
      {
        email,
        emailHash: email ? CryptoService.getInstance().digest(email) : undefined,
        name,
        phone,
        phoneHash: phone ? CryptoService.getInstance().digest(phone) : undefined,
        zipcode,
        address,
        addressHash: address ? CryptoService.getInstance().digest(address) : undefined,
        addressDetail,
        addressDetailHash: addressDetail ? CryptoService.getInstance().digest(addressDetail) : undefined
      }
    );

    return true;
  }
}
