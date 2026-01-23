import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { sessions } from '@/app/lib/sessions';

const prisma = new PrismaClient();

// Admin: 모든 간증 조회
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionId);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('간증 조회 오류:', error);
    return NextResponse.json(
      { error: '간증을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Admin: 간증 생성
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionId);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, community, content, imageUrl, order, isActive } = body;

    if (!name || !community || !content) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        community,
        content,
        imageUrl,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json({ 
      message: '간증이 생성되었습니다.',
      testimonial 
    });
  } catch (error) {
    console.error('간증 생성 오류:', error);
    return NextResponse.json(
      { error: '간증 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Admin: 간증 수정
export async function PUT(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionId);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, name, community, content, imageUrl, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: '간증 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(community && { community }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      }
    });

    return NextResponse.json({ 
      message: '간증이 수정되었습니다.',
      testimonial 
    });
  } catch (error) {
    console.error('간증 수정 오류:', error);
    return NextResponse.json(
      { error: '간증 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Admin: 간증 삭제
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionId);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: '간증 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await prisma.testimonial.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: '간증이 삭제되었습니다.' 
    });
  } catch (error) {
    console.error('간증 삭제 오류:', error);
    return NextResponse.json(
      { error: '간증 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
