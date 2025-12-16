import { PickType } from '@nestjs/mapped-types';
import { UserDto } from './base/user.dto';

export class UpdateUserDto extends PickType(UserDto, ['email', 'name', 'phone', 'zipcode', 'address', 'addressDetail'] as const) {}
