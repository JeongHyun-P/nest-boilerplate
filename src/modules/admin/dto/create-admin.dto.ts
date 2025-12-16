import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsOptional()
  loginId: string;

  @IsString()
  @IsOptional()
  password: string;
}
