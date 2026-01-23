import { Controller, Post, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FileService } from '../file.service';
import { FileUploadResponseDto, FileDeleteResponseDto } from '../dto/response.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/role.enum';
import { ApiOkArrayResponseDto, ApiOkResponseDto } from '../../../common/decorators/api-response.decorator';

// 파일 업로드 컨트롤러
@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(AnyFilesInterceptor({ limits: { files: 10 } }))
  @ApiOperation({
    summary: '파일 업로드 (단일/다중)',
    description: '단일 또는 다중 파일을 업로드합니다. 허용 keys - attachment: 첨부파일',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object'
    }
  })
  @ApiOkArrayResponseDto(FileUploadResponseDto)
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<FileUploadResponseDto[]> {
    return this.fileService.uploadFiles(files);
  }

  @Delete()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: '파일 삭제 (관리자 전용)',
    description: 'S3에 업로드된 파일을 삭제. 관리자 권한 필요.',
  })
  @ApiQuery({ name: 'key', required: true, description: '삭제할 파일 키 (S3 경로)' })
  @ApiOkResponseDto(FileDeleteResponseDto)
  async deleteFile(@Query('key') key: string): Promise<FileDeleteResponseDto> {
    await this.fileService.deleteFile(key);
    return { success: true };
  }
}
