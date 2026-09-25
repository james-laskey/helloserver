// app/api/learning/generate-quiz/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateLearningContent } from '@/lib/learning-service';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function POST(request: NextRequest) {
  try {
    const { userId, topicId, topicName, language, userPreferences, questionCount = 10 } = await request.json();

    if (!userId || !topicId || !topicName || !language) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, topicId, topicName, language' },
        { status: 400 }
      );
    }

    // Generate new quiz using AI
    const quiz = await generateLearningContent({
      type: 'quiz',
      topicName,
      language,
      userPreferences,
      count: questionCount
    }) as QuizQuestion[];

    if (!Array.isArray(quiz) || quiz.length === 0) {
      throw new Error('Invalid quiz data received from AI');
    }

    // Save to database
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId,
        topicId,
        topicName,
        language,
        title: `${topicName} Quiz`,
        questions: quiz as any, // Use 'as any' to bypass TypeScript strict checking
        totalQuestions: quiz.length,
        completedAt: new Date()
      }
    });

    return NextResponse.json({ 
      quiz: quiz, 
      attemptId: quizAttempt.id 
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}