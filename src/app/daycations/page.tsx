import type { Metadata } from 'next';
import daycations, { DAYCATION_CATEGORIES } from '@/data/daycations';
import DaycationsClient from './DaycationsClient';

export const metadata: Metadata = {
  title: 'Daycations — 1-Day Adventures Near You | YlooTrips',
  description: 'No bags, no hotel — just pure vibes. Explore 1-day experiences from treks to food walks, curated for every city and mood.',
  alternates: { canonical: 'https://www.ylootrips.com/daycations' },
};

export default function DaycationsPage() {
  return <DaycationsClient daycations={daycations} categories={DAYCATION_CATEGORIES} />;
}
