'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Globe, MessageCircle, Star, Clock, Users } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPriceWithCurrency } from '@/lib/utils';

const regions = [
  { label: '🌐 All', value: 'All' },
  { label: '🌏 Southeast Asia', value: 'Southeast Asia' },
  { label: '🌍 Middle East', value: 'Middle East' },
  { label: '🇪🇺 Europe', value: 'Europe' },
  { label: '🌿 South Asia', value: 'South Asia' },
  { label: '🌊 Island Escapes', value: 'Islands' },
];

interface IntlDestination {
  name: string;
  country: string;
  region: string;
  image: string;
  description: string;
  priceINR: number;
  duration: string;
  rating: number;
  reviews: number;
  href: string;
  badge?: string;
  badgeColor?: string;
  highlights: string[];
  visa: string;
}

const INTERNATIONAL_DESTINATIONS: IntlDestination[] = [
  {
    name: 'Bali, Indonesia',
    country: 'Indonesia',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    description: 'Rice terraces, ancient temples, private villas and world-class sunsets — the Island of Gods beckons.',
    priceINR: 52499,
    duration: '6 Nights / 7 Days',
    rating: 4.9,
    reviews: 623,
    href: '/bali-honeymoon-package',
    badge: 'Most Popular',
    badgeColor: 'bg-pink-500',
    highlights: ['Tegalalang Rice Terrace', 'Private Pool Villa', 'Tanah Lot Sunset', 'Uluwatu Kecak Dance'],
    visa: 'Visa free for Indians',
  },
  {
    name: 'Dubai, UAE',
    country: 'UAE',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
    description: 'Burj Khalifa, desert safaris, gold souks and world-class malls — Dubai never sleeps.',
    priceINR: 36499,
    duration: '5 Nights / 6 Days',
    rating: 4.8,
    reviews: 1284,
    href: '/dubai-tour-package-from-delhi',
    badge: 'Best Value',
    badgeColor: 'bg-amber-500',
    highlights: ['Burj Khalifa At The Top', 'Desert Safari BBQ', 'Dubai Mall', 'Palm Jumeirah'],
    visa: 'Visa on arrival',
  },
  {
    name: 'Bangkok & Phuket, Thailand',
    country: 'Thailand',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80',
    description: 'Grand Palace, Phi Phi islands, floating markets, world-class street food and legendary nightlife.',
    priceINR: 49499,
    duration: '5 Nights / 6 Days',
    rating: 4.8,
    reviews: 2041,
    href: '/thailand-budget-trip',
    badge: 'Top Rated',
    badgeColor: 'bg-green-600',
    highlights: ['Phi Phi Islands Day Trip', 'Grand Palace', 'Floating Markets', 'Thai Cooking Class'],
    visa: 'Visa free (30 days)',
  },
  {
    name: 'Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1508964942454-1a56651d54ac?w=800&q=80',
    description: 'Futuristic gardens, Universal Studios, Marina Bay Sands and Michelin-starred street food.',
    priceINR: 32999,
    duration: '4 Nights / 5 Days',
    rating: 4.8,
    reviews: 892,
    href: '/singapore-tour-package',
    badge: 'Family Fave',
    badgeColor: 'bg-blue-600',
    highlights: ['Universal Studios', 'Gardens by the Bay', 'Marina Bay Sands', 'Sentosa Island'],
    visa: 'Visa on arrival / e-Visa',
  },
  {
    name: 'Maldives',
    country: 'Maldives',
    region: 'Islands',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    description: 'Overwater villas, crystal lagoons and coral reefs — the world\'s ultimate luxury escape.',
    priceINR: 89999,
    duration: '4 Nights / 5 Days',
    rating: 4.9,
    reviews: 437,
    href: '/maldives-luxury-package',
    badge: 'Luxury',
    badgeColor: 'bg-violet-600',
    highlights: ['Overwater Bungalow', 'Snorkelling & Diving', 'Sunset Cruise', 'Private Beach Dinner'],
    visa: 'Visa free (30 days)',
  },
  {
    name: 'Sri Lanka',
    country: 'Sri Lanka',
    region: 'South Asia',
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80',
    description: 'Ancient ruins, tea plantations, elephant encounters and pristine beaches just 1.5 hrs from India.',
    priceINR: 28999,
    duration: '5 Nights / 6 Days',
    rating: 4.7,
    reviews: 312,
    href: '/contact?destination=sri-lanka',
    highlights: ['Sigiriya Rock Fortress', 'Kandy Temple', 'Tea Estates', 'Whale Watching Mirissa'],
    visa: 'e-Visa (₹2,500)',
  },
  {
    name: 'Vietnam',
    country: 'Vietnam',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    description: 'Ha Long Bay, Hoi An lanterns, Hanoi street food and Da Nang beaches — Asia\'s rising star.',
    priceINR: 51499,
    duration: '7 Nights / 8 Days',
    rating: 4.8,
    reviews: 289,
    href: '/contact?destination=vietnam',
    badge: 'Trending',
    badgeColor: 'bg-red-500',
    highlights: ['Ha Long Bay Cruise', 'Hoi An Old Town', 'Hanoi Street Food Tour', 'Da Nang Beach'],
    visa: 'e-Visa ($25)',
  },
  {
    name: 'Japan',
    country: 'Japan',
    region: 'Southeast Asia',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80',
    description: 'Cherry blossoms, bullet trains, ancient temples and the world\'s best food culture.',
    priceINR: 172799,
    duration: '7 Nights / 8 Days',
    rating: 4.9,
    reviews: 198,
    href: '/contact?destination=japan',
    badge: 'Premium',
    badgeColor: 'bg-rose-600',
    highlights: ['Mt. Fuji View', 'Tokyo Shibuya', 'Kyoto Temples', 'Osaka Street Food'],
    visa: 'Visa required (₹4,500)',
  },
  {
    name: 'Georgia & Azerbaijan',
    country: 'Georgia',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800&q=80',
    description: 'Old Tbilisi, Caucasus mountains, Baku\'s flame towers — budget Europe for Indian travelers.',
    priceINR: 54999,
    duration: '6 Nights / 7 Days',
    rating: 4.7,
    reviews: 156,
    href: '/contact?destination=georgia-azerbaijan',
    highlights: ['Old Tbilisi', 'Kazbegi Mountains', 'Baku Old City', 'Flame Towers'],
    visa: 'Visa free (Georgia) / e-Visa (Azer)',
  },
  {
    name: 'Paris & Europe',
    country: 'France',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    description: 'Eiffel Tower, Louvre, Swiss Alps, Rome\'s Colosseum — the European dream holiday.',
    priceINR: 189999,
    duration: '10 Nights / 11 Days',
    rating: 4.9,
    reviews: 421,
    href: '/contact?destination=europe',
    badge: 'Dream Trip',
    badgeColor: 'bg-blue-700',
    highlights: ['Eiffel Tower', 'Swiss Alps', 'Colosseum Rome', 'Amsterdam Canals'],
    visa: 'Schengen Visa required',
  },
  {
    name: 'Nepal & Bhutan',
    country: 'Nepal',
    region: 'South Asia',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    description: 'Everest base camp treks, Tiger\'s Nest monastery and Himalayan kingdoms just next door.',
    priceINR: 37799,
    duration: '6 Nights / 7 Days',
    rating: 4.8,
    reviews: 267,
    href: '/contact?destination=nepal-bhutan',
    highlights: ['Everest Base Camp', "Tiger's Nest", 'Pokhara Lakeside', 'Paro Valley'],
    visa: 'No visa for Indians (Nepal)',
  },
  {
    name: 'Kenya Safari',
    country: 'Kenya',
    region: 'Islands',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    description: 'Witness the Great Migration, big five safaris and Masai Mara — the trip of a lifetime.',
    priceINR: 224999,
    duration: '7 Nights / 8 Days',
    rating: 4.9,
    reviews: 134,
    href: '/contact?destination=kenya-safari',
    badge: 'Bucket List',
    badgeColor: 'bg-amber-700',
    highlights: ['Masai Mara Safari', 'Great Migration', 'Amboseli Elephant Park', 'Nairobi'],
    visa: 'e-Visa required',
  },
];

