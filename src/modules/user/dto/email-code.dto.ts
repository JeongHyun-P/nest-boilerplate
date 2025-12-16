import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './base/user.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailCodeDto extends PickType(UserDto, ['email'] as const) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  code: string;
}
