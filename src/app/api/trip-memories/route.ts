import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const REDIS_URL   = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

const CASHBACK_PHOTO = 500;
const CASHBACK_VIDEO = 1000;
const MAX_UPLOADS_PER_DAY = 5;

// Flexible MongoDB model
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

// Upload file to Cloudinary if configured (optional)
async function uploadToCloudinary(fileBuffer: Buffer, fileName: string, resourceType: 'image' | 'video'): Promise<string | null> {
  const cloudName  = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey     = process.env.CLOUDINARY_API_KEY;
  const apiSecret  = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return null;

  const base64 = fileBuffer.toString('base64');
  const dataUri = `data:${resourceType === 'video' ? 'video/mp4' : 'image/jpeg'};base64,${base64}`;

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'trip-memories';

  // Build signature
  const str = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
  const { createHash } = await import('crypto');
  const signature = createHash('sha1').update(str).digest('hex');

  const body = new FormData();
  body.append('file', dataUri);
  body.append('api_key', apiKey);
  body.append('timestamp', String(timestamp));
  body.append('signature', signature);
  body.append('folder', folder);
  body.append('resource_type', resourceType);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body,
  });
  if (!res.ok) return null;
  const data = await res.json() as { secure_url?: string };
  return data.secure_url ?? null;
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const name      = String(form.get('name') || '').trim();
    const contact   = String(form.get('contact') || '').trim(); // phone or email
    const tripName  = String(form.get('tripName') || '').trim();
    const mediaType = String(form.get('mediaType') || 'photo') as 'photo' | 'video';
    const file      = form.get('file') as File | null;

    if (!name || !contact || !tripName) {
      return NextResponse.json({ error: 'Name, contact and trip name are required.' }, { status: 400 });
    }

    // Normalise contact: strip non-digits if phone
    const isEmail = contact.includes('@');
    const walletId = isEmail
      ? contact.toLowerCase()
      : contact.replace(/\D/g, '').replace(/^91(\d{10})$/, '$1');

    // Rate limit: max 5 uploads per contact per day
    const today = new Date().toISOString().slice(0, 10);
    const rateKey = `tm:rate:${walletId}:${today}`;
    const currentCount = parseInt(String(await redisCmd<string>('GET', rateKey) || '0'), 10);
    if (currentCount >= MAX_UPLOADS_PER_DAY) {
      return NextResponse.json({ error: 'Max 5 uploads per day. Try again tomorrow!' }, { status: 429 });
    }

    // File handling
    let fileUrl: string | null = null;
    let fileSizeKB = 0;
    let originalFileName = '';

    if (file && file.size > 0) {
      originalFileName = file.name;
      fileSizeKB = Math.round(file.size / 1024);

      // Size limits: 10 MB for photos, 100 MB for videos
      const maxSizeBytes = mediaType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        return NextResponse.json({
          error: `File too large. Max ${mediaType === 'video' ? '100MB' : '10MB'} allowed.`,
        }, { status: 400 });
      }

      const arrayBuf = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      fileUrl = await uploadToCloudinary(buffer, file.name, mediaType === 'video' ? 'video' : 'image');
    }

    // Save to MongoDB
    await connectDB();
    const cashback = mediaType === 'video' ? CASHBACK_VIDEO : CASHBACK_PHOTO;
    const ref = `MEM-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    await TripMemory.create({
      ref,
      name,
      contact,
      walletId,
      tripName,
      mediaType,
      fileUrl,
      fileSizeKB,
      originalFileName,
      cashbackAmount: cashback,
      status: 'approved',
      createdAt: new Date().toISOString(),
    });

    // Credit fixed cashback to wallet via Redis
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
        description: `📸 Trip memory reward — ${tripName}`,
      };
      await redisCmd('SET', `wl:txns:${walletId}`, JSON.stringify([newTxn, ...txns].slice(0, 100)));
      credited = cashback;
    }

    // Increment rate counter
    await redisCmd('INCR', rateKey);
    await redisCmd('EXPIRE', rateKey, 86400);

    // New wallet balance
    const newBalance = parseInt(String(await redisCmd<string>('GET', `wl:bal:${walletId}`) || '0'), 10);

    return NextResponse.json({ success: true, ref, cashback: credited, walletBalance: newBalance });
  } catch (err) {
    console.error('[trip-memories POST]', err);
    return NextResponse.json({ error: 'Upload failed. Try again.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Admin-only: list all memories
  const adminSecret = process.env.ADMIN_SECRET;
  const token = req.headers.get('x-admin-secret') || req.headers.get('x-admin-token');
  if (adminSecret && token !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const docs = await TripMemory.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ data: docs, total: docs.length });
}

export async function PATCH(req: NextRequest) {
  // Admin-only: approve or reject a memory
  const adminSecret = process.env.ADMIN_SECRET;
  const token = req.headers.get('x-admin-secret') || req.headers.get('x-admin-token');
  if (adminSecret && token !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { ref, status } = await req.json() as { ref: string; status: string };
  if (!ref || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
  await connectDB();
  await TripMemory.findOneAndUpdate({ ref }, { $set: { status } });
  return NextResponse.json({ success: true });
}
