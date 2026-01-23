/**
 * TypeORM 로깅 활성화 여부를 판단하는 유틸리티 함수
 * 
 * 기준:
 * 1. DB_QUERY_LOG이 'true'가 아니면 무조건 비활성화
 * 2. DB_QUERY_LOG이 'true'이고 NODE_ENV가 'development'일 때만 활성화
 * 
 * @param nodeEnv NODE_ENV 환경변수 값
 * @param dbLogging DB_QUERY_LOG 환경변수 값
 * @returns boolean
 */
export function isDbLoggingEnabled(nodeEnv: string, dbLogging?: string | boolean): boolean {
  // DB_QUERY_LOG 값을 문자열로 변환하여 확인
  const isLoggingOn = String(dbLogging) === 'true';
  const isDevelopment = nodeEnv === 'development';

  return isLoggingOn && isDevelopment;
}
