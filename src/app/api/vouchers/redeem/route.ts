import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

export async function POST(req: NextRequest) {
  try {
    const { code, bookingRef } = await req.json() as { code?: string; bookingRef?: string };
    if (!code) return NextResponse.json({ error: 'Voucher code required.' }, { status: 400 });

    const ref = db().collection('vouchers').doc(code.trim().toUpperCase());
    const snap = await ref.get();

    if (!snap.exists) return NextResponse.json({ error: 'Invalid voucher code.' }, { status: 404 });
    const v = snap.data()!;
    if (v.status !== 'active') return NextResponse.json({ error: `Voucher is ${v.status}.` }, { status: 400 });
    if (v.validUntil < new Date().toISOString()) {
      await ref.update({ status: 'expired', updatedAt: new Date().toISOString() });
      return NextResponse.json({ error: 'Voucher has expired.' }, { status: 400 });
    }

    await ref.update({ status: 'used', usedFor: bookingRef || '', usedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    return NextResponse.json({ success: true, amount: v.amount });
  } catch (err) {
    console.error('[vouchers/redeem]', err);
    return NextResponse.json({ error: 'Failed to redeem voucher.' }, { status: 500 });
  }
}
