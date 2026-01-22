import { Controller, Post, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody, ApiQuery } from '@nestjs/swagger';
import { FileService } from '../file.service';
import { FileUploadResponseDto, FileDeleteResponseDto } from '../dto/response.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/constants/role.enum';
import { ApiSuccessArrayResponse, ApiSuccessResponse, ApiErrorResponse, ApiCommonErrorResponses } from '../../../common/decorators/api-response.decorator';

// 파일 업로드 컨트롤러
@ApiTags('Files')
@ApiBearerAuth()
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(AnyFilesInterceptor({ limits: { files: 10 } }))
  @ApiOperation({ summary: '파일 업로드 (단일/다중)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        profile: { type: 'array', items: { type: 'string', format: 'binary' }, description: '프로필 이미지' },
        document: { type: 'array', items: { type: 'string', format: 'binary' }, description: '문서' },
        image: { type: 'array', items: { type: 'string', format: 'binary' }, description: '일반 이미지' },
        attachment: { type: 'array', items: { type: 'string', format: 'binary' }, description: '첨부파일' }
      }
    }
  })
  @ApiSuccessArrayResponse(FileUploadResponseDto)
  @ApiCommonErrorResponses()
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<FileUploadResponseDto[]> {
    return this.fileService.uploadFiles(files);
  }

  @Delete()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: '파일 삭제 (관리자 전용)' })
  @ApiQuery({ name: 'key', required: true, description: '삭제할 파일 키 (S3 경로)' })
  @ApiSuccessResponse(FileDeleteResponseDto)
  @ApiCommonErrorResponses()
  async deleteFile(@Query('key') key: string): Promise<FileDeleteResponseDto> {
    await this.fileService.deleteFile(key);
    return { success: true };
  }
}
