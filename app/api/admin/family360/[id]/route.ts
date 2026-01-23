import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET - 특정 콘텐츠 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const content = await prisma.family360Content.findUnique({
      where: { id }
    });

    if (!content) {
      return NextResponse.json({ error: '콘텐츠를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('콘텐츠 조회 오류:', error);
    return NextResponse.json({ error: '콘텐츠 조회 실패' }, { status: 500 });
  }
}

// PUT - 콘텐츠 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { key, title, content, icon, order, isActive } = body;

    const updatedContent = await prisma.family360Content.update({
      where: { id },
      data: {
        key,
        title,
        content,
        icon: icon || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('콘텐츠 수정 오류:', error);
    return NextResponse.json({ error: '콘텐츠 수정 실패' }, { status: 500 });
  }
}

// DELETE - 콘텐츠 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.family360Content.delete({
      where: { id }
    });

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    console.error('콘텐츠 삭제 오류:', error);
    return NextResponse.json({ error: '콘텐츠 삭제 실패' }, { status: 500 });
  }
}
