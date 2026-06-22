import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Voucher from '@/models/Voucher';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ylootrips.com';
const EASEBUZZ_KEY = (process.env.EASEBUZZ_KEY || '').trim();
const EASEBUZZ_SALT = (process.env.EASEBUZZ_SALT || '').trim();
const EASEBUZZ_ENV = (process.env.EASEBUZZ_ENV || 'production').trim();
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'YlooTrips <hello@ylootrips.com>';

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'YLVCH-';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`voucher-purchase:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const { name, email, phone, amount, validDays = 365, destination, pdfUrl } = body as {
      name?: string; email?: string; phone?: string; amount?: number; validDays?: number; destination?: string; pdfUrl?: string;
    };

    if (!name || !email || !phone) return NextResponse.json({ error: 'Name, email and phone are required.' }, { status: 400 });
    if (!amount || amount < 500) return NextResponse.json({ error: 'Minimum voucher amount is ₹500.' }, { status: 400 });

    await connectDB();

    // Generate unique code
    let code = generateCode();
    let tries = 0;
    while (await Voucher.exists({ code }) && tries < 10) { code = generateCode(); tries++; }

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + Number(validDays));

    const txnid = `VCH-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Create voucher in pending state — activate on payment success
    await Voucher.create({
      code,
      amount: Number(amount),
      validUntil,
      status: 'cancelled', // will be set to 'active' after successful payment
      purchasedBy: { name, email, phone: phone.replace(/\D/g, '').slice(-10) || '' },
      createdBy: 'client',
      txnid,
      note: 'Pending payment',
      destination: destination || '',
      pdfUrl: pdfUrl || '',
    });

    // If Easebuzz not configured, return code directly (dev/test)
    if (!EASEBUZZ_KEY || !EASEBUZZ_SALT) {
      await Voucher.updateOne({ code }, { status: 'active', note: 'Activated (no payment gateway)' });
      return NextResponse.json({ success: true, code, txnid, paymentUrl: null });
    }

    // Initiate Easebuzz payment
    const amountStr = Number(amount).toFixed(2);
    const firstname = name.split(' ')[0] || name;
    const cleanPhone = phone.replace(/\D/g, '').slice(-10).padStart(10, '0');
    const productinfo = `YlooTrips Gift Voucher ₹${Number(amount).toLocaleString('en-IN')}`;

    const hashStr = [
      EASEBUZZ_KEY, txnid, amountStr, productinfo, firstname, email,
      txnid, code, '', '', '',
      '', '', '', '', '',
      EASEBUZZ_SALT,
    ].join('|');
    const hash = crypto.createHash('sha512').update(hashStr).digest('hex');

    const payUrl = EASEBUZZ_ENV === 'production'
      ? 'https://pay.easebuzz.in/payment/initiateLink'
      : 'https://testpay.easebuzz.in/payment/initiateLink';

    const formData = new URLSearchParams({
      key: EASEBUZZ_KEY,
      txnid,
      amount: amountStr,
      productinfo,
      firstname,
      email,
      phone: cleanPhone,
      udf1: txnid,
      udf2: code,
      udf3: '', udf4: '', udf5: '',
      hash,
      surl: `${SITE_URL}/vouchers/success?code=${encodeURIComponent(code)}&txnid=${txnid}${destination ? `&dest=${encodeURIComponent(destination)}` : ''}`,
      furl: `${SITE_URL}/vouchers?error=payment_failed`,
    });

    const ebRes = await fetch(payUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    const ebJson = await ebRes.json();

    if (ebJson.status === 1 && ebJson.data) {
      const redirectBase = EASEBUZZ_ENV === 'production' ? 'https://pay.easebuzz.in' : 'https://testpay.easebuzz.in';

      // Send notification to admin
      if (RESEND_API_KEY) {
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: [process.env.ADMIN_EMAIL || 'hello@ylootrips.com'],
            subject: `[Voucher] ${name} purchasing ₹${Number(amount).toLocaleString('en-IN')} gift voucher`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nAmount: ₹${Number(amount).toLocaleString('en-IN')}\nCode: ${code}\nValid until: ${validUntil.toLocaleDateString('en-IN')}\nTxn: ${txnid}`,
          }),
        }).catch(() => {});
      }

      return NextResponse.json({ paymentUrl: `${redirectBase}/pay/${ebJson.data}`, txnid, code });
    }

    // Payment init failed — clean up pending voucher
    await Voucher.deleteOne({ code });
    return NextResponse.json({ error: ebJson.error_desc || 'Payment gateway error. Please try again.' }, { status: 502 });
  } catch (err) {
    console.error('[vouchers/purchase]', err);
    return NextResponse.json({ error: 'Failed to initiate purchase.' }, { status: 500 });
  }
}
