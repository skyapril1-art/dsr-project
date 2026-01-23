import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const postsWithCounts = posts.map(post => ({
      ...post,
      commentCount: post._count.comments,
      likeCount: post._count.likes,
      _count: undefined,
    }));

    return NextResponse.json({ posts: postsWithCounts });
  } catch (error) {
    console.error('Board fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
