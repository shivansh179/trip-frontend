'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Lock, Clock, Phone, Star, CreditCard, ArrowRight } from 'lucide-react';

/* ─── data ──────────────────────────────────────────────────────────────── */

function bookedToday() {
  const d = new Date().getDate() + new Date().getMonth() * 31;
  return 18 + (d % 14);
}

const TRUST_BADGES = [
  { icon: ShieldCheck, color: 'text-green-400',  bg: 'bg-green-500/10',  label: 'Govt. Registered', sub: 'MSME Certified' },
  { icon: Lock,        color: 'text-blue-400',   bg: 'bg-blue-500/10',   label: '256-bit SSL',       sub: 'PCI-DSS Compliant' },
  { icon: Clock,       color: 'text-amber-400',  bg: 'bg-amber-500/10',  label: 'Reply < 1 Hr',      sub: '7 days a week' },
  { icon: Phone,       color: 'text-purple-400', bg: 'bg-purple-500/10', label: '24/7 Support',      sub: 'Emergency line' },
  { icon: Star,        color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: '4.9★ Google',       sub: '2,400+ reviews' },
];

const GUARANTEES = [
  { emoji: '💯', title: '100% Money-Back',       body: 'If we cancel for any reason, full refund — no questions, no delays.',        badge: 'Zero Risk',       color: 'from-green-500/20 to-green-500/5',  border: 'border-green-500/30',  tag: 'bg-green-500/15 text-green-300' },
  { emoji: '🔒', title: 'Lowest Price Match',    body: 'Find it cheaper within 48 hrs — we match it plus ₹500 WanderLoot credit.', badge: 'Best Price',      color: 'from-blue-500/20 to-blue-500/5',    border: 'border-blue-500/30',   tag: 'bg-blue-500/15 text-blue-300' },
  { emoji: '🛡️', title: 'Free 14-Day Cancel',   body: 'Cancel up to 14 days before departure — full refund, no hidden fees.',       badge: 'Flexible',        color: 'from-amber-500/20 to-amber-500/5',  border: 'border-amber-500/30',  tag: 'bg-amber-500/15 text-amber-300' },
  { emoji: '📞', title: '24/7 On-Trip Help',     body: 'Real human on WhatsApp round the clock. Hotel issue? We handle it now.',    badge: 'Always On',       color: 'from-purple-500/20 to-purple-500/5',border: 'border-purple-500/30', tag: 'bg-purple-500/15 text-purple-300' },
];

const MEDIA = [
  { name: 'Times of India',  short: 'TOI',  style: 'font-serif font-black text-red-400' },
  { name: 'Economic Times',  short: 'ET',   style: 'font-serif font-black text-blue-300' },
  { name: 'NDTV',            short: 'NDTV', style: 'font-black text-red-400' },
  { name: 'Condé Nast',      short: 'CNT',  style: 'font-serif italic font-semibold text-gray-300' },
  { name: 'Lonely Planet',   short: 'LP',   style: 'font-black text-green-400' },
  { name: 'TripAdvisor',     short: 'TA',   style: 'font-black text-[#00d9a6]' },
];

const HOTELS = [
  { name: 'Taj Hotels',      logo: '/hotels/taj.svg',      sub: 'Est. 1903' },
  { name: 'The Oberoi',      logo: '/hotels/oberoi.svg',   sub: 'Hotels & Resorts' },
  { name: 'ITC Hotels',      logo: '/hotels/itc.svg',      sub: 'Luxury Collection' },
  { name: 'The Leela',       logo: '/hotels/leela.svg',    sub: 'Palaces & Resorts' },
  { name: 'Marriott',        logo: '/hotels/marriott.svg', sub: 'International' },
  { name: 'Rambagh Palace',  logo: '/hotels/rambagh.svg',  sub: 'Jaipur · Heritage' },
  { name: 'Trident Hotels',  logo: '/hotels/trident.svg',  sub: 'by Oberoi Group' },
  { name: 'The Lalit',       logo: '/hotels/lalit.svg',    sub: 'Luxury Hotels' },
];

