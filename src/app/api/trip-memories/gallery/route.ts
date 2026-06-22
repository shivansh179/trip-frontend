import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

export async function GET(req: NextRequest) {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '50'), 100);
  const page  = Math.max(parseInt(req.nextUrl.searchParams.get('page') || '1'), 1);

  try {
    // Firestore: fetch approved memories sorted by createdAt desc
    const snap = await db()
      .collection('trip_memories')
      .where('status', '==', 'approved')
      .orderBy('createdAt', 'desc')
      .limit(page * limit) // over-fetch to support pagination
      .get();

    const all = snap.docs.map(d => d.data());
    const paginated = all.slice((page - 1) * limit, page * limit);

    const safe = paginated.map(d => {
      const fullName = String(d.name || '');
      const parts = fullName.split(' ');
      const displayName = parts[0] + (parts.length > 1 ? ' ' + parts.slice(1).map((w: string) => w[0] + '.').join(' ') : '');
      return { ref: d.ref, name: displayName, tripName: d.tripName, mediaType: d.mediaType, fileUrl: d.fileUrl, createdAt: d.createdAt };
    });

    return NextResponse.json({ data: safe, total: snap.size, page, limit });
  } catch {
    return NextResponse.json({ data: [], total: 0, page, limit });
  }
}
