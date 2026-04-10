import type { Metadata } from 'next';
import { Suspense } from 'react';
import TripPlannerChat from '@/components/TripPlannerChat';

export const metadata: Metadata = {
  title: 'AI Trip Planner — YlooTrips',
  description: 'Get a personalised day-by-day India travel itinerary in seconds. Tell Yloo your destination, budget, and travel style.',
  openGraph: {
    title: 'AI Trip Planner — YlooTrips',
    description: 'Instantly plan your perfect Indian trip with Yloo, our AI travel expert.',
    url: 'https://ylootrips.com/trip-planner',
  },
};

export default function TripPlannerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-light" />}>
      <TripPlannerChat />
    </Suspense>
  );
}
