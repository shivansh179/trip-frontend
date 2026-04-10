'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageCircle, FileText, Luggage, Compass,
  ShieldCheck, RefreshCcw, ArrowRight,
  Sparkles, MapPin, Clock, Wallet,
  Calendar, ArrowUpRight, Zap,
} from 'lucide-react';

/* ─── data ──────────────────────────────────────────────────────────────── */

const STEPS = [
  { n: '01', emoji: '💬', title: 'Tell us your dream',      sub: '2 MIN',        body: 'Fill a quick form or drop us a WhatsApp. Share your vibe, budget, dates, destinations. A real expert listens — not a bot.', grad: 'from-blue-500 to-violet-600',   glow: 'hover:shadow-blue-500/20' },
  { n: '02', emoji: '📋', title: 'Get your itinerary',      sub: '< 24 HRS',     body: 'Within 24 hours you get a day-by-day plan handcrafted just for you. No templates. Tweak anything until it\'s perfect.',       grad: 'from-amber-500 to-orange-600',  glow: 'hover:shadow-amber-500/20' },
  { n: '03', emoji: '🏨', title: 'We handle everything',    sub: 'FULLY MANAGED', body: 'Hotels, transfers, guides, entry tickets, visa help, 24/7 on-trip support. You confirm — we handle every detail.',            grad: 'from-emerald-500 to-teal-600',  glow: 'hover:shadow-emerald-500/20' },
  { n: '04', emoji: '🧭', title: 'You just explore',        sub: 'STRESS-FREE',  body: 'Land in India and your driver\'s waiting with your name. Your guide already knows your preferences. Just soak it in.',          grad: 'from-rose-500 to-pink-600',     glow: 'hover:shadow-rose-500/20' },
];

const EXAMPLES = [
  '5 days in Manali, ₹20,000 budget',
  '3 days Goa beach trip for 2',
  'Kerala backwaters, honeymoon, 7 days',
  'Rajasthan heritage tour, 10 days',
];

interface Holiday { name: string; date: string; emoji: string; isLongWeekend: boolean; longWeekendNote: string; tags: string[]; tripLink: string; }
interface WeekendTrip { from: string; dest: string; duration: string; emoji: string; type: string; href: string; km: string; }

const HOLIDAYS: Holiday[] = [
  { name: 'Dr Ambedkar Jayanti', date: '2026-04-14', emoji: '🇮🇳', isLongWeekend: false, longWeekendNote: 'Tuesday',                    tags: ['City Break'],          tripLink: '/trips?category=Tour'    },
  { name: 'Good Friday',         date: '2026-04-18', emoji: '✝️',  isLongWeekend: false, longWeekendNote: 'Saturday',                   tags: ['Beach','Relaxation'],  tripLink: '/trips?category=Beach'   },
  { name: 'Buddha Purnima',      date: '2026-05-12', emoji: '☸️',  isLongWeekend: false, longWeekendNote: 'Tuesday',                    tags: ['Spiritual','Heritage'],tripLink: '/trips?category=Tour'    },
  { name: 'Eid ul-Adha',         date: '2026-06-07', emoji: '🌙',  isLongWeekend: true,  longWeekendNote: 'Sun — extended weekend',     tags: ['Heritage','Culture'],  tripLink: '/trips?category=Tour'    },
  { name: 'Independence Day',    date: '2026-08-15', emoji: '🇮🇳', isLongWeekend: false, longWeekendNote: 'Saturday',                   tags: ['Hills','Trekking'],    tripLink: '/trips?category=Trekking'},
  { name: 'Janmashtami',         date: '2026-08-16', emoji: '🪷',  isLongWeekend: true,  longWeekendNote: 'Sun — extended weekend',     tags: ['Spiritual','Heritage'],tripLink: '/trips?category=Tour'    },
  { name: 'Ganesh Chaturthi',    date: '2026-08-27', emoji: '🐘',  isLongWeekend: true,  longWeekendNote: 'Thu — 4-day break possible', tags: ['Beach','Cultural'],    tripLink: '/trips?category=Tour'    },
  { name: 'Gandhi Jayanti',      date: '2026-10-02', emoji: '🇮🇳', isLongWeekend: true,  longWeekendNote: 'Fri — 3-day weekend',        tags: ['Heritage','Nature'],   tripLink: '/trips?category=Tour'    },
  { name: 'Dussehra',            date: '2026-10-11', emoji: '🏹',  isLongWeekend: false, longWeekendNote: 'Sunday',                     tags: ['Cultural','Heritage'], tripLink: '/trips?category=Tour'    },
  { name: 'Diwali',              date: '2026-10-20', emoji: '🪔',  isLongWeekend: true,  longWeekendNote: 'Tue — extended break',       tags: ['Heritage','Festive'],  tripLink: '/trips?category=Tour'    },
  { name: 'Christmas & New Year',date: '2026-12-25', emoji: '🎄',  isLongWeekend: true,  longWeekendNote: 'Fri — 4-day weekend',        tags: ['Beach','Hills'],       tripLink: '/trips?category=Beach'   },
];