const AIRLINES = [
  { name: 'IndiGo',     emoji: '✈️', color: 'text-blue-400' },
  { name: 'Air India',  emoji: '🛫', color: 'text-red-400' },
  { name: 'Emirates',   emoji: '✈️', color: 'text-yellow-400' },
  { name: 'Vistara',    emoji: '✈️', color: 'text-purple-400' },
  { name: 'SpiceJet',   emoji: '🛫', color: 'text-orange-400' },
  { name: 'Easebuzz',   emoji: '🔒', color: 'text-indigo-400' },
];

const PAYMENTS_IN  = [
  { label: 'UPI',         cls: 'text-green-300   bg-green-500/10   border-green-500/30' },
  { label: 'RuPay',       cls: 'text-orange-300  bg-orange-500/10  border-orange-500/30' },
  { label: 'Net Banking', cls: 'text-gray-300    bg-white/5        border-white/10' },
  { label: '0% EMI',      cls: 'text-purple-300  bg-purple-500/10  border-purple-500/30' },
];
const PAYMENTS_INTL = [
  { label: 'Visa',        cls: 'text-blue-300    bg-blue-500/10    border-blue-500/30' },
  { label: 'Mastercard',  cls: 'text-red-300     bg-red-500/10     border-red-500/30' },
  { label: 'Amex',        cls: 'text-blue-200    bg-blue-500/10    border-blue-500/30' },
  { label: 'PayPal',      cls: 'text-blue-400    bg-blue-500/10    border-blue-500/30' },
];

const CERTS = [
  { icon: '🏛️', label: 'MSME Certified',   sub: 'Govt. of India' },
  { icon: '📋', label: 'GST Registered',    sub: 'Tax compliant' },
  { icon: '🔐', label: 'SSL Secured',       sub: '256-bit encryption' },
  { icon: '💳', label: 'PCI-DSS',           sub: 'Payment security' },
  { icon: '⏳', label: '12+ Years',         sub: 'Since 2012' },
  { icon: '⭐', label: '4.9★ Google',       sub: '2,400+ reviews' },
];

