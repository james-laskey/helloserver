// lib/session-tracker.ts

import { prisma } from './prisma';
import { v4 as uuidv4 } from 'uuid';

export interface SessionStats {
  sessionId: string;
  language: string;
  topic: string | null;
  topicName: string | null;
  startTime: Date;
  endTime?: Date;
  durationSeconds: number;
  messageCount: number;
}

export async function startSession(
  userId: string, 
  language: string, 
  topicId?: string, 
  topicName?: string,
  nativeLanguage?: string,
  proficiencyLevel?: number,
  learningGoals?: string[]
): Promise<string> {
  const sessionId = uuidv4();
  
  await prisma.session.create({
    data: {
      sessionId,
      userId,
      language,
      topicId,
      topicName,
      nativeLanguage,
      proficiencyLevel,
      learningGoals: learningGoals || [],
      status: 'active'
    }
  });
  
  return sessionId;
}

// Add a function to update system prompt after session creation
export async function updateSessionSystemPrompt(sessionId: string, systemPrompt: string): Promise<void> {
  await prisma.session.update({
    where: { sessionId },
    data: { systemPrompt }
  });
}

export async function updateSessionActivity(sessionId: string, userId: string): Promise<void> {
  const session = await prisma.session.findUnique({
    where: { sessionId }
  });
  
  if (!session || session.userId !== userId) return;
  
  const durationSeconds: number = Math.floor(
    (Date.now() - new Date(session.startTime).getTime()) / 1000
  );
  
  await prisma.session.update({
    where: { sessionId },
    data: {
      messageCount: { increment: 1 },
      durationSeconds
    }
  });
}

export async function addMessage(
  sessionId: string, 
  role: 'user' | 'assistant', 
  content: string
): Promise<void> {
  await prisma.message.create({
    data: {
      sessionId,
      role,
      content
    }
  });
}

export async function endSession(sessionId: string, userId: string): Promise<SessionStats | null> {
  const session = await prisma.session.findUnique({
    where: { sessionId }
  });

  if (!session || session.userId !== userId || session.status !== 'active') return null;

  const endTime: Date = new Date();
  const durationSeconds: number = Math.floor(
    (endTime.getTime() - new Date(session.startTime).getTime()) / 1000
  );

  await prisma.session.update({
    where: { sessionId },
    data: { endTime, durationSeconds, status: 'completed' }
  });

  // Update user stats (grouped by language only, per new simplified schema)
  const existingStats = await prisma.userStats.findUnique({
    where: {
      userId_language: {
        userId: session.userId,
        language: session.language
      }
    }
  });

  if (existingStats) {
    await prisma.userStats.update({
      where: { id: existingStats.id },
      data: {
        totalDurationSeconds: { increment: durationSeconds },
        totalSessions: { increment: 1 },
        totalMessages: { increment: session.messageCount },
        lastActivity: new Date()
      }
    });
  } else {
    await prisma.userStats.create({
      data: {
        userId: session.userId,
        language: session.language,
        totalDurationSeconds: durationSeconds,
        totalSessions: 1,
        totalMessages: session.messageCount,
        lastActivity: new Date()
      }
    });
  }

  return {
    sessionId: session.sessionId,
    language: session.language,
    topic: session.topicId || null,
    topicName: session.topicName,
    startTime: session.startTime,
    endTime,
    durationSeconds,
    messageCount: session.messageCount
  };
}

export async function getUserStats(userId: string): Promise<{
  languages: Array<{
    language: string;
    totalDurationSeconds: number;
    totalSessions: number;
    totalMessages: number;
    lastActivity: Date;
  }>;
  total_duration_seconds: number;
  total_duration_formatted: string;
}> {
  const stats = await prisma.userStats.findMany({
    where: { userId },
    select: {
      language: true,
      totalDurationSeconds: true,
      totalSessions: true,
      totalMessages: true,
      lastActivity: true
    },
    orderBy: { language: 'asc' }
  });

  const totalDuration: number = stats.reduce((sum: number, s) => sum + s.totalDurationSeconds, 0);

  return {
    languages: stats,
    total_duration_seconds: totalDuration,
    total_duration_formatted: formatDuration(totalDuration)
  };
}

export async function getUserLanguageStats(userId: string, language: string) {
  const stats = await prisma.userStats.findUnique({
    where: {
      userId_language: { userId, language }
    }
  });
  
  return stats;
}

function formatDuration(seconds: number): string {
  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const remainingSeconds: number = seconds % 60;
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}