import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Voucher from '@/models/Voucher';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`voucher-validate:${ip}`, 10, 60_000)) {
    return NextResponse.json({ valid: false, error: 'Too many attempts. Please wait.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { code } = body as { code?: string };

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'Voucher code is required.' });
    }

    await connectDB();
    const voucher = await Voucher.findOne({ code: code.trim().toUpperCase() });

    if (!voucher) return NextResponse.json({ valid: false, error: 'Invalid voucher code.' });
    if (voucher.status === 'used') return NextResponse.json({ valid: false, error: 'This voucher has already been used.' });
    if (voucher.status === 'cancelled') return NextResponse.json({ valid: false, error: 'This voucher has been cancelled.' });
    if (voucher.status === 'expired' || voucher.validUntil < new Date()) {
      return NextResponse.json({ valid: false, error: 'This voucher has expired.' });
    }

    return NextResponse.json({
      valid: true,
      code: voucher.code,
      amount: voucher.amount,
      validUntil: voucher.validUntil,
      holder: voucher.purchasedBy.name,
    });
  } catch (err) {
    console.error('[vouchers/validate]', err);
    return NextResponse.json({ valid: false, error: 'Failed to validate voucher.' }, { status: 500 });
  }
}
