import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ylootrips.com';
const EASEBUZZ_KEY = (process.env.EASEBUZZ_KEY || '').trim();
const EASEBUZZ_SALT = (process.env.EASEBUZZ_SALT || '').trim();
const EASEBUZZ_ENV = (process.env.EASEBUZZ_ENV || 'production').trim();
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'YlooTrips <hello@ylootrips.com>';

function isAdmin(req: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (secret && req.headers.get('x-admin-secret') === secret) return true;
  if (req.headers.get('x-admin-token')) return true;
  return false;
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { clientName, email, phone, amount, description, pdfUrl, note, sendEmail } = body as {
      clientName?: string;
      email?: string;
      phone?: string;
      amount?: number;
      description?: string;
      pdfUrl?: string;
      note?: string;
      sendEmail?: boolean;
    };

    if (!clientName || !email || !phone) {
      return NextResponse.json({ error: 'Name, email and phone are required.' }, { status: 400 });
    }
    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum amount is ₹100.' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: 'Description / purpose is required.' }, { status: 400 });
    }

    const txnid = `ADV-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const amountStr = Number(amount).toFixed(2);
    const firstname = clientName.split(' ')[0] || clientName;
    const cleanPhone = phone.replace(/\D/g, '').slice(-10).padStart(10, '0');
    const productinfo = description.slice(0, 100);

    const receiptBase = `${SITE_URL}/payment/receipt?txnid=${txnid}&name=${encodeURIComponent(clientName)}&amount=${amount}&desc=${encodeURIComponent(description)}`;

    // If Easebuzz not configured, return a direct receipt link (dev/test)
    if (!EASEBUZZ_KEY || !EASEBUZZ_SALT) {
      return NextResponse.json({ success: true, paymentUrl: receiptBase, txnid });
    }

    const surl = `${receiptBase}${pdfUrl ? `&pdf=${encodeURIComponent(pdfUrl)}` : ''}`;
    const furl = `${SITE_URL}/payment/receipt?txnid=${txnid}&error=1`;

    const hashStr = [
      EASEBUZZ_KEY, txnid, amountStr, productinfo, firstname, email,
      txnid, pdfUrl || '', note || '', '', '',
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
      udf2: pdfUrl || '',
      udf3: note || '',
      udf4: '', udf5: '',
      hash,
      surl,
      furl,
    });

    const ebRes = await fetch(payUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });
    const ebJson = await ebRes.json();

    if (ebJson.status === 1 && ebJson.data) {
      const redirectBase = EASEBUZZ_ENV === 'production' ? 'https://pay.easebuzz.in' : 'https://testpay.easebuzz.in';
      const paymentUrl = `${redirectBase}/pay/${ebJson.data}`;

      // Optionally email the client
      if (sendEmail && RESEND_API_KEY) {
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: EMAIL_FROM,
            to: [email],
            subject: `Payment Request from YlooTrips — Rs.${Number(amount).toLocaleString('en-IN')}`,
            html: `
              <div style="font-family:sans-serif;max-width:540px;margin:0 auto;padding:28px;background:#fff;">
                <h2 style="color:#1c1c1c;margin:0 0 4px;">Payment Request</h2>
                <p style="color:#666;margin:0 0 20px;font-size:14px;">from YlooTrips</p>
                <p style="margin:0 0 16px;">Hi ${clientName},</p>
                <p style="margin:0 0 20px;color:#555;">Please complete your payment for the following:</p>
                <div style="background:#f5f0e8;border-radius:12px;padding:20px 24px;margin:0 0 24px;">
                  <p style="margin:0 0 6px;font-size:15px;font-weight:600;color:#1c1c1c;">${description}</p>
                  <p style="margin:0;font-size:26px;font-weight:bold;color:#1c1c1c;">Rs.${Number(amount).toLocaleString('en-IN')}</p>
                  ${note ? `<p style="margin:10px 0 0;font-size:13px;color:#666;">${note}</p>` : ''}
                </div>
                <a href="${paymentUrl}" style="display:inline-block;background:#1c1c1c;color:#fff;padding:14px 32px;border-radius:10px;font-weight:bold;text-decoration:none;font-size:15px;margin-bottom:20px;">Pay Now</a>
                ${pdfUrl ? `<p style="margin:16px 0 0;font-size:13px;"><a href="${pdfUrl}" style="color:#c9a96e;text-decoration:none;">View Itinerary / Document</a></p>` : ''}
                <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
                <p style="font-size:12px;color:#999;margin:0;">This payment link was sent to you by YlooTrips. For help, contact us at hello@ylootrips.com or WhatsApp +91 84278 31127.</p>
              </div>
            `,
          }),
        }).catch(() => {});
      }

      return NextResponse.json({ success: true, paymentUrl, txnid });
    }

    return NextResponse.json({ error: ebJson.error_desc || 'Payment gateway error. Please try again.' }, { status: 502 });
  } catch (err) {
    console.error('[admin/payment-link]', err);
    return NextResponse.json({ error: 'Failed to generate payment link.' }, { status: 500 });
  }
}
