import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const CASHBACK_PHOTO = 75;
const CASHBACK_VIDEO = 150;

async function redisCmd<T = unknown>(...args: (string | number)[]): Promise<T | null> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;
  try {
    const res = await fetch(REDIS_URL, {
      method:  'POST',
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(args),
    });
    const json = await res.json() as { result: T };
    return json.result ?? null;
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string; contact: string; tripName: string;
      mediaType: 'photo' | 'video'; fileUrl?: string; fileName?: string;
      fileSizeKB?: number; hashtags?: string; tagline?: string;
    };
    const { name, contact, tripName, mediaType, fileUrl = null, fileName = '', fileSizeKB = 0, hashtags = '', tagline = '' } = body;

    if (!name?.trim() || !contact?.trim() || !tripName?.trim()) {
      return NextResponse.json({ error: 'Name, contact and trip name are required.' }, { status: 400 });
    }

    const isEmail = contact.includes('@');
    const walletId = isEmail
      ? contact.trim().toLowerCase()
      : contact.replace(/\D/g, '').replace(/^91(\d{10})$/, '$1');

    const cashback = mediaType === 'video' ? CASHBACK_VIDEO : CASHBACK_PHOTO;
    const ref = `MEM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const today = new Date().toISOString().slice(0, 10);
    const rateKey = `tm:rate:${mediaType}:${walletId}:${today}`;
    const currentCount = parseInt(String(await redisCmd<string>('GET', rateKey) || '0'), 10);
    if (currentCount >= 1) {
      return NextResponse.json({ error: `You already earned cashback for a ${mediaType} today. Come back tomorrow!` }, { status: 429 });
    }

    let credited = 0;
    const dedupKey = `tm:done:${ref}`;
    const dedupSet = await redisCmd<string>('SET', dedupKey, '1', 'NX', 'EX', String(60 * 60 * 24 * 365));
    if (dedupSet) {
      await redisCmd('INCRBY', `wl:bal:${walletId}`, cashback);
      const txnsRaw = await redisCmd<string>('GET', `wl:txns:${walletId}`);
      const txns = txnsRaw ? JSON.parse(txnsRaw) : [];
      await redisCmd('SET', `wl:txns:${walletId}`, JSON.stringify([{
        id: `mem-${Date.now()}`, date: new Date().toISOString(),
        type: 'cashback', amount: cashback, bookingRef: ref,
        description: `📸 Trip memory reward — ${tripName.trim()}`,
      }, ...txns].slice(0, 100)));
      credited = cashback;
    }

    await redisCmd('INCR', rateKey);
    await redisCmd('EXPIRE', rateKey, 86400);
    const newBalance = parseInt(String(await redisCmd<string>('GET', `wl:bal:${walletId}`) || '0'), 10);

    // Save to Firestore (best-effort)
    try {
      await db().collection('trip_memories').doc(ref).set({
        ref, name: name.trim(), contact: contact.trim(), walletId,
        tripName: tripName.trim(), mediaType, fileUrl, fileName, fileSizeKB,
        hashtags: hashtags.trim(), tagline: tagline.trim(),
        cashbackAmount: cashback, status: 'approved',
        createdAt: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error('[trip-memories POST] Firestore write failed (non-fatal):', dbErr);
    }

    return NextResponse.json({ success: true, ref, cashback: credited, walletBalance: newBalance });
  } catch (err) {
    console.error('[trip-memories POST]', err);
    return NextResponse.json({ error: 'Upload failed. Try again.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  const token = req.headers.get('x-admin-secret') || req.headers.get('x-admin-token');
  if (adminSecret && token !== adminSecret && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const snap = await db().collection('trip_memories').orderBy('createdAt', 'desc').get();
    const docs = snap.docs.map(d => ({ _id: d.id, ...d.data() }));
    return NextResponse.json({ data: docs, total: docs.length });
  } catch {
    return NextResponse.json({ data: [], total: 0 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as { ref: string; status?: string; fileUrl?: string };
  const { ref, status, fileUrl } = body;
  if (!ref) return NextResponse.json({ error: 'ref required' }, { status: 400 });

  if (fileUrl !== undefined) {
    try { await db().collection('trip_memories').doc(ref).update({ fileUrl, updatedAt: new Date().toISOString() }); } catch { /* non-fatal */ }
    return NextResponse.json({ success: true });
  }

  const adminSecret = process.env.ADMIN_SECRET;
  const token = req.headers.get('x-admin-secret') || req.headers.get('x-admin-token');
  if (adminSecret && token !== adminSecret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!status || !['approved', 'rejected'].includes(status)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  try { await db().collection('trip_memories').doc(ref).update({ status, updatedAt: new Date().toISOString() }); } catch { /* non-fatal */ }
  return NextResponse.json({ success: true });
}
