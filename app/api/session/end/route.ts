import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { endSession } from '@/lib/session-tracker';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, userId } = await request.json();
    
    if (!sessionId || !userId) {
      return NextResponse.json({ error: 'Session ID and User ID are required' }, { status: 400 });
    }

    const stats = await endSession(sessionId, userId);
    
    if (!stats) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error ending session:', error);
    return NextResponse.json({ error: 'Failed to end session' }, { status: 500 });
  }
}