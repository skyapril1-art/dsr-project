import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET - 활성화된 콘텐츠만 조회 (공개 API)
export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    // key를 기준으로 객체로 변환
    const contentMap = contents.reduce((acc, content) => {
      acc[content.key] = {
        title: content.title,
        content: content.content,
        imageUrl: content.imageUrl
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(contentMap);
  } catch (error) {
    console.error('콘텐츠 조회 오류:', error);
    return NextResponse.json(
      { error: '콘텐츠 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
