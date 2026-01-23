import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// 공개 - 사역 정보 조회
export async function GET() {
  try {
    const ministryInfos = await prisma.ministryInfo.findMany();

    return NextResponse.json({ ministryInfos });
  } catch (error) {
    console.error('사역 정보 조회 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
