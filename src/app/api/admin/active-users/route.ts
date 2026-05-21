import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

function isAuthorised(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;
  const token =
    req.headers.get('x-admin-secret') ||
    req.headers.get('x-admin-token') ||
    req.headers.get('authorization')?.replace('Bearer ', '');
  return token === adminSecret;
}

// Module-level session map — persists within a Node.js instance
// (approximate for serverless; good enough for a small site)
declare global {
  // eslint-disable-next-line no-var
  var _activeSessions: Map<string, number> | undefined;
}

function getSessions(): Map<string, number> {
  if (!globalThis._activeSessions) {
    globalThis._activeSessions = new Map();
  }
  return globalThis._activeSessions;
}

const SESSION_TTL = 90_000; // 90 seconds — ping every 30s

function prune(sessions: Map<string, number>) {
  const now = Date.now();
  for (const [id, ts] of sessions) {
    if (now - ts > SESSION_TTL) sessions.delete(id);
  }
}

// POST /api/admin/active-users — called by client ping (every 30s)
export async function POST(req: NextRequest) {
  // Rate-limit pings: 5 per minute per IP to prevent memory flood
  if (isRateLimited(`active-ping:${getClientIp(req)}`, 5, 60_000)) {
    return NextResponse.json({ ok: true }, { status: 200 }); // silent drop — don't expose limit
  }
  const { sessionId } = await req.json().catch(() => ({ sessionId: null }));
  if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 64) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }
  const sessions = getSessions();
  sessions.set(sessionId, Date.now());
  prune(sessions);
  return NextResponse.json({ ok: true });
}

// GET /api/admin/active-users — admin only
export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const sessions = getSessions();
  prune(sessions);
  return NextResponse.json({ count: sessions.size });
}
