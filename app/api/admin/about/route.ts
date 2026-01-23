import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET - 모든 교회소개 콘텐츠 조회
export async function GET() {
  try {
    const contents = await prisma.aboutContent.findMany({
      orderBy: { order: 'asc' }
    });
    
    // content를 안전하게 JSON 파싱
    const parsedContents = contents.map(c => {
      let parsedContent = c.content;
      if (typeof c.content === 'string') {
        try {
          parsedContent = JSON.parse(c.content);
        } catch (e) {
          parsedContent = c.content;
        }
      }
      return { ...c, content: parsedContent };
    });
    
    return NextResponse.json(parsedContents);
  } catch (error) {
    console.error('콘텐츠 조회 오류:', error);
    return NextResponse.json({ error: '콘텐츠 조회 실패' }, { status: 500 });
  }
}

// POST - 새 콘텐츠 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, title, content, imageUrl, order, isActive } = body;

    // 필수 필드 검증
    if (!key || !title || !content) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 중복 key 확인
    const existing = await prisma.aboutContent.findUnique({
      where: { key }
    });

    if (existing) {
      return NextResponse.json(
        { error: '이미 존재하는 콘텐츠 키입니다.' },
        { status: 400 }
      );
    }

    const newContent = await prisma.aboutContent.create({
      data: {
        key,
        title,
        content: typeof content === 'string' ? content : JSON.stringify(content),
        imageUrl: imageUrl || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(newContent, { status: 201 });
  } catch (error) {
    console.error('콘텐츠 생성 오류:', error);
    return NextResponse.json({ error: '콘텐츠 생성 실패' }, { status: 500 });
  }
}
