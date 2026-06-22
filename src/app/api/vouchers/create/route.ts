import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'YLVCH-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token') || req.headers.get('x-admin-secret');
  const secret = process.env.ADMIN_SECRET;
  return !!secret && token === secret;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { amount, validDays, recipientName, recipientEmail, recipientPhone, note } = body as {
      amount?: number;
      validDays?: number;
      recipientName?: string;
      recipientEmail?: string;
      recipientPhone?: string;
      note?: string;
    };

    if (!amount || amount < 100) return NextResponse.json({ error: 'Amount must be at least ₹100' }, { status: 400 });
    if (!validDays || validDays < 1) return NextResponse.json({ error: 'validDays must be at least 1' }, { status: 400 });
    if (!recipientName || !recipientEmail) return NextResponse.json({ error: 'Recipient name and email are required' }, { status: 400 });

    await connectDB();

    // Generate unique code
    let code = generateCode();
    let tries = 0;
    while (await Voucher.exists({ code }) && tries < 10) { code = generateCode(); tries++; }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Number(validDays));

    const voucher = await Voucher.create({
      code,
      amount: Number(amount),
      validUntil,
      status: 'active',
      purchasedBy: { name: recipientName, email: recipientEmail, phone: recipientPhone || '' },
      createdBy: 'admin',
      note: note || '',
    });

    return NextResponse.json({ success: true, voucher: { code: voucher.code, amount: voucher.amount, validUntil: voucher.validUntil } });
  } catch (err) {
    console.error('[vouchers/create]', err);
    return NextResponse.json({ error: 'Failed to create voucher' }, { status: 500 });
  }
}
