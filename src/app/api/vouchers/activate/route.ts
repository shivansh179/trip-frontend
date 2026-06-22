import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'YlooTrips <hello@ylootrips.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ylootrips.com';

export async function POST(req: NextRequest) {
  try {
    const { code, txnid } = await req.json() as { code?: string; txnid?: string };
    if (!code || !txnid) return NextResponse.json({ error: 'Code and txnid required.' }, { status: 400 });

    const docRef = db().collection('vouchers').doc(code.trim().toUpperCase());
    const snap = await docRef.get();

    if (!snap.exists) return NextResponse.json({ error: 'Voucher not found.' }, { status: 404 });
    const v = snap.data()!;

    // Already active
    if (v.status === 'active') {
      return NextResponse.json({ success: true, already: true, amount: v.amount, validUntil: v.validUntil, destination: v.destination || '', pdfUrl: v.pdfUrl || '' });
    }

    // Must be cancelled (pending payment) and matching txnid
    if (v.status !== 'cancelled' || v.txnid !== txnid) {
      return NextResponse.json({ error: 'Voucher not found or already processed.' }, { status: 404 });
    }

    await docRef.update({ status: 'active', note: `Activated after payment ${txnid}`, updatedAt: new Date().toISOString() });

    // Send confirmation email
    if (RESEND_API_KEY) {
      const expiryStr = new Date(v.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: [v.purchasedBy.email],
          subject: `Your YlooTrips Gift Voucher — ${v.code}`,
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;">
              <h2 style="color:#1c1c1c;">Your Gift Voucher is Ready! 🎁</h2>
              <p>Hi ${v.purchasedBy.name},</p>
              <p>Your YlooTrips gift voucher has been successfully created. Use it when booking any trip!</p>
              <div style="background:#f5f0e8;border:2px dashed #c9a96e;border-radius:12px;padding:20px;text-align:center;margin:24px 0;">
                <p style="font-size:13px;color:#666;margin:0 0 8px;">Your Voucher Code</p>
                <p style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#1c1c1c;margin:0;">${v.code}</p>
                <p style="font-size:14px;color:#666;margin:8px 0 0;">Valid for ₹${v.amount.toLocaleString('en-IN')} · Expires ${expiryStr}</p>
              </div>
              <p style="font-size:14px;color:#555;">To use your voucher, enter the code at checkout on any booking at <a href="${SITE_URL}/trips">${SITE_URL}/trips</a></p>
              <p style="font-size:12px;color:#999;margin-top:24px;">This voucher is non-transferable and can only be used once. Contact us at hello@ylootrips.com for any assistance.</p>
            </div>
          `,
        }),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true, amount: v.amount, validUntil: v.validUntil, destination: v.destination || '', pdfUrl: v.pdfUrl || '' });
  } catch (err) {
    console.error('[vouchers/activate]', err);
    return NextResponse.json({ error: 'Failed to activate voucher.' }, { status: 500 });
  }
}
