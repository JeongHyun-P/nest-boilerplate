import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { ApiOkInlineResponseDto } from '../decorators/api-response.decorator';

// 헬스체크 컨트롤러
@ApiTags('Health')
@Controller()
export class HealthController {
  @Public()
  @Get('health')
  @ApiOperation({
    summary: '서버 상태 확인',
    description: '서버의 현재 상태와 타임스탬프를 반환. 모니터링 및 로드밸런서 헬스체크에 사용.',
  })
  @ApiOkInlineResponseDto({
    status: { type: 'string', example: 'UP' },
    timestamp: { type: 'string', example: '2026-01-23T14:55:19.000Z' }
  })
  health(): { status: string; timestamp: string } {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
    };
  }
}
