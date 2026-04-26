import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateTicket } from '@/lib/leads';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, eventType, guests, preferredDate, notes } = body;

    if (!name || !phone || !eventType) {
      return NextResponse.json({ error: 'Name, phone, and event type are required.' }, { status: 400 });
    }

    const ticket = generateTicket();

    // Send admin notification (non-fatal)
    try {
      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
          to: process.env.ADMIN_EMAIL || 'hello@ylootrips.com',
          subject: `📞 Event Callback Request — ${name} · ${eventType} [${ticket}]`,
          html: `
            <h2 style="font-family:sans-serif">New Event Callback Request</h2>
            <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
              <tr><td style="padding:4px 16px 4px 0;color:#666">Ticket</td><td><strong>${ticket}</strong></td></tr>
              <tr><td style="padding:4px 16px 4px 0;color:#666">Name</td><td><strong>${name}</strong></td></tr>
              <tr><td style="padding:4px 16px 4px 0;color:#666">Phone</td><td><strong>${phone}</strong></td></tr>
              <tr><td style="padding:4px 16px 4px 0;color:#666">Email</td><td>${email || '—'}</td></tr>
              <tr><td style="padding:4px 16px 4px 0;color:#666">Event Type</td><td>${eventType}</td></tr>
              <tr><td style="padding:4px 16px 4px 0;color:#666">Guests</td><td>${guests || '—'}</td></tr>
              <tr><td style="padding:4px 16px 4px 0;color:#666">Preferred Date</td><td>${preferredDate || 'Flexible'}</td></tr>
              <tr><td style="padding:4px 16px 4px 0;color:#666">Notes</td><td>${notes || '—'}</td></tr>
            </table>
            <p style="margin-top:16px;font-family:sans-serif;font-size:13px;color:#888">Call back within 1 hour as promised.</p>
          `,
        });
      }
    } catch { /* email failure is non-fatal */ }

    return NextResponse.json({ success: true, ticket });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[events/callback]', msg);
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 });
  }
}
