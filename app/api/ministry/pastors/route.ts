import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const pastors = await prisma.pastor.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ pastors });
  } catch (error) {
    console.error('Pastor fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
