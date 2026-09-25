// app/api/session/start/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startSession, addMessage, updateSessionSystemPrompt } from '@/lib/session-tracker';
import { generateIntroduction } from '@/lib/llm-service';
import { verifyAccessToken } from '@/lib/auth';

// ✅ Make sure this is exported properly
export async function POST(request: NextRequest) {
  try {
    // Get authentication token from headers
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token. Please log in again.' },
        { status: 401 }
      );
    }

    const authenticatedUserId = decoded.userId;

    // Verify the user exists in the database
    const userExists = await prisma.user.findUnique({
      where: { id: authenticatedUserId }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: 'User not found. Please log in again.' },
        { status: 404 }
      );
    }

    const { 
      language, 
      topicId,
      topicName, 
      topicConcept,
      topicExample,
      systemPrompt,
      nativeLanguage,
      proficiencyLevel,
      learningGoals
    } = await request.json();

    if (!language) {
      return NextResponse.json({ error: 'Language is required' }, { status: 400 });
    }

    console.log('Starting session for authenticated user:', authenticatedUserId);

    // Start session with authenticated user ID
    const sessionId = await startSession(
      authenticatedUserId, 
      language, 
      topicId, 
      topicName,
      nativeLanguage,
      proficiencyLevel,
      learningGoals
    );

    // Store the system prompt for this session (if provided)
    if (systemPrompt) {
      await updateSessionSystemPrompt(sessionId, systemPrompt);
    }

    // Generate focused introduction
    const topicInfo = {
      id: topicId,
      name: topicName || 'General Conversation',
      description: topicConcept || 'Practice and improve your conversational skills.',
      example: topicExample
    };
    
    const introduction = await generateIntroduction(
      language, 
      topicInfo.name, 
      topicInfo.description,
      systemPrompt
    );

    // Save the assistant's first message
    await addMessage(sessionId, 'assistant', introduction);

    return NextResponse.json({
      sessionId,
      message: introduction,
      language,
      topic: topicName,
    });
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json(
      { error: 'Failed to start session', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// ✅ Also export OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
    },
  });
}