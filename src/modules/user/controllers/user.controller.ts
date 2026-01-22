import { Controller, Get, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UserService } from '../user.service';
import { UserResponseDto } from '../dto/response.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/constants/role.enum';

// 사용자 컨트롤러
@ApiTags('Users')
@ApiBearerAuth()
@Roles(Role.USER)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: '프로필 조회' })
  async getProfile(@CurrentUser('id') userId: number): Promise<UserResponseDto> {
    return this.userService.getProfile(userId);
  }

  @Post('profile-image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: '프로필 이미지 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary', description: '프로필 이미지 파일' }
      }
    }
  })
  async uploadProfileImage(
    @CurrentUser('id') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif|webp)$/ })]
      })
    )
    file: Express.Multer.File
  ): Promise<UserResponseDto> {
    return this.userService.uploadProfileImage(userId, file);
  }
}
