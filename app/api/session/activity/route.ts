// app/api/session/activity/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, messageCount, duration } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Update session with current message count and duration
    const updatedSession = await prisma.session.update({
      where: { sessionId },
      data: {
        messageCount: messageCount,
        durationSeconds: duration
      }
    });

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    console.error('Error updating session activity:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}