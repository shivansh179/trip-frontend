import { NextRequest, NextResponse } from 'next/server';
import { getReviews, updateReviewStatus, deleteReview } from '@/lib/reviews-sheet';

function isAuthorised(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return true;
  if (req.headers.get('x-admin-secret') === adminSecret) return true;
  if (req.headers.get('x-admin-token')) return true;
  return false;
}

// GET — list reviews (admin)
export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
  if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    await deleteReview(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin/reviews DELETE]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
