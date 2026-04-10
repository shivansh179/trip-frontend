'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, Star, Wifi, Waves, Dumbbell, UtensilsCrossed, Car, MapPin,
  Calendar, Users, BedDouble, ChevronDown, ChevronUp, ExternalLink,
  Info, Loader2, AlertCircle,
} from 'lucide-react';
import Image from 'next/image';
import type { HotelResult } from '@/app/api/hotels/search/route';

// ── Amenity icon map ───────────────────────────────────────────────────────────
const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Free WiFi': <Wifi size={12} />,
  'WiFi': <Wifi size={12} />,
  'Pool': <Waves size={12} />,
  'Swimming Pool': <Waves size={12} />,
  'Gym': <Dumbbell size={12} />,
  'Fitness center': <Dumbbell size={12} />,
  'Restaurant': <UtensilsCrossed size={12} />,
  'Parking': <Car size={12} />,
  'Free parking': <Car size={12} />,
};

function AmenityPill({ label }: { label: string }) {
  const icon = Object.entries(AMENITY_ICONS).find(([k]) =>
    label.toLowerCase().includes(k.toLowerCase())
  )?.[1];
  return (
    <span className="flex items-center gap-1 bg-cream-light text-secondary text-[11px] font-medium px-2.5 py-1 rounded-full">
      {icon}
      {label}
    </span>
  );
}

function StarRating({ stars }: { stars: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={10}
          className={i < stars ? 'fill-amber-400 text-amber-400' : 'text-sand/60'}
        />
      ))}
    </span>
  );
}

