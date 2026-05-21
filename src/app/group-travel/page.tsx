import type { Metadata } from 'next';
import Link from 'next/link';
import { Users, Star, Shield, Zap, Phone, MessageCircle, Check, ChevronRight, Award, MapPin, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Group Tour Packages India 2026 — 4+ People Get 20% Off | YlooTrips',
  description: 'Plan group trips across India and abroad. Corporate outings, college trips, family reunions, friends getaways. 4+ people get 20% off. Custom itineraries, dedicated coordinator, group discounts.',
  keywords: 'group tour packages India, group travel India, corporate trip packages, college group trips, family group tours, group holiday India, group trip planner, group discount travel India',
  openGraph: {
    title: 'Group Tour Packages India 2026 — 20% Off for Groups of 4+',
    description: 'Corporate outings, college trips, family reunions. Custom itineraries, dedicated coordinator, group discounts on all packages.',
    url: 'https://www.ylootrips.com/group-travel',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80', width: 1200, height: 630, alt: 'Group of friends travelling together in India' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/group-travel' },
};

const PERKS = [
  { icon: Award, title: '20% Group Discount', body: 'Groups of 4 or more get 20% off any package automatically. Larger groups get even more — ask us.' },
  { icon: Users, title: 'Dedicated Coordinator', body: 'Every group gets a personal trip coordinator who handles logistics, queries, and on-ground support.' },
  { icon: Zap, title: 'Custom Itineraries', body: "Tell us your dates, budget, and interests — we'll build a tailored itinerary for your group within 24 hours." },
  { icon: Shield, title: 'Flexible Cancellation', body: 'Groups can cancel up to 15 days before departure for a full refund. Rescheduling is always free.' },
  { icon: Star, title: 'Best Price Guarantee', body: "Find the same group package cheaper elsewhere and we'll match it — no questions asked." },
  { icon: Phone, title: '24/7 WhatsApp Support', body: 'A real human on WhatsApp throughout your trip. No bots, no hold music — just instant help.' },
];

const POPULAR = [
  { dest: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', price: '₹10,399/person', tag: 'Most Popular' },
  { dest: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', price: '₹7,999/person', tag: 'Beach Getaway' },
  { dest: 'Rajasthan', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', price: '₹11,999/person', tag: 'Heritage Trip' },
  { dest: 'Bali', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', price: '₹41,999/person', tag: 'International' },
  { dest: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', price: '₹12,799/person', tag: 'Backwaters' },
  { dest: 'Ladakh', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', price: '₹18,399/person', tag: 'Adventure' },
];

const TYPES = [
  { label: 'Corporate & Team Outings', icon: '🏢', desc: 'Team building, offsite meetings, annual retreats. We handle everything.' },
  { label: 'College & Student Trips', icon: '🎓', desc: 'Budget-friendly packages for 10–100 students with certified guides.' },
  { label: 'Family Reunions', icon: '👨‍👩‍👧‍👦', desc: 'Multi-generational groups with kid-friendly and elderly-friendly itineraries.' },
  { label: 'Friends Getaways', icon: '🎉', desc: 'Bachelor/bachelorette parties, birthday trips, reunion getaways.' },
  { label: 'Religious & Pilgrimage', icon: '🛕', desc: 'Char Dham, Vaishno Devi, Tirupati, Shirdi — managed group pilgrimages.' },
  { label: 'Adventure Groups', icon: '🧗', desc: 'Treks, rafting, camping — specialist guides for adrenaline-focused groups.' },
];

export default function GroupTravelPage() {
  return (
    <main className="min-h-screen bg-white pt-20">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-gray-900/50 to-gray-900/80" />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6">
            <Users size={13} /> Group Travel Specialists
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Travel Better,<br className="hidden sm:block" /> Together
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Groups of 4+ get <strong className="text-white">20% off</strong> every package. Custom itineraries, dedicated coordinator, and memories that last a lifetime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="https://wa.me/918427831127?text=Hi%20I%20want%20to%20plan%20a%20group%20trip" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-sm">
              <MessageCircle size={16} />
              WhatsApp for Group Quote
            </Link>
            <Link href="/trip-planner"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors text-sm">
              Plan with AI
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-10 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '5,000+', label: 'Groups handled' },
            { value: '4.9★', label: 'Google reviews' },
            { value: '20%', label: 'Group discount' },
            { value: '24h', label: 'Custom quote' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Group types */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 text-center mb-2">We Handle Every Kind of Group</p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-10">What Kind of Group Are You?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TYPES.map((t) => (
              <div key={t.label} className="bg-gray-50 rounded-2xl p-5 hover:bg-gray-100 transition-colors">
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{t.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 text-center mb-2">Why Book With Us</p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-10">Group Travel Made Easy</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-4">
                  <p.icon size={18} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular group destinations */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 text-center mb-2">Group Picks</p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-10">Popular Group Destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {POPULAR.map((d) => (
              <Link key={d.dest} href="/trip-planner"
                className="relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer block">
                <img src={d.image} alt={d.dest} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/60 bg-white/10 px-2 py-0.5 rounded-full">{d.tag}</span>
                  <p className="text-white font-bold mt-1">{d.dest}</p>
                  <p className="text-white/70 text-xs">{d.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-10">How Group Booking Works</h2>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Tell Us About Your Group', body: 'WhatsApp us or fill the form with group size, dates, budget, and destination. We respond within 2 hours.' },
              { step: '02', title: 'Get a Custom Itinerary', body: "We build a tailored itinerary within 24 hours — day-by-day plan, accommodation, transport, and exact pricing." },
              { step: '03', title: 'Lock Your Dates', body: 'Confirm with a small group deposit (25%). Remaining balance due 7 days before departure.' },
              { step: '04', title: 'Travel & Enjoy', body: 'Your dedicated coordinator handles everything on the ground. Just show up and make memories.' },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="text-3xl font-black text-gray-200 font-mono shrink-0 w-10">{s.step}</div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto bg-gray-900 rounded-3xl p-10 text-center text-white">
          <h2 className="font-serif text-3xl font-bold mb-3">Ready to Plan Your Group Trip?</h2>
          <p className="text-white/70 mb-7">WhatsApp us for a free custom quote within 2 hours. Groups of 4+ get 20% off automatically.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="https://wa.me/918427831127?text=Hi%20I%20want%20to%20plan%20a%20group%20trip" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3.5 rounded-full hover:bg-gray-100 transition-colors text-sm">
              <MessageCircle size={15} />
              WhatsApp: +91-84278-31127
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition-colors text-sm">
              Send Enquiry
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
