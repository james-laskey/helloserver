// app/api/learning/submit-quiz/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export async function POST(request: NextRequest) {
  try {
    const { attemptId, userId, topicId, answers, timeSpent } = await request.json();

    console.log('Submit quiz request:', { attemptId, userId, topicId, answersLength: answers?.length, timeSpent });

    if (!attemptId || !userId || !topicId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields: attemptId, userId, topicId, answers' },
        { status: 400 }
      );
    }

    // Find the quiz attempt
    const quizAttempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId }
    });

    if (!quizAttempt) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    console.log('Quiz attempt found:', { 
      id: quizAttempt.id, 
      totalQuestions: quizAttempt.totalQuestions,
      language: quizAttempt.language,
      topicName: quizAttempt.topicName
    });

    // Safely cast JSON to QuizQuestion array
    const questions = quizAttempt.questions as unknown as QuizQuestion[];
    
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: 'Invalid quiz questions format' },
        { status: 500 }
      );
    }

    // Calculate score
    let correctCount = 0;
    
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const newScore = Math.round((correctCount / quizAttempt.totalQuestions) * 100);
    console.log(`Score calculated: ${correctCount}/${quizAttempt.totalQuestions} = ${newScore}%`);

    // Update quiz attempt with results
    await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        userAnswers: answers as Prisma.JsonArray,
        correctCount,
        score: newScore,
        timeSpent: timeSpent || 0,
        completedAt: new Date()
      }
    });

    // Update UserStats instead of LearningProgress
    const existingStats = await prisma.userStats.findUnique({
      where: {
        userId_language: { 
          userId, 
          language: quizAttempt.language 
        }
      }
    });

    if (existingStats) {
      // Calculate new weighted average
      const newQuizzesCompleted = existingStats.quizzesCompleted + 1;
      const totalScoreSoFar = existingStats.averageQuizScore * existingStats.quizzesCompleted;
      const newAverageScore = (totalScoreSoFar + newScore) / newQuizzesCompleted;
      
      await prisma.userStats.update({
        where: { id: existingStats.id },
        data: {
          quizzesCompleted: newQuizzesCompleted,
          averageQuizScore: newAverageScore,
          totalSessions: { increment: 1 },
          lastActivity: new Date()
        }
      });
    } else {
      // Create new user stats entry
      await prisma.userStats.create({
        data: {
          userId,
          language: quizAttempt.language,
          quizzesCompleted: 1,
          averageQuizScore: newScore,
          totalSessions: 1,
          lastActivity: new Date()
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      score: newScore, 
      correctCount, 
      total: quizAttempt.totalQuestions 
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to submit quiz',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}