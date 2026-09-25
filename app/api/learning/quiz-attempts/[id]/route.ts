// app/api/learning/quiz-attempts/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quizAttempt = await prisma.quizAttempt.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        topicId: true,
        topicName: true,
        language: true,
        title: true,
        questions: true,
        userAnswers: true,
        score: true,
        totalQuestions: true,
        correctCount: true,
        timeSpent: true,
        completedAt: true
      }
    });

    if (!quizAttempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      quiz: {
        ...quizAttempt,
        questionCount: Array.isArray(quizAttempt.questions) ? quizAttempt.questions.length : 0
      }
    });
  } catch (error) {
    console.error('Error fetching quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempt' },
      { status: 500 }
    );
  }
}