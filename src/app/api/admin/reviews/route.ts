import { NextRequest, NextResponse } from 'next/server';
import { getReviews, updateReviewStatus, deleteReview } from '@/lib/reviews-sheet';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';

async function isAuthorised(req: NextRequest): Promise<boolean> {
  // Accept ADMIN_SECRET directly (x-admin-secret / x-admin-token headers)
  const adminSecret = process.env.ADMIN_SECRET;
  const directToken = req.headers.get('x-admin-secret') || req.headers.get('x-admin-token');
  if (adminSecret && directToken === adminSecret) return true;

  // Accept backend JWT via Authorization: Bearer <token>
  const bearer = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!bearer) return false;
  try {
    const res = await fetch(`${BACKEND_URL}/admin/verify`, {
      headers: { Authorization: `Bearer ${bearer}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// GET — list reviews (admin)
export async function GET(req: NextRequest) {
  if (!await isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const status = req.nextUrl.searchParams.get('status') || 'all';
    const reviews = await getReviews(status);
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error('[admin/reviews GET]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PATCH — approve or reject
export async function PATCH(req: NextRequest) {
  if (!await isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id, status, adminNote } = await req.json();
    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const found = await updateReviewStatus(id, status, adminNote || '');
    if (!found) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/reviews PATCH]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — permanently remove
export async function DELETE(req: NextRequest) {
  if (!await isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    await deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/reviews DELETE]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
