import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Trips — Your Wishlist | YlooTrips',
  description: 'View all your saved trips in one place. Heart any trip to add it to your personal wishlist.',
  robots: { index: false },
};

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
