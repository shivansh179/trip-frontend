'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const DISMISSED_KEY = 'flashSaleBannerDismissed';

const EXCLUDED_PATHS = ['/checkout', '/payment', '/admin'];

function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();

  const totalSeconds = Math.max(0, Math.floor(diff / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export default function FlashSaleBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem(DISMISSED_KEY);
    if (!wasDismissed) {
      setDismissed(false);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, [dismissed]);

  const isExcluded = EXCLUDED_PATHS.some((p) => pathname.startsWith(p));
  if (isExcluded || dismissed) return null;

  const countdownStr = `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`;

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  };

  const bannerText = `🔥 Flash Sale — Flat ₹5,000 off all trips · Use code YLOO5000 · Ends in ${countdownStr}`;

  return (
    <div className="bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 text-white w-full">
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-center px-4 py-2 text-sm font-medium gap-4">
        <span>
          🔥 Flash Sale — Flat ₹5,000 off all trips · Use code{' '}
          <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded">YLOO5000</span>
          <span className="ml-3 font-mono">
            ⏰ Ends in{' '}
            <span className="font-bold">{countdownStr}</span>
          </span>
        </span>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="ml-2 flex-shrink-0 hover:bg-white/20 rounded-full p-0.5 transition-colors"
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

      {/* Mobile — scrolling marquee */}
      <div className="flex sm:hidden items-center overflow-hidden py-2 px-3 text-sm font-medium">
        <div className="flex-1 overflow-hidden">
          <div className="whitespace-nowrap inline-block" style={{ animation: 'marquee 18s linear infinite' }}>
            {bannerText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{bannerText}
          </div>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          className="flex-shrink-0 ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
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
