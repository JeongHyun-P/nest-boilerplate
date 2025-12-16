// 전화번호 하이픈 제거
export function removeHyphens(phone?: string | undefined): string | undefined {
  if (!phone) {
    return undefined;
  }
  return phone.replace(/-/g, '');
}

// 이메일 마스킹
export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  const maskedLocalPart = localPart.length <= 2 ? localPart[0] + '*'.repeat(localPart.length - 1) : localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
  return `${maskedLocalPart}@${domain}`;
}
