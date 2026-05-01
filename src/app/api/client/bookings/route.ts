import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { FlightBooking, MarketBooking, HotelBooking } from '@/lib/db/models';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';

function normalise(v: unknown): string {
  return String(v || '').trim().toLowerCase();
}

function matchesContact(doc: Record<string, unknown>, email: string, phone: string): boolean {
  const fields = [
    normalise(doc.email),
    normalise(doc.customerEmail),
    normalise((doc.contact as Record<string, unknown> | undefined)?.email),
    normalise((doc.userDetails as Record<string, unknown> | undefined)?.email),
  ];
  const phoneFields = [
    normalise(doc.phone),
    normalise(doc.customerPhone),
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
  const phone = rawPhone.trim().replace(/\D/g, ''); // digits only

  if (!email && !phone) {
    return NextResponse.json({ error: 'Provide email or phone' }, { status: 400 });
  }

  await connectDB();

  // Build MongoDB query
  const orClauses: Record<string, unknown>[] = [];
  if (email) {
    orClauses.push(
      { email: { $regex: new RegExp(`^${email}$`, 'i') } },
      { customerEmail: { $regex: new RegExp(`^${email}$`, 'i') } },
      { 'contact.email': { $regex: new RegExp(`^${email}$`, 'i') } },
      { 'userDetails.email': { $regex: new RegExp(`^${email}$`, 'i') } },
    );
  }
  if (phone) {
    // match last 10 digits to handle country codes
    const last10 = phone.slice(-10);
    orClauses.push(
      { phone: { $regex: last10 } },
      { customerPhone: { $regex: last10 } },
      { 'contact.phone': { $regex: last10 } },
      { 'userDetails.phone': { $regex: last10 } },
    );
  }

  const query = orClauses.length > 0 ? { $or: orClauses } : {};

  const [flightDocs, marketDocs, hotelDocs] = await Promise.all([
    FlightBooking.find(query).sort({ savedAt: -1 }).lean(),
    MarketBooking.find(query).sort({ createdAt: -1 }).lean(),
    HotelBooking.find(query).sort({ createdAt: -1 }).lean(),
  ]);

  // Fetch trip bookings from backend (best effort)
  let tripBookings: Record<string, unknown>[] = [];
  try {
    const adminToken = process.env.ADMIN_TOKEN || process.env.ADMIN_SECRET || '';
    if (adminToken) {
      const res = await fetch(`${BACKEND}/admin/bookings?limit=500`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const raw = await res.json();
        const list: Record<string, unknown>[] = Array.isArray(raw) ? raw
          : Array.isArray(raw?.data) ? raw.data
          : Array.isArray(raw?.data?.data) ? raw.data.data
          : [];
        tripBookings = list.filter(b => matchesContact(b, email, phone));
      }
    }
  } catch {
    // non-fatal — return what we have from MongoDB
  }

  const typed = (docs: Record<string, unknown>[], type: string) =>
    docs.map(b => ({ ...b, _bookingType: type }));

  const all: Record<string, unknown>[] = [
    ...typed(flightDocs as Record<string, unknown>[], 'flight'),
    ...typed(marketDocs as Record<string, unknown>[], 'market'),
    ...typed(hotelDocs as Record<string, unknown>[], 'hotel'),
    ...typed(tripBookings, 'trip'),
  ].sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
    const ta = new Date(String(a.savedAt || a.createdAt || 0)).getTime();
    const tb = new Date(String(b.savedAt || b.createdAt || 0)).getTime();
    return tb - ta;
  });

  return NextResponse.json({ data: all, total: all.length });
}
