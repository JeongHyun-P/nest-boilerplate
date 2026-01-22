import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiErrorResponseDto } from '../dto/api-response.dto';

// 성공 응답 데코레이터 (단일 데이터)
export const ApiSuccessResponse = <TModel extends Type<any>>(model: TModel, status = 200) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description: '성공',
      schema: {
        properties: {
          statusCode: { type: 'number', example: status },
          message: { type: 'string', example: 'ok' },
          data: { $ref: getSchemaPath(model) }
        }
      }
    })
  );
};

// 성공 응답 데코레이터 (배열 데이터)
export const ApiSuccessArrayResponse = <TModel extends Type<any>>(model: TModel, status = 200) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description: '성공',
      schema: {
        properties: {
          statusCode: { type: 'number', example: status },
          message: { type: 'string', example: 'ok' },
          data: { type: 'array', items: { $ref: getSchemaPath(model) } }
        }
      }
    })
  );
};

// 성공 응답 데코레이터 (페이지네이션)
export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: 200,
      description: '성공',
      schema: {
        properties: {
          statusCode: { type: 'number', example: 200 },
          message: { type: 'string', example: 'ok' },
          data: {
            properties: {
              items: { type: 'array', items: { $ref: getSchemaPath(model) } },
              total: { type: 'number', example: 100 },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              totalPages: { type: 'number', example: 10 }
            }
          }
        }
      }
    })
  );
};

// 에러 응답 데코레이터
export const ApiErrorResponse = (status: number, description: string, code: string, message: string) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        properties: {
          statusCode: { type: 'number', example: status },
          code: { type: 'string', example: code },
          message: { type: 'string', example: message }
        }
      }
    })
  );
};

// 공통 에러 응답 (401, 403)
export const ApiCommonErrorResponses = () => {
  return applyDecorators(
    ApiErrorResponse(401, '인증 실패', 'UNAUTHORIZED', '인증이 필요합니다.'),
    ApiErrorResponse(403, '권한 없음', 'FORBIDDEN', '접근 권한이 없습니다.')
  );
};
