import Link from 'next/link';

const guarantees = [
  {
    emoji: '💯',
    title: '100% Money-Back Guarantee',
    body: 'If we cancel your trip for any reason on our end, you get a full refund — no questions, no forms, no delays. Straight back to your account.',
    badge: 'Zero Risk',
    badgeColor: 'bg-green-100 text-green-800',
    border: 'border-green-200',
    bg: 'bg-green-50',
  },
  {
    emoji: '🔒',
    title: 'Lowest Price Guarantee',
    body: 'Find the exact same trip cheaper anywhere online within 48 hours of booking and we\'ll match it — plus give you ₹500 WanderLoot credit.',
    badge: 'Best Price',
    badgeColor: 'bg-blue-100 text-blue-800',
    border: 'border-blue-200',
    bg: 'bg-blue-50',
  },
  {
    emoji: '🛡️',
    title: 'Free 14-Day Cancellation',
    body: 'Plans change — we get it. Cancel up to 14 days before departure for a full refund. No cancellation fee. No fine print. Just honest travel.',
    badge: 'Flexible',
    badgeColor: 'bg-amber-100 text-amber-800',
    border: 'border-amber-200',
    bg: 'bg-amber-50',
  },
  {
    emoji: '📞',
    title: '24/7 On-Trip Emergency Line',
    body: 'While you\'re travelling, a real human is available round the clock on WhatsApp. Flight cancelled? Hotel issue? We handle it — immediately.',
    badge: 'Always Available',
    badgeColor: 'bg-purple-100 text-purple-800',
    border: 'border-purple-200',
    bg: 'bg-purple-50',
  },
];

const certifications = [
  { label: 'MSME Certified', sub: 'Govt. of India', icon: '🏛️' },
  { label: 'GST Registered', sub: 'Tax compliant', icon: '📋' },
  { label: 'SSL Secured', sub: '256-bit encryption', icon: '🔐' },
  { label: 'PCI-DSS', sub: 'Payment security', icon: '💳' },
  { label: '12+ Years', sub: 'In business since 2012', icon: '⏳' },
  { label: '4.9★ Google', sub: '2,400+ verified reviews', icon: '⭐' },
];

export default function GuaranteeSection() {
  return (
    <section className="py-14 md:py-20 bg-cream">
      <div className="section-container">

        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-3">Our Promise</p>
          <h2 className="font-display text-display-lg text-primary">
            Book with <span className="italic text-secondary">complete confidence</span>
          </h2>
          <p className="text-primary/60 mt-3 max-w-xl mx-auto text-sm">
            Every booking on YlooTrips is backed by four ironclad guarantees. No fine print. No exceptions.
          </p>
        </div>

        {/* Guarantee cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {guarantees.map(g => (
            <div key={g.title} className={`${g.bg} ${g.border} border rounded-2xl p-6 flex gap-5 hover:shadow-md transition-shadow`}>
              <div className="text-4xl shrink-0 mt-1">{g.emoji}</div>
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="font-semibold text-primary text-base">{g.title}</h3>
                  <span className={`${g.badgeColor} text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>
                    {g.badge}
                  </span>
                </div>
                <p className="text-primary/70 text-sm leading-relaxed">{g.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications bar */}
        <div className="bg-primary rounded-2xl px-6 py-5 mb-8">
          <p className="text-[9px] text-accent uppercase tracking-[0.3em] text-center mb-4">Verified Credentials</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {certifications.map(c => (
              <div key={c.label} className="text-center">
                <div className="text-2xl mb-1">{c.icon}</div>
                <div className="text-xs font-semibold text-cream">{c.label}</div>
                <div className="text-[10px] text-cream/40 mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-cream font-semibold px-8 py-3.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            Plan My Trip — Zero Risk
          </Link>
          <p className="text-primary/40 text-xs mt-2">
            No deposit until you confirm · Free custom itinerary in 24 hrs
          </p>
        </div>

      </div>
    </section>
  );
}
