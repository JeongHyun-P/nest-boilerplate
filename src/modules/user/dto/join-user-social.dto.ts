import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './base/user.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserType } from '../constants/user-type.enum';

export class JoinUserSocialDto {
    @IsNotEmpty()
    @IsEnum(UserType)
    userType: UserType;

    @IsNotEmpty()
    @IsString()
    socialId: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    socialRefreshToken?: string;
}
