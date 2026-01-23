import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET - 모든 행사 조회
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: [
        { eventType: 'asc' },
        { order: 'asc' }
      ]
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('행사 조회 오류:', error);
    return NextResponse.json({ error: '행사 조회 실패' }, { status: 500 });
  }
}

// POST - 새 행사 추가
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      title, date, time, location, description, 
      imageUrl, eventType, participants, order, isActive 
    } = body;

    // 필수 필드 검증
    if (!title || !date || !time || !location || !description || !eventType) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        date,
        time,
        location,
        description,
        imageUrl: imageUrl || null,
        eventType,
        participants: participants || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('행사 생성 오류:', error);
    return NextResponse.json({ error: '행사 생성 실패' }, { status: 500 });
  }
}
