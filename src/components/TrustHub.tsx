'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck, Lock, Clock, Phone, Star, CreditCard, ArrowRight,
  Users, HeartHandshake, Award, Zap,
} from 'lucide-react';

/* ─── data ──────────────────────────────────────────────────────────────── */

const STATS = [
  { value: '3+',  label: 'Years',       sub: 'Est. 2022',    icon: Award,         grad: 'from-amber-400 to-orange-500'  },
  { value: '25K+', label: 'Travelers',   sub: '40+ countries',   icon: Users,         grad: 'from-blue-400 to-violet-500'   },
  { value: '4.9★', label: 'Rating',      sub: '2,400+ reviews',  icon: Star,          grad: 'from-yellow-400 to-amber-500'  },
  { value: '98%',  label: 'Satisfaction',sub: 'Would recommend', icon: HeartHandshake,grad: 'from-pink-400 to-rose-500'     },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, color: 'text-green-600',  bg: 'bg-green-50  border-green-200',  label: 'Govt. Registered', sub: 'MSME Certified'    },
  { icon: Lock,        color: 'text-blue-600',   bg: 'bg-blue-50   border-blue-200',   label: '256-bit SSL',      sub: 'PCI-DSS Compliant' },
  { icon: Clock,       color: 'text-amber-600',  bg: 'bg-amber-50  border-amber-200',  label: 'Reply < 1 Hr',     sub: '7 days a week'     },
  { icon: Phone,       color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', label: '24/7 Support',     sub: 'Emergency line'    },
  { icon: Star,        color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200', label: '4.9★ Google',      sub: '2,400+ reviews'    },
];

const GUARANTEES = [
  { emoji: '💯', title: '100% Money-Back',     body: 'If we cancel for any reason, full refund — no questions, no delays.',            badge: 'Zero Risk',   bc: 'bg-green-100 text-green-700',  border: 'border-green-200', bg: 'bg-green-50'  },
  { emoji: '🔒', title: 'Lowest Price Match',  body: 'Find it cheaper within 48 hrs — we match it plus ₹500 WanderLoot credit.',      badge: 'Best Price',  bc: 'bg-blue-100 text-blue-700',    border: 'border-blue-200',  bg: 'bg-blue-50'   },
  { emoji: '🛡️', title: 'Free 14-Day Cancel',  body: 'Cancel up to 14 days before departure — full refund, no hidden fees.',          badge: 'Flexible',    bc: 'bg-amber-100 text-amber-700',  border: 'border-amber-200', bg: 'bg-amber-50'  },
  { emoji: '📞', title: '24/7 On-Trip Help',   body: 'Real human on WhatsApp round the clock. Hotel issue? We handle it now.',        badge: 'Always On',   bc: 'bg-purple-100 text-purple-700',border: 'border-purple-200',bg: 'bg-purple-50' },
];

const REASONS = [
  { emoji: '🛡️', title: 'Licensed & Govt. Registered', body: 'MSME certified, Govt. of India registered. Your booking is legally protected end-to-end.',              color: 'text-blue-700',   bg: 'bg-blue-50   border-blue-100'   },
  { emoji: '⚡', title: 'Real Human · Under 1 Hour',   body: 'A real travel expert (not a bot) responds to every query. WhatsApp or email, 7 days a week.',           color: 'text-amber-700',  bg: 'bg-amber-50  border-amber-100'  },
  { emoji: '🗺️', title: 'Born & Based in India',       body: 'Our guides grew up in Rajasthan, Kerala, the Himalayas. Insider knowledge = extraordinary trips.',        color: 'text-green-700',  bg: 'bg-green-50  border-green-100'  },
  { emoji: '🧳', title: 'Private Tours — No Crowds',   body: 'Your own car, guide, and schedule. No strangers. No buses. Just your group and the open road.',          color: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' },
  { emoji: '🏨', title: 'Hotels Personally Inspected', body: 'Palace havelis in Jaipur, eco-lodges in Munnar — we\'ve stayed there. No surprises on arrival.',        color: 'text-rose-700',   bg: 'bg-rose-50   border-rose-100'   },
  { emoji: '💚', title: 'Free Cancel · Flex Dates',    body: 'Cancel free up to 14 days before. Reschedule any time at zero charge. We get it — life happens.',       color: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-100'},
];

const HOTELS = [
  { name: 'Taj Hotels',     logo: '/hotels/taj.svg',      sub: 'Est. 1903'        },
  { name: 'The Oberoi',     logo: '/hotels/oberoi.svg',   sub: 'Hotels & Resorts' },
  { name: 'ITC Hotels',     logo: '/hotels/itc.svg',      sub: 'Luxury Collection'},
  { name: 'The Leela',      logo: '/hotels/leela.svg',    sub: 'Palaces & Resorts'},
  { name: 'Marriott',       logo: '/hotels/marriott.svg', sub: 'International'    },
  { name: 'Rambagh Palace', logo: '/hotels/rambagh.svg',  sub: 'Jaipur · Heritage'},
  { name: 'Trident Hotels', logo: '/hotels/trident.svg',  sub: 'by Oberoi Group'  },
  { name: 'The Lalit',      logo: '/hotels/lalit.svg',    sub: 'Luxury Hotels'    },
];

const MEDIA = [
  { name: 'Times of India', short: 'TOI',  style: 'font-serif font-black text-red-700'     },
  { name: 'Economic Times', short: 'ET',   style: 'font-serif font-black text-blue-800'    },
  { name: 'NDTV',           short: 'NDTV', style: 'font-black text-red-600'                },
  { name: 'Condé Nast',     short: 'CNT',  style: 'font-serif italic font-semibold text-gray-700' },
  { name: 'Lonely Planet',  short: 'LP',   style: 'font-black text-green-700'              },
  { name: 'TripAdvisor',    short: 'TA',   style: 'font-black text-[#00af87]'              },
];

const AIRLINES = [
  { name: 'IndiGo',    emoji: '✈️', color: 'text-blue-700'   },
  { name: 'Air India', emoji: '🛫', color: 'text-red-700'    },
  { name: 'Emirates',  emoji: '✈️', color: 'text-yellow-700' },
  { name: 'Vistara',   emoji: '✈️', color: 'text-purple-700' },
  { name: 'SpiceJet',  emoji: '🛫', color: 'text-orange-700' },
  { name: 'Easebuzz',  emoji: '🔒', color: 'text-indigo-700' },
];

const PAYMENTS_IN   = ['UPI','RuPay','Net Banking','0% EMI'];
const PAYMENTS_INTL = ['Visa','Mastercard','Amex','PayPal'];

const CERTS = [
  { icon: '🏛️', label: 'MSME Certified',  sub: 'Govt. of India'   },
  { icon: '📋', label: 'GST Registered',   sub: 'Tax compliant'    },
  { icon: '🔐', label: 'SSL Secured',      sub: '256-bit encrypted'},
  { icon: '💳', label: 'PCI-DSS',          sub: 'Payment security' },
  { icon: '⏳', label: '3+ Years',        sub: 'Since 2022'       },
  { icon: '⭐', label: '4.9★ Google',      sub: '2,400+ reviews'   },
];

const FLAGS = ['🇺🇸','🇬🇧','🇦🇺','🇨🇦','🇩🇪','🇫🇷','🇳🇱','🇯🇵','🇸🇬','🇨🇭','🇸🇪','🇳🇿','🇦🇹','🇮🇹','🇪🇸','🇮🇱','🇰🇷','🇿🇦','🇧🇷','🇵🇹'];

/* ─── 3D hotel card ──────────────────────────────────────────────────────── */
function HotelCard({ name, logo, sub }: { name: string; logo: string; sub: string }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -12, y: ((e.clientX - r.left) / r.width - 0.5) * 12 });
  };
  return (
    <div className="group cursor-default" style={{ perspective: 600 }}
      onMouseMove={onMove} onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setTilt({ x: 0, y: 0 }); }}>
      <div className="relative bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center p-4 w-[130px] h-[100px] md:w-full md:h-[110px] transition-all duration-200 hover:border-amber-300"
        style={{
          transform: hover ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(6px)` : 'none',
          boxShadow: hover ? '0 16px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(245,158,11,0.2)' : '0 2px 8px rgba(0,0,0,0.06)',
          transformStyle: 'preserve-3d',
        }}>
        <Image src={logo} alt={name} width={110} height={60}
          className="object-contain w-full h-14 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
        <p className="text-[8px] text-gray-400 uppercase tracking-wider mt-1">{sub}</p>
      </div>
    </div>
  );
}

/* ─── main ───────────────────────────────────────────────────────────────── */
export default function TrustHub() {

  return (
    <section className="bg-white relative overflow-hidden">

      {/* ── Top accent bar ──────────────────────────────────────────────── */}
      <div className="bg-gray-950 py-2">
        <p className="text-center text-[10px] text-white/40 uppercase tracking-widest">
          Trusted · Verified · Award-winning travel partner
        </p>
      </div>

      <div className="section-container py-14 md:py-20 space-y-16">

        {/* ── Headline ────────────────────────────────────────────────────── */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest mb-4 border border-gray-200">
            <Zap size={12} /> Why YlooTrips
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-gray-900 mb-3">
            India experts you can{' '}
            <span className="italic text-amber-600">actually trust</span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Trusted by travelers from USA, UK, Australia, Germany, Canada & 35+ more countries.
          </p>
        </div>

        {/* ── Stats ───────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ value, label, sub, icon: Icon, grad }) => (
            <div key={label} className="group text-center bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-7 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
              <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <Icon size={18} className="text-gray-600" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{value}</div>
              <div className="text-xs uppercase tracking-widest text-gray-500 mb-0.5">{label}</div>
              <div className="text-[10px] text-gray-400">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Trust badges ────────────────────────────────────────────────── */}
        <div>
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-5">Verified credentials</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {TRUST_BADGES.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-gray-800 uppercase tracking-wide leading-none">{label}</div>
                  <div className="text-[9px] text-gray-500 leading-none mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Why us — feature cards ──────────────────────────────────────── */}
        <div>
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6">Why choose us</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {REASONS.map(({ emoji, title, body }) => (
              <div key={title} className="group flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-gray-200 hover:shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl border border-gray-100">
                  {emoji}
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1.5 text-gray-800">{title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Guarantee cards ─────────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-600 mb-2">Our Promise</p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              Book with <span className="italic text-amber-500">complete confidence</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GUARANTEES.map(g => (
              <div key={g.title} className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4 hover:shadow-md hover:border-gray-200 transition-all duration-300">
                <div className="text-2xl shrink-0 mt-0.5">{g.emoji}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-gray-900 text-sm">{g.title}</h4>
                    <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{g.badge}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed">{g.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Partner Hotels 3D ───────────────────────────────────────────── */}
        <div>
          <div className="text-center mb-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">Our Partner Hotels</p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              Staying in <span className="italic text-amber-500">India&apos;s finest</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1.5">Hand-selected · Pre-inspected · Boutique to 5-star</p>
          </div>
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0" style={{ perspective: 1000 }}>
            <div className="flex gap-3 min-w-max md:min-w-0 md:grid md:grid-cols-4 lg:grid-cols-8">
              {HOTELS.map(h => <HotelCard key={h.name} {...h} />)}
            </div>
          </div>
          <p className="text-center text-[9px] text-gray-400 uppercase tracking-widest mt-4">+ 200 more curated properties across India & the world</p>
        </div>

        {/* ── Media + Airlines ────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4 text-center">As featured in</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {MEDIA.map(m => (
                <span key={m.name} title={m.name} className={`text-lg leading-none ${m.style} opacity-60 hover:opacity-100 transition-opacity cursor-default select-none`}>{m.short}</span>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4 text-center">Trusted partners</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {AIRLINES.map(a => (
                <div key={a.name} className={`flex items-center gap-1 ${a.color} opacity-60 hover:opacity-100 transition-opacity`}>
                  <span className="text-sm">{a.emoji}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">{a.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Payment methods ─────────────────────────────────────────────── */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard size={13} className="text-gray-400" />
            <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400">Secure payments via</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider flex items-center gap-1">🇮🇳 India</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {PAYMENTS_IN.map(p => (
                  <span key={p} className="text-[9px] font-bold px-2.5 py-1 rounded border bg-white text-gray-700 border-gray-200 shadow-sm">{p}</span>
                ))}
              </div>
            </div>
            <div className="w-px h-8 bg-gray-200 hidden sm:block" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] text-gray-400 uppercase tracking-wider flex items-center gap-1">🌍 International</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {PAYMENTS_INTL.map(p => (
                  <span key={p} className="text-[9px] font-bold px-2.5 py-1 rounded border bg-white text-gray-700 border-gray-200 shadow-sm">{p}</span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-center text-[9px] text-gray-400 mt-3">No card details stored · 256-bit encrypted</p>
        </div>

        {/* ── Certifications ──────────────────────────────────────────────── */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5">
          <p className="text-[9px] text-gray-400 uppercase tracking-[0.3em] text-center mb-4">Verified Credentials</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {CERTS.map(c => (
              <div key={c.label} className="text-center group">
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">{c.icon}</div>
                <div className="text-[10px] font-bold text-gray-800">{c.label}</div>
                <div className="text-[8px] text-gray-500 mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Countries ───────────────────────────────────────────────────── */}
        <div className="text-center">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mb-4">Travelers from 40+ countries</p>
          <div className="flex flex-wrap justify-center gap-3 text-2xl mb-2">
            {FLAGS.map(f => <span key={f} className="hover:scale-125 transition-transform duration-200 cursor-default">{f}</span>)}
          </div>
          <p className="text-gray-400 text-xs">+ 20 more countries</p>
        </div>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="text-center bg-gray-900 rounded-2xl px-6 py-8">
          <p className="text-white/40 text-[10px] font-medium uppercase tracking-[0.25em] mb-3">Our Promise</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mb-6">
            {['Free 14-day cancellation','Price match guarantee','24/7 emergency line','Zero hidden fees'].map(g => (
              <span key={g} className="text-gray-400 text-sm flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-white/30 inline-block" />
                {g}
              </span>
            ))}
          </div>
          <Link href="/trip-planner"
            className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
            Plan My Trip — Zero Risk <ArrowRight size={16} />
          </Link>
          <p className="text-gray-600 text-xs mt-3">No deposit until you confirm · Free itinerary in 24 hrs</p>
        </div>

      </div>
    </section>
  );
}
