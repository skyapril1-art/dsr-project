import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sessions } from '@/app/lib/sessions';
import prisma from '@/app/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // 입력값 검증
    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 사용자 찾기
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: '존재하지 않는 이메일입니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    // 세션 ID 생성
    const sessionId = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    
    console.log('로그인 성공 - 생성된 sessionId:', sessionId);
    
    // 세션 저장
    sessions.set(sessionId, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      createdAt: new Date(),
    });

    console.log('세션 저장 완료');
    console.log('현재 저장된 모든 sessionId들:', Array.from(sessions.keys()));

    // 쿠키에 세션 ID 저장하여 응답
    const response = NextResponse.json(
      { 
        message: '로그인 성공',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      },
      { status: 200 }
    );

    response.cookies.set('sessionId', sessionId, {
      httpOnly: true,
      secure: false, // 개발 환경에서는 false로 설정
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: '/',
      sameSite: 'lax'
    });

    console.log('쿠키 설정 완료 - httpOnly: true, secure: false, path: /, sameSite: lax');

    return response;

  } catch (error) {
    console.error('로그인 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}