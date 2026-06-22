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
  console.log(`[market-bookings GET] txnid=${txnid} evtRef=${evtRef}`);

  const col = db().collection('market_bookings');

  if (txnid) {
    const snap = await col.where('txnid', '==', txnid).limit(1).get();
    return NextResponse.json({ data: snap.empty ? null : { _id: snap.docs[0].id, ...snap.docs[0].data() } });
  }
  if (evtRef) {
    const snap = await col.where('evtRef', '==', evtRef).limit(1).get();
    return NextResponse.json({ data: snap.empty ? null : { _id: snap.docs[0].id, ...snap.docs[0].data() } });
  }

  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const snap = await col.orderBy('createdAt', 'desc').get();
  return NextResponse.json({ data: snap.docs.map(d => ({ _id: d.id, ...d.data() })) });
}

export async function POST(req: NextRequest) {
  const booking = await req.json();
  console.log(`[market-bookings POST] txnid=${booking?.txnid}`);
  const col = db().collection('market_bookings');
  const docId = booking.txnid || `mkt-${Date.now()}`;
  await col.doc(docId).set({ ...booking, savedAt: new Date().toISOString() }, { merge: true });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { txnid, evtRef, status } = await req.json();
  console.log(`[market-bookings PATCH] txnid=${txnid} status=${status}`);
  const col = db().collection('market_bookings');
  const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (evtRef  !== undefined) update.evtRef  = evtRef;
  if (status  !== undefined) update.status  = status;

  const snap = await col.where('txnid', '==', txnid).limit(1).get();
  if (!snap.empty) await snap.docs[0].ref.update(update);
  return NextResponse.json({ success: true });
}
