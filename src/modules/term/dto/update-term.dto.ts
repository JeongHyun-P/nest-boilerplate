import { PickType } from '@nestjs/mapped-types';
import { TermDto } from './base/term.dto';

export class UpdateTermDto extends PickType(TermDto, ['content'] as const) {}
