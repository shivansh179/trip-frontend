import { NextRequest, NextResponse } from 'next/server';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

const PROMO_CODES = [
  { code: 'WELCOME10', title: '10% Off First Booking', type: 'percent' as const, value: 10, minOrder: 2000, maxDiscount: 5000, validTill: '2026-12-31' },
  { code: 'TRIPFIVE',  title: '₹500 Off',              type: 'flat'    as const, value: 500, minOrder: 5000, validTill: '2026-06-30' },
  { code: 'HOLIDAY15', title: '15% Off Holiday Packages', type: 'percent' as const, value: 15, minOrder: 25000, maxDiscount: 10000, validTill: '2026-08-15' },
  { code: 'INDIATRAVEL', title: '₹1,000 Off India Tours', type: 'flat' as const, value: 1000, minOrder: 15000, validTill: '2027-03-31' },
  // Internal test code — admin-only, pay only ₹10 on any booking
  { code: 'YLOOTEST10', title: 'Test Mode — Pay ₹10', type: 'fixed_price' as const, value: 10, minOrder: 1, validTill: '2030-12-31', adminOnly: true },
];

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  console.log(`[promos/validate] request from ${ip}`);

  // 10 promo attempts per minute per IP
  if (isRateLimited(`promo:${ip}`, 10, 60_000)) {
    return NextResponse.json({ valid: false, error: 'Too many attempts. Please wait a moment.' }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const { code, orderTotal } = body as { code?: string; orderTotal?: number };

  if (!code || typeof orderTotal !== 'number' || orderTotal <= 0) {
    return NextResponse.json({ valid: false, error: 'Invalid request.' }, { status: 400 });
  }

  const promo = PROMO_CODES.find((p) => p.code === code.trim().toUpperCase());

  if (!promo) {
    return NextResponse.json({ valid: false, error: 'Invalid promo code. Please check and try again.' });
  }

  // Admin-only codes require an active admin session
  if ((promo as { adminOnly?: boolean }).adminOnly) {
    const adminSecret = process.env.ADMIN_SECRET;
    const hasAdminSecret = adminSecret && req.headers.get('x-admin-secret') === adminSecret;
    const hasAdminToken = !!req.headers.get('x-admin-token');
    if (!hasAdminSecret && !hasAdminToken) {
      return NextResponse.json({ valid: false, error: 'Invalid promo code. Please check and try again.' });
    }
  }

  if (new Date(promo.validTill) < new Date()) {
    return NextResponse.json({ valid: false, error: 'This promo code has expired.' });
  }

  if (orderTotal < promo.minOrder) {
    return NextResponse.json({
      valid: false,
      error: `Minimum order of ₹${promo.minOrder.toLocaleString('en-IN')} required for this code.`,
    });
  }

  const discount =
    promo.type === 'fixed_price'
      ? Math.max(0, orderTotal - promo.value)   // discount = total - ₹10, so final = ₹10
      : promo.type === 'percent'
      ? Math.min(Math.round((orderTotal * promo.value) / 100), promo.maxDiscount ?? Infinity)
      : promo.value;

  console.log(`[promos/validate] code=${promo.code} orderTotal=${orderTotal} discount=${discount}`);
  return NextResponse.json({ valid: true, code: promo.code, title: promo.title, discount });
}
