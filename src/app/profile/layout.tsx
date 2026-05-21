import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account — Travel Hub | YlooTrips',
  description: 'Manage your bookings, wallet balance, saved trips, and referrals all in one place.',
  robots: { index: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
