import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, rating, feedback, category } = await request.json();

    if (!email || !feedback) {
      return NextResponse.json({ error: 'Email and feedback are required' }, { status: 400 });
    }

    const betaTester = await prisma.betaTester.findUnique({
      where: { email }
    });

    if (!betaTester) {
      return NextResponse.json({ error: 'Beta tester not found' }, { status: 404 });
    }

    await prisma.betaFeedback.create({
      data: {
        betaTesterId: betaTester.id,
        rating: rating || null,
        feedback,
        category: category || 'general'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for your feedback!'
    });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 });
  }
}