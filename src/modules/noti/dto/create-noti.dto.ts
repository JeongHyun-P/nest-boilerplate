import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { NotiType } from '../constants/noti-type.enum';
import { Type } from 'class-transformer';

export class CreateNotiDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  isSchedule: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  isOptIn: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  scheduledAt: Date;

  // 전체 발송 여부
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  isAll: number;

  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];
}
