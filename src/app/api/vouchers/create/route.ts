import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'YLVCH-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function isAdmin(req: NextRequest): boolean {
  return !!(req.headers.get('x-admin-token') || req.headers.get('x-admin-secret'));
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { amount, validDays, recipientName, recipientEmail, recipientPhone, note, destination, pdfUrl, tripName, tripDates, hotel, inclusions } = body as {
      amount?: number; validDays?: number; recipientName?: string;
      recipientEmail?: string; recipientPhone?: string; note?: string;
      destination?: string; pdfUrl?: string;
      tripName?: string; tripDates?: string; hotel?: string; inclusions?: string;
    };

    if (!amount || amount < 100) return NextResponse.json({ error: 'Amount must be at least ₹100' }, { status: 400 });
    if (!validDays || validDays < 1) return NextResponse.json({ error: 'validDays must be at least 1' }, { status: 400 });
    if (!recipientName || !recipientEmail) return NextResponse.json({ error: 'Recipient name and email are required' }, { status: 400 });

    const firestore = db();

    // Generate unique code
    let code = generateCode();
    let tries = 0;
    while ((await firestore.collection('vouchers').doc(code).get()).exists && tries < 10) {
      code = generateCode(); tries++;
    }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Number(validDays));

    const voucher = {
      code,
      amount: Number(amount),
      validUntil: validUntil.toISOString(),
      status: 'active',
      purchasedBy: { name: recipientName, email: recipientEmail, phone: recipientPhone || '' },
      createdBy: 'admin',
      note: note || '',
      destination: destination || '',
      pdfUrl: pdfUrl || '',
      tripName: tripName || '',
      tripDates: tripDates || '',
      hotel: hotel || '',
      inclusions: inclusions || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await firestore.collection('vouchers').doc(code).set(voucher);

    return NextResponse.json({ success: true, voucher: { code, amount: voucher.amount, validUntil: voucher.validUntil } });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[vouchers/create]', msg);
    return NextResponse.json({ error: msg || 'Failed to create voucher' }, { status: 500 });
  }
}
