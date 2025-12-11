'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Quote, Compass, Heart, Shield, Star, LucideIcon } from 'lucide-react';
import Hero from '@/components/Hero';
import DestinationCard from '@/components/DestinationCard';
import TripCard from '@/components/TripCard';
import { api } from '@/lib/api';
import { Destination, Trip } from '@/types';

interface CmsContent {
  pageKey: string;
  pageTitle: string;
  pageDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  sections: Array<{
    sectionKey: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    backgroundColor: string;
  }>;
  stats: Array<{ value: string; label: string }>;
  features: Array<{ icon: string; title: string; description: string }>;
}

interface Testimonial {
  id: number;
  userName: string;
  userTitle: string;
  userImage: string;
  comment: string;
}

// Icon map
const iconMap: Record<string, LucideIcon> = {
  compass: Compass,
  heart: Heart,
  shield: Shield,
  star: Star,
};

export default function Home() {
  const [content, setContent] = useState<CmsContent | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [contentRes, destRes, tripRes, testRes] = await Promise.all([
          api.getPageContent('home'),
          api.getFeaturedDestinations(),
          api.getFeaturedTrips(),
          api.getFeaturedTestimonials(),
        ]);

        setContent(contentRes.data);
        setDestinations(destRes.data.slice(0, 4));
        setTrips(tripRes.data.slice(0, 3));
        setTestimonials(testRes.data.slice(0, 2));
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to load content. Please ensure the backend is running and seeded.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get section by key
  const getSection = (key: string) => content?.sections?.find(s => s.sectionKey === key);

  const philosophySection = getSection('philosophy');
  const destinationsSection = getSection('destinations');
  const experiencesSection = getSection('experiences');
  const testimonialsSection = getSection('testimonials');
  const ctaSection = getSection('cta');

  return (
    <>
      {/* Hero Section - CMS Driven */}
      <Hero
        content={content?.hero}
        stats={content?.stats}
      />

      {/* Error Banner */}
      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Philosophy Section - CMS Driven */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
                  {philosophySection?.eyebrow || 'Our Philosophy'}
                </p>
                <h2 className="font-display text-display-lg text-primary">
                  {philosophySection?.title?.split('.').map((part, i) => (
                    <span key={i}>
                      {i === 1 ? <><br /><span className="italic text-secondary">{part.trim()}</span></> : part}
                    </span>
                  )) || <>Travel is not just movement.<br /><span className="italic text-secondary">It&apos;s transformation.</span></>}
                </h2>
              </div>

              <p className="text-body-lg text-primary/70 leading-relaxed">
                {philosophySection?.description || 'We believe that the best journeys are those that leave you changed. Our curated experiences go beyond the ordinary, connecting you with local cultures, hidden treasures, and the stories that make each destination unique.'}
              </p>

              {/* Features - CMS Driven */}
              <div className="grid grid-cols-2 gap-8 pt-4">
                {(content?.features && content.features.length > 0
                  ? content.features
                  : [
                    { icon: 'compass', title: 'Expert Local Guides', description: '' },
                    { icon: 'heart', title: 'Authentic Experiences', description: '' },
                    { icon: 'shield', title: 'Sustainable Travel', description: '' },
                    { icon: 'star', title: 'Curated Excellence', description: '' },
                  ]
                ).map((feature, index) => {
                  const IconComponent = iconMap[feature.icon] || Compass;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="text-sm text-primary/80">{feature.title}</span>
                    </div>
                  );
                })}
              </div>

              <Link href={philosophySection?.ctaLink || '/about'} className="btn-ghost group inline-flex items-center gap-2 pt-4">
                <span>{philosophySection?.ctaText || 'Discover Our Story'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Image Grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative aspect-portrait overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80"
                      alt="Travel experience"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&q=80"
                      alt="Adventure journey"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="pt-12 space-y-4">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80"
                      alt="Cultural immersion"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative aspect-portrait overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80"
                      alt="Natural wonders"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating badge with CMS stat */}
              <div className="absolute -bottom-6 -left-6 bg-accent text-primary px-8 py-4">
                <span className="font-display text-3xl">
                  {content?.stats?.find(s => s.label?.includes('Year'))?.value || '12+'}
                </span>
                <span className="block text-caption uppercase tracking-widest">
                  {content?.stats?.find(s => s.label?.includes('Year'))?.label || 'Years of Excellence'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section - CMS Driven */}
      <section className="py-24 md:py-32 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
                {destinationsSection?.eyebrow || 'Destinations'}
              </p>
              <h2 className="font-display text-display-lg text-primary">
                {destinationsSection?.title?.split(' ').map((word, i, arr) => (
                  i >= arr.length - 2 ? <span key={i} className="italic">{word} </span> : <span key={i}>{word} </span>
                )) || <>Where will your<br /><span className="italic">story begin?</span></>}
              </h2>
            </div>
            <Link href={destinationsSection?.ctaLink || '/destinations'} className="btn-ghost group">
              <span>{destinationsSection?.ctaText || 'View All Destinations'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[500px] bg-cream animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                  variant={index === 0 ? 'featured' : 'default'}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Experiences - CMS Driven */}
      <section className="py-24 md:py-32 bg-cream">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
              {experiencesSection?.eyebrow || 'Curated Journeys'}
            </p>
            <h2 className="font-display text-display-lg text-primary max-w-2xl mx-auto">
              {experiencesSection?.title || <>Experiences crafted for the<span className="italic"> discerning traveler</span></>}
            </h2>
          </div>

          {/* Trips Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[500px] bg-cream-dark animate-pulse" />
              ))}
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-primary/60">
              <p>No trips available. Please seed the database first.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href={experiencesSection?.ctaLink || '/trips'} className="btn-outline">
              <span>{experiencesSection?.ctaText || 'Explore All Experiences'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials - CMS Driven */}
      <section className="py-24 md:py-32 bg-primary text-cream">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">
              {testimonialsSection?.eyebrow || 'Testimonials'}
            </p>
            <h2 className="font-display text-display-lg">
              {testimonialsSection?.title || <>Stories from our<span className="italic"> travelers</span></>}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                className="relative p-8 md:p-12 border border-white/10 bg-white/5"
              >
                <Quote className="w-10 h-10 text-accent/30 mb-6" />
                <blockquote className="font-display text-2xl md:text-3xl leading-relaxed mb-8 text-cream/90">
                  &ldquo;{testimonial.comment}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.userImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                      alt={testimonial.userName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-cream">{testimonial.userName}</div>
                    <div className="text-caption text-cream/50">{testimonial.userTitle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - CMS Driven */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={ctaSection?.imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80'}
            alt="Start your journey"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-primary/60" />
        </div>

        <div className="relative z-10 section-container text-center text-cream">
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-6">
            {ctaSection?.eyebrow || 'Ready to Begin?'}
          </p>
          <h2 className="font-display text-display-xl max-w-3xl mx-auto mb-8">
            {ctaSection?.title || <>Let us craft your next<span className="italic"> unforgettable journey</span></>}
          </h2>
          <p className="text-body-lg text-cream/70 max-w-xl mx-auto mb-12">
            {ctaSection?.description || 'Tell us about your dream destination, and our travel experts will design a bespoke experience just for you.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={ctaSection?.ctaLink || '/contact'} className="btn-primary bg-cream text-primary hover:bg-cream-dark">
              <span>{ctaSection?.ctaText || 'Plan Your Journey'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="/destinations" className="btn-outline border-cream/30 text-cream hover:bg-cream/10">
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}