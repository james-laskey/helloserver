// app/api/learning/flashcard-sets/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId, topicId, language } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    // Build the where clause
    const where: any = { userId };
    if (topicId) {
      where.topicId = topicId;
    }
    if (language) {
      where.language = language;
    }

    // Fetch flashcard sets
    const flashcardSets = await prisma.flashcardSet.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        topicId: true,
        topicName: true,
        language: true,
        title: true,
        description: true,
        cards: true,
        createdAt: true,
        lastReviewed: true,
        timesReviewed: true
      }
    });

    // Format the response
    const formattedSets = flashcardSets.map(set => ({
      id: set.id,
      topicId: set.topicId,
      topicName: set.topicName,
      language: set.language,
      title: set.title,
      description: set.description,
      cards: set.cards,
      cardCount: Array.isArray(set.cards) ? set.cards.length : 0,
      createdAt: set.createdAt,
      lastReviewed: set.lastReviewed,
      timesReviewed: set.timesReviewed,
    }));

    return NextResponse.json({
      success: true,
      sets: formattedSets,
      count: formattedSets.length
    });
  } catch (error) {
    console.error('Error fetching flashcard sets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flashcard sets' },
      { status: 500 }
    );
  }
}