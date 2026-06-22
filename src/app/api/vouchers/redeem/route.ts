import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, bookingRef } = body as { code?: string; bookingRef?: string };

    if (!code) return NextResponse.json({ error: 'Voucher code required.' }, { status: 400 });

    await connectDB();
    const voucher = await Voucher.findOne({ code: code.trim().toUpperCase() });

    if (!voucher) return NextResponse.json({ error: 'Invalid voucher code.' }, { status: 404 });
    if (voucher.status !== 'active') return NextResponse.json({ error: `Voucher is ${voucher.status}.` }, { status: 400 });
    if (voucher.validUntil < new Date()) {
      await Voucher.updateOne({ _id: voucher._id }, { status: 'expired' });
      return NextResponse.json({ error: 'Voucher has expired.' }, { status: 400 });
    }

    await Voucher.updateOne(
      { _id: voucher._id },
      { status: 'used', usedFor: bookingRef || '', usedAt: new Date() }
    );

    return NextResponse.json({ success: true, amount: voucher.amount });
  } catch (err) {
    console.error('[vouchers/redeem]', err);
    return NextResponse.json({ error: 'Failed to redeem voucher.' }, { status: 500 });
  }
}