/* ─── 3-D hotel card ─────────────────────────────────────────────────────── */
function HotelCard({ name, logo, sub }: { name: string; logo: string; sub: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width  - 0.5;
    const py = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({ x: py * -14, y: px * 14 });
  };

  return (
    <div
      className="group cursor-default"
      style={{ perspective: 600 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setTilt({ x: 0, y: 0 }); }}
    >
      <div
        className="relative bg-white/90 backdrop-blur rounded-2xl border border-white/20 flex flex-col items-center justify-center p-4 w-[130px] h-[100px] md:w-full md:h-[110px] transition-all duration-200"
        style={{
          transform: hover
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(8px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          boxShadow: hover
            ? '0 20px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.4)'
            : '0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.3)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glare overlay */}
        {hover && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, rgba(255,255,255,0.18) 0%, transparent 70%)`,
            }}
          />
        )}
        <Image
          src={logo}
          alt={name}
          width={110}
          height={60}
          className="object-contain w-full h-14 opacity-80 group-hover:opacity-100 transition-opacity duration-200"
        />
        <p className="text-[8px] text-gray-400 uppercase tracking-wider mt-1 leading-none">{sub}</p>
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────── */
export default function TrustHub() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = bookedToday();
    let cur = 0;
    const step = Math.ceil(target / 18);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      setCount(cur);
      if (cur >= target) clearInterval(t);
    }, 55);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative bg-gradient-to-b from-[#0e0e14] via-[#111118] to-[#0a0a10] overflow-hidden">

      {/* Subtle grid texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* ── Live booking ticker ──────────────────────────────────────────── */}
      <div className="border-b border-white/5 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10">
        <div className="section-container py-2">
          <p className="text-center text-[10px] text-white/50 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
            <span className="text-white/80 font-bold">{count} trips</span>
            <span>booked in last 24 hrs · Slots filling fast</span>
          </p>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 space-y-14">

        {/* ── Trust badges ─────────────────────────────────────────────── */}
        <div>
          <p className="text-center text-[9px] uppercase tracking-[0.3em] text-white/25 mb-6">Why travelers trust us</p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {TRUST_BADGES.map(({ icon: Icon, color, bg, label, sub }) => (
              <div key={label}
                className={`flex items-center gap-2.5 ${bg} border border-white/8 rounded-2xl px-4 py-3 backdrop-blur hover:border-white/15 transition-all duration-300`}>
                <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
                  <Icon size={16} className={color} />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-white/85 uppercase tracking-wide leading-none">{label}</div>
                  <div className="text-[9px] text-white/35 leading-none mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Guarantee cards ──────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-6">
            <p className="text-[9px] uppercase tracking-[0.3em] text-amber-400/60 mb-2">Our Promise</p>
            <h2 className="font-display text-2xl md:text-3xl text-white">
              Book with <span className="italic text-amber-400">complete confidence</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {GUARANTEES.map(g => (
              <div key={g.title}
                className={`group relative bg-gradient-to-br ${g.color} border ${g.border} rounded-2xl p-5 flex gap-4 hover:scale-[1.01] transition-all duration-300 overflow-hidden`}>
                {/* Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
                <div className="text-3xl shrink-0 mt-0.5">{g.emoji}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-white text-sm">{g.title}</h3>
                    <span className={`${g.tag} text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>{g.badge}</span>
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed">{g.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Partner Hotels 3D ─────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-6">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-2">Our Partner Hotels</p>
            <h3 className="font-display text-2xl md:text-3xl text-white">
              Staying in <span className="italic text-amber-400">India&apos;s finest</span>
            </h3>
            <p className="text-xs text-white/35 mt-1.5">Hand-selected · Pre-inspected · Boutique to 5-star</p>
          </div>

          {/* 3D card grid */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
            style={{ perspective: 1000 }}>
            <div className="flex gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-4 lg:grid-cols-8">
              {HOTELS.map(h => <HotelCard key={h.name} {...h} />)}
            </div>
          </div>
          <p className="text-center text-[9px] text-white/20 uppercase tracking-widest mt-4">
            + 200 more curated properties across India &amp; the world
          </p>
        </div>

        {/* ── Media + Airlines row ──────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Media */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5 backdrop-blur">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-4 text-center">As featured in</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {MEDIA.map(m => (
                <span key={m.name} title={m.name}
                  className={`text-lg leading-none ${m.style} opacity-50 hover:opacity-90 transition-opacity duration-300 cursor-default select-none`}>
                  {m.short}
                </span>
              ))}
            </div>
          </div>

          {/* Airline + Payment partners */}
          <div className="bg-white/3 border border-white/8 rounded-2xl p-5 backdrop-blur">
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-4 text-center">Trusted partners</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {AIRLINES.map(a => (
                <div key={a.name} className={`flex items-center gap-1 ${a.color} opacity-50 hover:opacity-85 transition-opacity duration-300`}>
                  <span className="text-sm">{a.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment methods ───────────────────────────────────────────── */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 backdrop-blur">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard size={13} className="text-white/30" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">Secure payments via</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* India */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] text-white/25 uppercase tracking-wider flex items-center gap-1">🇮🇳 India</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {PAYMENTS_IN.map(p => (
                  <span key={p.label} className={`${p.cls} text-[9px] font-bold px-2.5 py-1 rounded border whitespace-nowrap`}>{p.label}</span>
                ))}
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            {/* International */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] text-white/25 uppercase tracking-wider flex items-center gap-1">🌍 International</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {PAYMENTS_INTL.map(p => (
                  <span key={p.label} className={`${p.cls} text-[9px] font-bold px-2.5 py-1 rounded border whitespace-nowrap`}>{p.label}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-[9px] text-white/15 mt-3">No card details stored · 256-bit encrypted</p>
        </div>

        {/* ── Certs bar ─────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-500/15 rounded-2xl px-6 py-5">
          <p className="text-[9px] text-amber-400/50 uppercase tracking-[0.3em] text-center mb-4">Verified Credentials</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {CERTS.map(c => (
              <div key={c.label} className="text-center group">
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-300">{c.icon}</div>
                <div className="text-[10px] font-semibold text-white/70">{c.label}</div>
                <div className="text-[8px] text-white/30 mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <div className="text-center">
          <Link href="/trip-planner"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-3.5 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/25">
            Plan My Trip — Zero Risk
            <ArrowRight size={16} />
          </Link>
          <p className="text-white/25 text-xs mt-2">No deposit until you confirm · Free itinerary in 24 hrs</p>
        </div>

      </div>
    </section>
  );
}
