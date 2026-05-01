import { NextRequest, NextResponse } from 'next/server';
import { deductWallet, normalizeId } from '@/lib/wallet-store';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (isRateLimited(`wallet-deduct:${getClientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }
  try {
    const { id, amount, bookingRef } = await req.json();

    if (!id || !amount || !bookingRef) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalized = normalizeId(String(id).trim());
    const result = await deductWallet(normalized, Number(amount), bookingRef);

    if (!result.success) {
      return NextResponse.json({ error: 'Insufficient balance or wallet unavailable' }, { status: 400 });
    }

    return NextResponse.json({ success: true, newBalance: result.newBalance, id: normalized });
  } catch (err) {
    console.error('[wallet/deduct]', err);
    return NextResponse.json({ error: 'Failed to deduct wallet' }, { status: 500 });
  }
}
