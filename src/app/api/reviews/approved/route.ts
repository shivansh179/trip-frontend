import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/reviews-sheet';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reviews = await getReviews('approved');
    return NextResponse.json({ reviews: reviews.slice(0, 20) });
  } catch (err) {
    console.error('[reviews/approved]', err);
    return NextResponse.json({ reviews: [] });
  }
}
