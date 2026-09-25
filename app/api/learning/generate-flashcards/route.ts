// app/api/learning/generate-flashcards/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateLearningContent } from '@/lib/learning-service';
import { Prisma } from '@prisma/client';

interface Flashcard {
  front: string;
  back: string;
  example: string;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
    },
  });
}

export async function POST(request: NextRequest) {
  const headers = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  };

  try {
    const { userId, topicId, topicName, language, userPreferences } = await request.json();

    // Validate required fields
    if (!userId || !topicId || !topicName || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, topicId, topicName, language' },
        { status: 400, headers }
      );
    }

const existingSets = await prisma.flashcardSet.findMany({
  where: { userId, topicId }
});

let existingFlashcardsContext = '';

if (existingSets.length > 0) {
  // Collect all flashcards from all existing sets
  const allExistingFlashcards: Flashcard[] = [];
  
  for (const set of existingSets) {
    const cards = set.cards as unknown as Flashcard[];
    allExistingFlashcards.push(...cards);
  }

  existingFlashcardsContext = allExistingFlashcards.map(card => `${card.front} - ${card.back}`).join('\n');

  console.log('Found existing flashcards. Using them as context...');
}

    console.log('No existing flashcards found. Generating new set...');

    // Generate new flashcards using AI
    const generatedFlashcards = await generateLearningContent({
      type: 'flashcards',
      topicName,
      language,
      userPreferences: userPreferences || {},
      count: 10,
      existingFlashcards: existingFlashcardsContext
    }) as Flashcard[];

    // Validate the response
    if (!Array.isArray(generatedFlashcards) || generatedFlashcards.length === 0) {
      console.error('Invalid flashcards response:', generatedFlashcards);
      throw new Error('No flashcards generated');
    }

    console.log(`Generated ${generatedFlashcards.length} new flashcards`);

    // ✅ FIX: Convert flashcards to Prisma-compatible JSON
    const flashcardsForDb = generatedFlashcards.map(card => ({
      front: card.front,
      back: card.back,
      example: card.example
    }));

    // Save to database
    const flashcardSet = await prisma.flashcardSet.create({
      data: {
        userId,
        topicId,
        topicName,
        language,
        title: `${topicName} Flashcards`,
        description: `Practice ${topicName} with these flashcards`,
        cards: flashcardsForDb as Prisma.InputJsonValue,
        createdAt: new Date(),
        timesReviewed: 0
      }
    });

    // Update UserStats for this language (track that flashcards exist)
    const existingStats = await prisma.userStats.findUnique({
      where: {
        userId_language: { userId, language }
      }
    });

    if (existingStats) {
      await prisma.userStats.update({
        where: { id: existingStats.id },
        data: {
          lastActivity: new Date()
        }
      });
    } else {
      await prisma.userStats.create({
        data: {
          userId,
          language,
          flashcardsStudied: 0,
          flashcardsMastered: 0,
          lastActivity: new Date()
        }
      });
    }

    console.log('Flashcards saved to database with ID:', flashcardSet.id);

    return NextResponse.json(
      { 
        flashcards: generatedFlashcards, 
        setId: flashcardSet.id,
        existing: false,
        message: 'New flashcards generated'
      },
      { headers }
    );
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers }
    );
  }
}