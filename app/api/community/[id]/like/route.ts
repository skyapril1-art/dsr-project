import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// 게시글 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.postLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      const likesCount = await prisma.postLike.count({
        where: { postId },
      });

      return NextResponse.json({ 
        liked: false,
        likesCount,
      });
    } else {
      // 좋아요 추가
      await prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      });

      const likesCount = await prisma.postLike.count({
        where: { postId },
      });

      return NextResponse.json({ 
        liked: true,
        likesCount,
      });
    }
  } catch (error) {
    console.error('좋아요 처리 오류:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 사용자의 좋아요 상태 확인
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ liked: false, likesCount: 0 });
    }

    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: parseInt(userId),
        },
      },
    });

    const likesCount = await prisma.postLike.count({
      where: { postId },
    });

    return NextResponse.json({ 
      liked: !!existingLike,
      likesCount,
    });
  } catch (error) {
    console.error('좋아요 상태 확인 오류:', error);
    return NextResponse.json(
      { error: '좋아요 상태 확인에 실패했습니다.' },
      { status: 500 }
    );
  }
}
