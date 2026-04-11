import { NextRequest, NextResponse } from 'next/server';

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
  const { sessionId } = await req.json().catch(() => ({ sessionId: null }));
  if (!sessionId || typeof sessionId !== 'string') {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
  }
  const sessions = getSessions();
  sessions.set(sessionId, Date.now());
  prune(sessions);
  return NextResponse.json({ ok: true, count: sessions.size });
}

// GET /api/admin/active-users — called by admin dashboard
export async function GET() {
  const sessions = getSessions();
  prune(sessions);
  return NextResponse.json({ count: sessions.size, sessions: sessions.size });
}
