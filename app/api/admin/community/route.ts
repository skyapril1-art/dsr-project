import { NextRequest, NextResponse } from 'next/server';
import { sessions } from '@/app/lib/sessions';
import prisma from '@/app/lib/prisma';

// Admin: 모든 커뮤니티(목장) 조회
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

    const communities = await prisma.community.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({ communities });
  } catch (error) {
    console.error('커뮤니티 조회 오류:', error);
    return NextResponse.json(
      { error: '커뮤니티를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Admin: 커뮤니티 생성
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
    const { name, leader, area, members, meetingDay, description, order, isActive } = body;

    if (!name || !leader || !area || !meetingDay) {
      return NextResponse.json(
        { error: '필수 항목을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    const community = await prisma.community.create({
      data: {
        name,
        leader,
        area,
        members: members || 0,
        meetingDay,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      }
    });

    return NextResponse.json({ 
      message: '커뮤니티가 생성되었습니다.',
      community 
    });
  } catch (error) {
    console.error('커뮤니티 생성 오류:', error);
    return NextResponse.json(
      { error: '커뮤니티 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Admin: 커뮤니티 수정
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
    const { id, name, leader, area, members, meetingDay, description, order, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: '커뮤니티 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    const community = await prisma.community.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(leader && { leader }),
        ...(area && { area }),
        ...(members !== undefined && { members }),
        ...(meetingDay && { meetingDay }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
      }
    });

    return NextResponse.json({ 
      message: '커뮤니티가 수정되었습니다.',
      community 
    });
  } catch (error) {
    console.error('커뮤니티 수정 오류:', error);
    return NextResponse.json(
      { error: '커뮤니티 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Admin: 커뮤니티 삭제
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
        { error: '커뮤니티 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    await prisma.community.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ 
      message: '커뮤니티가 삭제되었습니다.' 
    });
  } catch (error) {
    console.error('커뮤니티 삭제 오류:', error);
    return NextResponse.json(
      { error: '커뮤니티 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
