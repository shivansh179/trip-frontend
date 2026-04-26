'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Calendar, MapPin, Ticket, Phone, Users, Star, Camera, Music, Briefcase, Heart, ChevronRight, Check, Sparkles, UtensilsCrossed, X, CheckCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Event as EventType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const eventCategories = [
  {
    icon: Briefcase,
    title: 'Corporate Events',
    desc: 'Team outings, offsites, conferences, and incentive trips across India\'s best destinations. We handle logistics so your team just shows up.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
    color: 'bg-primary',
  },
  {
    icon: Heart,
    title: 'Weddings & Celebrations',
    desc: 'Destination weddings, sangeet nights, mehendi ceremonies, and anniversary getaways. Royal venues, floral decor, and seamless coordination.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
    color: 'bg-secondary',
  },
  {
    icon: Camera,
    title: 'Cultural Experiences',
    desc: 'Holi festivals, Diwali celebrations, cooking classes, heritage walks, and immersive cultural programs for groups and individuals.',
    image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=600&q=80',
    color: 'bg-terracotta',
  },
  {
    icon: Music,
    title: 'Group Adventures',
    desc: 'Wildlife safaris, river rafting, trekking expeditions, and sunset desert camps. Curated adventures for groups of all sizes.',
    image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=600&q=80',
    color: 'bg-accent',
  },
];

const whyUs = [
  { icon: Users, title: '500+ Events Delivered', desc: 'From intimate gatherings of 10 to corporate events of 2,000+. We\'ve done it all across India.' },
  { icon: MapPin, title: 'Pan-India Reach', desc: 'Rajasthan palaces, Kerala backwaters, Goa beachfronts, Himalayan camps — we operate everywhere.' },
  { icon: Star, title: 'Handpicked Venues', desc: 'Heritage havelis, luxury resorts, forest lodges, and rooftop terraces. We know India\'s best event venues.' },
  { icon: Phone, title: '24/7 On-Ground Support', desc: 'A dedicated event coordinator is with your group from arrival to departure. Nothing falls through the cracks.' },
];

