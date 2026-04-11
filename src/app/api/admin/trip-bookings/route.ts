import { NextRequest, NextResponse } from 'next/server';

const BACKEND = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';

// Try fetching all bookings with various query param strategies
// so we don't miss pending/failed/cancelled ones
async function fetchAllBookings(token: string): Promise<unknown[]> {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // Strategy 1: try with status=all or includeAll=true
  const paramVariants = [
    '?limit=500',
    '?limit=500&status=all',
    '?limit=500&all=true',
    '?limit=500&includeAll=true',
    '?limit=500&payment_status=all',
    '', // plain — backend default
  ];

  for (const params of paramVariants) {
    try {
      const res = await fetch(`${BACKEND}/admin/bookings${params}`, { headers });
      if (!res.ok) continue;
      const raw = await res.json();
      const list = extractList(raw);
      // If we got more than the plain call would give, prefer this
      if (list.length > 0) {
        return list;
      }
    } catch {
      continue;
    }
  }

  return [];
}

// Also separately fetch PENDING bookings if the backend has that filter
async function fetchPendingBookings(token: string): Promise<unknown[]> {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const statuses = ['PENDING', 'INITIATED', 'PROCESSING', 'FAILED', 'CANCELLED'];
  const results: unknown[] = [];

  for (const status of statuses) {
    try {
      const res = await fetch(`${BACKEND}/admin/bookings?status=${status}&limit=500`, { headers });
      if (!res.ok) continue;
      const raw = await res.json();
      results.push(...extractList(raw));
    } catch {
      continue;
    }
  }
  return results;
}

function extractList(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>;
    if (Array.isArray(r.data)) return r.data as Record<string, unknown>[];
    if (r.data && typeof r.data === 'object') {
      const inner = r.data as Record<string, unknown>;
      if (Array.isArray(inner.data)) return inner.data as Record<string, unknown>[];
      if (Array.isArray(inner.bookings)) return inner.bookings as Record<string, unknown>[];
    }
    if (Array.isArray(r.bookings)) return r.bookings as Record<string, unknown>[];
    if (Array.isArray(r.items)) return r.items as Record<string, unknown>[];
    if (Array.isArray(r.results)) return r.results as Record<string, unknown>[];
  }
  return [];
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('x-admin-token') || '';
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all bookings + specifically pending/failed ones in parallel
    const [allBookings, pendingBookings] = await Promise.all([
      fetchAllBookings(token),
      fetchPendingBookings(token),
    ]);

    // Merge and deduplicate by id or bookingReference
    const seen = new Set<string>();
    const merged: unknown[] = [];

    for (const b of [...allBookings, ...pendingBookings]) {
      const booking = b as Record<string, unknown>;
      const key = String(booking.id || booking.bookingReference || booking.txnid || Math.random());
      if (!seen.has(key)) {
        seen.add(key);
        merged.push(booking);
      }
    }

    // Sort newest first
    merged.sort((a, b) => {
      const ta = new Date(String((a as Record<string, unknown>).createdAt || 0)).getTime();
      const tb = new Date(String((b as Record<string, unknown>).createdAt || 0)).getTime();
      return tb - ta;
    });

    return NextResponse.json({ data: merged, total: merged.length });
  } catch (err) {
    console.error('[trip-bookings]', err);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
