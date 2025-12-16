import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).*$/)
  password: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('KR')
  phone: string;

  @IsString()
  @IsOptional()
  zipcode: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  addressDetail: string;
}