function IntlCard({ d }: { d: IntlDestination }) {
  const { currency } = useCurrency();

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-primary/8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Image */}
      <Link href={d.href} className="block relative aspect-[4/3] overflow-hidden shrink-0">
        <Image
          src={d.image} alt={d.name} fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Country pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full">
          <MapPin className="w-2.5 h-2.5" />
          {d.country}
        </div>

        {/* Badge */}
        {d.badge && (
          <div className={`absolute top-3 right-3 ${d.badgeColor} text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>
            {d.badge}
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold">{d.rating}</span>
          <span className="text-[10px] opacity-70">({d.reviews.toLocaleString()})</span>
        </div>

        {/* Visa info */}
        <div className="absolute bottom-3 right-3 bg-green-600/90 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full">
          {d.visa}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-display text-xl text-primary leading-tight">{d.name}</h3>
        <p className="text-sm text-secondary leading-relaxed line-clamp-2">{d.description}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-secondary">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{d.duration}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />Small group</span>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1">
          {d.highlights.slice(0, 3).map((h) => (
            <span key={h} className="text-[10px] bg-primary/5 text-primary/70 px-2 py-0.5 rounded-full">{h}</span>
          ))}
          {d.highlights.length > 3 && (
            <span className="text-[10px] text-primary/40 px-1 py-0.5">+{d.highlights.length - 3} more</span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-primary/8 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-secondary uppercase tracking-wider block">from</span>
            <span className="font-display text-xl text-primary">{formatPriceWithCurrency(d.priceINR, currency)}</span>
            <span className="text-[10px] text-secondary"> / person</span>
          </div>
          <Link
            href={d.href}
            className="flex items-center gap-1.5 bg-primary text-cream text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            View Package
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function InternationalDestinationsPage() {
  const [activeRegion, setActiveRegion] = useState('All');

  const filtered = useMemo(() =>
    activeRegion === 'All'
      ? INTERNATIONAL_DESTINATIONS
      : INTERNATIONAL_DESTINATIONS.filter((d) => d.region === activeRegion),
    [activeRegion]
  );

  return (
    <>
      <PageHero
        title="Explore the World"
        subtitle="Curated international journeys designed for Indian travelers — visa support, INR pricing, 24/7 on-trip assistance."
        breadcrumb="International"
        backgroundImage="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-secondary/40 via-primary/60 to-primary/90"
      />

      {/* Trust bar */}
      <section className="py-6 bg-secondary/5 border-b border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              '✈️  Visa assistance included',
              '💳  INR pricing · no forex surprises',
              '🗣  Hindi & English-speaking guides',
              '📞  24/7 on-trip emergency support',
            ].map((item) => (
              <span key={item} className="text-xs md:text-sm text-primary/70 font-medium">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Region filter */}
      <section className="py-4 md:py-5 bg-cream-dark border-b border-primary/8 sticky top-16 z-30">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
            {regions.map((r) => (
              <button
                key={r.value}
                onClick={() => setActiveRegion(r.value)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 rounded-full ${
                  activeRegion === r.value
                    ? 'bg-secondary text-cream shadow-sm'
                    : 'bg-white text-primary/70 border border-primary/15 hover:border-secondary/40 hover:text-secondary'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destination grid */}
      <section className="py-12 md:py-20 bg-cream">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-2">
                {activeRegion === 'All' ? 'Across the globe' : activeRegion}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-primary">
                {activeRegion === 'All' ? 'Where in the world?' : `Explore ${activeRegion}`}
              </h2>
            </div>
            <p className="text-sm text-primary/50">{filtered.length} destination{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((d) => (
                <IntlCard key={d.name} d={d} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-secondary">
              <p className="text-4xl mb-3">🌍</p>
              <p className="font-display text-xl">Coming soon</p>
              <p className="text-sm mt-1">We're adding more destinations — WhatsApp us for custom packages.</p>
            </div>
          )}
        </div>
      </section>

      {/* Countries we cover */}
      <section className="py-10 bg-cream-dark border-y border-primary/8">
        <div className="section-container text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-secondary mb-5">Popular with Indian travelers</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {['🇹🇭','🇧🇦','🇬🇧','🇫🇷','🇮🇹','🇪🇸','🇬🇷','🇹🇷','🇯🇵','🇸🇬','🇦🇺','🇺🇸','🇲🇻','🇰🇪','🇵🇹','🇳🇿','🇨🇭','🇦🇹','🇲🇦','🇦🇪'].map(flag => (
              <span key={flag} className="text-2xl">{flag}</span>
            ))}
          </div>
          <p className="text-primary/40 text-xs mt-3">+ many more</p>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-16 md:py-24 bg-secondary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-5">
              <Globe className="w-10 h-10 text-cream/40" />
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">International Travel Specialists</p>
            <h2 className="font-display text-4xl md:text-5xl mb-4">Ready to explore the world?</h2>
            <p className="text-cream/60 text-lg max-w-xl mx-auto mb-10">
              We handle visa paperwork, flights, hotels, and on-ground guides. You just pack and go. Our specialists respond in under 1 hour.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/918427831127?text=Hi%2C+I'm+interested+in+an+international+trip"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors rounded-full"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all rounded-full">
                Plan My World Trip
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
