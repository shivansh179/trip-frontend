import { NextResponse } from 'next/server';

interface ApiStatus {
  name: string;
  key: string;
  purpose: string;
  configured: boolean;
  status: 'ok' | 'missing' | 'error' | 'rate_limited' | 'checking';
  latencyMs?: number;
  message?: string;
  docsUrl: string;
  envVars: string[];
}

async function checkGroq(): Promise<Pick<ApiStatus, 'status' | 'latencyMs' | 'message'>> {
  if (!process.env.GROQ_API_KEY) return { status: 'missing', message: 'GROQ_API_KEY not set' };
  const t = Date.now();
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Rate limit / quota reached' };
    if (res.status === 401) return { status: 'error', latencyMs, message: 'Invalid API key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `HTTP ${res.status}` };
    return { status: 'ok', latencyMs };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

async function checkOpenAI(): Promise<Pick<ApiStatus, 'status' | 'latencyMs' | 'message'>> {
  if (!process.env.OPENAI_API_KEY) return { status: 'missing', message: 'OPENAI_API_KEY not set' };
  const t = Date.now();
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Rate limit / quota exceeded' };
    if (res.status === 401) return { status: 'error', latencyMs, message: 'Invalid API key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `HTTP ${res.status}` };
    return { status: 'ok', latencyMs };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

async function checkGemini(): Promise<Pick<ApiStatus, 'status' | 'latencyMs' | 'message'>> {
  if (!process.env.GEMINI_API_KEY) return { status: 'missing', message: 'GEMINI_API_KEY not set' };
  const t = Date.now();
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const latencyMs = Date.now() - t;
    if (res.status === 429) return { status: 'rate_limited', latencyMs, message: 'Quota exceeded' };
    if (res.status === 400 || res.status === 403) return { status: 'error', latencyMs, message: 'Invalid API key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `HTTP ${res.status}` };
    return { status: 'ok', latencyMs };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

async function checkSerpApi(): Promise<Pick<ApiStatus, 'status' | 'latencyMs' | 'message'>> {
  if (!process.env.SERPAPI_KEY) return { status: 'missing', message: 'SERPAPI_KEY not set' };
  const t = Date.now();
  try {
    const res = await fetch(
      `https://serpapi.com/account?api_key=${process.env.SERPAPI_KEY}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const latencyMs = Date.now() - t;
    if (!res.ok) return { status: 'error', latencyMs, message: `HTTP ${res.status}` };
    const data = await res.json();
    if (data.total_searches_left === 0) return { status: 'rate_limited', latencyMs, message: 'Monthly quota exhausted' };
    const left = data.total_searches_left ?? '?';
    return { status: 'ok', latencyMs, message: `${left} searches remaining` };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

async function checkAmadeus(): Promise<Pick<ApiStatus, 'status' | 'latencyMs' | 'message'>> {
  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    return { status: 'missing', message: 'AMADEUS_CLIENT_ID / AMADEUS_CLIENT_SECRET not set' };
  }
  const base = process.env.AMADEUS_ENV === 'production'
    ? 'https://api.amadeus.com'
    : 'https://test.api.amadeus.com';
  const t = Date.now();
  try {
    const res = await fetch(`${base}/v1/security/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID!,
        client_secret: process.env.AMADEUS_CLIENT_SECRET!,
      }),
      signal: AbortSignal.timeout(6000),
    });
    const latencyMs = Date.now() - t;
    if (!res.ok) return { status: 'error', latencyMs, message: `HTTP ${res.status}` };
    const json = await res.json();
    if (!json.access_token) return { status: 'error', latencyMs, message: 'No token returned' };
    const env = process.env.AMADEUS_ENV === 'production' ? 'Production' : 'Test';
    return { status: 'ok', latencyMs, message: `${env} environment` };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

async function checkResend(): Promise<Pick<ApiStatus, 'status' | 'latencyMs' | 'message'>> {
  if (!process.env.RESEND_API_KEY) return { status: 'missing', message: 'RESEND_API_KEY not set' };
  const t = Date.now();
  try {
    const res = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - t;
    if (res.status === 401) return { status: 'error', latencyMs, message: 'Invalid API key' };
    if (!res.ok) return { status: 'error', latencyMs, message: `HTTP ${res.status}` };
    return { status: 'ok', latencyMs, message: 'Email service operational' };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

async function checkBackendApi(): Promise<Pick<ApiStatus, 'status' | 'latencyMs' | 'message'>> {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return { status: 'missing', message: 'NEXT_PUBLIC_API_URL not set' };
  const t = Date.now();
  try {
    const res = await fetch(`${url}/health`.replace(/\/health$/, '/trips?limit=1'), {
      signal: AbortSignal.timeout(5000),
    });
    const latencyMs = Date.now() - t;
    if (!res.ok) return { status: 'error', latencyMs, message: `HTTP ${res.status}` };
    return { status: 'ok', latencyMs, message: 'Backend reachable' };
  } catch (e) {
    return { status: 'error', latencyMs: Date.now() - t, message: String(e) };
  }
}

function checkEasebuzz(): Pick<ApiStatus, 'status' | 'message'> {
  const key = process.env.EASEBUZZ_KEY;
  const salt = process.env.EASEBUZZ_SALT;
  if (!key || !salt) return { status: 'missing', message: 'EASEBUZZ_KEY / EASEBUZZ_SALT not set' };
  const env = process.env.EASEBUZZ_ENV === 'production' ? 'Production' : 'Test';
  return { status: 'ok', message: `${env} mode · key configured` };
}

export async function GET() {
  // Run all checks in parallel
  const [groq, openai, gemini, serpapi, amadeus, resend, backend] = await Promise.all([
    checkGroq(),
    checkOpenAI(),
    checkGemini(),
    checkSerpApi(),
    checkAmadeus(),
    checkResend(),
    checkBackendApi(),
  ]);
  const easebuzz = checkEasebuzz();

  const apis: ApiStatus[] = [
    {
      name: 'Groq AI',
      key: 'GROQ_API_KEY',
      purpose: 'AI Trip Planner · Reel-to-Trip (primary)',
      configured: !!process.env.GROQ_API_KEY,
      docsUrl: 'https://console.groq.com/keys',
      envVars: ['GROQ_API_KEY'],
      ...groq,
    },
    {
      name: 'OpenAI',
      key: 'OPENAI_API_KEY',
      purpose: 'AI Trip Planner (fallback)',
      configured: !!process.env.OPENAI_API_KEY,
      docsUrl: 'https://platform.openai.com/api-keys',
      envVars: ['OPENAI_API_KEY'],
      ...openai,
    },
    {
      name: 'Google Gemini',
      key: 'GEMINI_API_KEY',
      purpose: 'AI Trip Planner (second fallback)',
      configured: !!process.env.GEMINI_API_KEY,
      docsUrl: 'https://aistudio.google.com/apikey',
      envVars: ['GEMINI_API_KEY'],
      ...gemini,
    },
    {
      name: 'SerpAPI',
      key: 'SERPAPI_KEY',
      purpose: 'Live Flight Search (Google Flights)',
      configured: !!process.env.SERPAPI_KEY,
      docsUrl: 'https://serpapi.com/manage-api-key',
      envVars: ['SERPAPI_KEY'],
      ...serpapi,
    },
    {
      name: 'Amadeus',
      key: 'AMADEUS_CLIENT_ID',
      purpose: 'Flight Search fallback',
      configured: !!(process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET),
      docsUrl: 'https://developers.amadeus.com/',
      envVars: ['AMADEUS_CLIENT_ID', 'AMADEUS_CLIENT_SECRET'],
      ...amadeus,
    },
    {
      name: 'Easebuzz',
      key: 'EASEBUZZ_KEY',
      purpose: 'Payment Gateway (booking payments)',
      configured: !!(process.env.EASEBUZZ_KEY && process.env.EASEBUZZ_SALT),
      docsUrl: 'https://easebuzz.in/dashboard',
      envVars: ['EASEBUZZ_KEY', 'EASEBUZZ_SALT', 'EASEBUZZ_ENV'],
      ...easebuzz,
    },
    {
      name: 'Resend (Email)',
      key: 'RESEND_API_KEY',
      purpose: 'Booking confirmations · Tickets',
      configured: !!process.env.RESEND_API_KEY,
      docsUrl: 'https://resend.com/api-keys',
      envVars: ['RESEND_API_KEY', 'EMAIL_FROM', 'ADMIN_EMAIL'],
      ...resend,
    },
    {
      name: 'Backend API',
      key: 'NEXT_PUBLIC_API_URL',
      purpose: 'Database · Trips · Bookings · Users',
      configured: !!process.env.NEXT_PUBLIC_API_URL,
      docsUrl: '#',
      envVars: ['NEXT_PUBLIC_API_URL'],
      ...backend,
    },
  ];

  const allOk = apis.every(a => a.status === 'ok');
  const hasIssues = apis.some(a => a.status === 'missing' || a.status === 'error' || a.status === 'rate_limited');

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    allOk,
    hasIssues,
    apis,
  });
}
