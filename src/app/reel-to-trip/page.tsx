import type { Metadata } from 'next';
import { Suspense } from 'react';
import ReelToTrip from '@/components/ReelToTrip';

export const metadata: Metadata = {
  title: 'Reel to Trip — Turn Instagram Reels into Itineraries | YlooTrips',
  description: 'Paste any Instagram travel reel or describe what you saw — our AI instantly generates a full 5-day itinerary with costs, activities, and booking options.',
  openGraph: {
    title: 'Turn any travel reel into a real trip — YlooTrips',
    description: 'Describe a travel Instagram reel and get a complete 5-day itinerary with costs in seconds.',
    url: 'https://ylootrips.com/reel-to-trip',
  },
};

export default function ReelToTripPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-light" />}>
      <ReelToTrip />
    </Suspense>
  );
}
