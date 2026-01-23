import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET - 특정 콘텐츠 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const content = await prisma.aboutContent.findUnique({
      where: { id }
    });

    if (!content) {
      return NextResponse.json({ error: '콘텐츠를 찾을 수 없습니다.' }, { status: 404 });
    }

    // content를 안전하게 JSON 파싱
    let parsedContentData = content.content;
    if (typeof content.content === 'string') {
      try {
        parsedContentData = JSON.parse(content.content);
      } catch (e) {
        parsedContentData = content.content;
      }
    }
    
    const parsedContent = {
      ...content,
      content: parsedContentData
    };

    return NextResponse.json(parsedContent);
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
    const { key, title, content, imageUrl, order, isActive } = body;

    const updatedContent = await prisma.aboutContent.update({
      where: { id },
      data: {
        key,
        title,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        imageUrl: imageUrl || null,
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
    await prisma.aboutContent.delete({
      where: { id }
    });

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    console.error('콘텐츠 삭제 오류:', error);
    return NextResponse.json({ error: '콘텐츠 삭제 실패' }, { status: 500 });
  }
}
