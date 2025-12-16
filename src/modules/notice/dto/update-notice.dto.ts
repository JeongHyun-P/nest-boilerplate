import { PickType } from '@nestjs/mapped-types';
import { NoticeDto } from './base/notice.dto';

export class UpdateNoticeDto extends PickType(NoticeDto, ['title', 'content'] as const) {}
