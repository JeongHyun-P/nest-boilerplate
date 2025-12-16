import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InquiryType } from '../../constants/inquiry-type.enum';

export class InquiryDto {
  @IsNotEmpty()
  @IsEnum(InquiryType)
  type: InquiryType;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  reply: string;
}
