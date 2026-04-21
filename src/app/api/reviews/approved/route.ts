import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Review } from '@/lib/db/models';

export const dynamic = 'force-dynamic';

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
