import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

function isAdmin(req: NextRequest): boolean {
  return !!(req.headers.get('x-admin-token') || req.headers.get('x-admin-secret'));
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { code, status, validUntil, note } = body as {
      code?: string;
      status?: string;
      validUntil?: string;
      note?: string;
    };

    if (!code) return NextResponse.json({ error: 'Code required' }, { status: 400 });

    await connectDB();

    const update: Record<string, unknown> = {};
    if (status && ['active', 'cancelled', 'expired'].includes(status)) update.status = status;
    if (validUntil) update.validUntil = new Date(validUntil);
    if (note !== undefined) update.note = note;

    const result = await Voucher.findOneAndUpdate(
      { code: code.trim().toUpperCase() },
      { $set: update },
      { new: true }
    );

    if (!result) return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    return NextResponse.json({ success: true, voucher: result });
  } catch (err) {
    console.error('[vouchers/update]', err);
    return NextResponse.json({ error: 'Failed to update voucher' }, { status: 500 });
  }
}
