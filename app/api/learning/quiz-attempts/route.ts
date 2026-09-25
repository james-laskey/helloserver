// app/api/learning/quiz-attempts/route.ts

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

    // Fetch quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where,
      orderBy: { completedAt: 'desc' },
      select: {
        id: true,
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

    // Format the response
    const formattedQuizzes = quizAttempts.map(quiz => ({
      id: quiz.id,
      topicId: quiz.topicId,
      topicName: quiz.topicName,
      language: quiz.language,
      title: quiz.title,
      questions: quiz.questions,
      questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
      userAnswers: quiz.userAnswers,
      score: quiz.score,
      totalQuestions: quiz.totalQuestions,
      correctCount: quiz.correctCount,
      timeSpent: quiz.timeSpent,
      completedAt: quiz.completedAt
    }));

    return NextResponse.json({
      success: true,
      quizzes: formattedQuizzes,
      count: formattedQuizzes.length
    });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
}