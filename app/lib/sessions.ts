// 간단한 세션 관리를 위한 임시 저장소 (실제 환경에서는 Redis나 데이터베이스 사용)
// globalThis를 사용하여 Hot Module Replacement 시에도 세션 유지
const globalForSessions = globalThis as unknown as {
  sessions: Map<string, any> | undefined;
};

export const sessions = globalForSessions.sessions ?? new Map<string, any>();

if (process.env.NODE_ENV !== 'production') {
  globalForSessions.sessions = sessions;
}

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

// 세션 ID로 사용자 정보 가져오기
export async function getUserFromSession(sessionId: string) {
  if (!sessionId || !sessions.has(sessionId)) {
    return null;
  }

  return sessions.get(sessionId)?.user || null;
}