const WEEKEND_TRIPS: WeekendTrip[] = [
  { from: 'Delhi',     dest: 'Jaipur',       duration: '2D 1N', emoji: '🏯', type: 'Heritage',  href: '/trips?q=Jaipur',         km: '280 km' },
  { from: 'Delhi',     dest: 'Rishikesh',    duration: '2D 1N', emoji: '🏄', type: 'Adventure', href: '/trips?category=Adventure',km: '240 km' },
  { from: 'Mumbai',    dest: 'Lonavala',     duration: '2D 1N', emoji: '⛰️', type: 'Nature',    href: '/trips?q=Lonavala',       km: '83 km'  },
  { from: 'Mumbai',    dest: 'Goa',          duration: '3D 2N', emoji: '🏖️', type: 'Beach',     href: '/trips?category=Beach',   km: '590 km' },
  { from: 'Bangalore', dest: 'Coorg',        duration: '2D 1N', emoji: '☕', type: 'Nature',    href: '/trips?q=Coorg',          km: '270 km' },
  { from: 'Bangalore', dest: 'Ooty',         duration: '2D 1N', emoji: '🌿', type: 'Hills',     href: '/trips?q=Ooty',           km: '265 km' },
  { from: 'Chennai',   dest: 'Pondicherry',  duration: '2D 1N', emoji: '🌊', type: 'Beach',     href: '/trips?category=Beach',   km: '150 km' },
  { from: 'Hyderabad', dest: 'Hampi',        duration: '3D 2N', emoji: '🗿', type: 'Heritage',  href: '/trips?q=Hampi',          km: '370 km' },
];

function fmtDate(d: string) { return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
function daysUntil(d: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(d).getTime() - today.getTime()) / 86400000);
}

