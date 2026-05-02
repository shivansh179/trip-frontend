import { NextRequest, NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

function getFirestore(): Firestore | null {
  try {
    const raw = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON || '';
    if (!raw) return null;
    const credentials = JSON.parse(raw);
    return new Firestore({ credentials, projectId: credentials.project_id });
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '50'), 100);

  const db = getFirestore();
  if (!db) return NextResponse.json({ data: [], total: 0, page: 1, limit });

  const snap = await db
    .collection('trip_memories')
    .where('status', '==', 'approved')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();

  const safe = snap.docs.map(d => {
    const doc = d.data() as Record<string, unknown>;
    const fullName = String(doc.name || '');
    const parts = fullName.split(' ');
    const displayName = parts[0] + (parts.length > 1 ? ' ' + parts.slice(1).map(w => w[0] + '.').join(' ') : '');
    return {
      ref:       doc.ref,
      name:      displayName,
      tripName:  doc.tripName,
      mediaType: doc.mediaType,
      fileUrl:   doc.fileUrl,
      createdAt: doc.createdAt,
    };
  });

  return NextResponse.json({ data: safe, total: safe.length, page: 1, limit });
}
