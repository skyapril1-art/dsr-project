import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { withAdmin, handleApiError, successResponse, errorResponse, getIdFromParams } from '@/app/lib/api-utils';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/app/lib/constants';

const prisma = new PrismaClient();

/**
 * Admin: 모든 게시글 조회
 */
export const GET = withAdmin(async (request, user) => {
  try {
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

    return successResponse({ posts });
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.INTERNAL_ERROR);
  }
});

/**
 * Admin: 게시글 삭제
 */
export const DELETE = withAdmin(async (request, user) => {
  try {
    const { searchParams } = new URL(request.url);
    const postId = getIdFromParams(searchParams);

    if (!postId) {
      return errorResponse(ERROR_MESSAGES.INVALID_REQUEST, 400);
    }

    // 게시글 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return errorResponse(ERROR_MESSAGES.NOT_FOUND, 404);
    }

    // 게시글 삭제 (Cascade로 관련 댓글, 좋아요도 함께 삭제됨)
    await prisma.post.delete({
      where: { id: postId }
    });

    return successResponse({ 
      message: SUCCESS_MESSAGES.DELETED,
      deletedPostId: postId 
    });
  } catch (error) {
    return handleApiError(error, ERROR_MESSAGES.INTERNAL_ERROR);
  }
});