/* ─── component ─────────────────────────────────────────────────────────── */
export default function PlanningHub() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [inputFocus, setInputFocus] = useState(false);
  const [plannerTab, setPlannerTab] = useState<'holidays' | 'weekends'>('holidays');
  const [filter, setFilter] = useState<'all' | 'long'>('all');

  const handleGo = (q?: string) => {
    const v = (q || query).trim();
    if (!v) return;
    router.push(`/trip-planner?q=${encodeURIComponent(v)}`);
  };

  const upcomingHolidays = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    return HOLIDAYS.filter(h => new Date(h.date) >= today).slice(0, 8);
  }, []);

  const displayedHolidays = filter === 'long'
    ? upcomingHolidays.filter(h => h.isLongWeekend)
    : upcomingHolidays;

  return (
    <div className="relative overflow-hidden">

      {/* ══════════════════════════════════════════════════════════════════
          PART 1 — How It Works  (light)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-gray-50 relative py-14 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-50 via-transparent to-transparent pointer-events-none" />

        <div className="section-container relative">
          {/* Header */}
          <div className="text-center mb-10 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">
              ✨ The Process
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
              Your trip in{' '}
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent italic">
                4 easy steps
              </span>
            </h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              25,000+ travelers planned India effortlessly with us. Here's exactly how it works.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative mb-10">
            {/* Connector */}
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-blue-200 via-amber-200 to-pink-200" />

            {STEPS.map(({ n, emoji, title, sub, body, grad, glow }, i) => (
              <div key={n}
                className={`group relative flex flex-col items-center text-center gap-4 p-6 rounded-3xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-xl ${glow} transition-all duration-300 hover:-translate-y-1`}>
                <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{emoji}</span>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-gray-100 text-gray-800 text-xs font-black flex items-center justify-center shadow-sm">{n}</span>
                </div>
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-2">{sub}</span>
                  <h3 className="font-bold text-base text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-10 z-10">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                      <ArrowRight size={12} className="text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Guarantees + CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
            {[{ e: '🛡️', l: 'Free cancellation · 14 days before' }, { e: '🔄', l: 'Reschedule any time — no fee' }].map(({ e, l }) => (
              <div key={l} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-50 border border-green-200">
                <span>{e}</span>
                <span className="text-sm text-green-800 font-semibold">{l}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-105 shadow-lg shadow-amber-500/30">
              Start Planning Now ✈️
            </Link>
            <a href="https://wa.me/918427831127?text=Hi!%20I'd%20like%20to%20plan%20a%20trip."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-green-500/20">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us 💬
            </a>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">Avg. reply under 1 hour · 7 days a week · No commitment</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PART 2 — AI Trip Planner  (dark)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0f0f14] py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%,#C4A77D 0%,transparent 50%),radial-gradient(circle at 80% 20%,#C17F59 0%,transparent 50%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wider uppercase px-4 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Yloo AI Trip Planner
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
            Get your itinerary<br />
            <span className="text-amber-400 italic">in seconds. Free.</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base mb-8 max-w-md mx-auto">
            Tell Yloo your destination, budget, and travel style — get a complete day-by-day plan instantly.
          </p>

          {/* Search bar */}
          <div className={`flex items-center bg-white rounded-2xl overflow-hidden transition-all duration-200 mb-4 ${inputFocus ? 'shadow-[0_0_0_3px_rgba(245,158,11,0.4)]' : 'shadow-xl'}`}>
            <MapPin className="w-4 h-4 text-amber-500 ml-4 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGo()}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              placeholder="e.g. 5 days in Manali, ₹20,000 budget, adventure lover..."
              className="flex-1 px-3 py-4 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none"
            />
            <button onClick={() => handleGo()}
              className="shrink-0 m-1.5 flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
              Plan It Free
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {EXAMPLES.map(ex => (
              <button key={ex} onClick={() => handleGo(ex)}
                className="text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 px-3 py-1.5 rounded-full transition-all">
                {ex}
              </button>
            ))}
          </div>

          {/* Value props */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {[
              { icon: Sparkles, l: 'AI-generated in seconds' },
              { icon: Clock,    l: 'Day-by-day itinerary'    },
              { icon: Wallet,   l: '100% free, no sign-up'   },
            ].map(({ icon: Icon, l }) => (
              <div key={l} className="flex items-center gap-1.5 text-white/35 text-xs">
                <Icon className="w-3.5 h-3.5 text-amber-400/60" />{l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          PART 3 — Holiday & Weekend Planner  (cream)
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-14 md:py-20 bg-[#f5f0e8]">
        <div className="section-container">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-700/60 mb-2">Plan Ahead</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900">
                Holiday & weekend <span className="italic text-amber-600">planner</span>
              </h2>
              <p className="text-gray-500 text-sm max-w-md mt-2">
                Never miss a long weekend. Plan your next escape around Indian public holidays and short breaks.
              </p>
            </div>
            {/* Tab toggle */}
            <div className="flex bg-white border border-gray-200 p-1 gap-1 rounded-xl self-start md:self-end shadow-sm">
              <button onClick={() => setPlannerTab('holidays')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${plannerTab === 'holidays' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                <Calendar className="w-3.5 h-3.5" /> Holidays
              </button>
              <button onClick={() => setPlannerTab('weekends')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${plannerTab === 'weekends' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                <MapPin className="w-3.5 h-3.5" /> Weekend Trips
              </button>
            </div>
          </div>

          {/* ── Holidays ── */}
          {plannerTab === 'holidays' && (
            <>
              <div className="flex gap-2 mb-6">
                {[
                  { v: 'all',  l: 'All Holidays' },
                  { v: 'long', l: '⚡ Long Weekends Only' },
                ].map(({ v, l }) => (
                  <button key={v} onClick={() => setFilter(v as 'all' | 'long')}
                    className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${filter === v ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-400'}`}>
                    {l}
                  </button>
                ))}
              </div>

              {displayedHolidays.length === 0 ? (
                <p className="text-center py-10 text-gray-400 text-sm">No more long weekends this year — check back in January!</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {displayedHolidays.map(h => {
                    const days = daysUntil(h.date);
                    const near = days <= 14;
                    return (
                      <div key={h.name}
                        className={`bg-white rounded-2xl border p-5 hover:shadow-lg transition-all duration-300 group relative ${h.isLongWeekend ? 'border-amber-200' : 'border-gray-100'}`}>
                        {h.isLongWeekend && (
                          <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-100 text-amber-700 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                            <Zap className="w-2.5 h-2.5" /> Long Weekend
                          </div>
                        )}
                        <div className="text-3xl mb-3">{h.emoji}</div>
                        <h3 className="font-bold text-base text-gray-900 mb-1 pr-24">{h.name}</h3>
                        <p className="text-xs text-gray-400 mb-0.5">{fmtDate(h.date)}</p>
                        <p className="text-xs text-amber-600/80 font-medium mb-3">{h.longWeekendNote}</p>
                        <div className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-3 ${near ? 'text-red-500' : 'text-gray-400'}`}>
                          <Clock className="w-3 h-3" />
                          {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow!' : `${days} days away`}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {h.tags.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-semibold uppercase tracking-wider rounded">{t}</span>)}
                        </div>
                        <Link href={h.tripLink} className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-gray-900 transition-colors">
                          Plan Trip <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-8 text-center">
                <Link href="/trips"
                  className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 text-gray-700 px-8 py-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all">
                  Browse All Trips <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}

          {/* ── Weekend trips ── */}
          {plannerTab === 'weekends' && (
            <>
              <p className="text-gray-500 text-sm mb-6">Quick getaways you can book for any upcoming weekend — curated by departure city.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {WEEKEND_TRIPS.map(t => (
                  <Link key={`${t.from}-${t.dest}`} href={t.href}
                    className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-amber-200 transition-all duration-300 group block">
                    <div className="text-3xl mb-3">{t.emoji}</div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">From {t.from}</p>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">{t.dest}</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        <Clock className="w-2.5 h-2.5" />{t.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                        <MapPin className="w-2.5 h-2.5" />{t.km}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{t.type}</span>
                      <ArrowUpRight className="w-4 h-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-8 p-5 bg-white border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-gray-900">Can't find your city?</p>
                  <p className="text-gray-500 text-sm">Tell us where you are — we'll suggest the best weekend escapes near you.</p>
                </div>
                <a href="https://wa.me/918427831127?text=Hi%2C+I'm+looking+for+a+weekend+trip+near+me."
                  target="_blank" rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Ask on WhatsApp
                </a>
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
}
