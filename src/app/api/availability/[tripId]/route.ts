import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { TripSeat } from '@/lib/db/models';

export interface DateAvailability {
  date: string;        // YYYY-MM-DD
  price: number;       // dynamic price (INR)
  originalPrice: number;
  seatsLeft: number;
  tier: 'cheap' | 'normal' | 'peak' | 'sold_out';
  priceLabel: string;  // e.g. "Cheapest" | "Popular" | "Peak"
}

// ── Dynamic pricing rules ─────────────────────────────────────────────────────
function getDynamicPrice(
  basePrice: number,
  date: Date,
  seatsLeft: number,
  maxSeats: number
): Pick<DateAvailability, 'price' | 'tier' | 'priceLabel'> {
  let multiplier = 1.0;

  const month = date.getMonth(); // 0-indexed
  const dow   = date.getDay();   // 0=Sun, 6=Sat

  // Peak season: Oct–Jan (holiday + winter)
  if ([9, 10, 11, 0].includes(month)) multiplier *= 1.25;
  // Off-peak: Jun–Aug (monsoon)
  else if ([5, 6, 7].includes(month)) multiplier *= 0.88;

  // Weekend premium: Fri, Sat, Sun
  if ([0, 5, 6].includes(dow)) multiplier *= 1.18;

  // Scarcity surge: ≤ 3 seats left
  if (seatsLeft > 0 && seatsLeft <= 3) multiplier *= 1.12;

  const price = Math.round((basePrice * multiplier) / 100) * 100;

  let tier:       DateAvailability['tier'];
  let priceLabel: string;

  if (seatsLeft === 0) {
    tier = 'sold_out'; priceLabel = 'Sold Out';
  } else if (multiplier <= 0.92) {
    tier = 'cheap';   priceLabel = 'Cheapest';
  } else if (multiplier <= 1.12) {
    tier = 'normal';  priceLabel = seatsLeft <= 3 ? `${seatsLeft} left!` : '';
  } else {
    tier = 'peak';    priceLabel = seatsLeft <= 3 ? `${seatsLeft} left!` : 'Peak';
  }

  return { price, tier, priceLabel };
}

// GET /api/availability/[tripId]?month=YYYY-MM&basePrice=N&maxSeats=N
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId: tripIdStr } = await params;
  const tripId    = parseInt(tripIdStr);
  const sp        = req.nextUrl.searchParams;
  const month     = sp.get('month') || new Date().toISOString().slice(0, 7); // YYYY-MM
  const basePrice = parseInt(sp.get('basePrice') || '0');
  const maxSeats  = parseInt(sp.get('maxSeats')  || '16');

  if (!tripId || !basePrice) {
    return NextResponse.json({ error: 'tripId and basePrice required' }, { status: 400 });
  }

  // Build date range: full month
  const [year, mon] = month.split('-').map(Number);
  const firstDay  = new Date(year, mon - 1, 1);
  const lastDay   = new Date(year, mon, 0); // last day of month
  const today     = new Date(); today.setHours(0, 0, 0, 0);

  // Fetch booked seats for this trip in this month from MongoDB
  await connectDB();
  const seatDocs = await TripSeat.find({
    tripId,
    date: { $gte: `${month}-01`, $lte: `${month}-31` },
  }).lean();

  const bookedMap: Record<string, number> = {};
  for (const doc of seatDocs) {
    bookedMap[doc.date] = doc.seatsBooked;
  }

  // Build availability for each day in the month
  const dates: DateAvailability[] = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const dateStr   = d.toISOString().slice(0, 10);
    const isPast    = d < today;
    const booked    = bookedMap[dateStr] ?? 0;
    const seatsLeft = Math.max(0, maxSeats - booked);

    if (isPast) {
      dates.push({ date: dateStr, price: basePrice, originalPrice: basePrice, seatsLeft: 0, tier: 'sold_out', priceLabel: '' });
      continue;
    }

    const { price, tier, priceLabel } = getDynamicPrice(basePrice, new Date(d), seatsLeft, maxSeats);
    dates.push({ date: dateStr, price, originalPrice: basePrice, seatsLeft, tier, priceLabel });
  }

  return NextResponse.json(
    { dates, month, tripId },
    { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } }
  );
}

// POST /api/availability/[tripId] — confirm a seat (called from payment success)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const { tripId: tripIdStr } = await params;
  const tripId  = parseInt(tripIdStr);
  const { date, guests } = await req.json();

  if (!tripId || !date || !guests) {
    return NextResponse.json({ error: 'tripId, date, guests required' }, { status: 400 });
  }

  await connectDB();
  await TripSeat.findOneAndUpdate(
    { tripId, date },
    { $inc: { seatsBooked: Number(guests) } },
    { upsert: true, new: true }
  );

  console.log(`[availability] tripId=${tripId} date=${date} +${guests} seats`);
  return NextResponse.json({ success: true });
}
