import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '.data', 'reviews.json');

function isAuthorised(req: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return true;
  if (req.headers.get('x-admin-secret') === adminSecret) return true;
  if (req.headers.get('x-admin-token')) return true;
  return false;
}

interface Review {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  trip: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  avatarUrl?: string;
  tripPhotoUrl?: string;
  createdAt: string;
}

function readReviews(): Review[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeReviews(reviews: Review[]) {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(reviews, null, 2));
}

// GET — list all reviews (admin)
export async function GET(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const status = req.nextUrl.searchParams.get('status') || 'all';
  const reviews = readReviews();
  const filtered = status === 'all' ? reviews : reviews.filter(r => r.status === status);
  return NextResponse.json({ reviews: filtered });
}

// PATCH — approve or reject a review
export async function PATCH(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id, status, adminNote } = await req.json();
    if (!id || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
    const reviews = readReviews();
    const idx = reviews.findIndex(r => r.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    reviews[idx] = { ...reviews[idx], status, adminNote: adminNote || '' };
    writeReviews(reviews);
    return NextResponse.json({ success: true, review: reviews[idx] });
  } catch (err) {
    console.error('[admin/reviews PATCH]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — permanently remove
export async function DELETE(req: NextRequest) {
  if (!isAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    const reviews = readReviews();
    writeReviews(reviews.filter(r => r.id !== id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
