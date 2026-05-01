import { NextRequest, NextResponse } from 'next/server';
import { creditCashback, normalizeId } from '@/lib/wallet-store';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (isRateLimited(`wallet-credit:${getClientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }
  try {
    const { id, bookingRef, bookingTotal, tripName } = await req.json();

    if (!id || !bookingRef || !bookingTotal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalized = normalizeId(String(id).trim());
    const credited = await creditCashback(normalized, bookingRef, Number(bookingTotal), tripName || 'your booking');

    return NextResponse.json({ success: true, credited, id: normalized });
  } catch (err) {
    console.error('[wallet/credit]', err);
    return NextResponse.json({ error: 'Failed to credit cashback' }, { status: 500 });
  }
}
