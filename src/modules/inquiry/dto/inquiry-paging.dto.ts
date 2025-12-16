import { IsEnum, IsOptional } from 'class-validator';
import { PagingDto } from 'src/common/dto/paging.dto';
import { InquiryType } from '../constants/inquiry-type.enum';

export class InquiryPagingDto extends PagingDto {
  @IsOptional()
  @IsEnum(InquiryType)
  type?: InquiryType;
}
