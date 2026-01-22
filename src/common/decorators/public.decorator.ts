import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Public API 데코레이터 - 인증 없이 접근 허용
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
