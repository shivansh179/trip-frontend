import { NextRequest, NextResponse } from 'next/server';
import { creditCashback, normalizeId } from '@/lib/wallet-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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
