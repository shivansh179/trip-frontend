import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic'; // always fresh — reviews must show immediately after approval

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('[reviews/approved]', err);
    return NextResponse.json({ reviews: [] });
  }
}
