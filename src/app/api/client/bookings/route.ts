import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';

function normalise(v: unknown): string {
  return String(v || '').trim().toLowerCase();
}

function matchesContact(doc: Record<string, unknown>, email: string, phone: string): boolean {
  const fields = [
    normalise(doc.email), normalise(doc.customerEmail),
    normalise((doc.contact as Record<string, unknown> | undefined)?.email),
    normalise((doc.userDetails as Record<string, unknown> | undefined)?.email),
  ];
  const phoneFields = [
    normalise(doc.phone), normalise(doc.customerPhone),
    normalise((doc.contact as Record<string, unknown> | undefined)?.phone),
    normalise((doc.userDetails as Record<string, unknown> | undefined)?.phone),
  ];
  if (email && fields.some(f => f && f === email)) return true;
  if (phone && phoneFields.some(f => f && f === phone)) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const rawEmail = req.nextUrl.searchParams.get('email') || '';
  const rawPhone = req.nextUrl.searchParams.get('phone') || '';
  const email = rawEmail.trim().toLowerCase();
  const phone = rawPhone.trim().replace(/\D/g, '');

  if (!email && !phone) return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 });

  // Firestore: fetch all bookings and filter in-memory (no regex support)
  let flightDocs: Record<string, unknown>[] = [];
  let marketDocs: Record<string, unknown>[] = [];
  let hotelDocs:  Record<string, unknown>[] = [];

  try {
    const firestore = db();
    const [fSnap, mSnap, hSnap] = await Promise.all([
      firestore.collection('flight_bookings').orderBy('savedAt', 'desc').limit(2000).get(),
      firestore.collection('market_bookings').orderBy('savedAt', 'desc').limit(2000).get(),
      firestore.collection('hotel_bookings').orderBy('savedAt', 'desc').limit(2000).get(),
    ]);
    flightDocs = fSnap.docs.map(d => ({ _id: d.id, ...d.data() })).filter(b => matchesContact(b, email, phone));
    marketDocs = mSnap.docs.map(d => ({ _id: d.id, ...d.data() })).filter(b => matchesContact(b, email, phone));
    hotelDocs  = hSnap.docs.map(d => ({ _id: d.id, ...d.data() })).filter(b => matchesContact(b, email, phone));
  } catch { /* non-fatal */ }

  // Fetch trip bookings from Java backend
  let tripBookings: Record<string, unknown>[] = [];
  try {
    const adminSecret = process.env.ADMIN_SECRET || process.env.ADMIN_TOKEN || '';
    const filterParams = new URLSearchParams({ limit: '500' });
    if (phone) filterParams.set('customerPhone', phone);
    if (email) filterParams.set('customerEmail', email);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (adminSecret) { headers['x-admin-secret'] = adminSecret; headers['Authorization'] = `Bearer ${adminSecret}`; }

    const res = await fetch(`${BACKEND}/admin/bookings?${filterParams}`, { headers, signal: AbortSignal.timeout(10000) });
    if (res.ok) {
      const raw = await res.json();
      const list: Record<string, unknown>[] = Array.isArray(raw) ? raw
        : Array.isArray(raw?.data) ? raw.data
        : Array.isArray(raw?.data?.data) ? raw.data.data
        : Array.isArray(raw?.bookings) ? raw.bookings : [];
      tripBookings = list.filter(b => matchesContact(b, email, phone));
    }
  } catch { /* non-fatal */ }

  type Booking = Record<string, unknown> & { _bookingType: string };
  const typed = (docs: Record<string, unknown>[], type: string): Booking[] => docs.map(b => ({ ...b, _bookingType: type }));
  const all: Booking[] = [
    ...typed(flightDocs, 'flight'),
    ...typed(marketDocs, 'market'),
    ...typed(hotelDocs,  'hotel'),
    ...typed(tripBookings, 'trip'),
  ].sort((a, b) => {
    const ta = new Date(String(a['savedAt'] || a['createdAt'] || 0)).getTime();
    const tb = new Date(String(b['savedAt'] || b['createdAt'] || 0)).getTime();
    return tb - ta;
  });

  return NextResponse.json({ data: all, total: all.length });
}
