import { NextRequest, NextResponse } from 'next/server';
import { creditCashback, normalizeId } from '@/lib/wallet-store';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

// Known valid booking reference prefixes — fake refs won't match
const VALID_REF_PREFIXES = ['TXN-', 'BOOK-', 'EVT-', 'FLT-', 'HTL-', 'MKT-', 'PART-'];

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // Strict rate limit: 3 credits per IP per hour (real users only book a few trips)
  if (isRateLimited(`wallet-credit:${ip}`, 3, 3_600_000)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  try {
    const { id, bookingRef, bookingTotal, tripName } = await req.json();

    if (!id || !bookingRef || !bookingTotal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ref = String(bookingRef).trim();
    const total = Number(bookingTotal);

    // Validate bookingRef format — must start with a known prefix
    const validPrefix = VALID_REF_PREFIXES.some((p) => ref.startsWith(p));
    if (!validPrefix || ref.length > 80) {
      console.warn(`[wallet/credit] Invalid bookingRef format from ${ip}: ${ref.slice(0, 30)}`);
      return NextResponse.json({ error: 'Invalid booking reference' }, { status: 400 });
    }

    // Cap bookingTotal to prevent inflated cashback (max realistic trip = ₹5,00,000)
    if (total <= 0 || total > 500_000) {
      return NextResponse.json({ error: 'Invalid booking total' }, { status: 400 });
    }

    const normalized = normalizeId(String(id).trim());
    const credited = await creditCashback(normalized, ref, total, tripName || 'your booking');

    return NextResponse.json({ success: true, credited, id: normalized });
  } catch (err) {
    console.error('[wallet/credit]', err);
    return NextResponse.json({ error: 'Failed to credit cashback' }, { status: 500 });
  }
}
