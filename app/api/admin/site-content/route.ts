import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET - 모든 사이트 콘텐츠 조회
export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error('콘텐츠 조회 오류:', error);
    return NextResponse.json(
      { error: '콘텐츠 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
