import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateResponse } from '@/lib/llm-service';
import { addMessage, updateSessionActivity } from '@/lib/session-tracker';

export async function POST(request: NextRequest) {
  try {
    const { 
      sessionId, 
      userId,
      message, 
      language, 
      topic, 
      conversationHistory,
      systemPrompt
    } = await request.json();

    if (!message || !language || !sessionId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the session to find the current topic and stored system prompt
    const session = await prisma.session.findUnique({
      where: { sessionId, userId },
      select: { 
        topicName: true,
        systemPrompt: true  // This now exists in the schema
      }
    });

    const currentTopic = session?.topicName || topic?.name || 'conversation';
    
    // Use the provided systemPrompt or fall back to the stored one
    const activeSystemPrompt = systemPrompt || session?.systemPrompt;

    // Store user message and update activity
    await addMessage(sessionId,  'user', message);
    await updateSessionActivity(sessionId, userId);

    // Generate response using the system prompt
    const aiResponse = await generateResponse(
      message, 
      language, 
      currentTopic, 
      conversationHistory,
      activeSystemPrompt
    );

    // Store assistant response
    await addMessage(sessionId, 'assistant', aiResponse);

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}