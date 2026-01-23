import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET - 활성화된 슬라이드만 조회 (공개 API)
export async function GET() {
  try {
    const slides = await prisma.mainSlide.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(slides);
  } catch (error) {
    console.error('슬라이드 조회 오류:', error);
    return NextResponse.json(
      { error: '슬라이드 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
