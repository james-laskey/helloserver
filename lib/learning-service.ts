// lib/learning-service.ts

interface UserPreferences {
  proficiencyLevel?: number;
  nativeLanguage?: string;
  learningGoals?: string[];
}

interface Flashcard {
  front: string;
  back: string;
  example: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

function getProficiencyDescription(level: number): string {
  const descriptions: Record<number, string> = {
    1: 'absolute beginner',
    2: 'very basic',
    3: 'basic',
    4: 'elementary',
    5: 'lower intermediate',
    6: 'intermediate',
    7: 'upper intermediate',
    8: 'advanced',
    9: 'very advanced',
    10: 'proficient'
  };
  return descriptions[level] || 'intermediate';
}

async function callAI(prompt: string): Promise<string> {
  const apiUrl = process.env.AI_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    console.error('AI_API_KEY is not set in environment variables');
    throw new Error('AI API key not configured');
  }

  console.log('Calling AI API for content generation...');
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4000
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);
    throw new Error(`AI API returned ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  if (!content) {
    throw new Error('No content returned from AI API');
  }
  
  return content;
}

function extractJSONFromResponse(response: string): any {
  // Try to parse the entire response as JSON first
  try {
    return JSON.parse(response);
  } catch (e) {
    // If that fails, try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    throw new Error('Could not extract JSON from AI response');
  }
}

function generateFallbackContent(type: string, topicName: string, language: string, nativeLanguage: string): Flashcard[] | QuizQuestion[] {
  console.log('Using fallback content generation for:', topicName);
  
  if (type === 'flashcards') {
    return [
      {
        front: `What is ${topicName} in ${language}?`,
        back: `${topicName} is an important concept in ${language} grammar`,
        example: `This is an example sentence using ${topicName}.`
      },
      {
        front: `How do you use ${topicName} correctly?`,
        back: `Use ${topicName} according to the grammatical rules of ${language}`,
        example: `Here is a practical example of ${topicName} in context.`
      },
      {
        front: `Practice with ${topicName}`,
        back: `Understanding ${topicName} helps you speak ${language} better`,
        example: `Let me show you how ${topicName} works in everyday conversation.`
      }
    ];
  } else {
    return [
      {
        question: `What is the best way to understand ${topicName}?`,
        options: ['Study grammar rules', 'Practice speaking', 'Listen to native speakers', 'All of the above'],
        correctAnswer: 'All of the above',
        explanation: `The best way to learn ${topicName} is through a combination of studying, practicing, and listening.`
      }
    ];
  }
}

interface GenerateLearningContentParams {
  type: 'flashcards' | 'quiz';
  topicName: string;
  language: string;
  userPreferences: UserPreferences;
  count: number;
  existingFlashcards?: string;
}

export async function generateLearningContent({ 
  type, 
  topicName, 
  language, 
  userPreferences, 
  count,
  existingFlashcards 
}: GenerateLearningContentParams): Promise<Flashcard[] | QuizQuestion[]> {
  const proficiencyLevel = userPreferences?.proficiencyLevel || 5;
  const nativeLanguage = userPreferences?.nativeLanguage || 'English';

  console.log(`Generating ${type} for topic: ${topicName}, language: ${language}, proficiency: ${proficiencyLevel}/10`);
  

  const prompt = `You are an expert ${language} language teacher creating ${type === 'flashcards' ? 'flashcards' : 'multiple choice quiz questions'} for a student.

STUDENT PROFILE:
- Native Language: ${nativeLanguage}
- Target Language: ${language}
- Proficiency Level: ${proficiencyLevel}/10 (${getProficiencyDescription(proficiencyLevel)})
- Topic: ${topicName}

TASK: Create ${count} ${type === 'flashcards' ? 'flashcards' : 'quiz questions'} for the topic "${topicName}".

${type === 'flashcards' ? `
FORMAT: Return ONLY a JSON array of objects with this exact structure:
[
  {
    "front": "The term or question in ${language}",
    "back": "The definition or answer in ${nativeLanguage}",
    "example": "An example sentence in ${language} using this term"
  }
]

REQUIREMENTS:
- Front should be in ${language} (the target language)
- Back should be in ${nativeLanguage} (the student's native language)
- Include realistic, practical examples
- Focus on the specific grammar concept or vocabulary
- Difficulty should match proficiency level ${proficiencyLevel}/10
- Try not to repeat existing flashcards if provided ${existingFlashcards}
` : `
FORMAT: Return ONLY a JSON array of objects with this exact structure:
[
  {
    "question": "The question text in ${language}",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "The exact text of the correct option",
    "explanation": "Brief explanation in ${nativeLanguage} why this is correct"
  }
]

REQUIREMENTS:
- Questions should be in ${language}
- Explanations should be in ${nativeLanguage}
- Include 4 options per question
- One clearly correct answer
- Difficulty should match proficiency level ${proficiencyLevel}/10
- Cover key concepts from the topic
`}

IMPORTANT: Return ONLY the JSON array, no additional text, no markdown formatting, no explanation before or after.`;

  try {
    const aiResponse = await callAI(prompt);
    console.log('AI Response received, parsing JSON...');
    
    const content = extractJSONFromResponse(aiResponse);
    
    if (!Array.isArray(content) || content.length === 0) {
      throw new Error('AI response is not a valid array');
    }
    
    console.log(`Successfully generated ${content.length} ${type} items`);
    return content;
  } catch (error) {
    console.error('Error generating content with AI:', error);
    console.log('Falling back to static content');
    return generateFallbackContent(type, topicName, language, nativeLanguage);
  }
}