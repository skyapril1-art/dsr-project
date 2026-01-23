import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/sessions';
import prisma from '@/app/lib/prisma';

// PUT - 특정 콘텐츠 수정
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

    const { title, content, imageUrl, isActive } = body;

    // 콘텐츠 수정
    const updatedContent = await prisma.siteContent.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        updatedBy: session.userId
      }
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('콘텐츠 수정 오류:', error);
    return NextResponse.json(
      { error: '콘텐츠 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE - 특정 콘텐츠 삭제 (필요시)
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

    await prisma.siteContent.delete({
      where: { id }
    });

    return NextResponse.json({ message: '콘텐츠가 삭제되었습니다.' });
  } catch (error) {
    console.error('콘텐츠 삭제 오류:', error);
    return NextResponse.json(
      { error: '콘텐츠 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
