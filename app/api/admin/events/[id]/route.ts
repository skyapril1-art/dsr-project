import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// GET - 특정 행사 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const event = await prisma.event.findUnique({
      where: { id }
    });

    if (!event) {
      return NextResponse.json({ error: '행사를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('행사 조회 오류:', error);
    return NextResponse.json({ error: '행사 조회 실패' }, { status: 500 });
  }
}

// PUT - 행사 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { 
      title, date, time, location, description, 
      imageUrl, eventType, participants, order, isActive 
    } = body;

    const updatedEvent = await prisma.event.update({
      where: { id },
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

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error('행사 수정 오류:', error);
    return NextResponse.json({ error: '행사 수정 실패' }, { status: 500 });
  }
}

// DELETE - 행사 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await prisma.event.delete({
      where: { id }
    });

    return NextResponse.json({ message: '삭제되었습니다.' });
  } catch (error) {
    console.error('행사 삭제 오류:', error);
    return NextResponse.json({ error: '행사 삭제 실패' }, { status: 500 });
  }
}
