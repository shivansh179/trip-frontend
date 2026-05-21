'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Clock, ArrowRight, Trash2, Compass } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';

const STORAGE_KEY = 'ylootrips-wishlist';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';

interface Trip {
  id: number;
  title: string;
  destination: string;
  duration: string;
  pricePerPerson: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export default function WishlistPage() {
  const [ids, setIds] = useState<number[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const { currency } = useCurrency();
  const fp = (n: number) => formatPriceWithCurrency(n, currency);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed: number[] = stored ? JSON.parse(stored) : [];
      setIds(parsed);
      if (parsed.length === 0) { setLoading(false); return; }

      Promise.all(
        parsed.map((id) =>
          fetch(`${API_BASE}/trips/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null)
        )
      ).then((results) => {
        setTrips(results.filter(Boolean) as Trip[]);
        setLoading(false);
      });
    } catch {
      setLoading(false);
    }
  }, []);

  const removeTrip = (tripId: number) => {
    const updated = ids.filter((id) => id !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setIds(updated);
    setTrips((prev) => prev.filter((t) => t.id !== tripId));
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIds([]);
    setTrips([]);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-16">
      <div className="section-container max-w-5xl">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-1">Your Collection</p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              Saved Trips
            </h1>
            {trips.length > 0 && (
              <p className="text-gray-500 text-sm mt-1">{trips.length} trip{trips.length !== 1 ? 's' : ''} saved</p>
            )}
          </div>
          {trips.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors mt-2"
            >
              <Trash2 size={13} />
              Clear all
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && trips.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="w-9 h-9 text-red-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No saved trips yet</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
              Tap the heart icon on any trip to save it here for later.
            </p>
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-gray-700 transition-colors"
            >
              <Compass size={15} />
              Browse Trips
            </Link>
          </div>
        )}

        {/* Trip grid */}
        {!loading && trips.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  {trip.imageUrl ? (
                    <Image
                      src={trip.imageUrl}
                      alt={trip.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <MapPin className="text-gray-400" size={32} />
                    </div>
                  )}
                  <button
                    onClick={() => removeTrip(trip.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-base leading-snug mb-1 line-clamp-2">
                    {trip.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    {trip.destination && (
                      <span className="flex items-center gap-1">
                        <MapPin size={11} />
                        {trip.destination}
                      </span>
                    )}
                    {trip.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {trip.duration}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-gray-400">from</span>
                      <p className="text-lg font-bold text-gray-900">
                        {fp(trip.pricePerPerson)}
                        <span className="text-xs font-normal text-gray-400">/person</span>
                      </p>
                    </div>
                    <Link
                      href={`/trips/${trip.id}`}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                    >
                      View
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Browse more */}
        {!loading && trips.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-semibold px-6 py-3 rounded-full hover:border-gray-900 hover:text-gray-900 transition-colors"
            >
              Browse more trips
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
