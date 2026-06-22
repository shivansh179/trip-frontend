import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`voucher-validate:${ip}`, 10, 60_000)) {
    return NextResponse.json({ valid: false, error: 'Too many attempts. Please wait.' }, { status: 429 });
  }

  try {
    const { code } = await req.json() as { code?: string };
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Voucher code is required.' });
    }

    const snap = await db().collection('vouchers').doc(code.trim().toUpperCase()).get();
    if (!snap.exists) return NextResponse.json({ valid: false, error: 'Invalid voucher code.' });

    const v = snap.data()!;
    if (v.status === 'used') return NextResponse.json({ valid: false, error: 'This voucher has already been used.' });
    if (v.status === 'cancelled') return NextResponse.json({ valid: false, error: 'This voucher has been cancelled.' });
    if (v.status === 'expired' || v.validUntil < new Date().toISOString()) {
      return NextResponse.json({ valid: false, error: 'This voucher has expired.' });
    }

    return NextResponse.json({ valid: true, code: v.code, amount: v.amount, validUntil: v.validUntil, holder: v.purchasedBy?.name });
  } catch (err) {
    console.error('[vouchers/validate]', err);
    return NextResponse.json({ valid: false, error: 'Failed to validate voucher.' }, { status: 500 });
  }
}
