import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { MarketBooking } from '@/lib/db/models';

function isAuthorised(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return true;
  if (req.headers.get('x-admin-secret') === adminSecret) return true;
  if (req.headers.get('x-admin-token')) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const txnid  = req.nextUrl.searchParams.get('txnid');
  const evtRef = req.nextUrl.searchParams.get('evtRef');
  console.log(`[market-bookings GET] txnid=${txnid} evtRef=${evtRef}`);

  await connectDB();

  if (evtRef) {
    const doc = await MarketBooking.findOne({ evtRef }).lean();
    return NextResponse.json({ data: doc || null });
  }
  if (txnid) {
    const doc = await MarketBooking.findOne({ txnid }).lean();
    return NextResponse.json({ data: doc || null });
  }

  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const docs = await MarketBooking.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: docs });
}

export async function POST(req: NextRequest) {
  const booking = await req.json();
  console.log(`[market-bookings POST] txnid=${booking?.txnid}`);
  await connectDB();
  await MarketBooking.findOneAndUpdate(
    { txnid: booking.txnid },
    { ...booking },
    { upsert: true, new: true }
  );
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { txnid, evtRef, status } = await req.json();
  console.log(`[market-bookings PATCH] txnid=${txnid} status=${status}`);
  await connectDB();
  const update: Record<string, unknown> = {};
  if (evtRef  !== undefined) update.evtRef  = evtRef;
  if (status  !== undefined) update.status  = status;
  await MarketBooking.findOneAndUpdate({ txnid }, { $set: update });
  return NextResponse.json({ success: true });
}
