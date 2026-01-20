// 간단한 세션 관리를 위한 임시 저장소 (실제 환경에서는 Redis나 데이터베이스 사용)
export const sessions = new Map<string, any>();

// 세션 가져오기 함수
export async function getSession() {
  // 서버 컴포넌트에서 사용
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId || !sessions.has(sessionId)) {
    return null;
  }

  return sessions.get(sessionId)?.user;
}