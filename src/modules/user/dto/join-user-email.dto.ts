import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './base/user.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class JoinUserEmailDto extends PickType(UserDto, ['email', 'password', 'name', 'phone'] as const) {
  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  addressDetail: string;
}
