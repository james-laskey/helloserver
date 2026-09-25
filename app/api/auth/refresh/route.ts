import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, generateAccessToken, getUserById } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// app/api/auth/refresh/route.ts - Add debug logs

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    console.log('1. Received refresh token:', refreshToken?.substring(0, 20) + '...');

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token required' },
        { status: 400 }
      );
    }

    // Verify refresh token signature
    const decoded = verifyRefreshToken(refreshToken);
    console.log('2. Decoded token:', decoded);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
    }

    // Check database for session
    const session = await prisma.authSession.findFirst({
      where: {
        refreshToken,
        userId: decoded.userId,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      }
    });
    console.log('3. Found session in DB:', session ? 'Yes' : 'No');
    console.log('   Session revokedAt:', session?.revokedAt);
    console.log('   Session expiresAt:', session?.expiresAt);

    if (!session) {
      // Check if token exists but is revoked
      const revokedSession = await prisma.authSession.findFirst({
        where: {
          refreshToken,
          userId: decoded.userId,
          revokedAt: { not: null }
        }
      });
      
      if (revokedSession) {
        console.log('   Token was revoked at:', revokedSession.revokedAt);
        return NextResponse.json(
          { error: 'Refresh token has been revoked' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Refresh token not found or expired' },
        { status: 401 }
      );
    }

    // Generate new access token
    const user = await getUserById(decoded.userId);
    const accessToken = generateAccessToken(user.id, user.email);

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
}