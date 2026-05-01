import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Disable body parsing to handle form-urlencoded data properly
export const runtime = 'nodejs';

/**
 * Verify Easebuzz response hash to ensure callback is genuine.
 * Hash format (reverse of request): key|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|salt
 */
function verifyEasebuzzHash(params: Record<string, string>): boolean {
  const key  = process.env.EASEBUZZ_KEY;
  const salt = process.env.EASEBUZZ_SALT;
  if (!key || !salt || !params.hash) return true; // skip if not configured

  // Easebuzz response hash: sha512(key|status|txnid|amount|productinfo|firstname|email|udf1..udf5|salt)
  const str = [
    key,
    params.status   || '',
    params.txnid    || '',
    params.amount   || '',
    params.productinfo || '',
    params.firstname || '',
    params.email    || '',
    params.udf1     || '',
    params.udf2     || '',
    params.udf3     || '',
    params.udf4     || '',
    params.udf5     || '',
    salt,
  ].join('|');

  const expected = crypto.createHash('sha512').update(str).digest('hex');
  return expected === params.hash;
}

export async function POST(request: NextRequest) {
  try {
    // Easebuzz sends form-urlencoded data via POST
    // Parse the raw body as form data
    const contentType = request.headers.get('content-type') || '';

    let txnid: string | null = null;
    let status: string = 'success';
    let easepayid: string | null = null;
    let hashParams: Record<string, string> = {};

    if (contentType.includes('application/x-www-form-urlencoded')) {
      // Parse form-urlencoded data
      const formData = await request.formData();
      const toStr = (v: FormDataEntryValue | null) => v?.toString() || '';
      txnid     = toStr(formData.get('txnid')) || toStr(formData.get('udf1')) || null;
      status    = toStr(formData.get('status')) || 'success';
      easepayid = toStr(formData.get('easepayid')) || null;
      // Collect all fields for HMAC verification
      for (const [k, v] of formData.entries()) hashParams[k] = v.toString();

      // Verify Easebuzz HMAC — reject tampered callbacks
      if (!verifyEasebuzzHash(hashParams)) {
        console.error('[payment/success] HMAC mismatch — possible tampered callback', { txnid, status });
        return NextResponse.redirect(new URL('/payment/failure?error=Invalid+payment+signature', request.url), { status: 303 });
      }
    } else {
      // Try to parse as JSON (fallback)
      try {
        const body = await request.json();
        txnid = body.txnid || body.udf1 || null;
        status = body.status || 'success';
        easepayid = body.easepayid || null;
      } catch {
        // If JSON parsing fails, try to get from URL search params
        const url = new URL(request.url);
        txnid = url.searchParams.get('txnid') || url.searchParams.get('udf1');
        status = url.searchParams.get('status') || 'success';
        easepayid = url.searchParams.get('easepayid');
      }
    }

    if (!txnid) {
      return NextResponse.redirect(
        new URL(`/payment/failure?error=Missing transaction ID`, request.url),
        { status: 303 }
      );
    }

    // Redirect to frontend success page with GET parameters
    const baseUrl = request.nextUrl.origin;

    // Direct flight bookings (EASEBUZZ_KEY mode) go to flight success page
    if (txnid.startsWith('FLT-')) {
      const flightSuccessUrl = new URL('/flights/booking-success', baseUrl);
      flightSuccessUrl.searchParams.set('txnid', txnid);
      flightSuccessUrl.searchParams.set('status', status);
      return NextResponse.redirect(flightSuccessUrl, { status: 303 });
    }

    // Market trip bookings
    if (txnid.startsWith('MKT-')) {
      const mktSuccessUrl = new URL('/market/booking-success', baseUrl);
      mktSuccessUrl.searchParams.set('txnid', txnid);
      mktSuccessUrl.searchParams.set('status', status);
      if (easepayid) mktSuccessUrl.searchParams.set('easepayid', easepayid);
      // Update status
      fetch(`${baseUrl}/api/admin/market-bookings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(process.env.ADMIN_SECRET ? { 'x-admin-secret': process.env.ADMIN_SECRET } : {}) },
        body: JSON.stringify({ txnid, status: 'PAID' }),
      }).catch(() => {});
      return NextResponse.redirect(mktSuccessUrl, { status: 303 });
    }

    // Hotel bookings go to hotel booking success page
    if (txnid.startsWith('HTL-')) {
      const hotelSuccessUrl = new URL('/hotels/booking-success', baseUrl);
      hotelSuccessUrl.searchParams.set('txnid', txnid);
      hotelSuccessUrl.searchParams.set('status', status);
      if (easepayid) hotelSuccessUrl.searchParams.set('easepayid', easepayid);
      return NextResponse.redirect(hotelSuccessUrl, { status: 303 });
    }

    // Backend-proxied bookings arrive with EVT- prefix — check market, hotels, flights
    if (txnid.startsWith('EVT-')) {
      // Check market bookings first
      try {
        const lookup = await fetch(`${baseUrl}/api/admin/market-bookings?evtRef=${txnid}`);
        if (lookup.ok) {
          const data = await lookup.json();
          if (data.data) {
            const mktTxnid = (data.data as Record<string, string>).txnid || txnid;
            await fetch(`${baseUrl}/api/admin/market-bookings`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ txnid: mktTxnid, status: 'PAID' }),
            }).catch(() => {});
            const mktSuccessUrl = new URL('/market/booking-success', baseUrl);
            mktSuccessUrl.searchParams.set('txnid', mktTxnid);
            mktSuccessUrl.searchParams.set('status', status);
            if (easepayid) mktSuccessUrl.searchParams.set('easepayid', easepayid);
            return NextResponse.redirect(mktSuccessUrl, { status: 303 });
          }
        }
      } catch { /* fall through */ }

      // Check hotel bookings
      try {
        const lookup = await fetch(`${baseUrl}/api/admin/hotel-bookings?evtRef=${txnid}`);
        if (lookup.ok) {
          const data = await lookup.json();
          if (data.data) {
            const hotelTxnid = (data.data as Record<string, string>).txnid || txnid;
            await fetch(`${baseUrl}/api/admin/hotel-bookings`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', ...(process.env.ADMIN_SECRET ? { 'x-admin-secret': process.env.ADMIN_SECRET } : {}) },
              body: JSON.stringify({ txnid: hotelTxnid, status: 'PAID' }),
            }).catch(() => {});
            const hotelSuccessUrl = new URL('/hotels/booking-success', baseUrl);
            hotelSuccessUrl.searchParams.set('txnid', hotelTxnid);
            hotelSuccessUrl.searchParams.set('status', status);
            if (easepayid) hotelSuccessUrl.searchParams.set('easepayid', easepayid);
            return NextResponse.redirect(hotelSuccessUrl, { status: 303 });
          }
        }
      } catch { /* fall through to flight check */ }

      // Check flight bookings
      try {
        const lookup = await fetch(`${baseUrl}/api/admin/flight-bookings?evtRef=${txnid}`);
        if (lookup.ok) {
          const data = await lookup.json();
          if (data.data) {
            const flightTxnid = (data.data as Record<string, string>).txnid || txnid;
            const flightSuccessUrl = new URL('/flights/booking-success', baseUrl);
            flightSuccessUrl.searchParams.set('txnid', flightTxnid);
            flightSuccessUrl.searchParams.set('status', status);
            await fetch(`${baseUrl}/api/admin/flight-bookings`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', ...(process.env.ADMIN_SECRET ? { 'x-admin-secret': process.env.ADMIN_SECRET } : {}) },
              body: JSON.stringify({ txnid: flightTxnid, status: 'PAID' }),
            }).catch(() => {});
            return NextResponse.redirect(flightSuccessUrl, { status: 303 });
          }
        }
      } catch { /* fall through to regular event success */ }
    }

    const successUrl = new URL(`/payment/success`, baseUrl);
    successUrl.searchParams.set('txnid', txnid);
    successUrl.searchParams.set('status', status);

    // Preserve other important fields as query params
    if (easepayid) {
      successUrl.searchParams.set('easepayid', easepayid);
    }

    return NextResponse.redirect(successUrl, { status: 303 });
  } catch {
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(
      new URL(`/payment/failure?error=Failed to process payment response`, baseUrl),
      { status: 303 }
    );
  }
}

// Also handle GET requests (fallback)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const txnid = searchParams.get('txnid');
  const status = searchParams.get('status') || 'success';

  if (!txnid) {
    return NextResponse.redirect(
      new URL('/payment/failure?error=Missing transaction ID', request.url),
      { status: 303 }
    );
  }

  // Redirect to frontend success page
  const successUrl = new URL('/payment/success', request.url);
  successUrl.searchParams.set('txnid', txnid);
  successUrl.searchParams.set('status', status);

  return NextResponse.redirect(successUrl, { status: 303 });
}