function HotelCard({ hotel, nights }: { hotel: HotelResult; nights: number }) {
  const [expanded, setExpanded] = useState(false);
  const fmt = (n: number) =>
    n ? `₹${n.toLocaleString('en-IN')}` : 'Price on request';

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-sand/50 shadow-sm hover:shadow-md transition-shadow">
      {/* Image + badge row */}
      <div className="relative h-48 overflow-hidden">
        {hotel.thumbnail ? (
          <Image
            src={hotel.thumbnail}
            alt={hotel.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized // SerpAPI thumbnails are CDN links, skip Next optimisation
          />
        ) : (
          <div className="h-full bg-sand/40 flex items-center justify-center">
            <BedDouble size={40} className="text-secondary/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Type badge */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
          {hotel.type}
        </span>

        {/* Demo badge */}
        {hotel.isDemo && (
          <span className="absolute top-3 right-3 bg-amber-400/90 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full">
            Sample prices
          </span>
        )}

        {/* Stars */}
        <div className="absolute bottom-3 left-3">
          <StarRating stars={hotel.starClass} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="font-display text-lg text-primary leading-snug">{hotel.name}</h3>
            {hotel.overallRating > 0 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="bg-green-600 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                  {hotel.overallRating.toFixed(1)}
                </span>
                <span className="text-xs text-secondary">
                  {hotel.reviewCount > 0 && `${hotel.reviewCount.toLocaleString('en-IN')} reviews`}
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="text-right shrink-0">
            <p className="font-display text-xl text-primary">{fmt(hotel.pricePerNight)}</p>
            <p className="text-[11px] text-secondary">per night</p>
            {nights > 1 && (
              <p className="text-xs text-secondary/70 mt-0.5">
                {fmt(hotel.totalPrice)} total ({nights}N)
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {hotel.description && (
          <p className={`text-xs text-secondary leading-relaxed mb-3 ${expanded ? '' : 'line-clamp-2'}`}>
            {hotel.description}
          </p>
        )}

        {/* Amenities */}
        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {hotel.amenities.slice(0, expanded ? undefined : 4).map((a) => (
              <AmenityPill key={a} label={a} />
            ))}
            {!expanded && hotel.amenities.length > 4 && (
              <span className="text-[11px] text-accent font-medium self-center">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Check-in/out */}
        <div className="flex gap-4 text-[11px] text-secondary/70 mb-4">
          <span>Check-in: <strong className="text-primary">{hotel.checkIn}</strong></span>
          <span>Check-out: <strong className="text-primary">{hotel.checkOut}</strong></span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {hotel.link ? (
            <a
              href={hotel.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-primary text-sm font-semibold py-2.5 rounded-xl hover:bg-accent/90 transition-colors"
            >
              <ExternalLink size={14} />
              View & Book
            </a>
          ) : (
            <a
              href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I'd like to book ${hotel.name} through YlooTrips.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-primary text-sm font-semibold py-2.5 rounded-xl hover:bg-accent/90 transition-colors"
            >
              Book via WhatsApp
            </a>
          )}
          <button
            onClick={() => setExpanded((v) => !v)}
            className="px-3 py-2.5 rounded-xl border border-sand/60 text-secondary hover:bg-cream-light transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Today + tomorrow helpers ──────────────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10);
}
function tomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

// ── Sort options ──────────────────────────────────────────────────────────────
type SortKey = 'rating' | 'price_asc' | 'price_desc' | 'reviews';
const SORT_LABELS: { value: SortKey; label: string }[] = [
  { value: 'rating', label: 'Best rated' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'reviews', label: 'Most reviewed' },
];

function sortHotels(hotels: HotelResult[], key: SortKey) {
  return [...hotels].sort((a, b) => {
    if (key === 'rating') return b.overallRating - a.overallRating;
    if (key === 'price_asc') return a.pricePerNight - b.pricePerNight;
    if (key === 'price_desc') return b.pricePerNight - a.pricePerNight;
    if (key === 'reviews') return b.reviewCount - a.reviewCount;
    return 0;
  });
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HotelSearch() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [checkIn, setCheckIn] = useState(searchParams.get('check_in') ?? today());
  const [checkOut, setCheckOut] = useState(searchParams.get('check_out') ?? tomorrow());
  const [adults, setAdults] = useState(parseInt(searchParams.get('adults') ?? '2'));
  const [rooms, setRooms] = useState(parseInt(searchParams.get('rooms') ?? '1'));

  const [results, setResults] = useState<HotelResult[]>([]);
  const [nights, setNights] = useState(1);
  const [resultQuery, setResultQuery] = useState('');
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rating');
  const [searched, setSearched] = useState(false);
  const didAutoSearch = useRef(false);

  const search = useCallback(async () => {
    if (!query.trim() || !checkIn || !checkOut) return;
    setLoading(true);
    setError('');
    setSearched(true);

    const params = new URLSearchParams({
      q: query.trim(),
      check_in: checkIn,
      check_out: checkOut,
      adults: String(adults),
      rooms: String(rooms),
    });

    const res = await fetch(`/api/hotels/search?${params}`);
    if (!res.ok) {
      setError('Failed to fetch hotels. Please try again.');
      setLoading(false);
      return;
    }

    const data = await res.json();
    setResults(data.data ?? []);
    setNights(data.nights ?? 1);
    setResultQuery(data.query ?? query);
    setIsDemo(data.isDemo ?? false);
    setLoading(false);
  }, [query, checkIn, checkOut, adults, rooms]);

  const sorted = useMemo(() => sortHotels(results, sortKey), [results, sortKey]);

  // Auto-search when ?q= is present in the URL
  useEffect(() => {
    if (didAutoSearch.current) return;
    if (query.trim() && checkIn && checkOut) {
      didAutoSearch.current = true;
      search();
    }
  }, [query, checkIn, checkOut, search]);

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Hero */}
      <section className="bg-primary py-14 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Hotels</p>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3">Find Your Perfect Stay</h1>
          <p className="text-white/60 text-sm">Live rates from Google Hotels · Curated by YlooTrips</p>
        </div>

        {/* Search card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Destination */}
            <div className="md:col-span-2 flex items-center gap-2 bg-cream-light rounded-xl px-4 py-3">
              <MapPin size={16} className="text-accent shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                placeholder="Where are you going?"
                className="bg-transparent text-sm text-primary placeholder:text-secondary/50 outline-none w-full"
              />
            </div>

            {/* Check-in */}
            <div className="flex items-center gap-2 bg-cream-light rounded-xl px-4 py-3">
              <Calendar size={15} className="text-accent shrink-0" />
              <input
                type="date"
                value={checkIn}
                min={today()}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-sm text-primary outline-none w-full"
              />
            </div>

            {/* Check-out */}
            <div className="flex items-center gap-2 bg-cream-light rounded-xl px-4 py-3">
              <Calendar size={15} className="text-accent shrink-0" />
              <input
                type="date"
                value={checkOut}
                min={checkIn || today()}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-sm text-primary outline-none w-full"
              />
            </div>

            {/* Search button */}
            <button
              onClick={search}
              disabled={loading || !query.trim()}
              className="flex items-center justify-center gap-2 bg-accent text-primary font-semibold rounded-xl py-3 hover:bg-accent/90 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {/* Guests row */}
          <div className="flex flex-wrap gap-4 mt-3 px-1">
            <label className="flex items-center gap-2 text-sm text-secondary">
              <Users size={14} className="text-accent" />
              <span>Adults:</span>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="bg-cream-light text-primary rounded-lg px-2 py-2 outline-none min-h-[40px]"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-secondary">
              <BedDouble size={14} className="text-accent" />
              <span>Rooms:</span>
              <select
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="bg-cream-light text-primary rounded-lg px-2 py-2 outline-none min-h-[40px]"
              >
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-sand/50">
                <div className="h-48 bg-sand/60" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-sand/60 rounded w-3/4" />
                  <div className="h-4 bg-sand/60 rounded w-1/2" />
                  <div className="h-3 bg-sand/60 rounded w-full" />
                  <div className="h-3 bg-sand/60 rounded w-5/6" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-10 bg-sand/60 rounded-xl flex-1" />
                    <div className="h-10 bg-sand/60 rounded-xl w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && results.length > 0 && (
          <>
            {/* Result header */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
              <div>
                <h2 className="font-display text-2xl text-primary">
                  Hotels in {resultQuery}
                </h2>
                <p className="text-sm text-secondary mt-0.5">
                  {results.length} options · {nights} night{nights > 1 ? 's' : ''} · {adults} guest{adults > 1 ? 's' : ''}
                </p>
              </div>

              {/* Sort */}
              <div className="flex gap-1.5 flex-wrap">
                {SORT_LABELS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setSortKey(value)}
                    className={`text-xs font-semibold px-3 py-2 rounded-full transition-colors min-h-[36px] ${
                      sortKey === value
                        ? 'bg-primary text-white'
                        : 'bg-white text-secondary border border-sand/50 hover:bg-cream-light'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Demo notice */}
            {isDemo && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl px-4 py-3 mb-5">
                <Info size={15} className="shrink-0 mt-0.5" />
                <span>
                  Showing <strong>sample hotel prices</strong> — add your SerpAPI key to see live rates.
                  Prices shown include YlooTrips service.
                </span>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sorted.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} nights={nights} />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10 bg-primary rounded-2xl p-6 text-center">
              <p className="font-display text-xl text-white mb-2">Need help choosing?</p>
              <p className="text-white/70 text-sm mb-5">
                Our travel experts can find you the best deal and bundle it with flights + activities.
              </p>
              <a
                href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi! I'm looking for a hotel in ${resultQuery} from ${checkIn} to ${checkOut} for ${adults} guests.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-accent text-primary font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
              >
                Chat with a Travel Expert
              </a>
            </div>
          </>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏨</p>
            <p className="font-display text-2xl text-primary mb-2">No hotels found</p>
            <p className="text-secondary text-sm">Try a different destination or travel dates.</p>
          </div>
        )}

        {!searched && (
          <div className="text-center py-20 text-secondary">
            <p className="text-5xl mb-4">🏨</p>
            <p className="font-display text-2xl text-primary mb-2">Search hotels worldwide</p>
            <p className="text-sm">Live rates from Google Hotels with instant pricing</p>
          </div>
        )}
      </section>
    </div>
  );
}
