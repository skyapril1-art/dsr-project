import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// 간증 목록 조회 (활성화된 것만)
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({ testimonials });
  } catch (error) {
    console.error('간증 조회 오류:', error);
    return NextResponse.json(
      { error: '간증을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
