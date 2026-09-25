import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Invite token is required' }, { status: 400 });
    }

    const invite = await prisma.betaInvite.findUnique({
      where: { token }
    });

    if (!invite) {
      return NextResponse.json({ error: 'Invalid invite token' }, { status: 404 });
    }

    if (invite.usedAt) {
      return NextResponse.json({ error: 'Invite already used' }, { status: 400 });
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invite has expired' }, { status: 400 });
    }

    // Update beta tester status
    await prisma.betaTester.update({
      where: { email: invite.email },
      data: {
        status: 'active',
        joinedAt: new Date()
      }
    });

    // Mark invite as used
    await prisma.betaInvite.update({
      where: { id: invite.id },
      data: { usedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome to the beta program!'
    });
  } catch (error) {
    console.error('Join beta error:', error);
    return NextResponse.json({ error: 'Failed to join beta' }, { status: 500 });
  }
}