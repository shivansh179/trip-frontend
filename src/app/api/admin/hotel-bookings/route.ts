import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

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
  console.log(`[hotel-bookings GET] txnid=${txnid} evtRef=${evtRef}`);

  const col = db().collection('hotel_bookings');

  if (txnid) {
    const snap = await col.where('txnid', '==', txnid).limit(1).get();
    return NextResponse.json({ data: snap.empty ? null : { _id: snap.docs[0].id, ...snap.docs[0].data() } });
  }
  if (evtRef) {
    const snap = await col.where('evtRef', '==', evtRef).limit(1).get();
    return NextResponse.json({ data: snap.empty ? null : { _id: snap.docs[0].id, ...snap.docs[0].data() } });
  }

  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const snap = await col.orderBy('savedAt', 'desc').get();
  return NextResponse.json({ data: snap.docs.map(d => ({ _id: d.id, ...d.data() })) });
}

export async function POST(req: NextRequest) {
  try {
    const booking = await req.json();
    console.log(`[hotel-bookings POST] txnid=${booking?.txnid}`);
    const docId = booking.txnid || `htl-${Date.now()}`;
    await db().collection('hotel_bookings').doc(docId).set({ ...booking, savedAt: new Date().toISOString() }, { merge: true });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { txnid, status, evtRef } = await req.json();
    console.log(`[hotel-bookings PATCH] txnid=${txnid} status=${status}`);
    const col = db().collection('hotel_bookings');
    const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (status !== undefined) update.status = status;
    if (evtRef !== undefined) update.evtRef = evtRef;

    // Try by txnid first, then evtRef
    let snap = await col.where('txnid', '==', txnid).limit(1).get();
    if (snap.empty && evtRef) snap = await col.where('evtRef', '==', evtRef).limit(1).get();
    if (!snap.empty) await snap.docs[0].ref.update(update);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
