// app/api/learning/flashcard-sets/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        topicId: true,
        topicName: true,
        language: true,
        title: true,
        description: true,
        cards: true,
        createdAt: true,
        lastReviewed: true,
        timesReviewed: true,
      }
    });

    if (!flashcardSet) {
      return NextResponse.json(
        { error: 'Flashcard set not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      set: {
        ...flashcardSet,
        cardCount: Array.isArray(flashcardSet.cards) ? flashcardSet.cards.length : 0
      }
    });
  } catch (error) {
    console.error('Error fetching flashcard set:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcard set' },
      { status: 500 }
    );
  }
}