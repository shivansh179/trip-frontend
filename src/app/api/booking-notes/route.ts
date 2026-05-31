import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const FILE_NAME = 'booking-notes.json';

function getBucket() {
  const raw = process.env.GCS_CREDENTIALS || '';
  const bucket = process.env.GCS_BUCKET || '';
  if (!raw || !bucket) return null;
  const credentials = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
  return new Storage({ credentials }).bucket(bucket);
}

// GET /api/booking-notes?ref=BK-123 — public, used by clients on /my-booking
export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  if (!ref) return NextResponse.json({ notes: null });
  try {
    const bucket = getBucket();
    if (!bucket) return NextResponse.json({ notes: null });
    const file = bucket.file(FILE_NAME);
    const [exists] = await file.exists();
    if (!exists) return NextResponse.json({ notes: null });
    const [contents] = await file.download();
    const all: Record<string, string> = JSON.parse(contents.toString('utf-8'));
    return NextResponse.json({ notes: all[ref] ?? null });
  } catch {
    return NextResponse.json({ notes: null });
  }
}
