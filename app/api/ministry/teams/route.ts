import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
  try {
    const teams = await prisma.ministryTeam.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ teams });
  } catch (error) {
    console.error('Ministry teams fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
