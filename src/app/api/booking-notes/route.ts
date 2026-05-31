import { NextRequest, NextResponse } from 'next/server';
import { head, BlobNotFoundError } from '@vercel/blob';

const BLOB_KEY = 'booking-notes.json';

// GET /api/booking-notes?ref=BK-123 — public, used by clients on /my-booking
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  if (!ref) return NextResponse.json({ notes: null });
  try {
    const info = await head(BLOB_KEY);
    const res = await fetch(info.url, { cache: 'no-store' });
    if (!res.ok) return NextResponse.json({ notes: null });
    const all: Record<string, string> = await res.json();
    return NextResponse.json({ notes: all[ref] ?? null });
  } catch (e) {
    if (e instanceof BlobNotFoundError) return NextResponse.json({ notes: null });
    return NextResponse.json({ notes: null });
  }
}
