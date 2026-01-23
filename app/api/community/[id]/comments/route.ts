import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// 댓글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        likes: true, // 좋아요 정보 포함
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 각 댓글에 좋아요 수 추가
    const commentsWithLikes = comments.map(comment => ({
      ...comment,
      likesCount: comment.likes.length,
    }));

    return NextResponse.json({ comments: commentsWithLikes });
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 작성
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const { content, authorId } = await request.json();

    if (!content || !authorId) {
      return NextResponse.json(
        { error: '댓글 내용과 작성자 정보가 필요합니다.' },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    return NextResponse.json(
      { error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
