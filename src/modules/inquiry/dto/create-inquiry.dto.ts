import { PickType } from '@nestjs/mapped-types';
import { InquiryDto } from './base/inquiry.dto';

export class CreateInquiryDto extends PickType(InquiryDto, ['type', 'title', 'content'] as const) {}
