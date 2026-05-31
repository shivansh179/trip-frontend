import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const FILE_NAME = 'booking-notes.json';

function getStorage() {
  const raw = process.env.GCS_CREDENTIALS || '';
  if (!raw) throw new Error('GCS_CREDENTIALS env var not set');
  const credentials = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
  return new Storage({ credentials });
}

function getBucket() {
  const bucket = process.env.GCS_BUCKET || '';
  if (!bucket) throw new Error('GCS_BUCKET env var not set');
  return getStorage().bucket(bucket);
}

async function readNotes(): Promise<Record<string, string>> {
  try {
    const file = getBucket().file(FILE_NAME);
    const [exists] = await file.exists();
    if (!exists) return {};
    const [contents] = await file.download();
    return JSON.parse(contents.toString('utf-8'));
  } catch {
    return {};
  }
}

async function writeNotes(notes: Record<string, string>) {
  const file = getBucket().file(FILE_NAME);
  await file.save(JSON.stringify(notes), {
    contentType: 'application/json',
    resumable: false,
  });
}

// GET /api/admin/booking-notes?ref=BK-123
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
  try {
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
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
