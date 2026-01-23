import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { cookies } from 'next/headers';
import { sessions } from '@/app/lib/sessions';

const prisma = new PrismaClient();

// 사역팀 목록 조회
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

    const teams = await prisma.ministryTeam.findMany({
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('사역팀 목록 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 사역팀 추가
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

    const { name, description, activities, icon, order, isActive } = await request.json();

    if (!name || !description || !activities || !icon) {
      return NextResponse.json(
        { error: '이름, 설명, 활동, 아이콘은 필수입니다.' },
        { status: 400 }
      );
    }

    // activities 배열을 JSON 문자열로 변환
    const activitiesString = JSON.stringify(activities);

    const team = await prisma.ministryTeam.create({
      data: {
        name,
        description,
        activities: activitiesString,
        icon,
        order: order || 0,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error('사역팀 추가 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 사역팀 수정
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

    const { id, name, description, activities, icon, order, isActive } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다.' }, { status: 400 });
    }

    // activities 배열을 JSON 문자열로 변환
    const activitiesString = JSON.stringify(activities);

    const team = await prisma.ministryTeam.update({
      where: { id },
      data: {
        name,
        description,
        activities: activitiesString,
        icon,
        order,
        isActive,
      },
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error('사역팀 수정 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 사역팀 삭제
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

    await prisma.ministryTeam.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: '사역팀이 삭제되었습니다.' });
  } catch (error) {
    console.error('사역팀 삭제 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
