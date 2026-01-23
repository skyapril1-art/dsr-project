import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// 공개 - 활성화된 목회자 목록 조회
export async function GET() {
  try {
    const pastors = await prisma.pastor.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ pastors });
  } catch (error) {
    console.error('목회자 목록 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
