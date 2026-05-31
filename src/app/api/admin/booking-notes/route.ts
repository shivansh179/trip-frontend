import { NextRequest, NextResponse } from 'next/server';
import { put, head, BlobNotFoundError } from '@vercel/blob';

const BLOB_KEY = 'booking-notes.json';

async function readNotes(): Promise<Record<string, string>> {
  try {
    const info = await head(BLOB_KEY);
    const res = await fetch(info.url, { cache: 'no-store' });
    if (!res.ok) return {};
    return await res.json();
  } catch (e) {
    if (e instanceof BlobNotFoundError) return {};
    throw e;
  }
}

async function writeNotes(notes: Record<string, string>) {
  await put(BLOB_KEY, JSON.stringify(notes), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  });
}

// GET /api/admin/booking-notes?ref=BK-123 — admin reads notes
export async function GET(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || '';
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const ref = req.nextUrl.searchParams.get('ref');
  const notes = await readNotes();
  return NextResponse.json({ notes: ref ? (notes[ref] ?? null) : notes });
}

// POST /api/admin/booking-notes  body: { ref, notes }
export async function POST(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || '';
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { ref, notes: text } = await req.json();
  if (!ref) return NextResponse.json({ error: 'Missing ref' }, { status: 400 });
  const existing = await readNotes();
  if (!text) {
    delete existing[ref];
  } else {
    existing[ref] = text;
  }
  await writeNotes(existing);
  return NextResponse.json({ ok: true });
}
