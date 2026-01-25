'use client';

import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowUpRight, Send, Loader2, CheckCircle, AlertCircle, Compass } from 'lucide-react';
import PageHero from '@/components/PageHero';
import DestinationCard from '@/components/DestinationCard';
import { api } from '@/lib/api';
import { Destination } from '@/types';

interface PageContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageUrl: string;
  };
}

const regions = ['All Regions', 'Asia', 'Europe', 'Africa', 'Americas'];
const scopeFilters = ['All', 'Domestic', 'International'] as const;
type ScopeFilter = typeof scopeFilters[number];

function EmptyStateCustomPlan({
  scopeFilter,
  activeRegion,
  onViewAll,
}: {
  scopeFilter: ScopeFilter;
  activeRegion: string;
  onViewAll: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', where: '', travelers: '', dates: '', details: '' });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');
    const prefix = `[CUSTOM PLAN${scopeFilter !== 'All' ? ` - ${scopeFilter.toUpperCase()} destinations` : ''}${activeRegion !== 'All Regions' ? ` | Region: ${activeRegion}` : ''}]\n\n`;
    const message = prefix + (form.details || 'No additional details.');
    try {
      const res = await api.submitContactInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone || undefined,
        destination: form.where || undefined,
        travelers: form.travelers || undefined,
        preferredDates: form.dates || undefined,
        message,
      });
      const data = res.data as { success?: boolean; message?: string; error?: string };
      if (data.success) {
        setStatus('success');
        setStatusMsg(data.message || "We've received your request. We'll design a custom plan and email you within 24 hours.");
        setForm({ name: '', email: '', phone: '', where: '', travelers: '', dates: '', details: '' });
      } else {
        setStatus('error');
        setStatusMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err: unknown) {
      setStatus('error');
      const ax = err as { response?: { data?: { error?: string } } };
      setStatusMsg(ax.response?.data?.error || 'Failed to submit. Please try again or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  // Fun block: show when form is hidden (form only on click)
  if (!showForm) {
    return (
      <div className="max-w-xl mx-auto text-center pt-4 pb-8">
        {/* Animated travel buddy */}
        <div
          className="inline-flex justify-center mb-8"
          style={{ animation: 'bounce-soft 2.5s ease-in-out infinite' }}
          role="img"
          aria-hidden
        >
          <span className="text-7xl md:text-8xl select-none">🧭</span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-primary mb-4">
          Ooh, you wanna go far!
        </h2>
        <p className="text-primary/70 text-lg mb-2">
          Tell us where—we&apos;ll plan it for you. No really.
        </p>
        <p className="text-primary/50 text-sm mb-8">
          Custom itinerary, zero stress. We&apos;ll slide into your inbox within 24 hours. ✨
        </p>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="btn-primary mb-6"
        >
          <span>Yeah, plan my trip</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onViewAll}
          className="block mx-auto text-caption text-secondary hover:underline"
        >
          View all destinations
        </button>
      </div>
    );
  }

  // Form: shown on click, with smooth entrance
  return (
    <div
      className="max-w-2xl mx-auto"
      style={{ animation: 'fade-up 0.5s ease-out forwards' }}
    >
      <button
        type="button"
        onClick={() => setShowForm(false)}
        className="flex items-center gap-2 text-caption text-primary/60 hover:text-primary mb-6"
      >
        ← Back
      </button>

      <div className="bg-cream border border-primary/10 p-8 md:p-10 rounded-sm shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Compass className="w-6 h-6 text-secondary" style={{ animation: 'wave 2s ease-in-out infinite' }} />
          <h3 className="font-display text-2xl text-primary">Alright, let&apos;s plan your trip</h3>
        </div>
        <p className="text-primary/60 text-sm mb-6">
          Drop your details below—we&apos;ll craft a custom itinerary and get back to you within 24 hours. We&apos;re already excited. 🗺️
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Email *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary"
              placeholder="+91 ..."
            />
          </div>
          <div>
            <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Where do you want to go? *</label>
            <input
              required
              value={form.where}
              onChange={e => setForm(f => ({ ...f, where: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary"
              placeholder="e.g. Ladakh, Spiti, Kerala or Dubai, Singapore"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Travelers</label>
              <select
                value={form.travelers}
                onChange={e => setForm(f => ({ ...f, travelers: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary"
              >
                <option value="">Select</option>
                <option value="1">Solo</option>
                <option value="2">Couple</option>
                <option value="3-4">3–4</option>
                <option value="5+">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Preferred dates</label>
              <input
                value={form.dates}
                onChange={e => setForm(f => ({ ...f, dates: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary"
                placeholder="e.g. March 2025, flexible"
              />
            </div>
          </div>
          <div>
            <label className="block text-caption uppercase tracking-widest text-primary/60 mb-1">Tell us more</label>
            <textarea
              rows={3}
              value={form.details}
              onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-primary/10 text-primary focus:outline-none focus:border-secondary resize-none"
              placeholder="Interests, budget, duration, or any special requests"
            />
          </div>

          {status === 'success' && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 text-green-700">
              <CheckCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{statusMsg}</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{statusMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><span>Request custom plan</span><Send className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

function DestinationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState('All Regions');

  const scopeFilter = (searchParams.get('filter') === 'domestic' ? 'Domestic' : searchParams.get('filter') === 'international' ? 'International' : 'All') as ScopeFilter;

  const setScopeFilter = (s: ScopeFilter) => {
    const q = s === 'Domestic' ? '?filter=domestic' : s === 'International' ? '?filter=international' : '';
    router.replace('/destinations' + q);
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.getPageContent('destinations');
        setPageContent(response.data);
      } catch (err) {
        console.error('Error fetching page content:', err);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.getDestinations();
        setDestinations(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Unable to load destinations. Please ensure the backend is running.');
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Filter by scope (Domestic = India, International = outside India) then by region
  const byScope = scopeFilter === 'Domestic'
    ? destinations.filter(d => (d.country || '').toLowerCase() === 'india')
    : scopeFilter === 'International'
      ? destinations.filter(d => (d.country || '').toLowerCase() !== 'india')
      : destinations;
  const filteredDestinations = activeRegion === 'All Regions'
    ? byScope
    : byScope.filter(d => d.region === activeRegion);

  const featuredDestination = filteredDestinations[0];

  const heroTitle = scopeFilter === 'Domestic' ? 'Domestic Destinations' : scopeFilter === 'International' ? 'International Destinations' : (pageContent?.hero?.title || 'Explore Destinations');
  const heroBreadcrumb = scopeFilter === 'Domestic' ? 'Domestic' : scopeFilter === 'International' ? 'International' : (pageContent?.hero?.eyebrow || 'Destinations');

  return (
    <>
      {/* Hero Section - CMS Driven */}
      <PageHero
        title={heroTitle}
        subtitle={pageContent?.hero?.subtitle || "From hidden gems to iconic landmarks, discover the world's most captivating places through our curated collection of destinations."}
        breadcrumb={heroBreadcrumb}
        backgroundImage={pageContent?.hero?.imageUrl}
      />

      {/* Scope: All | Domestic | International */}
      <section className="py-6 border-b border-primary/10 bg-cream">
        <div className="section-container">
          <div className="flex flex-wrap gap-3">
            {scopeFilters.map((s) => (
              <button
                key={s}
                onClick={() => setScopeFilter(s)}
                className={`px-6 py-3 text-caption uppercase tracking-widest transition-all ${scopeFilter === s
                  ? 'bg-primary text-cream'
                  : 'bg-cream-dark text-primary hover:bg-primary/10'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Filter */}
      <section className="py-6 border-b border-primary/10 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-wrap gap-3">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-6 py-3 text-caption uppercase tracking-widest transition-all ${activeRegion === region
                    ? 'bg-primary text-cream'
                    : 'bg-cream-dark text-primary hover:bg-primary/10'
                  }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Featured Destination */}
      {!loading && featuredDestination && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="section-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Featured Image */}
              <div className="relative h-[500px] lg:h-[600px] overflow-hidden group">
                <Image
                  src={featuredDestination.imageUrl || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80'}
                  alt={featuredDestination.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="inline-block px-4 py-2 bg-accent text-primary text-caption uppercase tracking-widest mb-4">
                    Featured Destination
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl text-cream mb-4">
                    {featuredDestination.name}
                  </h2>
                  <p className="text-cream/70 text-lg mb-6 max-w-md">
                    {featuredDestination.description}
                  </p>
                  <Link href={`/destinations/${featuredDestination.slug}`} className="btn-primary bg-cream text-primary hover:bg-cream-dark">
                    <span>Explore {featuredDestination.name}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Stats & Info */}
              <div className="flex flex-col justify-center space-y-8 lg:pl-12">
                <div>
                  <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">
                    Why {featuredDestination.name}?
                  </p>
                  <h3 className="font-display text-display-lg text-primary mb-4">
                    A destination for the
                    <span className="italic"> soul</span>
                  </h3>
                  <p className="text-primary/60 text-body-lg">
                    {featuredDestination.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { value: featuredDestination.tripCount || '0', label: 'Experiences' },
                    { value: '4.9', label: 'Avg Rating' },
                    { value: '12', label: 'Hotels' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-cream-dark">
                      <div className="font-display text-3xl text-secondary mb-1">{stat.value}</div>
                      <div className="text-caption uppercase tracking-widest text-primary/50">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Destinations Grid */}
      <section className="py-16 md:py-24 bg-cream-dark">
        <div className="section-container">
          {(loading || filteredDestinations.length > 0) && (
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">
                  All Destinations
                </p>
                {filteredDestinations.length > 0 && (
                  <h2 className="font-display text-display-lg text-primary">
                    Where will you go?
                  </h2>
                )}
              </div>
              <p className="text-primary/60 hidden md:block">
                {loading ? 'Loading...' : `${filteredDestinations.length} destinations to explore`}
              </p>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[450px] bg-cream animate-pulse" />
              ))}
            </div>
          ) : filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredDestinations.map((destination, index) => (
                <DestinationCard key={destination.id} destination={destination} index={index} />
              ))}
            </div>
          ) : (
            <EmptyStateCustomPlan
              scopeFilter={scopeFilter}
              activeRegion={activeRegion}
              onViewAll={() => { setActiveRegion('All Regions'); router.replace('/destinations'); }}
            />
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-secondary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg mb-4">
            Get inspired
          </h2>
          <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
            Subscribe for destination guides, travel tips, and exclusive offers delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent"
            />
            <button type="submit" className="btn-primary bg-accent text-primary hover:bg-accent-warm">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default function DestinationsPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><div className="animate-pulse text-primary/50">Loading...</div></div>}>
      <DestinationsContent />
    </Suspense>
  );
}