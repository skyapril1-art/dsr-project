import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sessions } from '@/app/lib/sessions';
import prisma from '@/app/lib/prisma';

// 목회자 목록 조회
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionId || !sessions.has(sessionId)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const session = sessions.get(sessionId);
    if (session?.user.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const pastors = await prisma.pastor.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ pastors });
  } catch (error) {
    console.error('목회자 목록 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 목회자 추가
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionId || !sessions.has(sessionId)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const session = sessions.get(sessionId);
    if (session?.user.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { name, position, description, imageUrl, order, isActive } = await request.json();

    if (!name || !position || !imageUrl) {
      return NextResponse.json(
        { error: '이름, 직책, 이미지는 필수입니다.' },
        { status: 400 }
      );
    }

    const pastor = await prisma.pastor.create({
      data: {
        name,
        position,
        description: description || null,
        imageUrl,
        order: order || 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ pastor }, { status: 201 });
  } catch (error) {
    console.error('목회자 추가 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 목회자 수정
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionId || !sessions.has(sessionId)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const session = sessions.get(sessionId);
    if (session?.user.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { id, name, position, description, imageUrl, order, isActive } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    const pastor = await prisma.pastor.update({
      where: { id },
      data: {
        name,
        position,
        description: description || null,
        imageUrl,
        order,
        isActive,
      },
    });

    return NextResponse.json({ pastor });
  } catch (error) {
    console.error('목회자 수정 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 목회자 삭제
export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (!sessionId || !sessions.has(sessionId)) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 });
    }

    const session = sessions.get(sessionId);
    if (session?.user.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    await prisma.pastor.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: '목회자가 삭제되었습니다.' });
  } catch (error) {
    console.error('목회자 삭제 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
