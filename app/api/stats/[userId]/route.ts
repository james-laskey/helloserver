// app/api/stats/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  try {
    // Get all user stats
    const userStats = await prisma.userStats.findMany({
      where: { userId },
      orderBy: { language: 'asc' }
    });

    // Get session data for message counts
    const sessions = await prisma.session.findMany({
      where: { userId, status: 'completed' },
      select: { language: true, messageCount: true }
    });

    // Group session messages by language
    const sessionMessages = new Map<string, number>();
    for (const session of sessions) {
      const lang = session.language;
      sessionMessages.set(lang, (sessionMessages.get(lang) || 0) + session.messageCount);
    }

    // Build language stats
    const languages = [];
    const processedLanguages = new Set<string>();

    // Process from userStats
    for (const stat of userStats) {
      processedLanguages.add(stat.language);
      languages.push({
        language: stat.language,
        quizzesCompleted: stat.quizzesCompleted || 0,
        averageQuizScore: Math.round(stat.averageQuizScore || 0),
        totalMessages: sessionMessages.get(stat.language) || 0,
        totalSessions: stat.totalSessions || 0,
        flashcardsStudied: stat.flashcardsStudied || 0,
        flashcardsMastered: stat.flashcardsMastered || 0,
        lastActivity: stat.lastActivity
      });
    }

    // Add languages that only have sessions
    for (const [language, messageCount] of sessionMessages) {
      if (!processedLanguages.has(language)) {
        languages.push({
          language,
          quizzesCompleted: 0,
          averageQuizScore: 0,
          totalMessages: messageCount,
          totalSessions: 0,
          flashcardsStudied: 0,
          flashcardsMastered: 0,
          lastActivity: null
        });
      }
    }

    // Sort languages alphabetically
    languages.sort((a, b) => a.language.localeCompare(b.language));

    // Calculate totals
    const totalQuizzesCompleted = userStats.reduce((sum, s) => sum + (s.quizzesCompleted || 0), 0);
    const totalFlashcardsStudied = userStats.reduce((sum, s) => sum + (s.flashcardsStudied || 0), 0);
    const totalFlashcardsMastered = userStats.reduce((sum, s) => sum + (s.flashcardsMastered || 0), 0);
    
    // Weighted average for quiz scores
    let overallAverageQuizScore = 0;
    if (totalQuizzesCompleted > 0) {
      let totalWeightedScore = 0;
      for (const stat of userStats) {
        totalWeightedScore += (stat.averageQuizScore || 0) * (stat.quizzesCompleted || 0);
      }
      overallAverageQuizScore = Math.round(totalWeightedScore / totalQuizzesCompleted);
    }

    return NextResponse.json({
      languages,
      total_quizzes_completed: totalQuizzesCompleted,
      total_flashcards_studied: totalFlashcardsStudied,
      total_flashcards_mastered: totalFlashcardsMastered,
      overall_average_quiz_score: overallAverageQuizScore
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to get statistics' }, { status: 500 });
  }
}