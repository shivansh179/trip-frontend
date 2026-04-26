import type { Metadata } from 'next';
import { Suspense } from 'react';
import TripPlannerChat from '@/components/TripPlannerChat';

export const metadata: Metadata = {
  title: 'Plan Your Dream Journey — Free AI Trip Planner | YlooTrips',
  description: 'Plan your dream journey with Yloo AI — get a personalised day-by-day itinerary in seconds. India, Bali, Dubai, Thailand and beyond. 100% free.',
  keywords: ['trip planner', 'AI travel planner', 'plan your dream journey', 'India itinerary planner', 'free trip planner'],
  alternates: { canonical: 'https://www.ylootrips.com/trip-planner' },
  openGraph: {
    title: 'Plan Your Dream Journey — Free AI Trip Planner | YlooTrips',
    description: 'Get a personalised day-by-day itinerary in seconds. India, Bali, Dubai, Thailand and beyond.',
    url: 'https://www.ylootrips.com/trip-planner',
  },
};

export default function TripPlannerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-light animate-pulse"><div className="bg-primary h-56" /></div>}>
      <TripPlannerChat />
    </Suspense>
  );
}
