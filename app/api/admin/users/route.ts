import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { cookies } from 'next/headers';
import { sessions } from '@/app/lib/sessions';

const prisma = new PrismaClient();

// 관리자 권한 확인 함수
async function checkAdminAuth(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    console.log('🍪 세션 ID:', sessionId);

    if (!sessionId || !sessions.has(sessionId)) {
      console.log('❌ 유효하지 않은 세션');
      console.log('현재 활성 세션 수:', sessions.size);
      return { isAdmin: false, user: null };
    }

    const session = sessions.get(sessionId);
    const isAdmin = session.user.role === 'admin';
    console.log('👤 세션 사용자:', session.user);
    console.log('🔐 관리자 여부:', isAdmin);

    return { isAdmin, user: session.user };
  } catch (error) {
    console.log('❌ 권한 확인 오류:', error);
    return { isAdmin: false, user: null };
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 관리자 사용자 목록 API 호출');
    const { isAdmin, user } = await checkAdminAuth(request);
    console.log('👤 현재 사용자:', user);
    console.log('🔐 관리자 권한:', isAdmin);

    if (!isAdmin) {
      console.log('❌ 관리자 권한 없음');
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    // 모든 사용자 조회 (비밀번호 제외)
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`✅ 사용자 목록 조회 성공: ${users.length}명`);
    
    return NextResponse.json(
      { users },
      { status: 200 }
    );

  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}