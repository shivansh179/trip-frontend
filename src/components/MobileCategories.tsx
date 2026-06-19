'use client';

import Link from 'next/link';

const CATS = [
  { emoji: '✨', label: 'AI Itinerary', sub: 'Free planner', href: '/trip-planner', hot: true },
  { emoji: '🏔️', label: 'India Trips', sub: '150+ packages', href: '/destinations/domestic' },
  { emoji: '🌍', label: 'International', sub: 'Global tours', href: '/destinations/international' },
  { emoji: '✈️', label: 'Flights', sub: 'Cheap fares', href: '/?tab=flights' },
  { emoji: '🎉', label: 'Events', sub: 'Live events', href: '/events' },
  { emoji: '🏨', label: 'Hotels', sub: 'Best stays', href: '/?tab=hotels' },
  { emoji: '🗺️', label: 'Custom Trip', sub: 'We plan it', href: '/trip-planner' },
  { emoji: '📞', label: 'Talk Expert', sub: 'Free call', href: '/contact' },
];

export default function MobileCategories() {
  return (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/10">
      {/* Desktop: horizontal scrollable pill row */}
      <div className="hidden md:flex section-container items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
        {CATS.map(({ emoji, label, sub, href, hot }) => (
          <Link
            key={href + label}
            href={href}
            className={`group flex items-center gap-2.5 shrink-0 px-4 py-2.5 rounded-full border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              hot
                ? 'bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-700/40'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10'
            }`}
          >
            <span className="text-lg leading-none">{emoji}</span>
            <div>
              <p className={`text-xs font-bold leading-tight ${hot ? 'text-amber-700 dark:text-amber-400' : 'text-gray-800 dark:text-white'}`}>{label}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{sub}</p>
            </div>
            {hot && <span className="text-[9px] font-bold uppercase tracking-wide bg-amber-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>}
          </Link>
        ))}
      </div>

      {/* Mobile: 4-col icon grid */}
      <div className="md:hidden grid grid-cols-4 divide-x divide-gray-100 dark:divide-white/5">
        {CATS.slice(0, 8).map(({ emoji, label, sub, href, hot }) => (
          <Link
            key={href + label}
            href={href}
            className="flex flex-col items-center gap-1 py-3.5 px-1 text-center active:bg-gray-50 dark:active:bg-white/5 transition-colors relative"
          >
            {hot && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full" />
            )}
            <span className="text-2xl leading-none">{emoji}</span>
            <p className={`text-[11px] font-semibold leading-tight mt-0.5 ${hot ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-gray-200'}`}>
              {label}
            </p>
            <p className="text-[9px] text-gray-400 leading-tight">{sub}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
