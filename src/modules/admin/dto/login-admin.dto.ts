import { IsString } from 'class-validator';

export class LoginAdminDto {
  @IsString()
  loginId: string;

  @IsString()
  password: string;
}
