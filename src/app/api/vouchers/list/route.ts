import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

function isAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (secret && req.headers.get('x-admin-secret') === secret) return true;
  if (req.headers.get('x-admin-token')) return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    // Auto-expire vouchers past their validUntil date
    await Voucher.updateMany(
      { status: 'active', validUntil: { $lt: new Date() } },
      { $set: { status: 'expired' } }
    );

    const vouchers = await Voucher.find().sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ vouchers });
  } catch (err) {
    console.error('[vouchers/list]', err);
    return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 });
  }
}
