import { NextRequest, NextResponse } from 'next/server';
import { sessions } from './sessions';
import { ERROR_MESSAGES } from './constants';
import type { User } from './types';

/**
 * 세션에서 사용자 정보를 가져옵니다
 */
export function getUserFromSession(request: NextRequest): User | null {
  const sessionId = request.cookies.get('sessionId')?.value;
  
  if (!sessionId) {
    return null;
  }

  const session = sessions.get(sessionId);
  return session?.user || null;
}

/**
 * 인증이 필요한 API 핸들러를 래핑합니다
 */
export function withAuth(
  handler: (request: NextRequest, user: User) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = getUserFromSession(request);
    
    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    return handler(request, user);
  };
}

/**
 * 관리자 권한이 필요한 API 핸들러를 래핑합니다
 */
export function withAdmin(
  handler: (request: NextRequest, user: User) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = getUserFromSession(request);
    
    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: ERROR_MESSAGES.ADMIN_ONLY },
        { status: 403 }
      );
    }

    return handler(request, user);
  };
}

/**
 * API 에러를 처리하고 일관된 형식으로 반환합니다
 */
export function handleApiError(error: unknown, defaultMessage: string = ERROR_MESSAGES.INTERNAL_ERROR) {
  console.error('API Error:', error);
  
  const message = error instanceof Error ? error.message : defaultMessage;
  
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}

/**
 * 성공 응답을 생성합니다
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}

/**
 * 에러 응답을 생성합니다
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * 파일 확장자를 검증합니다
 */
export function validateFileExtension(filename: string, allowedExtensions: readonly string[]): boolean {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return allowedExtensions.includes(ext);
}

/**
 * 파일 타입을 검증합니다
 */
export function validateFileType(fileType: string, allowedTypes: readonly string[]): boolean {
  return allowedTypes.includes(fileType);
}

/**
 * 쿼리 파라미터에서 ID를 안전하게 추출합니다
 */
export function getIdFromParams(searchParams: URLSearchParams): number | null {
  const id = searchParams.get('id');
  if (!id) return null;
  
  const numId = parseInt(id, 10);
  return isNaN(numId) ? null : numId;
}

/**
 * 페이지네이션 파라미터를 추출합니다
 */
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '10', 10)));
  const skip = (page - 1) * pageSize;
  
  return { page, pageSize, skip };
}
