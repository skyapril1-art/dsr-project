import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';
import { handleApiError, successResponse } from '@/app/lib/api-utils';
import { ERROR_MESSAGES } from '@/app/lib/constants';

const prisma = new PrismaClient();

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
