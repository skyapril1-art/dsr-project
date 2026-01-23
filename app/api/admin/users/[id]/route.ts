import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sessions } from '@/app/lib/sessions';
import prisma from '@/app/lib/prisma';

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

export async function DELETE(
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
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자 ID입니다.' },
        { status: 400 }
      );
    }

    // 자기 자신은 삭제할 수 없음
    if (currentUser && currentUser.id === userId) {
      return NextResponse.json(
        { error: '자기 자신은 삭제할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 삭제하려는 사용자가 관리자인지 확인
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (userToDelete?.role === 'admin') {
      // 전체 관리자 수 확인
      const adminCount = await prisma.user.count({
        where: { role: 'admin' }
      });

      // 마지막 관리자는 삭제할 수 없음
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: '마지막 관리자는 삭제할 수 없습니다.' },
          { status: 400 }
        );
      }
    }

    // 사용자 삭제
    const deletedUser = await prisma.user.delete({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json(
      { 
        message: '사용자가 삭제되었습니다.',
        deletedUser 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('사용자 삭제 오류:', error);
    
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