import { PickType } from '@nestjs/mapped-types';
import { NoticeDto } from './base/notice.dto';

export class CreateNoticeDto extends PickType(NoticeDto, ['title', 'content'] as const) {}
