import { NextRequest, NextResponse } from 'next/server';

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const MARKUP = 1.20; // 20% above live price

// ── Types ─────────────────────────────────────────────────────────────────────
export interface HotelResult {
  id: string;
  isDemo: boolean;
  name: string;
  type: string;
  starClass: number;           // 1–5
  overallRating: number;       // e.g. 4.2
  reviewCount: number;
  description: string;
  thumbnail: string;
  amenities: string[];
  checkIn: string;
  checkOut: string;
  pricePerNight: number;       // after markup, INR
  totalPrice: number;          // after markup, INR, for all nights
  currency: 'INR';
  link: string;
}

// ── SerpAPI response shapes ───────────────────────────────────────────────────
interface SerpRate {
  lowest?: string;
  extracted_lowest?: number;
  before_taxes_fees?: string;
  extracted_before_taxes_fees?: number;
}

interface SerpProperty {
  property_token?: string;
  name?: string;
  type?: string;
  hotel_class?: string;        // "3-star hotel"
  overall_rating?: number;
  reviews?: number;
  description?: string;
  images?: { thumbnail?: string }[];
  amenities?: string[];
  check_in_time?: string;
  check_out_time?: string;
  rate_per_night?: SerpRate;
  total_rate?: SerpRate;
  link?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function extractStars(hotelClass: string | undefined): number {
  if (!hotelClass) return 3;
  const m = hotelClass.match(/(\d)/);
  return m ? parseInt(m[1]) : 3;
}

function applyMarkup(raw: number): number {
  return Math.ceil((raw * MARKUP) / 100) * 100; // round up to nearest ₹100
}

function mapProperty(p: SerpProperty, nights: number, idx: number): HotelResult {
  const rawPerNight = p.rate_per_night?.extracted_lowest ?? p.rate_per_night?.extracted_before_taxes_fees ?? 0;
  const rawTotal = p.total_rate?.extracted_lowest ?? p.total_rate?.extracted_before_taxes_fees ?? rawPerNight * nights;

  const pricePerNight = rawPerNight ? applyMarkup(rawPerNight) : 0;
  const totalPrice = rawTotal ? applyMarkup(rawTotal) : pricePerNight * nights;

  return {
    id: p.property_token ?? `SERP-${idx}`,
    isDemo: false,
    name: p.name ?? 'Hotel',
    type: p.type ?? 'Hotel',
    starClass: extractStars(p.hotel_class),
    overallRating: p.overall_rating ?? 0,
    reviewCount: p.reviews ?? 0,
    description: p.description ?? '',
    thumbnail: p.images?.[0]?.thumbnail ?? '',
    amenities: p.amenities?.slice(0, 8) ?? [],
    checkIn: p.check_in_time ?? '12:00 PM',
    checkOut: p.check_out_time ?? '11:00 AM',
    pricePerNight,
    totalPrice,
    currency: 'INR',
    link: p.link ?? '',
  };
}

// ── Demo fallback ─────────────────────────────────────────────────────────────
const DEMO_HOTELS: Omit<HotelResult, 'id' | 'isDemo' | 'totalPrice'>[] = [
  {
    name: 'The Grand Heritage Retreat',
    type: 'Resort',
    starClass: 5,
    overallRating: 4.7,
    reviewCount: 1284,
    description: 'An opulent resort nestled amid lush greenery, offering world-class amenities and breathtaking views. Perfect for a luxury getaway.',
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    amenities: ['Pool', 'Spa', 'Free WiFi', 'Restaurant', 'Gym', 'Room Service', 'Bar', 'Parking'],
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
    pricePerNight: 8999,
    currency: 'INR',
    link: '',
  },
  {
    name: 'Comfort Inn & Suites',
    type: 'Hotel',
    starClass: 3,
    overallRating: 4.2,
    reviewCount: 867,
    description: 'A comfortable mid-range hotel with all essential amenities. Centrally located for easy access to local attractions.',
    thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80',
    amenities: ['Free WiFi', 'AC', 'Restaurant', 'Room Service', 'Parking', '24hr Reception'],
    checkIn: '12:00 PM',
    checkOut: '11:00 AM',
    pricePerNight: 3499,
    currency: 'INR',
    link: '',
  },
  {
    name: 'Backpacker\'s Hostel & Café',
    type: 'Hostel',
    starClass: 2,
    overallRating: 4.4,
    reviewCount: 2103,
    description: 'A vibrant community hostel loved by solo travellers. Great social vibes, hearty breakfasts, and unbeatable value.',
    thumbnail: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80',
    amenities: ['Free WiFi', 'Common Room', 'Lockers', 'Café', 'Laundry', 'Tours Desk'],
    checkIn: '1:00 PM',
    checkOut: '11:00 AM',
    pricePerNight: 899,
    currency: 'INR',
    link: '',
  },
  {
    name: 'Boutique Heritage Haveli',
    type: 'Boutique Hotel',
    starClass: 4,
    overallRating: 4.6,
    reviewCount: 543,
    description: 'A beautifully restored heritage property with hand-painted murals and traditional décor. An immersive cultural experience.',
    thumbnail: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80',
    amenities: ['Free WiFi', 'Pool', 'Heritage Tours', 'Restaurant', 'Rooftop', 'Spa'],
    checkIn: '2:00 PM',
    checkOut: '11:00 AM',
    pricePerNight: 5999,
    currency: 'INR',
    link: '',
  },
  {
    name: 'Budget Stay Express',
    type: 'Guest House',
    starClass: 2,
    overallRating: 3.9,
    reviewCount: 312,
    description: 'No-frills, clean and safe accommodation right in the heart of the city. Ideal for budget-conscious travellers.',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    amenities: ['Free WiFi', 'AC', 'Hot Water', '24hr Security'],
    checkIn: '12:00 PM',
    checkOut: '10:00 AM',
    pricePerNight: 1299,
    currency: 'INR',
    link: '',
  },
  {
    name: 'Treehouse & Nature Resort',
    type: 'Resort',
    starClass: 4,
    overallRating: 4.8,
    reviewCount: 731,
    description: 'Unique treehouse cottages surrounded by jungle canopy. Fall asleep to birdsong and wake up to misty valley views.',
    thumbnail: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80',
    amenities: ['Nature Walks', 'Bonfire', 'Organic Meals', 'Birdwatching', 'Free WiFi', 'Parking'],
    checkIn: '1:00 PM',
    checkOut: '11:00 AM',
    pricePerNight: 6499,
    currency: 'INR',
    link: '',
  },
];

function buildDemo(nights: number): { isDemo: true; data: HotelResult[] } {
  return {
    isDemo: true,
    data: DEMO_HOTELS.map((h, i) => ({
      ...h,
      id: `DEMO-${i + 1}`,
      isDemo: true,
      totalPrice: h.pricePerNight * nights,
    })),
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const query = sp.get('q');           // e.g. "Manali" or "Hotels in Goa"
  const checkIn = sp.get('check_in'); // YYYY-MM-DD
  const checkOut = sp.get('check_out');
  const adults = parseInt(sp.get('adults') ?? '2');
  const rooms = parseInt(sp.get('rooms') ?? '1');

  if (!query || !checkIn || !checkOut) {
    return NextResponse.json({ error: 'q, check_in, and check_out are required' }, { status: 400 });
  }

  const nights = Math.max(
    1,
    Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000)
  );

  // ── Live: SerpAPI Google Hotels ──────────────────────────────────────────────
  if (SERPAPI_KEY) {
    try {
      const params = new URLSearchParams({
        engine: 'google_hotels',
        q: `Hotels in ${query}`,
        check_in_date: checkIn,
        check_out_date: checkOut,
        adults: String(adults),
        rooms: String(rooms),
        currency: 'INR',
        hl: 'en',
        gl: 'in',
        api_key: SERPAPI_KEY,
      });

      const res = await fetch(`https://serpapi.com/search?${params}`, {
        next: { revalidate: 1800 }, // cache 30 min
      });

      if (res.ok) {
        const json = await res.json();
        const properties: SerpProperty[] = json.properties ?? [];

        if (properties.length > 0) {
          const data = properties
            .map((p, i) => mapProperty(p, nights, i))
            .filter((h) => h.pricePerNight > 0) // skip hotels with no price
            .sort((a, b) => b.overallRating - a.overallRating);

          return NextResponse.json(
            { isDemo: false, data, nights, query },
            { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
          );
        }
      }
    } catch (err) {
      console.error('[hotels/search] SerpAPI error:', err);
    }
  }

  // ── Fallback: demo data ───────────────────────────────────────────────────────
  return NextResponse.json(
    { ...buildDemo(nights), nights, query },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } }
  );
}
