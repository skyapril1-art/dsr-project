import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany({
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(contents);
  } catch (error) {
    console.error('Site content fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
