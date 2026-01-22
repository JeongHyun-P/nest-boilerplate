import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';

// 헬스체크 컨트롤러
@ApiTags('Health')
@Controller()
export class HealthController {
  @Public()
  @Get('health')
  @ApiOperation({ summary: '서버 상태 확인' })
  health(): { status: string; timestamp: string } {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
    };
  }
}
