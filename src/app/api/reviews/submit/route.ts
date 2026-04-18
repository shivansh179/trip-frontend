import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, country, trip, rating, text, avatarUrl, tripPhotoUrl } = body;

    if (!name || !email || !country || !trip || !rating || !text) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }
    if (text.length > 1000) {
      return NextResponse.json({ error: 'Review too long (max 1000 characters).' }, { status: 400 });
    }

    const MAX_B64 = 1_500_000;
    const safeAvatar = avatarUrl && avatarUrl.length <= MAX_B64 ? avatarUrl : undefined;
    const safeTripPhoto = tripPhotoUrl && tripPhotoUrl.length <= MAX_B64 ? tripPhotoUrl : undefined;

    let savedToDb = false;
    let reviewId: string | undefined;

    // Try MongoDB if configured
    if (process.env.MONGODB_URI) {
      try {
        const { connectDB } = await import('@/lib/mongodb');
        const { default: Review } = await import('@/models/Review');
        await connectDB();
        const review = await Review.create({
          name, email, phone, country, trip, rating: Number(rating), text,
          ...(safeAvatar ? { avatarUrl: safeAvatar } : {}),
          ...(safeTripPhoto ? { tripPhotoUrl: safeTripPhoto } : {}),
        });
        savedToDb = true;
        reviewId = review._id?.toString();
      } catch (dbErr) {
        console.error('[review/submit] MongoDB error:', dbErr instanceof Error ? dbErr.message : dbErr);
        // Fall through to email-only path
      }
    }

    // Always send admin email (acts as backup record if DB is down)
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ylootrips.com'}/admin/reviews`;
    try {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
        to: process.env.ADMIN_EMAIL || 'hello@ylootrips.com',
        subject: `⭐ New Review${savedToDb ? '' : ' [DB BACKUP]'} — ${name} (${rating}/5)`,
        html: `
          <h2>New client review submitted${savedToDb ? '' : ' <span style="color:red">[NOT saved to DB — add to admin manually]</span>'}</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
            <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${name}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${email}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Phone</td><td>${phone || '—'}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Country</td><td>${country}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Trip</td><td>${trip}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Rating</td><td>${'★'.repeat(Number(rating))} (${rating}/5)</td></tr>
          </table>
          <p style="background:#f5f5f5;padding:12px;border-radius:8px;margin:16px 0;">"${text}"</p>
          ${savedToDb ? `<a href="${adminUrl}" style="background:#1c1c1c;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Review &amp; Approve →</a>` : ''}
        `,
      });
    } catch (emailErr) {
      console.error('[review/submit] Email error:', emailErr instanceof Error ? emailErr.message : emailErr);
      // If both DB and email fail, still return success to user but log it
      if (!savedToDb) {
        console.error('[review/submit] CRITICAL: Review lost — no DB and no email', { name, email, trip, rating, text });
      }
    }

    return NextResponse.json({ success: true, ...(reviewId ? { id: reviewId } : {}) });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[review/submit]', msg);
    return NextResponse.json({ error: 'Failed to submit review. Please try again or contact hello@ylootrips.com' }, { status: 500 });
  }
}
