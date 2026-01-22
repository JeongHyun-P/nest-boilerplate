import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/role.enum';

export const ROLES_KEY = 'roles';

// Role 기반 접근 제어 데코레이터
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
