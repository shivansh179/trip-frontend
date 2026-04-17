'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const DISMISSED_KEY = 'flashSaleBannerDismissed';

const EXCLUDED_PATHS = ['/checkout', '/payment', '/admin'];

export default function FlashSaleBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (!wasDismissed) {
      setDismissed(false);
    }
  }, []);

  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
  if (isExcluded || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="bg-gray-950 text-white w-full border-b border-white/5">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-center px-4 py-2 text-xs font-medium gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
        <span className="tracking-wide text-white/70">
          Limited Offer — ₹5,000 off all trips · Code{' '}
          <span className="font-bold tracking-widest text-white mx-1">YLOO5000</span>
        </span>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="ml-2 flex-shrink-0 hover:bg-white/10 rounded-full p-0.5 transition-colors text-white/40 hover:text-white/80"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
