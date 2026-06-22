import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

function isAdmin(req: NextRequest): boolean {
  return !!(req.headers.get('x-admin-token') || req.headers.get('x-admin-secret'));
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const firestore = db();
    const snap = await firestore.collection('vouchers').orderBy('createdAt', 'desc').limit(200).get();
    const now = new Date().toISOString();

    const vouchers = await Promise.all(snap.docs.map(async (d) => {
      const v = d.data();
      // Auto-expire active vouchers past validUntil
      if (v.status === 'active' && v.validUntil < now) {
        await d.ref.update({ status: 'expired', updatedAt: new Date().toISOString() });
        v.status = 'expired';
      }
      return { _id: d.id, ...v };
    }));

    return NextResponse.json({ vouchers });
  } catch (err) {
    console.error('[vouchers/list]', err);
    return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}
