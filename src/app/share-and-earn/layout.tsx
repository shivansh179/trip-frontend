import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Share Your Trip Memories | YlooTrips',
  description: 'Share your travel memories, photos and videos with the YlooTrips community. Earn rewards when your stories inspire others to travel. Join India\'s best travel community.',
  keywords: 'share travel memories India, trip photos community, travel stories India, YlooTrips share earn, travel UGC India',
  alternates: { canonical: 'https://www.ylootrips.com/share-and-earn' },
  openGraph: {
    title: 'Share Your Trip Memories | YlooTrips',
    description: 'Share your travel photos and stories with the YlooTrips community and earn rewards.',
    url: 'https://www.ylootrips.com/share-and-earn',
    type: 'website',
    siteName: 'YlooTrips',
  },
};

export default function ShareAndEarnLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
