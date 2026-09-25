import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
   // provider: process.env.LLM_PROVIDER || 'groq'
  });
}