import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'YlooTrips — Investor Pitch Deck 2026',
  description: 'YlooTrips funding deck. India\'s fastest-growing curated travel platform — ₹X Cr Series A.',
  robots: { index: false, follow: false },
};

const stats = [
  { value: '25,000+', label: 'Trips Completed' },
  { value: '4.9★', label: 'Google Rating' },
  { value: '₹18,999', label: 'Avg Ticket Size' },
  { value: '2022', label: 'Founded' },
];

const problems = [
  {
    icon: '😩',
    title: 'Travel Planning is Broken',
    body: 'Indians spend 12+ hours researching trips across fragmented platforms — OTAs, blogs, WhatsApp groups — with no single trusted curator.',
  },
  {
    icon: '💸',
    title: 'Hidden Costs Everywhere',
    body: 'Generic travel portals add undisclosed markups. Travelers discover "extra charges" at checkout or on arrival. Trust is broken.',
  },
  {
    icon: '🗺️',
    title: 'Cookie-Cutter Itineraries',
    body: 'Mass-market packages ignore traveler preferences. Every Manali trip looks identical. There is no personalisation for India\'s 200M+ aspiring travelers.',
  },
];

const solutions = [
  { icon: '🧠', title: 'AI Holiday Planner', body: 'Personalised itineraries in 60 seconds based on budget, dates, travel style — not templates.' },
  { icon: '✅', title: 'Curated & Verified Packages', body: 'Every package hand-verified by our team. No hidden fees. Price-match guarantee.' },
  { icon: '📱', title: 'End-to-End Experience', body: 'From discovery to booking to post-trip support — one platform, one WhatsApp number, one team.' },
  { icon: '🌍', title: 'Domestic + International', body: '50+ domestic destinations and 20+ international packages, all optimised for Indian travelers.' },
];

const marketData = [
  { label: 'India Travel Market 2026', value: '$75 Billion', note: 'Growing at 12% CAGR' },
  { label: 'Online Travel Addressable Market', value: '$24 Billion', note: 'Shifting rapidly to mobile-first' },
  { label: 'Curated / Experiential Travel', value: '$4.2 Billion', note: 'Fastest growing sub-segment' },
  { label: 'Middle-Class Travelers (Target)', value: '200M+', note: 'Aspiring Indians, ₹20k–₹2L trip budget' },
];

const traction = [
  { metric: '25,000+', desc: 'Trips completed since 2022' },
  { metric: '4.9 / 5', desc: 'Average Google review rating' },
  { metric: 'MSME Certified', desc: 'UDYAM-HR-05-0141455 · GST registered' },
  { metric: '50+', desc: 'Domestic & international destinations' },
  { metric: '₹5,000', desc: 'Average discount per booking via platform' },
  { metric: '3x', desc: 'Repeat booking rate vs industry avg' },
];

const revenue = [
  { stream: 'Package Margin', detail: '15–25% margin on every curated package booked through platform', badge: 'Core' },
  { stream: 'Trip Planner Pro', detail: 'Premium AI itinerary service — ₹499/month subscription', badge: 'SaaS' },
  { stream: 'Affiliate & Insurance', detail: 'Travel insurance and visa service commissions', badge: 'Cross-sell' },
  { stream: 'B2B Corporate Travel', detail: 'Managed travel for SME companies — group bookings', badge: 'Pipeline' },
];

const roadmap = [
  { quarter: 'Q2 2026', milestone: 'Series A close · Expand team to 25 FTE', done: false },
  { quarter: 'Q3 2026', milestone: 'Launch mobile app (iOS + Android)', done: false },
  { quarter: 'Q3 2026', milestone: 'Enter 5 Tier-2 cities (Jaipur, Ahmedabad, Pune, Hyderabad, Chennai)', done: false },
  { quarter: 'Q4 2026', milestone: 'AI Planner v2 — real-time pricing + hotel integration', done: false },
  { quarter: 'Q1 2027', milestone: 'International expansion: UAE + Singapore offices', done: false },
  { quarter: 'FY27', milestone: '1 lakh trips target · ₹50 Cr GMV', done: false },
];

