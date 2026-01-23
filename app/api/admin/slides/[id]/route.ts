import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/sessions';
import prisma from '@/app/lib/prisma';

// PUT - 슬라이드 수정
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 권한 확인
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();

    const { imageUrl, title, description, isActive, order } = body;

    const updatedSlide = await prisma.mainSlide.update({
      where: { id },
      data: {
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        order: order !== undefined ? order : undefined
      }
    });

    return NextResponse.json(updatedSlide);
  } catch (error) {
    console.error('슬라이드 수정 오류:', error);
    return NextResponse.json(
      { error: '슬라이드 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE - 슬라이드 삭제
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 관리자 권한 확인
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const params = await context.params;
    const id = parseInt(params.id);

    await prisma.mainSlide.delete({
      where: { id }
    });

    return NextResponse.json({ message: '슬라이드가 삭제되었습니다.' });
  } catch (error) {
    console.error('슬라이드 삭제 오류:', error);
    return NextResponse.json(
      { error: '슬라이드 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
