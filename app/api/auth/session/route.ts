import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sessions } from '@/app/lib/sessions';

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json();
    
    if (!user) {
      return NextResponse.json(
        { error: '사용자 정보가 없습니다.' },
        { status: 401 }
      );
    }

    // 세션 ID 생성
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    // 세션 저장
    sessions.set(sessionId, {
      user: user,
      createdAt: new Date(),
    });

    // 쿠키에 세션 ID 저장
    const response = NextResponse.json(
      { 
        message: '세션이 생성되었습니다.',
        sessionId: sessionId
      },
      { status: 200 }
    );

    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('세션 생성 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    console.log('GET /api/auth/session 호출됨');
    console.log('sessionId:', sessionId);
    console.log('sessions에 sessionId 존재 여부:', sessionId ? sessions.has(sessionId) : false);

    if (!sessionId || !sessions.has(sessionId)) {
      console.log('유효하지 않은 세션');
      return NextResponse.json(
        { error: '유효하지 않은 세션입니다.' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionId);
    console.log('세션 데이터:', session);
    
    return NextResponse.json(
      { 
        user: session.user,
        isAdmin: session.user.role === 'admin'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('세션 확인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;

    if (sessionId && sessions.has(sessionId)) {
      sessions.delete(sessionId);
    }

    const response = NextResponse.json(
      { message: '로그아웃되었습니다.' },
      { status: 200 }
    );

    response.cookies.delete('sessionId');

    return response;

  } catch (error) {
    console.error('로그아웃 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}