// Generate a unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Validate language code
export function isValidLanguage(language: string): boolean {
  const supportedLanguages = [
    'Spanish', 'French', 'Japanese', 'Korean', 
    'German', 'Italian', 'English', 'Chinese'
  ];
  return supportedLanguages.includes(language);
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}