// 허용된 이미지 MIME 타입
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// 허용된 이미지 MIME 타입 정규식 (Validator용)
export const ALLOWED_IMAGE_TYPES_REGEX = /^image\/(jpeg|png|gif|webp)$/;

// 최대 파일 크기 (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// 파일 업로드 키 (용도)
export enum FileUploadKey {
  PROFILE = 'profile',       // 프로필 이미지
  DOCUMENT = 'document',     // 문서
  IMAGE = 'image',           // 일반 이미지
  ATTACHMENT = 'attachment', // 첨부파일
}

// 파일 업로드 키 - 폴더 매핑
export const FILE_FOLDER_MAP: Record<FileUploadKey, string> = {
  [FileUploadKey.PROFILE]: 'profiles',
  [FileUploadKey.DOCUMENT]: 'documents',
  [FileUploadKey.IMAGE]: 'images',
  [FileUploadKey.ATTACHMENT]: 'attachments',
};

// 기본 폴더
export const DEFAULT_UPLOAD_FOLDER = 'uploads';
