'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PRIMARY = [
  { emoji: '✨', label: 'Free Itinerary', sub: 'AI-powered', href: '/trip-planner', highlight: true },
  { emoji: '🏔️', label: 'India Trips', sub: '150+ packages', href: '/destinations/domestic' },
  { emoji: '🌍', label: 'International', sub: 'Global tours', href: '/destinations/international' },
  { emoji: '✈️', label: 'Flights', sub: 'Book cheap', href: '/?tab=flights' },
];

const SECONDARY = [
  { emoji: '🎉', label: 'Events', sub: 'Live events', href: '/events' },
  { emoji: '🏨', label: 'Hotels', sub: 'Best stays', href: '/?tab=hotels' },
  { emoji: '🗺️', label: 'Plan Journey', sub: 'Custom trip', href: '/trip-planner' },
  { emoji: '📞', label: 'Talk to Expert', sub: 'Free consult', href: '/contact' },
];

const GOLD = '#C9A96E';
const GOLD_FAINT = 'rgba(201,169,110,0.12)';
const GOLD_BORDER = 'rgba(201,169,110,0.2)';

export default function MobileCategories() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="md:hidden px-4 pb-4 pt-0 -mt-4 relative z-10" style={{ background: 'transparent' }}>
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(10,10,10,0.95)',
          border: `1px solid ${GOLD_BORDER}`,
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* Heading */}
        <div className="px-4 pt-3.5 pb-2.5" style={{ borderBottom: `1px solid ${GOLD_FAINT}` }}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: GOLD }}>
            Explore
          </p>
        </div>

        {/* Primary grid */}
        <div className="grid grid-cols-4 gap-0">
          {PRIMARY.map(({ emoji, label, sub, href, highlight }) => (
            <Link
              key={href + label}
              href={href}
              className="flex flex-col items-center justify-center gap-1.5 py-4 px-2 text-center transition-all active:scale-95 select-none relative"
              style={highlight ? {
                background: 'linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.08))',
                borderRight: `1px solid ${GOLD_BORDER}`,
              } : {
                borderRight: `1px solid rgba(255,255,255,0.04)`,
              }}
            >
              {highlight && (
                <span className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
              )}
              <span className="text-xl">{emoji}</span>
              <p className="text-[11px] font-semibold leading-tight" style={{ color: highlight ? GOLD : 'rgba(255,255,255,0.85)' }}>
                {label}
              </p>
              <p className="text-[9px] leading-tight" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
            </Link>
          ))}
        </div>

        {/* Secondary grid */}
        {expanded && (
          <div className="grid grid-cols-4 gap-0" style={{ borderTop: `1px solid ${GOLD_FAINT}` }}>
            {SECONDARY.map(({ emoji, label, sub, href }) => (
              <Link
                key={href + label}
                href={href}
                className="flex flex-col items-center justify-center gap-1.5 py-4 px-1 text-center transition-all active:scale-95 select-none"
                style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}
              >
                <span className="text-xl">{emoji}</span>
                <p className="text-[11px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.85)' }}>{label}</p>
                <p className="text-[9px] leading-tight" style={{ color: 'rgba(255,255,255,0.3)' }}>{sub}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-1.5 py-3 text-[11px] font-medium min-h-[44px] transition-colors active:bg-white/5"
          style={{ borderTop: `1px solid ${GOLD_FAINT}`, color: 'rgba(201,169,110,0.6)' }}
        >
          <ChevronDown size={12} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Show less' : 'More options'}
        </button>
      </div>
    </section>
  );
}
