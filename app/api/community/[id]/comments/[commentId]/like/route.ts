import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// 댓글 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const commentId = parseInt(params.commentId);
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    // 이미 좋아요를 눌렀는지 확인
    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
    });

    if (existingLike) {
      // 좋아요 취소
      await prisma.commentLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      const likesCount = await prisma.commentLike.count({
        where: { commentId },
      });

      return NextResponse.json({ 
        liked: false,
        likesCount,
      });
    } else {
      // 좋아요 추가
      await prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });

      const likesCount = await prisma.commentLike.count({
        where: { commentId },
      });

      return NextResponse.json({ 
        liked: true,
        likesCount,
      });
    }
  } catch (error) {
    console.error('댓글 좋아요 처리 오류:', error);
    return NextResponse.json(
      { error: '좋아요 처리에 실패했습니다.' },
      { status: 500 }
    );
  }
}
