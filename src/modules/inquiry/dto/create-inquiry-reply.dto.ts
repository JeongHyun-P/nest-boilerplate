import { PickType } from '@nestjs/mapped-types';
import { InquiryDto } from './base/inquiry.dto';

export class CreateInquiryReplyDto extends PickType(InquiryDto, ['reply'] as const) {}
