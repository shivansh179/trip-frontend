/**
 * AI Call Request — triggers Vapi.ai outbound call to the customer
 *
 * Setup:
 * 1. Sign up at https://vapi.ai
 * 2. Add a phone number (supports Twilio numbers)
 * 3. Run GET /api/calls/setup-assistant once to create the AI assistant
 * 4. Add env vars: VAPI_API_KEY, VAPI_PHONE_NUMBER_ID, VAPI_ASSISTANT_ID
 *
 * Flow: Customer fills form → POST here → Vapi dials customer → AI call
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface CallRequest {
  name: string;
  phone: string;        // E.164 format preferred, e.g. +919876543210
  query?: string;       // What the call is about
  preferredTime?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, phone, query, preferredTime }: CallRequest = await req.json();

    if (!name || !phone) {
      return NextResponse.json({ error: 'name and phone are required' }, { status: 400 });
    }

    // Normalize phone to E.164
    const normalized = phone.replace(/\s+/g, '').replace(/[^+\d]/g, '');
    const e164 = normalized.startsWith('+') ? normalized : `+91${normalized}`;

    const vapiKey = process.env.VAPI_API_KEY;
    const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
    const assistantId = process.env.VAPI_ASSISTANT_ID;

    if (!vapiKey || !phoneNumberId || !assistantId) {
      // Vapi not configured — fall back to admin email notification
      await notifyAdminByEmail({ name, phone: e164, query, preferredTime });
      return NextResponse.json({
        success: true,
        message: 'callback_scheduled',
        note: 'AI calling not configured — admin notified to call manually',
      });
    }

    // Build assistant overrides with customer context
    const assistantOverrides = {
      firstMessage: `Hi ${name}! This is Yloo, your AI travel assistant from YlooTrips. ${
        query ? `I understand you're interested in ${query}. ` : ''
      }How can I help you plan your perfect trip today?`,
      variableValues: {
        customerName: name,
        customerQuery: query || 'travel planning',
      },
    };

    // Trigger Vapi outbound call
    const vapiRes = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vapiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumberId,
        assistantId,
        assistantOverrides,
        customer: {
          number: e164,
          name,
        },
        metadata: {
          customerName: name,
          customerPhone: e164,
          query: query || '',
          requestedAt: new Date().toISOString(),
        },
      }),
    });

    if (!vapiRes.ok) {
      const errText = await vapiRes.text();
      console.error('Vapi error:', errText);
      // Fall back to admin email
      await notifyAdminByEmail({ name, phone: e164, query, preferredTime });
      return NextResponse.json({
        success: true,
        message: 'callback_scheduled',
        note: 'Vapi error — admin notified to call manually',
      });
    }

    const vapiData = await vapiRes.json();

    // Notify admin that a call was placed
    await notifyAdminByEmail({ name, phone: e164, query, preferredTime, callId: vapiData.id });

    return NextResponse.json({
      success: true,
      message: 'call_initiated',
      callId: vapiData.id,
    });
  } catch (err) {
    console.error('Call request error:', err);
    return NextResponse.json({ error: 'Failed to schedule call' }, { status: 500 });
  }
}

async function notifyAdminByEmail(info: {
  name: string;
  phone: string;
  query?: string;
  preferredTime?: string;
  callId?: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const subject = info.callId
    ? `🤖 AI Call Placed — ${info.name} (${info.phone})`
    : `📞 Call Back Request — ${info.name} (${info.phone})`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: [adminEmail],
    subject,
    html: `
      <p><strong>Name:</strong> ${info.name}</p>
      <p><strong>Phone:</strong> ${info.phone}</p>
      ${info.query ? `<p><strong>Query:</strong> ${info.query}</p>` : ''}
      ${info.preferredTime ? `<p><strong>Preferred Time:</strong> ${info.preferredTime}</p>` : ''}
      ${info.callId ? `<p><strong>Vapi Call ID:</strong> ${info.callId}</p>` : ''}
      <p><strong>Requested At:</strong> ${new Date().toLocaleString('en-IN')}</p>
      ${!info.callId ? '<p style="color:red"><strong>AI calling not configured — please call this customer manually.</strong></p>' : ''}
    `,
  }).catch(() => {});
}
