import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const EASEBUZZ_KEY = (process.env.EASEBUZZ_KEY || '').trim();
const EASEBUZZ_SALT = (process.env.EASEBUZZ_SALT || '').trim();
const EASEBUZZ_ENV = (process.env.EASEBUZZ_ENV || 'production').trim();
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ylootrips.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hello@ylootrips.com';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { flight, passengers, contact, paymentMethod } = body;

        if (!flight || !passengers?.length || !contact?.email || !contact?.phone) {
            return NextResponse.json({ error: 'Missing required booking fields' }, { status: 400 });
        }

        // Validate price
        if (!flight.price || flight.price <= 0) {
            return NextResponse.json(
                { error: 'Flight price is unavailable. Please search again or contact us.' },
                { status: 400 }
            );
        }

        const txnid = `FLT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const firstname = passengers[0].firstName || 'Traveler';
        const email = contact.email;
        const rawPhone = contact.phone.replace(/\D/g, '');
        const phone = rawPhone.length >= 10 ? rawPhone.slice(-10) : rawPhone.padStart(10, '0');
        const totalPayable = Math.round(flight.price); // integer rupees

        // Store booking reference for success handler
        const bookingSummary = {
            txnid,
            createdAt: new Date().toISOString(),
            flight,
            passengers,
            contact,
            paymentMethod,
            status: 'PENDING',
        };

        // Persist booking to local store (non-fatal)
        try {
            await fetch(`${SITE_URL}/api/admin/flight-bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(process.env.ADMIN_SECRET ? { 'x-admin-secret': process.env.ADMIN_SECRET } : {}) },
                body: JSON.stringify(bookingSummary),
            });
        } catch { /* non-fatal */ }

        // Send admin notification email (non-fatal)
        try {
            await fetch(`${SITE_URL}/api/flights/send-confirmation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'admin_notification',
                    booking: bookingSummary,
                    to: ADMIN_EMAIL,
                }),
            });
        } catch { /* non-fatal */ }

        // ── Direct Easebuzz (all payment options) ────────────────────────────
        if (EASEBUZZ_KEY && EASEBUZZ_SALT) {
            const amount = String(totalPayable.toFixed(2));
            const productinfo = `Flight ${flight.flightNum} ${flight.from}-${flight.to} ${flight.date}`;
            const udf1 = txnid;
            const udf2 = email;
            const hashStr = [
                EASEBUZZ_KEY, txnid, amount, productinfo, firstname, email,
                udf1, udf2, '', '', '',
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
                amount,
                productinfo,
                firstname,
                email,
                phone: phone || '9999999999',
                udf1,
                udf2,
                udf3: '',
                udf4: '',
                udf5: '',
                hash,
                surl: `${SITE_URL}/api/payment/success`,
                furl: `${SITE_URL}/api/payment/failure`,
            });

            const ebRes = await fetch(payUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData,
            });
            const ebJson = await ebRes.json();

            if (ebJson.status === 1 && ebJson.data) {
                const redirectBase = EASEBUZZ_ENV === 'production'
                    ? 'https://pay.easebuzz.in'
                    : 'https://testpay.easebuzz.in';
                return NextResponse.json({ paymentUrl: `${redirectBase}/pay/${ebJson.data}`, accessKey: ebJson.data, txnid });
            }

            return NextResponse.json(
                { error: ebJson.error_desc || ebJson.message || 'Payment gateway error' },
                { status: 502 }
            );
        }

        // ── Option 3: WhatsApp fallback ───────────────────────────────────────────────
        const msg = encodeURIComponent(
            `✈️ New Flight Booking Request!\n\nRoute: ${flight.from} → ${flight.to}\nFlight: ${flight.airline} ${flight.flightNum}\nDate: ${flight.date} | ${flight.dep} - ${flight.arr}\nPassengers: ${passengers.length}\n\nLead Passenger: ${firstname} ${passengers[0].lastName}\nEmail: ${email}\nPhone: ${contact.phone}\n\nTotal: ₹${totalPayable.toLocaleString('en-IN')}\nRef: ${txnid}\n\nPlease send payment link.`
        );
        return NextResponse.json({
            paymentUrl: `https://wa.me/918427831127?text=${msg}`,
            txnid,
            fallback: true,
        });
    } catch (err) {
        console.error('Flight payment initiation error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
