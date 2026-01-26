'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import DestinationCard from '@/components/DestinationCard';
import EmptyStateCustomPlan from '@/components/EmptyStateCustomPlan';
import { api } from '@/lib/api';
import { Destination } from '@/types';

export default function DomesticDestinationsPage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.getDestinations();
        const india = (response.data || []).filter((d: Destination) => (d.country || '').toLowerCase() === 'india');
        setDestinations(india);
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

  const featured = destinations[0];

  return (
    <>
      {/* Hero – warm, India-focused */}
      <PageHero
        title="Discover India"
        subtitle="From the Himalayas to Kerala's backwaters—diverse landscapes, culture, and soul."
        breadcrumb="Domestic"
        backgroundImage="https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-terracotta/50 via-primary/60 to-primary/90"
      />

      {/* Intro strip – domestic-only feel */}
      <section className="py-6 md:py-8 lg:py-10 bg-cream border-l-4 border-terracotta">
        <div className="section-container">
          <p className="font-display text-lg sm:text-xl md:text-2xl text-primary/90 max-w-2xl">
            From the mountains to the coast—India&apos;s diversity awaits. Curated domestic experiences.
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

      {/* Featured – warm overlay, "In India" badge */}
      {!loading && featured && (
        <section className="py-10 md:py-16 lg:py-24 bg-cream-dark">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
              <div className="relative h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
                <Image
                  src={featured.imageUrl || 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1200&q=80'}
                  alt={featured.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-terracotta/60 via-primary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-8 lg:p-12">
                  <span className="inline-block px-4 py-2 bg-terracotta text-cream text-caption uppercase tracking-widest mb-4">
                    In India
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">{featured.name}</h2>
                  <p className="text-cream/70 text-lg mb-6 max-w-md">{featured.description}</p>
                  <Link href={`/destinations/${featured.slug}`} className="btn-primary bg-cream text-primary hover:bg-cream-dark">
                    <span>Explore {featured.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-8 lg:pl-12">
                <div>
                  <p className="text-caption uppercase tracking-[0.3em] text-terracotta mb-3">Why {featured.name}?</p>
                  <h3 className="font-display text-display-lg text-primary mb-4">
                    A destination for the <span className="italic text-terracotta">soul</span>
                  </h3>
                  <p className="text-primary/60 text-body-lg">{featured.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: featured.tripCount || '0', label: 'Experiences' },
                    { value: '4.9', label: 'Avg Rating' },
                    { value: '12', label: 'Hotels' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-6 bg-cream border-l-2 border-terracotta/40">
                      <div className="font-display text-3xl text-terracotta mb-1">{stat.value}</div>
                      <div className="text-caption uppercase tracking-widest text-primary/50">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid – 3 cols, domestic card theme */}
      <section className="py-10 md:py-16 lg:py-24 bg-cream">
        <div className="section-container">
          {(loading || destinations.length > 0) && (
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8 md:mb-12">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-terracotta mb-3">Across India</p>
                {destinations.length > 0 && <h2 className="font-display text-display-lg text-primary">Where in India?</h2>}
              </div>
              {!loading && <p className="text-primary/60 hidden md:block">{destinations.length} destinations</p>}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[450px] bg-cream-dark animate-pulse" />
              ))}
            </div>
          ) : destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {destinations.map((d, i) => (
                <DestinationCard key={d.id} destination={d} index={i} theme="domestic" />
              ))}
            </div>
          ) : (
            <EmptyStateCustomPlan scopeFilter="Domestic" activeRegion="All Regions" onViewAll={() => router.push('/destinations')} />
          )}
        </div>
      </section>

      {/* Newsletter – warm accent */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg mb-4">Discover more of India</h2>
          <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
            Get destination guides, trip ideas, and offers for domestic travel.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Your email" className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-terracotta" />
            <button type="submit" className="btn-primary bg-terracotta text-cream hover:bg-terracotta-light">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
