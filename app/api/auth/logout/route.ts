import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      );
    }

    // Revoke the refresh token
    const result = await prisma.authSession.updateMany({
      where: {
        refreshToken,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });

    if (result.count === 0) {
      // Token might already be revoked or doesn't exist
      return NextResponse.json(
        { message: 'Token already revoked or not found' },
        { status: 200 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}