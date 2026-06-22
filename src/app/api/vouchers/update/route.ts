import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

function isAdmin(req: NextRequest): boolean {
  return !!(req.headers.get('x-admin-token') || req.headers.get('x-admin-secret'));
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { code, status, validUntil, note } = await req.json() as {
      code?: string; status?: string; validUntil?: string; note?: string;
    };
    if (!code) return NextResponse.json({ error: 'code is required' }, { status: 400 });

    const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (status) update.status = status;
    if (validUntil) update.validUntil = validUntil;
    if (note !== undefined) update.note = note;

    await db().collection('vouchers').doc(code.toUpperCase()).update(update);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[vouchers/update]', err);
    return NextResponse.json({ error: 'Failed to update voucher' }, { status: 500 });
  }
}
