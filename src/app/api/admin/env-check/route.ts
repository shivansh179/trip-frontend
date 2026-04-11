import { NextResponse } from 'next/server';

export async function GET() {
  // Only show which keys are SET (not their values)
  const keys = [
    'GROQ_API_KEY', 'OPENAI_API_KEY', 'GEMINI_API_KEY',
    'SERPAPI_KEY', 'AMADEUS_CLIENT_ID', 'AMADEUS_CLIENT_SECRET',
    'EASEBUZZ_KEY', 'EASEBUZZ_SALT', 'RESEND_API_KEY',
    'NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_SITE_URL',
  ];
  const result: Record<string, boolean> = {};
  for (const k of keys) result[k] = !!process.env[k];
  return NextResponse.json({ env: result, nodeEnv: process.env.NODE_ENV });
}
