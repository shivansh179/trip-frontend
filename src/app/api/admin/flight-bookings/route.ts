import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FlightBooking } from '@/lib/db/models';

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
  console.log(`[flight-bookings GET] txnid=${txnid} evtRef=${evtRef}`);

  await connectDB();

  if (txnid) {
    const doc = await FlightBooking.findOne({ txnid }).lean();
    return NextResponse.json({ data: doc || null });
  }
  if (evtRef) {
    const doc = await FlightBooking.findOne({ evtRef }).lean();
    return NextResponse.json({ data: doc || null });
  }

  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const docs = await FlightBooking.find({}).sort({ savedAt: -1 }).lean();
  return NextResponse.json({ data: docs });
}

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();
    console.log(`[flight-bookings POST] txnid=${booking?.txnid}`);
    await connectDB();
    await FlightBooking.create({ ...booking, savedAt: new Date().toISOString() });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { txnid, status, evtRef } = await req.json();
    console.log(`[flight-bookings PATCH] txnid=${txnid} status=${status}`);
    await connectDB();
    const update: Record<string, unknown> = {};
    if (status !== undefined) update.status = status;
    if (evtRef !== undefined) update.evtRef = evtRef;
    await FlightBooking.findOneAndUpdate(
      { $or: [{ txnid }, ...(evtRef ? [{ evtRef }] : [])] },
      { $set: update }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
