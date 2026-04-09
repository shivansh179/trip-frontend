/**
 * Vapi.ai Webhook Handler
 * Receives call events: call-started, call-ended, end-of-call-report
 *
 * Set this URL in Vapi dashboard → Phone Numbers → Webhook URL:
 *   https://yourdomain.com/api/calls/vapi-webhook
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    const { type, call } = event;

    console.log(`[Vapi] Event: ${type}`, call?.id);

    switch (type) {
      case 'call-started':
        // Call is ringing / picked up
        console.log(`[Vapi] Call started: ${call?.id} → ${call?.customer?.number}`);
        break;

      case 'end-of-call-report':
      case 'call-ended': {
        const summary = event.summary || call?.summary || '';
        const transcript = event.transcript || call?.transcript || '';
        const duration = call?.endedAt && call?.startedAt
          ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
          : null;
        const customerNumber = call?.customer?.number || 'Unknown';
        const customerName = call?.customer?.name || call?.metadata?.customerName || 'Unknown';
        const endedReason = call?.endedReason || 'completed';

        // Send call summary to admin
        await sendCallSummaryToAdmin({
          callId: call?.id,
          customerName,
          customerNumber,
          duration,
          summary,
          transcript,
          endedReason,
          query: call?.metadata?.customerQuery || '',
        });
        break;
      }

      case 'function-call':
        // If you add custom Vapi functions, handle them here
        console.log('[Vapi] Function call:', event.functionCall?.name);
        return NextResponse.json({ result: 'acknowledged' });

      default:
        console.log(`[Vapi] Unhandled event type: ${type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Vapi webhook error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

async function sendCallSummaryToAdmin(info: {
  callId?: string;
  customerName: string;
  customerNumber: string;
  duration: number | null;
  summary: string;
  transcript: string;
  endedReason: string;
  query: string;
}) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !process.env.RESEND_API_KEY) return;

  const resend = new Resend(process.env.RESEND_API_KEY);
  const durationStr = info.duration ? `${Math.floor(info.duration / 60)}m ${info.duration % 60}s` : 'N/A';

  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
    to: [adminEmail],
    subject: `📞 AI Call Ended — ${info.customerName} (${info.customerNumber})`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;">
  <div style="background:#1a1714;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="color:#c8a97e;margin:0;">📞 AI Call Summary</h2>
    <p style="color:#888;margin:4px 0 0;font-size:13px;">YlooTrips AI Voice Agent</p>
  </div>
  <div style="background:white;padding:24px;border-radius:0 0 8px 8px;border:1px solid #eee;">
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <tr>
        <td style="padding:8px 0;color:#888;font-size:13px;width:140px;">Customer</td>
        <td style="padding:8px 0;font-weight:bold;">${info.customerName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;font-size:13px;">Phone</td>
        <td style="padding:8px 0;">${info.customerNumber}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;font-size:13px;">Duration</td>
        <td style="padding:8px 0;">${durationStr}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#888;font-size:13px;">Ended Reason</td>
        <td style="padding:8px 0;">${info.endedReason}</td>
      </tr>
      ${info.query ? `<tr>
        <td style="padding:8px 0;color:#888;font-size:13px;">Initial Query</td>
        <td style="padding:8px 0;">${info.query}</td>
      </tr>` : ''}
    </table>

    ${info.summary ? `
    <div style="background:#f0f9f0;border-left:4px solid #22c55e;padding:16px;border-radius:4px;margin-bottom:16px;">
      <p style="margin:0 0 8px;font-weight:bold;color:#15803d;">AI Summary</p>
      <p style="margin:0;color:#333;font-size:14px;line-height:1.6;">${info.summary}</p>
    </div>` : ''}

    ${info.transcript ? `
    <details style="margin-top:16px;">
      <summary style="cursor:pointer;font-weight:bold;color:#1a1714;margin-bottom:8px;">View Full Transcript</summary>
      <pre style="background:#f5f5f5;padding:16px;border-radius:4px;font-size:12px;white-space:pre-wrap;overflow-wrap:break-word;max-height:400px;overflow-y:auto;">${info.transcript}</pre>
    </details>` : ''}

    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;">
      <p style="margin:0;font-size:12px;color:#aaa;">Call ID: ${info.callId || 'N/A'} · ${new Date().toLocaleString('en-IN')}</p>
    </div>
  </div>
</body>
</html>`,
  }).catch((e) => console.error('Call summary email failed:', e));
}
