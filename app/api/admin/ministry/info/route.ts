import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sessions } from '@/app/lib/sessions';
import prisma from '@/app/lib/prisma';

// 사역 정보 조회
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

    const ministryInfos = await prisma.ministryInfo.findMany();

    return NextResponse.json({ ministryInfos });
  } catch (error) {
    console.error('사역 정보 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 사역 정보 수정
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

    const { key, title, content } = await request.json();

    if (!key || !title || !content) {
      return NextResponse.json(
        { error: 'key, title, content는 필수입니다.' },
        { status: 400 }
      );
    }

    // content를 JSON 문자열로 변환
    const contentString = typeof content === 'string' ? content : JSON.stringify(content);

    const ministryInfo = await prisma.ministryInfo.upsert({
      where: { key },
      update: {
        title,
        content: contentString,
      },
      create: {
        key,
        title,
        content: contentString,
      },
    });

    return NextResponse.json({ ministryInfo });
  } catch (error) {
    console.error('사역 정보 수정 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
