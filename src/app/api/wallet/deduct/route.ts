import { NextRequest, NextResponse } from 'next/server';
import { deductWallet, normalizeId } from '@/lib/wallet-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
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
