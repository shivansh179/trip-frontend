'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import DestinationCard from '@/components/DestinationCard';
import EmptyStateCustomPlan from '@/components/EmptyStateCustomPlan';
import { api } from '@/lib/api';
import { Destination } from '@/types';

const regions = ['All Regions', 'Asia', 'Europe', 'Africa', 'Americas'];

export default function InternationalDestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState('All Regions');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.getDestinations();
        const intl = (response.data || []).filter((d: Destination) => (d.country || '').toLowerCase() !== 'india');
        setDestinations(intl);
        setError(null);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Unable to load destinations.');
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const filtered = activeRegion === 'All Regions' ? destinations : destinations.filter((d) => d.region === activeRegion);
  const featured = filtered[0];

  return (
    <>
      {/* Hero – cooler, world-focused */}
      <PageHero
        title="Explore the World"
        subtitle="Across continents—culture, adventure, and unforgettable journeys."
        breadcrumb="International"
        backgroundImage="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-secondary/40 via-primary/60 to-primary/90"
      />

      {/* Region filter – international uses continents */}
      <section className="py-4 md:py-6 border-b border-primary/10 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-4 py-2 md:px-6 md:py-3 text-xs md:text-caption uppercase tracking-widest transition-all ${activeRegion === r ? 'bg-secondary text-cream' : 'bg-cream text-primary hover:bg-secondary/10'}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Intro strip – international feel */}
      <section className="py-6 md:py-8 lg:py-10 bg-cream border-l-4 border-secondary">
        <div className="section-container">
          <p className="font-display text-lg sm:text-xl md:text-2xl text-primary/90 max-w-2xl">
            From Asia to the Americas—curated destinations across the globe.
          </p>
        </div>
      </section>

      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Featured – image on RIGHT, "International" badge, cooler gradient */}
      {!loading && featured && (
        <section className="py-10 md:py-16 lg:py-24 bg-cream">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
              {/* Text first on mobile, second on desktop (image shows on right) */}
              <div className="flex flex-col justify-center space-y-8 order-2 lg:order-1 lg:pr-12">
                <div>
                  <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Why {featured.name}?</p>
                  <h3 className="font-display text-display-lg text-primary mb-4">
                    A destination for the <span className="italic text-secondary">world</span>
                  </h3>
                  <p className="text-primary/60 text-body-lg">{featured.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: featured.tripCount || '0', label: 'Experiences' },
                    { value: '4.9', label: 'Avg Rating' },
                    { value: '12', label: 'Hotels' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-6 bg-cream-dark border-l-2 border-secondary/50">
                      <div className="font-display text-3xl text-secondary mb-1">{stat.value}</div>
                      <div className="text-caption uppercase tracking-widest text-primary/50">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group order-1 lg:order-2">
                <Image
                  src={featured.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80'}
                  alt={featured.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 via-primary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="inline-block px-4 py-2 bg-secondary text-cream text-caption uppercase tracking-widest mb-4">
                    International
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">{featured.name}</h2>
                  <p className="text-cream/70 text-lg mb-6 max-w-md">{featured.description}</p>
                  <Link href={`/destinations/${featured.slug}`} className="btn-primary bg-cream text-primary hover:bg-cream-dark">
                    <span>Explore {featured.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid – 4 cols, international card theme */}
      <section className="py-10 md:py-16 lg:py-24 bg-cream-dark">
        <div className="section-container">
          {(loading || filtered.length > 0) && (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 md:mb-12">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Across the world</p>
                {filtered.length > 0 && <h2 className="font-display text-display-lg text-primary">Where in the world?</h2>}
              </div>
              {!loading && <p className="text-primary/60 hidden md:block">{filtered.length} destinations</p>}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[450px] bg-cream animate-pulse" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} theme="international" />
              ))}
            </div>
          ) : (
            <EmptyStateCustomPlan scopeFilter="International" activeRegion={activeRegion} onViewAll={() => router.push('/destinations')} />
          )}
        </div>
      </section>

      {/* Newsletter – secondary accent */}
      <section className="py-20 bg-secondary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg mb-4">Get inspired</h2>
          <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
            Subscribe for destination guides, travel tips, and exclusive offers worldwide.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Your email" className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent" />
            <button type="submit" className="btn-primary bg-accent text-primary hover:bg-accent-warm">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
