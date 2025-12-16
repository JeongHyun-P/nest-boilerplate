import { Type } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString, IsNumber, ValidateNested, IsArray } from 'class-validator';

export class PagingDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  order?: string; // id, name, ...

  @IsOptional()
  @IsString()
  orderValue?: string; // desc, asc

  @IsOptional()
  @IsString()
  status?: string;
}
