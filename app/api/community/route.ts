import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/app/lib/prisma';
import { handleApiError, successResponse } from '@/app/lib/api-utils';
import { ERROR_MESSAGES } from '@/app/lib/constants';
import { getUserFromSession } from '@/app/lib/sessions';

/**
 * 커뮤니티 목록 조회 (활성화된 것만)
 */
export async function GET() {
  try {
    const communities = await prisma.community.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        order: 'asc'
      }
    });

    return successResponse({ communities });
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.INTERNAL_ERROR);
  }
}

/**
 * 커뮤니티 게시글 작성
 */
export async function POST(request: Request) {
  try {
    // 세션 확인
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('sessionId')?.value;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const user = await getUserFromSession(sessionId);
    
    if (!user) {
      return NextResponse.json(
        { error: '유효하지 않은 세션입니다.' },
        { status: 401 }
      );
    }

    // 요청 본문 파싱
    const body = await request.json();
    const { title, content } = body;

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        { error: '제목과 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 게시글 작성 (Post 모델 사용)
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        authorId: user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return successResponse({ post });
  } catch (error) {
    console.error('커뮤니티 게시글 작성 오류:', error);
    return handleApiError(error, ERROR_MESSAGES.INTERNAL_ERROR);
  }
}
