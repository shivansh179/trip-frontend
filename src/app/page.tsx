'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Quote, Compass, Heart, Shield, Star, LucideIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  userTitle?: string;
  userImage?: string;
  photoGallery?: string[] | string;
  galleryImages?: string[] | string;
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
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Try combined endpoint first (single request - much faster)
        try {
          const homepageRes = await api.getHomepageData();
          const data = homepageRes.data;

          setContent(data.content);
          setDestinations(data.featuredDestinations || []);
          setTrips(data.featuredTrips || []);
          setTestimonials(data.featuredTestimonials || []);
          setError(null);
          return;
        } catch (combinedErr) {
          console.warn('Combined endpoint failed, falling back to individual calls:', combinedErr);
        }

        // Fallback to individual calls if combined endpoint fails
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
  const parseGalleryImages = (value: Testimonial['photoGallery'] | Testimonial['galleryImages']): string[] => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    if (typeof value !== 'string' || !value.trim()) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map((item) => String(item).trim()).filter(Boolean) : [];
    } catch {
      return value.split(',').map((item) => item.trim()).filter(Boolean);
    }
  };

  const visibleTestimonials = testimonials.filter((item) => item.comment?.trim()).slice(0, 8);
  const activeTestimonial = visibleTestimonials[activeTestimonialIndex] || null;
  const activeSlides = activeTestimonial
    ? Array.from(
      new Set(
        parseGalleryImages(activeTestimonial.photoGallery ?? activeTestimonial.galleryImages)
          .filter(Boolean) as string[]
      )
    )
    : [];
  const safeActiveGalleryIndex = activeSlides.length > 0 ? activeGalleryIndex % activeSlides.length : 0;

  useEffect(() => {
    if (visibleTestimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % visibleTestimonials.length);
      setActiveGalleryIndex(0);
    }, 5000);
    return () => clearInterval(timer);
  }, [visibleTestimonials.length]);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveGalleryIndex((prev) => (prev + 1) % activeSlides.length);
    }, 2600);
    return () => clearInterval(timer);
  }, [activeSlides.length, activeTestimonialIndex]);

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
      <section className="py-16 md:py-24 lg:py-32 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
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
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 pt-4">
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
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="space-y-2 sm:space-y-4">
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
                <div className="pt-6 sm:pt-12 space-y-2 sm:space-y-4">
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
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 md:-bottom-6 md:-left-6 bg-accent text-primary px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4">
                <span className="font-display text-xl sm:text-2xl md:text-3xl">
                  {content?.stats?.find(s => s.label?.includes('Year'))?.value || '12+'}
                </span>
                <span className="block text-[10px] sm:text-caption uppercase tracking-widest">
                  {content?.stats?.find(s => s.label?.includes('Year'))?.label || 'Years of Excellence'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section - CMS Driven */}
      <section className="py-16 md:py-24 lg:py-32 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-10 md:mb-16">
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
      <section className="py-16 md:py-24 lg:py-32 bg-cream">
        <div className="section-container">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-4">
              {experiencesSection?.eyebrow || 'Curated Journeys'}
            </p>
            <h2 className="font-display text-display-lg text-primary max-w-2xl mx-auto">
              {experiencesSection?.title || <>Experiences crafted for the<span className="italic"> discerning traveler</span></>}
            </h2>
          </div>

          {/* Trips Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[400px] md:h-[500px] bg-cream-dark animate-pulse" />
              ))}
            </div>
          ) : trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      <section className="py-16 md:py-24 lg:py-32 bg-primary text-cream">
        <div className="section-container">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">
              {testimonialsSection?.eyebrow || 'Testimonials'}
            </p>
            <h2 className="font-display text-display-lg">
              {testimonialsSection?.title || <>Stories from our<span className="italic"> travelers</span></>}
            </h2>
          </div>
          {activeTestimonial ? (
            <div className="relative overflow-hidden border border-white/15 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 sm:p-6 md:p-10">
              <div className="absolute -top-16 -right-16 h-48 w-48 bg-secondary/20 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-56 w-56 bg-accent/20 blur-3xl" />

              <div className="relative grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-stretch">
                <div className="space-y-6 md:space-y-8">
                  <Quote className="w-10 h-10 md:w-12 md:h-12 text-accent/40" />
                  <blockquote className="font-display text-xl md:text-3xl leading-snug text-cream/95 min-h-[120px]">
                    &ldquo;{activeTestimonial.comment}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent/40">
                      <Image
                        src={activeTestimonial.userImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'}
                        alt={activeTestimonial.userName || 'Traveler'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-cream">{activeTestimonial.userName || 'Happy Traveler'}</div>
                      {activeTestimonial.userTitle ? (
                        <div className="text-caption text-cream/60">{activeTestimonial.userTitle}</div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative h-[280px] sm:h-[320px] lg:h-full min-h-[280px] overflow-hidden">
                    {activeSlides.length > 0 ? (
                      activeSlides.length === 1 ? (
                        <button
                          type="button"
                          className="relative h-full w-full group rounded-xl overflow-hidden"
                          onClick={() => setIsGalleryOpen(true)}
                        >
                          <Image
                            src={activeSlides[0]}
                            alt={`${activeTestimonial.userName || 'Traveler'} memory`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white/90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                            1 photo
                          </div>
                        </button>
                      ) : activeSlides.length === 2 ? (
                        <div className="grid h-full grid-cols-2 gap-1.5 rounded-xl overflow-hidden">
                          {activeSlides.map((img, idx) => (
                            <button
                              key={`${activeTestimonial.id}-${idx}`}
                              type="button"
                              className="relative overflow-hidden group"
                              onClick={() => { setActiveGalleryIndex(idx); setIsGalleryOpen(true); }}
                            >
                              <Image src={img} alt={`Photo ${idx + 1}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white/90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                            {activeSlides.length} photos
                          </div>
                        </div>
                      ) : activeSlides.length === 3 ? (
                        <div className="grid h-full grid-cols-2 gap-1.5 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            className="relative row-span-2 overflow-hidden group"
                            onClick={() => { setActiveGalleryIndex(0); setIsGalleryOpen(true); }}
                          >
                            <Image src={activeSlides[0]} alt="Photo 1" fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          {activeSlides.slice(1, 3).map((img, idx) => (
                            <button
                              key={`${activeTestimonial.id}-${idx + 1}`}
                              type="button"
                              className="relative overflow-hidden group"
                              onClick={() => { setActiveGalleryIndex(idx + 1); setIsGalleryOpen(true); }}
                            >
                              <Image src={img} alt={`Photo ${idx + 2}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))}
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white/90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                            {activeSlides.length} photos
                          </div>
                        </div>
                      ) : (
                        <div className="grid h-full grid-cols-3 grid-rows-2 gap-1.5 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            className="relative col-span-2 row-span-2 overflow-hidden group"
                            onClick={() => { setActiveGalleryIndex(0); setIsGalleryOpen(true); }}
                          >
                            <Image src={activeSlides[0]} alt="Photo 1" fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          {activeSlides.slice(1, 3).map((img, idx) => {
                            const remaining = activeSlides.length - 3;
                            const isLast = idx === 1;
                            return (
                              <button
                                key={`${activeTestimonial.id}-${idx + 1}`}
                                type="button"
                                className="relative overflow-hidden group"
                                onClick={() => { setActiveGalleryIndex(idx + 1); setIsGalleryOpen(true); }}
                              >
                                <Image src={img} alt={`Photo ${idx + 2}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                                {isLast && remaining > 0 ? (
                                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-xl font-semibold text-white">+{remaining}</span>
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                            );
                          })}
                          <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs text-white/90">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                            {activeSlides.length} photos
                          </div>
                        </div>
                      )
                    ) : (
                      <div className="h-full w-full rounded-xl bg-white/5 border border-dashed border-white/20 flex flex-col items-center justify-center gap-3 text-cream/40">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                        <span className="text-sm">No travel photos shared</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {visibleTestimonials.length > 1 ? (
                <div className="relative mt-8 md:mt-10 flex flex-wrap items-center gap-2">
                  {visibleTestimonials.map((item, idx) => (
                    <button
                      key={item.id || idx}
                      type="button"
                      onClick={() => {
                        setActiveTestimonialIndex(idx);
                        setActiveGalleryIndex(0);
                      }}
                      className={`h-2 transition-all ${idx === activeTestimonialIndex ? 'w-10 bg-accent' : 'w-4 bg-white/30 hover:bg-white/60'}`}
                      aria-label={`Show testimonial ${idx + 1}`}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-center py-12 text-cream/60">No testimonials available.</div>
          )}
        </div>
      </section>

      {isGalleryOpen && activeSlides.length > 0 ? (
        <div className="fixed inset-0 z-50 bg-black/90 p-4 sm:p-8">
          <button
            type="button"
            onClick={() => setIsGalleryOpen(false)}
            className="absolute right-4 top-4 p-2 text-white/80 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mx-auto flex h-full max-w-6xl items-center justify-center gap-3">
            {activeSlides.length > 1 ? (
              <button
                type="button"
                onClick={() => setActiveGalleryIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                className="p-3 border border-white/30 text-white hover:bg-white/10"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            ) : null}

            <div className="relative h-[70vh] w-full max-w-5xl">
              <Image
                src={activeSlides[safeActiveGalleryIndex]}
                alt={`${activeTestimonial?.userName || 'Traveler'} photo ${safeActiveGalleryIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
              />
            </div>

            {activeSlides.length > 1 ? (
              <button
                type="button"
                onClick={() => setActiveGalleryIndex((prev) => (prev + 1) % activeSlides.length)}
                className="p-3 border border-white/30 text-white hover:bg-white/10"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* CTA Section - CMS Driven */}
      <section className="relative py-20 md:py-32 lg:py-40 overflow-hidden">
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
          <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4 md:mb-6">
            {ctaSection?.eyebrow || 'Ready to Begin?'}
          </p>
          <h2 className="font-display text-display-xl max-w-3xl mx-auto mb-6 md:mb-8 text-balance">
            {ctaSection?.title || <>Let us craft your next<span className="italic"> unforgettable journey</span></>}
          </h2>
          <p className="text-base md:text-body-lg text-cream/70 max-w-xl mx-auto mb-8 md:mb-12">
            {ctaSection?.description || 'Tell us about your dream destination, and our travel experts will design a bespoke experience just for you.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
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
