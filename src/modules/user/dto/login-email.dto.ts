import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './base/user.dto';

export class LoginEmailDto extends PickType(UserDto, ['email', 'password'] as const) {}
