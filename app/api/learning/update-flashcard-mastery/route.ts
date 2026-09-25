// app/api/learning/update-flashcard-mastery/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { setId, userId, topicId, cardIndex, known } = await request.json();

    console.log('Update flashcard mastery:', { setId, userId, topicId, cardIndex, known });

    if (!setId || !userId || !topicId || cardIndex === undefined || known === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: setId, userId, topicId, cardIndex, known' },
        { status: 400 }
      );
    }

    // Verify the flashcard set exists
    const flashcardSet = await prisma.flashcardSet.findUnique({
      where: { id: setId }
    });

    if (!flashcardSet) {
      return NextResponse.json(
        { error: 'Flashcard set not found' },
        { status: 404 }
      );
    }

    // Update the flashcard set's review count and last reviewed date
    await prisma.flashcardSet.update({
      where: { id: setId },
      data: {
        timesReviewed: { increment: 1 },
        lastReviewed: new Date()
      }
    });

    // Update UserStats for this language (using new schema)
    const existingStats = await prisma.userStats.findUnique({
      where: {
        userId_language: { 
          userId, 
          language: flashcardSet.language 
        }
      }
    });

    if (existingStats) {
      // Update existing stats
      await prisma.userStats.update({
        where: { id: existingStats.id },
        data: {
          flashcardsStudied: { increment: 1 },
          flashcardsMastered: { increment: known ? 1 : 0 },
          lastActivity: new Date()
        }
      });
    } else {
      // Create new stats entry for this language
      await prisma.userStats.create({
        data: {
          userId,
          language: flashcardSet.language,
          flashcardsStudied: 1,
          flashcardsMastered: known ? 1 : 0,
          lastActivity: new Date()
        }
      });
    }

    console.log(`Flashcard ${cardIndex} marked as ${known ? 'known' : 'needs review'}`);

    return NextResponse.json({ 
      success: true,
      message: known ? 'Flashcard marked as known' : 'Flashcard marked for review'
    });
  } catch (error) {
    console.error('Error updating flashcard mastery:', error);
    return NextResponse.json(
      { error: 'Failed to update mastery' },
      { status: 500 }
    );
  }
}