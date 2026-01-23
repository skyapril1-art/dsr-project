// 브랜드 색상
export const COLORS = {
  PRIMARY: '#c69d6c',
  PRIMARY_DARK: '#b8926a',
  PRIMARY_LIGHT: '#d4ae7f',
} as const;

// 파일 업로드 설정
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

// 페이지네이션 설정
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// 세션 설정
export const SESSION_CONFIG = {
  COOKIE_NAME: 'sessionId',
  MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7일
  COOKIE_OPTIONS: {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
  },
} as const;

// API 에러 메시지
export const ERROR_MESSAGES = {
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '권한이 없습니다.',
  ADMIN_ONLY: '관리자 권한이 필요합니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  INVALID_REQUEST: '잘못된 요청입니다.',
  INTERNAL_ERROR: '서버 오류가 발생했습니다.',
  UPLOAD_FAILED: '파일 업로드에 실패했습니다.',
  FILE_TOO_LARGE: '파일 크기가 너무 큽니다.',
  INVALID_FILE_TYPE: '지원하지 않는 파일 형식입니다.',
} as const;

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CREATED: '성공적으로 생성되었습니다.',
  UPDATED: '성공적으로 수정되었습니다.',
  DELETED: '성공적으로 삭제되었습니다.',
  UPLOADED: '파일이 업로드되었습니다.',
} as const;
