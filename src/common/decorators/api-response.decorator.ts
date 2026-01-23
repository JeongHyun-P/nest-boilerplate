import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Swagger용 공통 성공 응답 데코레이터 (단일 데이터)
 * Swagger에는 data 내부의 실제 DTO만 노출
 * 실제 응답은 { statusCode: 200, message: "ok", data: {...} } 형태
 */
export const ApiOkResponseDto = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: 200,
      description: '성공',
      schema: { $ref: getSchemaPath(model) }
    })
  );
};

/**
 * Swagger용 공통 성공 응답 데코레이터 (배열 데이터)
 * Swagger에는 data 내부의 실제 DTO 배열만 노출
 * 실제 응답은 { statusCode: 200, message: "ok", data: [...] } 형태
 */
export const ApiOkArrayResponseDto = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: 200,
      description: '성공',
      schema: { type: 'array', items: { $ref: getSchemaPath(model) } }
    })
  );
};

/**
 * Swagger용 공통 성공 응답 데코레이터 (페이지네이션)
 * Swagger에는 페이지네이션 구조만 노출
 * 실제 응답은 { statusCode: 200, message: "ok", data: { items: [...], total, page, limit, totalPages } } 형태
 */
export const ApiOkPaginatedResponseDto = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status: 200,
      description: '성공',
      schema: {
        properties: {
          items: { type: 'array', items: { $ref: getSchemaPath(model) } },
          total: { type: 'number', example: 100 },
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 10 },
          totalPages: { type: 'number', example: 10 }
        }
      }
    })
  );
};

/**
 * Swagger용 공통 성공 응답 데코레이터 (인라인 스키마)
 * 간단한 응답 객체를 직접 정의할 때 사용
 */
export const ApiOkInlineResponseDto = (schema: Record<string, any>) => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '성공',
      schema: { properties: schema }
    })
  );
};

// ==========================================
// 하위 호환성을 위한 레거시 데코레이터 (deprecated)
// ==========================================

/**
 * @deprecated ApiOkResponseDto 사용 권장
 */
export const ApiSuccessResponse = <TModel extends Type<any>>(model: TModel, status = 200) => {
  return ApiOkResponseDto(model);
};

/**
 * @deprecated ApiOkArrayResponseDto 사용 권장
 */
export const ApiSuccessArrayResponse = <TModel extends Type<any>>(model: TModel, status = 200) => {
  return ApiOkArrayResponseDto(model);
};

/**
 * @deprecated ApiOkPaginatedResponseDto 사용 권장
 */
export const ApiPaginatedResponse = <TModel extends Type<any>>(model: TModel) => {
  return ApiOkPaginatedResponseDto(model);
};

/**
 * @deprecated 실패 응답 명세는 사용하지 않음
 */
export const ApiErrorResponse = (status: number, description: string, code: string, message: string) => {
  return applyDecorators();
};

/**
 * @deprecated 실패 응답 명세는 사용하지 않음
 */
export const ApiCommonErrorResponses = () => {
  return applyDecorators();
};
