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

    return NextResponse.json({
      valid: true, code: v.code, amount: v.amount, validUntil: v.validUntil,
      holder: v.purchasedBy?.name,
      tripName: v.tripName || '', tripDates: v.tripDates || '',
      hotel: v.hotel || '', inclusions: v.inclusions || '',
      destination: v.destination || '', pdfUrl: v.pdfUrl || '',
      holderName: v.purchasedBy?.name || '', holderEmail: v.purchasedBy?.email || '',
    });
  } catch (err) {
    console.error('[vouchers/validate]', err);
    return NextResponse.json({ valid: false, error: 'Failed to validate voucher.' }, { status: 500 });
  }
}

// GET /api/vouchers/validate?code=YLVCH-XXX — fetch full voucher details for PDF
export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`voucher-pdf:${ip}`, 20, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  const code = req.nextUrl.searchParams.get('code')?.trim().toUpperCase();
  if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

  try {
    const snap = await db().collection('vouchers').doc(code).get();
    if (!snap.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const v = snap.data()!;
    if (!['active', 'used'].includes(String(v.status))) return NextResponse.json({ error: 'Voucher not active' }, { status: 403 });

    return NextResponse.json({
      code: v.code, amount: v.amount, validUntil: v.validUntil, status: v.status,
      destination: v.destination || '', pdfUrl: v.pdfUrl || '',
      tripName: v.tripName || '', tripDates: v.tripDates || '',
      hotel: v.hotel || '', inclusions: v.inclusions || '',
      holderName: v.purchasedBy?.name || '', holderEmail: v.purchasedBy?.email || '',
      createdAt: v.createdAt,
    });
  } catch (err) {
    console.error('[vouchers/validate GET]', err);
    return NextResponse.json({ error: 'Failed to fetch voucher' }, { status: 500 });
  }
}
