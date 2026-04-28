import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Careers at YlooTrips — Join Our Travel Team',
  description: "Work at YlooTrips — India's trusted travel company. Open positions for Travel Consultant, Digital Marketing Executive & Operations Coordinator. New Delhi (hybrid/remote). Apply now.",
  openGraph: {
    title: 'Careers at YlooTrips | Join Our Travel Team',
    description: 'Small team, big impact. Help 25,000+ travelers explore India & the world. See open roles at YlooTrips.',
    url: 'https://www.ylootrips.com/careers',
    images: [{ url: 'https://www.ylootrips.com/api/og?title=Work+With+Us&subtitle=Join+India%27s+Fastest-Growing+Travel+Team', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Careers at YlooTrips | Join Our Travel Team',
    images: ['https://www.ylootrips.com/api/og?title=Work+With+Us&subtitle=Join+India%27s+Fastest-Growing+Travel+Team'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/careers' },
};

export default function CareersLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
