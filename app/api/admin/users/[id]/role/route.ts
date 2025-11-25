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

    if (!sessionId || !sessions.has(sessionId)) {
      return { isAdmin: false, user: null };
    }

    const session = sessions.get(sessionId);
    const isAdmin = session.user.role === 'admin';

    return { isAdmin, user: session.user };
  } catch (error) {
    return { isAdmin: false, user: null };
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAdmin, user: currentUser } = await checkAdminAuth(request);

    if (!isAdmin) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const userId = parseInt(params.id);
    const { role } = await request.json();
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다.' },
        { status: 400 }
      );
    }

    // 역할 검증
    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json(
        { error: '유효하지 않은 역할입니다. (user 또는 admin만 가능)' },
        { status: 400 }
      );
    }

    // 자기 자신의 역할은 변경할 수 없음 (보안상)
    if (currentUser && currentUser.id === userId) {
      return NextResponse.json(
        { error: '자기 자신의 역할은 변경할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 관리자를 일반 사용자로 변경하려는 경우 마지막 관리자 보호
    if (role === 'user') {
      const userToChange = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (userToChange?.role === 'admin') {
        const adminCount = await prisma.user.count({
          where: { role: 'admin' }
        });

        if (adminCount <= 1) {
          return NextResponse.json(
            { error: '마지막 관리자의 역할은 변경할 수 없습니다.' },
            { status: 400 }
          );
        }
      }
    }

    // 사용자 역할 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { 
        message: '사용자 역할이 변경되었습니다.',
        user: updatedUser
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('사용자 역할 변경 오류:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}