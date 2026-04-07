'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const STORAGE_KEY = 'ylootrips-wishlist';

interface WishlistButtonProps {
  tripId: number;
  tripTitle: string;
  className?: string;
}

export default function WishlistButton({ tripId, tripTitle, className = '' }: WishlistButtonProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const ids: number[] = JSON.parse(stored);
        setIsSaved(ids.includes(tripId));
      }
    } catch {
      // Ignore parse errors
    }
  }, [tripId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const ids: number[] = stored ? JSON.parse(stored) : [];

      let updated: number[];
      if (ids.includes(tripId)) {
        updated = ids.filter((id) => id !== tripId);
        setIsSaved(false);
      } else {
        updated = [...ids, tripId];
        setIsSaved(true);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 1500);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className={`absolute ${className}`}>
      <button
        onClick={handleClick}
        aria-label={isSaved ? `Remove ${tripTitle} from wishlist` : `Save ${tripTitle} to wishlist`}
        className="relative flex items-center justify-center w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isSaved ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        />
      </button>

      {showTooltip && (
        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-md pointer-events-none z-50">
          +Saved!
        </span>
      )}
    </div>
  );
}
