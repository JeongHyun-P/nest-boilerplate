import { PickType } from '@nestjs/mapped-types';
import { FaqDto } from './base/faq.dto';

export class UpdateFaqDto extends PickType(FaqDto, ['title', 'content'] as const) {}
