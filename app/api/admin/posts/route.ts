import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { sessions } from '@/app/lib/sessions';

const prisma = new PrismaClient();

// Admin: 모든 게시글 조회
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionId);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    return NextResponse.json(
      { error: '게시글을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// Admin: 게시글 삭제
export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const session = sessions.get(sessionId);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('id');

    if (!postId) {
      return NextResponse.json(
        { error: '게시글 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 게시글 존재 여부 확인
    const post = await prisma.post.findUnique({
      where: { id: parseInt(postId) }
    });

    if (!post) {
      return NextResponse.json(
        { error: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 게시글 삭제 (Cascade로 관련 댓글, 좋아요도 함께 삭제됨)
    await prisma.post.delete({
      where: { id: parseInt(postId) }
    });

    return NextResponse.json({ 
      message: '게시글이 삭제되었습니다.',
      deletedPostId: postId 
    });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    return NextResponse.json(
      { error: '게시글 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
