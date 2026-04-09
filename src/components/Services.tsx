'use client';

import { Sparkles, Users, Shield, Globe, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Sparkles,
    number: '01',
    title: 'Fully Personalised Journeys',
    subtitle: 'Crafted just for you',
    description:
      'Every YlooTrips journey is created from scratch — no off-the-shelf packages. We understand your travel style, wishes and rhythm, then our experts curate a perfect experience.',
    tag: 'Custom Itinerary',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'hover:border-amber-500/30',
    iconColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
  },
  {
    icon: Users,
    number: '02',
    title: 'Insider Access & Boutique Luxury',
    subtitle: 'With real local soul',
    description:
      'Heritage havelis, private cultural encounters, gourmet meals in hidden enclaves, sunrise explorations before crowds arrive — all handled with signature local knowledge.',
    tag: 'Exclusive Access',
    color: 'from-violet-500/20 to-blue-500/10',
    border: 'hover:border-violet-500/30',
    iconColor: 'text-violet-400',
    iconBg: 'bg-violet-500/10',
  },
  {
    icon: Shield,
    number: '03',
    title: 'White-Glove Service',
    subtitle: 'Start to finish',
    description:
      'From first enquiry to your return home — smooth airport transfers, streamlined check-ins, reliable local hosts, and 24/7 concierge support. Your only job: relish the journey.',
    tag: 'Full Support',
    color: 'from-emerald-500/20 to-teal-500/10',
    border: 'hover:border-emerald-500/30',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
  },
  {
    icon: Globe,
    number: '04',
    title: 'Authentic Luxury',
    subtitle: 'Deeply rooted in place',
    description:
      'Luxury means authentic at YlooTrips — weaving comfort, taste and service with meaningful immersion. Feel the spice markets of Kerala, the tea hills of Sri Lanka, the beach villas of Bali.',
    tag: 'Immersive Travel',
    color: 'from-rose-500/20 to-pink-500/10',
    border: 'hover:border-rose-500/30',
    iconColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
  },
];

export default function Services() {
  return (
    <section className="py-16 md:py-24 bg-gray-950 text-white relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
              <Sparkles size={12} /> What We Do
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-tight">
              Travel crafted to{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent italic">
                perfection
              </span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-lg text-base leading-relaxed">
              Four pillars that make every YlooTrips journey extraordinary — not just a trip, but a story worth telling.
            </p>
          </div>
          <Link
            href="/trips"
            className="shrink-0 self-start md:self-end inline-flex items-center gap-2 border border-white/10 text-white/70 hover:text-white hover:border-white/30 px-6 py-3 text-xs uppercase tracking-widest transition-all rounded-full"
          >
            Explore All Trips
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map(({ icon: Icon, number, title, subtitle, description, tag, color, border, iconColor, iconBg }) => (
            <div
              key={number}
              className={`group relative p-[1px] rounded-2xl bg-gradient-to-br from-white/8 to-white/3 ${border} transition-all duration-500`}
            >
              <div className={`bg-gray-900 rounded-2xl p-7 h-full relative overflow-hidden`}>
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`} />

                <div className="relative">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon size={22} className={iconColor} />
                    </div>
                    <span className="text-5xl font-black text-white/5 group-hover:text-white/8 transition-colors leading-none">
                      {number}
                    </span>
                  </div>

                  {/* Tag */}
                  <span className={`inline-block text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full bg-white/5 text-gray-400 mb-3`}>
                    {tag}
                  </span>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
                  <p className={`text-sm font-medium ${iconColor} mb-3`}>{subtitle}</p>

                  {/* Description */}
                  <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 relative p-[1px] rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20">
          <div className="bg-gray-900 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold text-lg">Ready to experience the difference?</p>
              <p className="text-gray-500 text-sm mt-0.5">Free custom itinerary in 24 hours · No payment until you confirm</p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 px-7 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all hover:scale-105 shadow-lg shadow-amber-500/20 whitespace-nowrap"
            >
              Plan My Trip ✈️
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
