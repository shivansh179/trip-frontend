import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { isRateLimited, getClientIp } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (isRateLimited(`careers:${ip}`, 3, 300_000)) { // 3 per 5 min
    return NextResponse.json({ error: 'Too many applications. Please wait before trying again.' }, { status: 429 });
  }
  try {
    const { name, email, phone, role, experience, message } = await req.json();

    if (!name || !email || !role || !message) {
      return NextResponse.json({ error: 'Please fill all required fields.' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.ADMIN_EMAIL || 'hello@ylootrips.com',
        replyTo: email,
        subject: `📋 New Job Application — ${role} · ${name}`,
        html: `
<!DOCTYPE html><html><body style="font-family:-apple-system,sans-serif;background:#f3f4f6;margin:0;padding:32px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;">
  <div style="background:#111827;padding:24px 28px;">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#9ca3af;text-transform:uppercase;margin-bottom:4px;">YlooTrips — Job Application</div>
    <div style="font-size:20px;font-weight:700;color:#fff;">${role}</div>
  </div>
  <div style="padding:24px 28px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b7280;width:120px;">Name</td><td style="padding:6px 0;font-weight:600;color:#111827;">${name}</td></tr>
      <tr><td style="padding:6px 0;color:#6b7280;">Email</td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#6366f1;">${email}</a></td></tr>
      ${phone ? `<tr><td style="padding:6px 0;color:#6b7280;">Phone</td><td style="padding:6px 0;color:#111827;">${phone}</td></tr>` : ''}
      ${experience ? `<tr><td style="padding:6px 0;color:#6b7280;">Experience</td><td style="padding:6px 0;color:#111827;">${experience}</td></tr>` : ''}
    </table>
    <div style="margin-top:16px;padding:14px;background:#f9fafb;border-radius:8px;border-left:3px solid #6366f1;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:6px;">Cover Message</div>
      <div style="font-size:14px;color:#374151;line-height:1.6;">${message.replace(/\n/g, '<br>')}</div>
    </div>
    <div style="margin-top:20px;padding:10px 14px;background:#fffbeb;border-radius:6px;font-size:12px;color:#92400e;">
      💡 Reply directly to this email to respond to the applicant.
    </div>
  </div>
</div>
</body></html>`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[careers/apply]', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