const destinationEvents = [
  { city: 'Rajasthan', tag: 'Palace Weddings & Offsites', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80' },
  { city: 'Kerala', tag: 'Backwater Retreats & Wellness', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80' },
  { city: 'Goa', tag: 'Beach Events & Celebrations', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80' },
  { city: 'Himalayas', tag: 'Adventure & Team Building', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80' },
];

const PARTY_EVENTS = [
  {
    id: 'club-party-ncr',
    title: 'Club Night NCR 🎉',
    subtitle: 'The Ultimate Club Party Experience',
    desc: 'Delhi NCR\'s hottest club night — premium DJ set, open bar, curated cocktail menu, and live food stations. Pre-book your spot before it sells out.',
    location: 'Delhi NCR (Venue disclosed on booking)',
    category: 'Club Party',
    price: 2000,
    perks: ['Open bar (beer, spirits, cocktails)', 'Live food stations', 'Premium DJ set', 'VIP entry & seating', 'Midnight snacks included'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    badge: 'Club Night',
    badgeColor: 'bg-gray-700',
    spotsLeft: 0,
    whatsapp: 'Hi! I\'d like to pre-book the Club Night NCR party. Please share venue details and availability.',
  },
  {
    id: 'house-party',
    title: 'House Party Vibes 🏠',
    subtitle: 'Exclusive Curated House Party',
    desc: 'Intimate yet electric — a curated house party with a chill lounge vibe, chef-crafted finger food, artisan cocktails, and a surprise DJ set. Limited seats only.',
    location: 'South Delhi / Gurgaon (location shared on booking)',
    category: 'House Party',
    price: 2000,
    perks: ['Craft cocktails & mocktails', 'Chef-made finger food & desserts', 'DJ + curated playlist', 'Instagram-worthy setup', 'Goodie bag on entry'],
    image: 'https://images.unsplash.com/photo-1574270981993-49ccc2e7f63e?w=800&q=80',
    badge: 'House Party',
    badgeColor: 'bg-gray-700',
    spotsLeft: 0,
    whatsapp: 'Hi! I\'d like to pre-book the House Party. Please share venue details and availability.',
  },
];

// ── Callback Modal ─────────────────────────────────────────────────────────────
function EventCallbackModal({ prefilledType, onClose }: { prefilledType: string; onClose: () => void }) {
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    eventType: prefilledType,
    guests: '', preferredDate: '', notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/events/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed. Please try again.'); return; }
      setTicket(data.ticket);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: 'min(92dvh, 92vh)', overflow: 'hidden' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Request a Callback</h3>
            <p className="text-xs text-gray-500 mt-0.5">We'll call you within 1 hour · Free consultation</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
          {ticket ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-lg">Request Received!</h4>
              <p className="text-gray-500 text-sm max-w-xs">
                Our event specialist will call you within <strong>1 hour</strong>. Keep your phone handy!
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 mt-1">
                <p className="text-xs text-amber-700 font-medium">Your Ticket Number</p>
                <p className="font-mono text-lg font-bold text-amber-900">{ticket}</p>
              </div>
              <a
                href={`https://wa.me/918427831127?text=Hi!%20I%20just%20submitted%20event%20callback%20request.%20Ticket:%20${ticket}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Also message on WhatsApp
              </a>
              <button onClick={onClose} className="text-sm text-gray-400 hover:text-gray-600 mt-1">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-5 space-y-4 pb-8">
              {/* Event type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Event Type *</label>
                <select
                  required
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-amber-400"
                >
                  <option value="">Select event type…</option>
                  <option>Corporate Events</option>
                  <option>Weddings & Celebrations</option>
                  <option>Cultural Experiences</option>
                  <option>Group Adventures</option>
                  <option>Birthday / Anniversary</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Name + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name *</label>
                  <input required type="text" placeholder="Full name" maxLength={100}
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-amber-400 placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input required type="tel" placeholder="+91 98765 43210" maxLength={20}
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-amber-400 placeholder:text-gray-400" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="email" placeholder="your@email.com"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-amber-400 placeholder:text-gray-400" />
              </div>

              {/* Guests + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Number of Guests</label>
                  <select
                    value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white outline-none focus:border-amber-400"
                  >
                    <option value="">Select size…</option>
                    <option>1–10 guests</option>
                    <option>11–25 guests</option>
                    <option>26–50 guests</option>
                    <option>51–100 guests</option>
                    <option>100+ guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Date</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]}
                    value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-amber-400" />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Event Details / Notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Venue preference, theme, budget range, special requirements…"
                  maxLength={500}
                  value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-amber-400 placeholder:text-gray-400 resize-none"
                />
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm rounded-xl transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                {submitting ? 'Submitting…' : 'Request Callback'}
              </button>
              <p className="text-center text-[11px] text-gray-400">We'll call you within 1 hour · Free consultation · No obligation</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Events');
  const [callbackModal, setCallbackModal] = useState<string | null>(null); // holds pre-filled event type

  const eventFilters = ['All Events', 'Party', 'Corporate', 'Wedding', 'Cultural', 'Adventure'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.getEvents();
        const data = response.data;
        const raw: EventType[] = Array.isArray(data) ? data : (data && Array.isArray(data.content) ? data.content : []);
        // Filter out internal/test events (e.g. FlightPayment001)
        const list = raw.filter((e) => {
          const t = (e.title || '').toLowerCase();
          const cat = (e.category || '').toLowerCase();
          return !t.includes('flight') && !t.includes('payment') && cat !== 'internal';
        });
        setEvents(list);
        setError(null);
      } catch {
        setError('Unable to load events.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Events', url: 'https://www.ylootrips.com/events' },
      ]} />

      {/* ── HERO ── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=85"
          alt="Royal palace events across India — YlooTrips event planning"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-primary/30" />
        <div className="absolute inset-0 flex items-center pt-20">
          <div className="section-container text-cream">
            <p className="text-caption uppercase tracking-[0.4em] text-cream/60 mb-4">Events & Experiences</p>
            <h1 className="font-display text-display-xl text-cream max-w-3xl leading-tight mb-6">
              Unforgettable Events.<br />
              <span className="italic text-cream/80">Extraordinary</span> Destinations.
            </h1>
            <p className="text-cream/75 text-body-lg max-w-xl mb-10 leading-relaxed">
              Corporate offsites, destination weddings, cultural festivals, and group adventures — planned and delivered across India&apos;s most spectacular venues.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setCallbackModal('')}
                className="btn-primary bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-sm uppercase tracking-widest"
              >
                Plan My Event
              </button>
              <a
                href="#party-events"
                className="px-8 py-4 border border-cream/30 text-cream/70 text-sm uppercase tracking-widest hover:bg-cream/10 transition-colors"
              >
                Party Events · ₹2,000
              </a>
            </div>
          </div>
        </div>
        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary/80 backdrop-blur-sm">
          <div className="section-container">
            <div className="grid grid-cols-3 divide-x divide-cream/10 py-4">
              {[
                { num: '500+', label: 'Events Organised' },
                { num: '50+', label: 'Destinations' },
                { num: '98%', label: 'Client Satisfaction' },
              ].map(({ num, label }) => (
                <div key={label} className="text-center px-4 py-1">
                  <div className="font-display text-2xl text-cream">{num}</div>
                  <div className="text-cream/60 text-caption uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT CATEGORIES ── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">What We Plan</p>
            <h2 className="font-display text-display-lg text-primary">
              Every occasion, <span className="italic">expertly crafted</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {eventCategories.map(({ icon: Icon, title, desc, image }) => (
              <button key={title} onClick={() => setCallbackModal(title)} className="group relative overflow-hidden bg-cream-light border border-primary/8 hover:shadow-xl transition-all duration-500 text-left w-full">
                <div className="relative h-48 overflow-hidden">
                  <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80'; }} />
                  <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/20 transition-colors duration-500" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-cream/15 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cream" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-primary mb-2 group-hover:text-secondary transition-colors">{title}</h3>
                  <p className="text-sm text-primary/60 leading-relaxed">{desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-secondary text-caption font-medium uppercase tracking-wider group-hover:gap-2 transition-all">
                    Request Callback <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-caption uppercase tracking-[0.3em] text-cream/50 mb-3">Why YlooTrips</p>
            <h2 className="font-display text-display-lg text-cream">
              India&apos;s events, <span className="italic text-cream/70">without the stress</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUs.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 border border-cream/20 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-cream/60" />
                </div>
                <h3 className="font-display text-xl text-cream mb-3">{title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-10 border-t border-cream/10 flex flex-wrap items-center justify-center gap-6">
            {['Free site visits for large groups', 'Customisable packages', 'Transparent pricing', 'Visa & travel assistance included'].map((p) => (
              <div key={p} className="flex items-center gap-2 text-sm text-cream/70">
                <Check className="w-4 h-4 text-cream/60 shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF BAR ── */}
      <div className="bg-primary/5 border-y border-primary/10 py-4">
        <div className="section-container flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-primary/70">
          <span>✓ Free consultation</span>
          <span>✓ Custom packages for all budgets</span>
          <span>✓ Dedicated coordinator</span>
          <span>✓ Reply in under 1 hour</span>
        </div>
      </div>

      {/* ── PARTY EVENTS ── */}
      <section id="party-events" className="py-20 md:py-28 bg-gradient-to-br from-primary via-primary/95 to-[#1a0a2e]">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-caption uppercase tracking-[0.3em] text-cream/50 mb-3">NCR · ₹2,000 per person</p>
            <h2 className="font-display text-display-lg text-cream">
              Party Events <span className="italic text-cream/70">NCR</span>
            </h2>
            <p className="text-cream/60 text-body mt-3 max-w-xl mx-auto">
              ₹2,000 per person · Includes food &amp; drinks · Pre-book your spot before it sells out
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {PARTY_EVENTS.map((party) => (
              <div key={party.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group hover:border-white/30 transition-all duration-500">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={party.image}
                    alt={party.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?w=800&q=80'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`${party.badgeColor} text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full`}>
                      {party.badge}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">{party.category}</span>
                    <h3 className="font-display text-xl text-white mt-0.5">{party.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-cream/60 text-sm leading-relaxed mb-4">{party.desc}</p>

                  {/* Perks */}
                  <div className="space-y-1.5 mb-5">
                    {party.perks.map((perk) => (
                      <div key={perk} className="flex items-center gap-2 text-xs text-cream/70">
                        <Check className="w-3.5 h-3.5 text-white/60 shrink-0" />
                        {perk}
                      </div>
                    ))}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-cream/50 mb-5">
                    <MapPin className="w-3.5 h-3.5 text-white/60 shrink-0" />
                    {party.location}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-[10px] text-cream/40 uppercase tracking-wider">Per Person</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-2xl text-white">₹2,000</span>
                        <span className="text-xs text-cream/50 flex items-center gap-1"><UtensilsCrossed className="w-3 h-3" /> food &amp; drinks incl.</span>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/918427831127?text=${encodeURIComponent(party.whatsapp)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-900 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-200 shadow-lg shadow-black/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Pre-Book
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-cream/40 text-xs mt-8">
            Payment collected at venue · Confirmation sent on WhatsApp · 48-hr cancellation policy
          </p>
        </div>
      </section>

      {/* ── UPCOMING / LIVE EVENTS ── */}
      <section id="upcoming-events" className="py-20 md:py-28 bg-cream-dark">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Live Listings</p>
              <h2 className="font-display text-display-lg text-primary">Upcoming Events</h2>
            </div>
            <Link href="/contact" className="btn-outline shrink-0">
              Request Custom Event
            </Link>
          </div>
          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {eventFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 text-xs uppercase tracking-widest rounded-full transition-all border ${activeFilter === filter
                  ? 'bg-secondary text-cream border-secondary'
                  : 'bg-transparent text-primary/60 border-primary/20 hover:border-secondary/50 hover:text-secondary'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {loading && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-cream animate-pulse" />
              ))}
            </div>
          )}

          {!loading && (error || events.length === 0) && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Rajasthan Royal Diwali Celebration',
                  desc: 'An evening of fireworks, royal thali dinner, and cultural performances at a 17th-century haveli in Jaipur.',
                  category: 'Cultural Festival',
                  city: 'Jaipur',
                  date: 'Oct 2025',
                  price: 4500,
                  image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80',
                },
                {
                  title: 'Kerala Backwater Corporate Offsite',
                  desc: '3-day houseboat retreat for teams — Ayurveda sessions, team building, and sunset cruises through the backwaters.',
                  category: 'Corporate',
                  city: 'Alleppey',
                  date: 'Nov 2025',
                  price: 18000,
                  image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
                },
                {
                  title: 'Thar Desert Sunset Camp Experience',
                  desc: 'Overnight desert camp with camel ride, folk music, bonfire dinner, and stargazing in the Thar Desert.',
                  category: 'Adventure',
                  city: 'Jaisalmer',
                  date: 'Dec 2025',
                  price: 6500,
                  image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80',
                },
              ].map((ev) => (
                <article key={ev.title} className="bg-cream overflow-hidden border border-primary/8 hover:shadow-xl transition-all duration-500 group">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={ev.image} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80'; }} />
                    <div className="absolute inset-0 bg-primary/20" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-accent text-primary text-[10px] uppercase tracking-widest font-medium">
                        {ev.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                      {ev.title}
                    </h3>
                    <p className="text-sm text-primary/55 line-clamp-2 mb-4 leading-relaxed">{ev.desc}</p>
                    <div className="flex items-center gap-4 text-caption text-primary/50 mb-5">
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{ev.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{ev.city}</span>
                    </div>
                    <div className="flex items-center justify-between border-t border-primary/8 pt-4">
                      <div>
                        <p className="text-caption text-primary/40 uppercase tracking-wider">From</p>
                        <p className="font-display text-xl text-primary">{formatPrice(ev.price)}</p>
                      </div>
                      <Link href="/contact" className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-cream text-xs font-semibold uppercase tracking-widest hover:bg-secondary/80 transition-colors">
                        Book Tickets <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeFilter === 'All Events' ? events : events.filter(e => e.category?.toLowerCase().includes(activeFilter.toLowerCase()))).map((event) => {
                const price = typeof event.price === 'number' ? event.price : parseFloat(String(event.price ?? 0));
                const dateStr = typeof event.eventDate === 'string' ? event.eventDate : '';
                return (
                  <article key={event.id} className="bg-cream overflow-hidden border border-primary/8 hover:shadow-xl transition-all duration-500 group">
                    <Link href={`/events/${event.slug || event.id}`} className="block">
                      <div className="relative h-56 overflow-hidden">
                        {event.imageUrl ? (
                          <Image src={event.imageUrl} alt={event.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-primary/5 flex items-center justify-center">
                            <Ticket className="w-16 h-16 text-primary/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-primary/15" />
                        {event.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-accent text-primary text-[10px] uppercase tracking-widest font-medium">Featured</span>
                          </div>
                        )}
                        {event.category && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-primary/70 text-cream text-[10px] uppercase tracking-widest">{event.category}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-xl text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                          {event.title}
                        </h3>
                        {event.shortDescription && (
                          <p className="text-sm text-primary/55 line-clamp-2 mb-4 leading-relaxed">{event.shortDescription}</p>
                        )}
                        <div className="flex items-center gap-4 text-caption text-primary/50 mb-5">
                          {dateStr && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          )}
                          {event.city && (
                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.city}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between border-t border-primary/8 pt-4">
                          <div>
                            <p className="text-caption text-primary/40 uppercase tracking-wider">From</p>
                            <p className="font-display text-xl text-primary">
                              {formatPrice(price)}
                              {event.originalPrice && (
                                <span className="text-sm text-primary/40 line-through ml-2">
                                  {formatPrice(typeof event.originalPrice === 'number' ? event.originalPrice : parseFloat(String(event.originalPrice)))}
                                </span>
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-cream text-xs font-semibold uppercase tracking-widest hover:bg-secondary/80 transition-colors">
                            Book Tickets <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── DESTINATION EVENTS ── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="section-container">
          <div className="text-center mb-14">
            <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Where We Operate</p>
            <h2 className="font-display text-display-lg text-primary">
              Events across <span className="italic">India&apos;s finest</span> destinations
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {destinationEvents.map(({ city, tag, image }) => (
              <button
                key={city}
                onClick={() => setCallbackModal(`Event in ${city}`)}
                className="group relative h-72 overflow-hidden text-left w-full"
              >
                <Image src={image} alt={`${city} events`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80'; }} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-caption uppercase tracking-wider text-accent mb-1">{tag}</p>
                  <h3 className="font-display text-xl text-cream">{city}</h3>
                  <p className="text-cream/50 text-xs mt-1 group-hover:text-cream/80 transition-colors">Request callback →</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUICK ENQUIRY FORM ── */}
      <section className="py-20 md:py-28 bg-cream-dark">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Get Started</p>
              <h2 className="font-display text-display-lg text-primary mb-6">
                Let&apos;s plan your<br /><span className="italic">celebration</span>
              </h2>
              <p className="text-primary/60 text-body-lg leading-relaxed mb-8">
                Tell us about your event and we&apos;ll get back to you within 1 hour with venue options, pricing, and a customised proposal.
              </p>
              <div className="space-y-4">
                {[
                  'Free consultation & venue suggestions',
                  'Custom packages for all budgets',
                  'Dedicated coordinator from start to finish',
                  'On-ground support across all Indian cities',
                ].map((p) => (
                  <div key={p} className="flex items-center gap-3 text-primary/70 text-sm">
                    <div className="w-5 h-5 bg-accent/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    {p}
                  </div>
                ))}
              </div>
              <div className="mt-10 flex items-center gap-4">
                <a
                  href="https://wa.me/918427831127"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  <Phone className="w-4 h-4" /> WhatsApp Us Now
                </a>
                <p className="text-primary/50 text-caption">Reply in &lt; 1 hour</p>
              </div>
            </div>

            {/* Right — Callback CTA */}
            <div className="bg-cream border border-primary/10 p-8 flex flex-col items-center justify-center text-center gap-6">
              <div className="w-16 h-16 bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto">
                <Phone className="w-7 h-7 text-primary/60" />
              </div>
              <div>
                <h3 className="font-display text-2xl text-primary mb-2">Get a Free Callback</h3>
                <p className="text-primary/55 text-sm leading-relaxed">
                  Share your event details and our specialist will call you within <strong>1 hour</strong> with venue options and a custom quote.
                </p>
              </div>
              <button
                onClick={() => setCallbackModal('')}
                className="btn-primary w-full py-4 text-sm uppercase tracking-widest"
              >
                Request Callback Now
              </button>
              <p className="text-caption text-primary/40">Free · No obligation · Reply in &lt; 1 hour</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg text-cream mb-4">
            Ready to create something <span className="italic text-accent">extraordinary?</span>
          </h2>
          <p className="text-cream/55 text-body-lg max-w-xl mx-auto mb-10">
            From a 10-person desert camp to a 500-person corporate gala — we&apos;ve planned it all. Let&apos;s start with a conversation.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setCallbackModal('')}
              className="btn-primary bg-accent text-primary hover:bg-accent-warm px-10 py-4 text-sm uppercase tracking-widest"
            >
              Get a Free Quote
            </button>
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%27d%20like%20to%20discuss%20an%20event%20with%20YlooTrips."
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 border border-cream/30 text-cream text-sm uppercase tracking-widest hover:bg-cream/10 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* ── CALLBACK MODAL ── */}
      {callbackModal !== null && (
        <EventCallbackModal
          prefilledType={callbackModal}
          onClose={() => setCallbackModal(null)}
        />
      )}

    </div>
  );
}
