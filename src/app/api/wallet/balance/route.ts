import { NextRequest, NextResponse } from 'next/server';
import { getWallet, normalizeId } from '@/lib/wallet-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id || id.trim().length < 5) {
    return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
  }

  const normalized = normalizeId(id.trim());
  const wallet = await getWallet(normalized);
  return NextResponse.json({ id: normalized, ...wallet });
}
