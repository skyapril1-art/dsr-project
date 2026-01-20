import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { getSession } from '@/app/lib/sessions';

const prisma = new PrismaClient();

// GET - 모든 슬라이드 조회 (관리자용)
export async function GET() {
  try {
    const slides = await prisma.mainSlide.findMany({
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

// POST - 새 슬라이드 추가
export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { imageUrl, title, description } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: '이미지 URL은 필수입니다.' },
        { status: 400 }
      );
    }

    // 마지막 순서 번호 가져오기
    const lastSlide = await prisma.mainSlide.findFirst({
      orderBy: { order: 'desc' }
    });

    const newSlide = await prisma.mainSlide.create({
      data: {
        imageUrl,
        title: title || '',
        description: description || '',
        order: (lastSlide?.order || 0) + 1,
        isActive: true
      }
    });

    return NextResponse.json(newSlide, { status: 201 });
  } catch (error) {
    console.error('슬라이드 추가 오류:', error);
    return NextResponse.json(
      { error: '슬라이드 추가에 실패했습니다.' },
      { status: 500 }
    );
  }
}
