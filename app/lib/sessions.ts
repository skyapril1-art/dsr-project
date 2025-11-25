// 간단한 세션 관리를 위한 임시 저장소 (실제 환경에서는 Redis나 데이터베이스 사용)
export const sessions = new Map<string, any>();