const team = [
  { name: 'Vinay Arora', role: 'Founder & CEO', bg: 'Led operations scaling at Univest · 5+ years in fintech & travel' },
  { name: 'Core Team', role: 'Operations & Curation', bg: 'On-ground destination experts across 10 states' },
  { name: 'Tech Team', role: 'Product & Engineering', bg: 'Next.js · AI integration · Full-stack development' },
];

export default function PitchDeckPage() {
  return (
    <main className="bg-white text-gray-900 font-sans">

      {/* ── SLIDE 1: Cover ── */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0d0d14] via-[#151528] to-[#0d0d14] text-white relative overflow-hidden px-6">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Investor Deck · Series A · 2026
          </div>
          <img src="/logo.png" alt="YlooTrips" className="h-16 w-auto mx-auto mb-8 brightness-0 invert" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            India's Curated<br /><span className="text-amber-400">Travel Platform</span>
          </h1>
          <p className="text-white/70 text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Personalised trips for India's 200M+ aspiring travelers — powered by AI, built on trust.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-amber-400">{s.value}</p>
                <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/30 text-xs uppercase tracking-widest">Confidential · Not for distribution</p>
        </div>
      </section>

      {/* ── SLIDE 2: Problem ── */}
      <section className="min-h-screen flex items-center bg-gray-50 px-6 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <SlideLabel number="02" color="red">The Problem</SlideLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Planning a trip in India<br /><span className="text-red-500">is still painful.</span></h2>
          <p className="text-gray-500 text-lg mb-16 max-w-2xl">Despite a $75B market, the booking experience for Indian travelers remains fragmented, opaque, and deeply frustrating.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {problems.map(p => (
              <div key={p.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <span className="text-5xl block mb-5">{p.icon}</span>
                <h3 className="font-bold text-xl mb-3">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 bg-red-50 border border-red-100 rounded-2xl px-8 py-5 flex items-center gap-4">
            <span className="text-red-400 text-2xl">📊</span>
            <p className="text-gray-700 text-sm"><strong>78% of Indian travelers</strong> report dissatisfaction with their last online travel booking experience. Source: FICCI Travel Survey 2025.</p>
          </div>
        </div>
      </section>

      {/* ── SLIDE 3: Solution ── */}
      <section className="min-h-screen flex items-center bg-white px-6 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <SlideLabel number="03" color="green">Our Solution</SlideLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">YlooTrips — Travel the<br /><span className="text-green-600">way it should be.</span></h2>
          <p className="text-gray-500 text-lg mb-16 max-w-2xl">A full-stack curated travel platform combining AI planning, verified packages, and human support — all in one place.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {solutions.map(s => (
              <div key={s.title} className="flex gap-5 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <span className="text-4xl shrink-0">{s.icon}</span>
                <div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SLIDE 4: Market ── */}
      <section className="min-h-screen flex items-center bg-[#0d0d14] text-white px-6 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <SlideLabel number="04" color="amber">Market Opportunity</SlideLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">A <span className="text-amber-400">$75 Billion</span> market<br />with no dominant curator.</h2>
          <p className="text-white/60 text-lg mb-16 max-w-2xl">India is the world's fastest-growing outbound & domestic travel market. Yet no brand owns the "curated" space for middle India.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {marketData.map(m => (
              <div key={m.label} className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <p className="text-4xl font-bold text-amber-400 mb-2">{m.value}</p>
                <p className="font-semibold text-white mb-1">{m.label}</p>
                <p className="text-white/40 text-sm">{m.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <p className="text-amber-300 font-semibold mb-1">Our Target: The "New India" Traveler</p>
            <p className="text-white/60 text-sm">25–40 year old, tier-1 and tier-2 city, household income ₹8–25L, travels 2–4 times/year, values experiences over price, plans on mobile.</p>
          </div>
        </div>
      </section>

      {/* ── SLIDE 5: Traction ── */}
      <section className="min-h-screen flex items-center bg-gray-50 px-6 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <SlideLabel number="05" color="blue">Traction</SlideLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Real trips. Real travelers.<br /><span className="text-blue-600">Real trust.</span></h2>
          <p className="text-gray-500 text-lg mb-16 max-w-2xl">Built from zero to 25,000+ trips in 3 years — entirely organic, no paid acquisition.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {traction.map(t => (
              <div key={t.metric} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <p className="text-3xl font-bold text-gray-900 mb-2">{t.metric}</p>
                <p className="text-gray-500 text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <p className="font-bold text-blue-900 mb-2">🏆 Google Rating: 4.9★</p>
              <p className="text-blue-700 text-sm">Highest-rated curated travel company on Google for "Delhi travel agency" and "Kashmir trip package"</p>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
              <p className="font-bold text-green-900 mb-2">📈 100% Organic Growth</p>
              <p className="text-green-700 text-sm">Zero paid marketing spend. All growth through word-of-mouth, Google SEO, and repeat customers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SLIDE 6: Business Model ── */}
      <section className="min-h-screen flex items-center bg-white px-6 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <SlideLabel number="06" color="purple">Business Model</SlideLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Multiple revenue streams,<br /><span className="text-purple-600">high-margin core.</span></h2>
          <p className="text-gray-500 text-lg mb-16 max-w-2xl">Package margin is the core engine. SaaS and affiliate add recurring revenue. B2B opens enterprise scale.</p>
          <div className="space-y-4">
            {revenue.map(r => (
              <div key={r.stream} className="flex items-start gap-5 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 mt-0.5 ${
                  r.badge === 'Core' ? 'bg-purple-100 text-purple-700' :
                  r.badge === 'SaaS' ? 'bg-blue-100 text-blue-700' :
                  r.badge === 'Cross-sell' ? 'bg-green-100 text-green-700' :
                  'bg-amber-100 text-amber-700'
                }`}>{r.badge}</span>
                <div>
                  <p className="font-bold text-gray-900 mb-1">{r.stream}</p>
                  <p className="text-gray-500 text-sm">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SLIDE 7: Roadmap ── */}
      <section className="min-h-screen flex items-center bg-[#0d0d14] text-white px-6 py-24">
        <div className="max-w-4xl mx-auto w-full">
          <SlideLabel number="07" color="amber">Roadmap</SlideLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Where we're going<br /><span className="text-amber-400">with your capital.</span></h2>
          <p className="text-white/60 text-lg mb-16">18-month plan post Series A close.</p>
          <div className="relative">
            <div className="absolute left-[11px] top-0 bottom-0 w-px bg-white/10" />
            <div className="space-y-8">
              {roadmap.map((r, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-6 h-6 rounded-full bg-amber-500 border-4 border-[#0d0d14] shrink-0 mt-0.5 z-10" />
                  <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                    <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">{r.quarter}</span>
                    <p className="text-white font-medium mt-1">{r.milestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SLIDE 8: Team ── */}
      <section className="min-h-screen flex items-center bg-gray-50 px-6 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <SlideLabel number="08" color="green">Team</SlideLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Built by operators,<br /><span className="text-green-600">not tourists.</span></h2>
          <p className="text-gray-500 text-lg mb-16 max-w-2xl">Domain expertise from finance + travel + technology — the exact intersection this company needs to win.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map(t => (
              <div key={t.name} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-white mb-5">
                  {t.name.charAt(0)}
                </div>
                <p className="font-bold text-xl mb-1">{t.name}</p>
                <p className="text-gray-500 text-sm font-medium mb-3">{t.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{t.bg}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SLIDE 9: Why Now ── */}
      <section className="min-h-screen flex items-center bg-white px-6 py-24">
        <div className="max-w-5xl mx-auto w-full">
          <SlideLabel number="09" color="red">Why Now</SlideLabel>
          <h2 className="text-4xl md:text-5xl font-bold mb-16">Three tailwinds that make<br /><span className="text-red-500">2026 the moment.</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '✈️', title: 'Post-COVID Travel Boom', body: 'India\'s outbound travel is at an all-time high. Pent-up demand is driving 35% YoY growth in leisure travel bookings.' },
              { icon: '📲', title: 'Mobile-First India', body: '750M+ smartphone users, UPI payments ubiquitous, and 5G rollout complete. Digital booking is now default, not alternative.' },
              { icon: '🤖', title: 'AI Creates an Unfair Advantage', body: 'AI-powered itinerary planning reduces customer acquisition cost by 60% and increases conversion. Early movers own the category.' },
            ].map(w => (
              <div key={w.title} className="text-center">
                <span className="text-6xl block mb-6">{w.icon}</span>
                <h3 className="font-bold text-xl mb-3">{w.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SLIDE 10: The Ask ── */}
      <section className="min-h-screen flex items-center bg-gradient-to-br from-[#0d0d14] via-[#1a1a35] to-[#0d0d14] text-white px-6 py-24">
        <div className="max-w-4xl mx-auto w-full text-center">
          <SlideLabel number="10" color="amber" center>The Ask</SlideLabel>
          <h2 className="text-5xl md:text-7xl font-bold mb-6">
            Raising <span className="text-amber-400">₹5 Crore</span><br />
            <span className="text-white/60 text-4xl md:text-5xl">Series A</span>
          </h2>
          <p className="text-white/60 text-xl mb-16 max-w-xl mx-auto">To build India's most-trusted curated travel brand, powered by AI, trusted by 1 lakh+ travelers by 2027.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { pct: '40%', use: 'Technology', detail: 'Mobile app · AI Planner v2 · Platform infrastructure' },
              { pct: '35%', use: 'Growth & Marketing', detail: 'Tier-2 city expansion · Brand awareness · SEO dominance' },
              { pct: '25%', use: 'Team & Operations', detail: 'Hire 15 FTEs · Destination offices · Customer support' },
            ].map(u => (
              <div key={u.use} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                <p className="text-4xl font-bold text-amber-400 mb-2">{u.pct}</p>
                <p className="font-semibold mb-1">{u.use}</p>
                <p className="text-white/40 text-sm">{u.detail}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/15 rounded-3xl p-10 mb-10">
            <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-4">Contact</p>
            <p className="text-2xl font-bold mb-2">Vinay Arora — Founder & CEO</p>
            <p className="text-white/60 mb-1">hello@ylootrips.com</p>
            <p className="text-white/60 mb-4">+91 84278 31127 (WhatsApp)</p>
            <Link href="https://wa.me/918427831127?text=Hi%20Vinay%2C%20I%27d%20like%20to%20discuss%20the%20YlooTrips%20Series%20A%20funding%20opportunity."
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-full transition-colors text-sm">
              📩 Connect on WhatsApp
            </Link>
          </div>
          <div className="flex justify-center gap-8 text-white/40 text-xs">
            <span>MSME: UDYAM-HR-05-0141455</span>
            <span>·</span>
            <span>GST: 07BATPV1942C1ZF</span>
            <span>·</span>
            <span>New Delhi, India · Est. 2022</span>
          </div>
        </div>
      </section>

    </main>
  );
}

function SlideLabel({ number, color, children, center }: { number: string; color: string; children: React.ReactNode; center?: boolean }) {
  const colors: Record<string, string> = {
    red: 'bg-red-100 text-red-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <div className={`flex items-center gap-3 mb-6 ${center ? 'justify-center' : ''}`}>
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${colors[color] || 'bg-gray-100 text-gray-500'}`}>
        {number}
      </span>
      <span className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400">{children}</span>
    </div>
  );
}
