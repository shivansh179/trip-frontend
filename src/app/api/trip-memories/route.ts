import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const CASHBACK_PHOTO = 500;
const CASHBACK_VIDEO = 1000;

const TripMemory =
  (mongoose.models.TripMemory as mongoose.Model<Record<string, unknown>>) ||
  mongoose.model<Record<string, unknown>>(
    'TripMemory',
    new mongoose.Schema({}, { strict: false, collection: 'trip_memories' }),
  );

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
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name: string;
      contact: string;
      tripName: string;
      mediaType: 'photo' | 'video';
      fileUrl?: string;
      fileName?: string;
      fileSizeKB?: number;
      hashtags?: string;
      tagline?: string;
    };

    const { name, contact, tripName, mediaType, fileUrl = null, fileName = '', fileSizeKB = 0, hashtags = '', tagline = '' } = body;

    if (!name?.trim() || !contact?.trim() || !tripName?.trim()) {
      return NextResponse.json({ error: 'Name, contact and trip name are required.' }, { status: 400 });
    }

    // Normalise contact
    const isEmail = contact.includes('@');
    const walletId = isEmail
      ? contact.trim().toLowerCase()
      : contact.replace(/\D/g, '').replace(/^91(\d{10})$/, '$1');

    const cashback = mediaType === 'video' ? CASHBACK_VIDEO : CASHBACK_PHOTO;
    const ref = `MEM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Rate limit: max 1 photo + 1 video per user per day (separate counters)
    const today = new Date().toISOString().slice(0, 10);
    const rateKey = `tm:rate:${mediaType}:${walletId}:${today}`;
    const currentCount = parseInt(String(await redisCmd<string>('GET', rateKey) || '0'), 10);
    if (currentCount >= 1) {
      return NextResponse.json({
        error: `You already earned cashback for a ${mediaType} today. Come back tomorrow!`,
      }, { status: 429 });
    }

    // ── Credit wallet via Redis FIRST (fast, never blocked by DB issues) ──
    let credited = 0;
    const dedupKey = `tm:done:${ref}`;
    const dedupSet = await redisCmd<string>('SET', dedupKey, '1', 'NX', 'EX', String(60 * 60 * 24 * 365));
    if (dedupSet) {
      await redisCmd('INCRBY', `wl:bal:${walletId}`, cashback);
      const txnsRaw = await redisCmd<string>('GET', `wl:txns:${walletId}`);
      const txns = txnsRaw ? JSON.parse(txnsRaw) : [];
      const newTxn = {
        id:          `mem-${Date.now()}`,
        date:        new Date().toISOString(),
        type:        'cashback',
        amount:      cashback,
        bookingRef:  ref,
        description: `📸 Trip memory reward — ${tripName.trim()}`,
      };
      await redisCmd('SET', `wl:txns:${walletId}`, JSON.stringify([newTxn, ...txns].slice(0, 100)));
      credited = cashback;
    }

    // Increment rate counter
    await redisCmd('INCR', rateKey);
    await redisCmd('EXPIRE', rateKey, 86400);

    const newBalance = parseInt(String(await redisCmd<string>('GET', `wl:bal:${walletId}`) || '0'), 10);

    // ── Save to MongoDB (best-effort — DB issues must NOT block the user) ──
    try {
      await connectDB();
      await TripMemory.create({
        ref,
        name:           name.trim(),
        contact:        contact.trim(),
        walletId,
        tripName:       tripName.trim(),
        mediaType,
        fileUrl,
        fileName,
        fileSizeKB,
        hashtags:       hashtags.trim(),
        tagline:        tagline.trim(),
        cashbackAmount: cashback,
        status:         'approved',
        createdAt:      new Date().toISOString(),
      });
    } catch (dbErr) {
      console.error('[trip-memories POST] MongoDB write failed (non-fatal):', dbErr);
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
  if (adminSecret && token !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const docs = await TripMemory.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: docs, total: docs.length });
  } catch {
    return NextResponse.json({ data: [], total: 0 });
  }
}

export async function PATCH(req: NextRequest) {
  const body = await req.json() as { ref: string; status?: string; fileUrl?: string };
  const { ref, status, fileUrl } = body;
  if (!ref) return NextResponse.json({ error: 'ref required' }, { status: 400 });

  // fileUrl update — called by client after background GCS upload, no auth needed
  if (fileUrl !== undefined) {
    try {
      await connectDB();
      await TripMemory.findOneAndUpdate({ ref }, { $set: { fileUrl } });
    } catch { /* non-fatal */ }
    return NextResponse.json({ success: true });
  }

  // Status change — admin only
  const adminSecret = process.env.ADMIN_SECRET;
  const token = req.headers.get('x-admin-secret') || req.headers.get('x-admin-token');
  if (adminSecret && token !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!status || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  try {
    await connectDB();
    await TripMemory.findOneAndUpdate({ ref }, { $set: { status } });
  } catch { /* non-fatal */ }
  return NextResponse.json({ success: true });
}
