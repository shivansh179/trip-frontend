import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import mongoose from 'mongoose';

const TripMemory =
  (mongoose.models.TripMemory as mongoose.Model<Record<string, unknown>>) ||
  mongoose.model<Record<string, unknown>>(
    'TripMemory',
    new mongoose.Schema({}, { strict: false, collection: 'trip_memories' }),
  );

export async function GET(req: NextRequest) {
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '50'), 100);
  const page  = Math.max(parseInt(req.nextUrl.searchParams.get('page') || '1'), 1);
  const skip  = (page - 1) * limit;

  try {
    await connectDB();
    const docs = await TripMemory
      .find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const safe = (docs as Record<string, unknown>[]).map(d => {
      const fullName = String(d.name || '');
      const parts = fullName.split(' ');
      const displayName = parts[0] + (parts.length > 1 ? ' ' + parts.slice(1).map((w: string) => w[0] + '.').join(' ') : '');
      return {
        ref:       d.ref,
        name:      displayName,
        tripName:  d.tripName,
        mediaType: d.mediaType,
        fileUrl:   d.fileUrl,
        createdAt: d.createdAt,
      };
    });

    const total = await TripMemory.countDocuments({ status: 'approved' });
    return NextResponse.json({ data: safe, total, page, limit });
  } catch {
    return NextResponse.json({ data: [], total: 0, page, limit });
  }
}
