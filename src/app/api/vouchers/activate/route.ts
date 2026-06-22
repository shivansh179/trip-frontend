import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Voucher from '@/models/Voucher';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'YlooTrips <hello@ylootrips.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ylootrips.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, txnid } = body as { code?: string; txnid?: string };

    if (!code || !txnid) return NextResponse.json({ error: 'Code and txnid required.' }, { status: 400 });

    await connectDB();
    const voucher = await Voucher.findOneAndUpdate(
      { code: code.trim().toUpperCase(), txnid, status: 'cancelled' },
      { $set: { status: 'active', note: `Activated after payment ${txnid}` } },
      { new: true }
    );

    if (!voucher) {
      // Already activated or invalid
      const existing = await Voucher.findOne({ code: code.trim().toUpperCase() });
      if (existing?.status === 'active') return NextResponse.json({ success: true, already: true, amount: existing.amount, validUntil: existing.validUntil, destination: existing.destination || '', pdfUrl: existing.pdfUrl || '' });
      return NextResponse.json({ error: 'Voucher not found or already processed.' }, { status: 404 });
    }

    // Send confirmation email to buyer
    if (RESEND_API_KEY) {
      const expiryStr = new Date(voucher.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [voucher.purchasedBy.email],
          subject: `Your YlooTrips Gift Voucher — ${voucher.code}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
              <h2 style="color:#1c1c1c;">Your Gift Voucher is Ready! 🎁</h2>
              <p>Hi ${voucher.purchasedBy.name},</p>
              <p>Your YlooTrips gift voucher has been successfully created. Use it when booking any trip!</p>
              <div style="background:#f5f0e8;border:2px dashed #c9a96e;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
                <p style="font-size:13px;color:#666;margin:0 0 8px;">Your Voucher Code</p>
                <p style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#1c1c1c;margin:0;">${voucher.code}</p>
                <p style="font-size:14px;color:#666;margin:8px 0 0;">Valid for ₹${voucher.amount.toLocaleString('en-IN')} · Expires ${expiryStr}</p>
              </div>
              <p style="font-size:14px;color:#555;">To use your voucher, enter the code at checkout on any booking at <a href="${SITE_URL}/trips">${SITE_URL}/trips</a></p>
              <p style="font-size:12px;color:#999;margin-top:24px;">This voucher is non-transferable and can only be used once. Contact us at hello@ylootrips.com for any assistance.</p>
            </div>
          `,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, amount: voucher.amount, validUntil: voucher.validUntil, destination: voucher.destination || '', pdfUrl: voucher.pdfUrl || '' });
  } catch (err) {
    console.error('[vouchers/activate]', err);
    return NextResponse.json({ error: 'Failed to activate voucher.' }, { status: 500 });
  }
}
