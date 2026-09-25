// lib/llm-service.ts
// DeepSeek API configuration

// Note: In Next.js 13+ with App Router, environment variables are automatically loaded
const DEEPSEEK_API_KEY: string | undefined = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL: string = 'https://api.deepseek.com/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Call DeepSeek API
 * @param messages - Array of chat messages
 * @returns The assistant's response text
 */
async function callDeepSeek(messages: ChatMessage[]): Promise<string> {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('DEEPSEEK_API_KEY is not configured. Please add it to your environment variables.');
  }

  try {
    const response: Response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        temperature: 0.7,
        max_tokens: 150,
        stream: false
      })
    });

    if (!response.ok) {
      const error: string = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${error}`);
    }

    const data: DeepSeekResponse = await response.json() as DeepSeekResponse;
    return data.choices[0]?.message?.content?.trim() ?? "I'm not sure how to respond to that.";
  } catch (error) {
    console.error('DeepSeek API call failed:', error);
    // Return a friendly fallback message instead of throwing
    return "I'm having trouble connecting right now. Could you please repeat that or try a different question?";
  }
}

/**
 * Generate introduction for a new session with a specific topic
 * @param language - The language being taught (e.g., "Spanish")
 * @param topicName - The name of the topic (e.g., "Basics & Greetings")
 * @param topicDescription - Description of the topic
 * @returns The introduction message
 */
// lib/llm-service.ts

/**
 * Generate introduction for a new session with a specific topic
 * @param language - The language being taught (e.g., "Spanish")
 * @param topicName - The name of the topic (e.g., "Basics & Greetings")
 * @param topicDescription - Description of the topic
 * @param customSystemPrompt - Optional custom system prompt from frontend
 * @returns The introduction message
 */
export async function generateIntroduction(
  language: string, 
  topicName: string, 
  topicDescription: string,
  customSystemPrompt?: string
): Promise<string> {
  // Use custom system prompt if provided, otherwise use default
  const systemPrompt: string = customSystemPrompt || `You are a friendly, enthusiastic ${language} tutor.
  
Your student has chosen to study the topic: "${topicName}". 
The topic description is: "${topicDescription}".

Guidelines:
- Introduce yourself warmly in 1-2 short sentences
- Ask ONE specific, engaging question to start the conversation about this topic
- Show enthusiasm for the chosen topic
- Keep it natural and conversational, like a real tutor`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Please introduce yourself as my ${language} tutor for the topic "${topicName}" and ask me a question to begin.` }
  ];

  const response: string = await callDeepSeek(messages);
  return response;
}

/**
 * Generate response to user message with topic focus
 * @param userMessage - The user's input message
 * @param language - The language being taught
 * @param topicName - The current topic name
 * @param conversationHistory - Previous conversation messages
 * @param customSystemPrompt - Optional custom system prompt from frontend
 * @returns The assistant's response
 */
export async function generateResponse(
  userMessage: string,
  language: string,
  topicName: string,
  conversationHistory: ChatMessage[] = [],
  customSystemPrompt?: string
): Promise<string> {
  // Use custom system prompt if provided, otherwise use default
  const systemPrompt: string = customSystemPrompt || `You are a patient, encouraging ${language} tutor having a voice/video call conversation.

IMPORTANT RULES:
1. Keep responses VERY CONCISE (1-2 short sentences max) - like a real conversation
2. Focus your answers and follow-up questions on the topic: "${topicName}"
3. Correct mistakes gently when you notice them
4. Provide vocabulary help related to ${topicName} when asked
5. Ask engaging follow-up questions about ${topicName}
6. Use natural, conversational language

Teaching language: ${language}
Current topic: ${topicName}`;

  // Build messages array with system prompt, history, and current message
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10), // Last 10 messages for context
    { role: 'user', content: userMessage }
  ];

  const response: string = await callDeepSeek(messages);
  return response;
}

/**
 * Generate a follow-up question (optional utility)
 * @param language - The language being taught
 * @param previousTopic - The previous topic discussed
 * @returns A follow-up question
 */
export async function generateFollowUp(
  language: string, 
  previousTopic: string
): Promise<string> {
  const messages: ChatMessage[] = [
    {
      role: 'system',
      content: `You are a ${language} tutor. Generate a natural, engaging follow-up question about ${previousTopic}. Keep it to one sentence.`
    },
    {
      role: 'user',
      content: `The student was learning about "${previousTopic}". Ask an engaging follow-up question to continue the conversation.`
    }
  ];

  const response: string = await callDeepSeek(messages);
  return response;
}

/**
 * Get model information for health check
 * @returns Model information object
 */
export function getModelInfo(): { provider: string; model: string; apiEndpoint: string; features: string[] } {
  return {
    provider: 'DeepSeek',
    model: 'deepseek-chat',
    apiEndpoint: DEEPSEEK_API_URL,
    features: ['topic-focused tutoring', 'conversation history', 'multi-language support']
  };
}

/**
 * Check if API is configured
 * @returns True if API key is available
 */
export function isAPIAvailable(): boolean {
  return !!(DEEPSEEK_API_KEY && DEEPSEEK_API_KEY.length > 0);
}

// For backwards compatibility with existing code that expects default export
export default {
  generateIntroduction,
  generateResponse,
  generateFollowUp,
  getModelInfo,
  isAPIAvailable
};