import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'WanderLoot — Earn Cashback on Every Trip | YlooTrips',
  description: 'Earn 10% cashback on every trip you book with YlooTrips. Redeem WanderLoot credits on future bookings. Refer friends and earn more — India\'s best travel rewards program.',
  keywords: 'travel cashback India, trip cashback YlooTrips, WanderLoot, travel rewards India, refer and earn travel, YlooTrips cashback',
  alternates: { canonical: 'https://www.ylootrips.com/cashback' },
  openGraph: {
    title: 'WanderLoot — Earn Cashback on Every Trip',
    description: 'Book any trip with YlooTrips and earn 10% cashback as WanderLoot credits. Refer friends, earn more, travel for less.',
    url: 'https://www.ylootrips.com/cashback',
    type: 'website',
    siteName: 'YlooTrips',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WanderLoot — Earn Cashback on Every Trip | YlooTrips',
    description: 'Earn 10% cashback on every YlooTrips booking. Redeem on future trips.',
  },
};

export default function CashbackLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
