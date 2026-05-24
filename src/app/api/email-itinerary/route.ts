import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { to, itinerary } = await req.json();

    if (!to || !itinerary) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const daysHtml = (itinerary.days || []).map((day: {
      day: number;
      title: string;
      theme: string;
      activities: { time: string; activity: string; details: string; tip?: string }[];
    }) => `
      <div style="margin-bottom:24px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
          <span style="display:inline-block;width:28px;height:28px;background:#c8a97e;color:#1a1714;font-size:12px;font-weight:bold;text-align:center;line-height:28px;border-radius:50%;font-family:Arial,sans-serif;">${day.day}</span>
          <div>
            <p style="margin:0;font-size:15px;font-weight:bold;color:#1a1714;font-family:Arial,sans-serif;">${day.title}</p>
            <p style="margin:0;font-size:11px;color:#999;font-family:Arial,sans-serif;">${day.theme}</p>
          </div>
        </div>
        ${day.activities.map((act) => `
          <div style="margin-left:40px;margin-bottom:14px;padding:12px 14px;background:#f9f7f4;border-left:3px solid #c8a97e;">
            <p style="margin:0 0 4px;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#c8a97e;font-family:Arial,sans-serif;">${act.time}</p>
            <p style="margin:0 0 4px;font-size:13px;font-weight:bold;color:#1a1714;font-family:Arial,sans-serif;">${act.activity}</p>
            <p style="margin:0;font-size:12px;color:#666;line-height:1.6;font-family:Arial,sans-serif;">${act.details}</p>
            ${act.tip ? `<p style="margin:8px 0 0;font-size:11px;color:#c8a97e;font-family:Arial,sans-serif;">💡 ${act.tip}</p>` : ''}
          </div>
        `).join('')}
      </div>
    `).join('');

    const highlightsHtml = (itinerary.highlights || []).map((h: string) =>
      `<span style="display:inline-block;margin:3px;padding:4px 10px;background:#f0ede8;border:1px solid #e0d9ce;border-radius:20px;font-size:12px;color:#1a1714;font-family:Arial,sans-serif;">${h}</span>`
    ).join('');

    const packingHtml = (itinerary.packingTips || []).map((tip: string) =>
      `<li style="margin-bottom:6px;font-size:12px;color:#555;line-height:1.5;font-family:Arial,sans-serif;">${tip}</li>`
    ).join('');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Trip Plan — ${itinerary.destination} | YlooTrips</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EA;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1a1714;padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:26px;font-weight:bold;color:#F4F1EA;letter-spacing:-1px;">YlooTrips</p>
              <p style="margin:6px 0 0;font-size:10px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;">AI Trip Planner</p>
            </td>
          </tr>

          <!-- Destination Banner -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1205,#2a1e0a);padding:28px 40px;">
              <p style="margin:0 0 6px;font-size:11px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">Your personalised trip plan</p>
              <h1 style="margin:0 0 10px;font-size:30px;color:#ffffff;font-weight:bold;">${itinerary.destination}</h1>
              <div style="display:flex;gap:20px;flex-wrap:wrap;">
                <span style="font-size:12px;color:rgba(255,255,255,0.6);font-family:Arial,sans-serif;">📅 ${itinerary.duration}</span>
                <span style="font-size:12px;color:rgba(255,255,255,0.6);font-family:Arial,sans-serif;">💰 ${itinerary.estimatedBudget}</span>
                <span style="font-size:12px;color:rgba(255,255,255,0.6);font-family:Arial,sans-serif;">🌤 Best time: ${itinerary.bestTimeToVisit}</span>
                <span style="font-size:12px;color:rgba(255,255,255,0.6);font-family:Arial,sans-serif;">✈️ ${itinerary.travelStyle}</span>
              </div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="background:#ffffff;padding:40px;">

              <!-- Highlights -->
              ${highlightsHtml ? `
              <div style="margin-bottom:32px;">
                <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#c8a97e;font-family:Arial,sans-serif;">✨ Trip Highlights</p>
                <div>${highlightsHtml}</div>
              </div>` : ''}

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #eee;margin-bottom:32px;" />

              <!-- Day by Day -->
              <p style="margin:0 0 20px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#c8a97e;font-family:Arial,sans-serif;">📍 Day-by-Day Itinerary</p>
              ${daysHtml}

              ${itinerary.localInsights ? `
              <!-- Local Insight -->
              <div style="margin-top:8px;margin-bottom:28px;padding:16px 20px;background:#fffbf5;border-left:4px solid #c8a97e;">
                <p style="margin:0 0 6px;font-size:10px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;color:#c8a97e;font-family:Arial,sans-serif;">💡 Local Insight</p>
                <p style="margin:0;font-size:13px;color:#555;line-height:1.7;font-family:Arial,sans-serif;">${itinerary.localInsights}</p>
              </div>` : ''}

              ${packingHtml ? `
              <!-- Packing Tips -->
              <div style="margin-bottom:32px;padding:20px 24px;background:#f9f7f4;border-radius:4px;">
                <p style="margin:0 0 12px;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#888;font-family:Arial,sans-serif;">🎒 What to Pack</p>
                <ul style="margin:0;padding-left:18px;">${packingHtml}</ul>
              </div>` : ''}

              <!-- Book CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1714;border-radius:8px;margin-top:8px;">
                <tr>
                  <td style="padding:28px 32px;text-align:center;">
                    <p style="margin:0 0 6px;font-size:18px;font-weight:bold;color:#ffffff;font-family:Arial,sans-serif;">Ready to make this trip happen?</p>
                    <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,0.6);font-family:Arial,sans-serif;">Our travel experts will handle all bookings, hotels, and transfers for you.</p>
                    <a href="https://wa.me/918427831127?text=Hi!%20I%20received%20my%20trip%20plan%20for%20${encodeURIComponent(itinerary.destination)}%20and%20want%20to%20book%20it."
                       style="display:inline-block;background:#c8a97e;color:#1a1714;text-decoration:none;padding:12px 32px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:2px;font-family:Arial,sans-serif;border-radius:4px;">
                      WhatsApp to Book
                    </a>
                    <p style="margin:12px 0 0;font-size:11px;color:rgba(255,255,255,0.35);font-family:Arial,sans-serif;">Free consultation · No advance payment required</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#1a1714;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:10px;color:#c8a97e;text-transform:uppercase;letter-spacing:3px;font-family:Arial,sans-serif;">YlooTrips</p>
              <p style="margin:0;font-size:11px;color:#555;font-family:Arial,sans-serif;">
                <a href="https://www.ylootrips.com" style="color:#c8a97e;text-decoration:none;">www.ylootrips.com</a> · hello@ylootrips.com · +91 84278 31127
              </p>
              <p style="margin:8px 0 0;font-size:10px;color:#444;font-family:Arial,sans-serif;">New Delhi, India · MSME: UDYAM-HR-05-0141455</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'hello@ylootrips.com',
      to: [to],
      subject: `Your ${itinerary.destination} Trip Plan — ${itinerary.duration} | YlooTrips`,
      html,
    });

    if (error) {
      console.error('[email-itinerary] Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Notify admin
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      try {
        await resend.emails.send({
          from: process.env.EMAIL_FROM || 'hello@ylootrips.com',
          to: [adminEmail],
          subject: `🗺️ Trip plan emailed: ${itinerary.destination} → ${to}`,
          html: `<p>A trip plan for <strong>${itinerary.destination}</strong> (${itinerary.duration}) was emailed to <strong>${to}</strong>.</p>`,
        });
      } catch { /* non-fatal */ }
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('[email-itinerary] Error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
