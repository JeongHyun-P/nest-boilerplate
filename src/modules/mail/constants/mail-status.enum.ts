// 메일 발송 상태
export enum MailStatus {
  SUCCESS = 'success',   // 발송 성공
  FAILED = 'failed',     // 발송 실패
  RETRY = 'retry',       // 재시도 대기
}
