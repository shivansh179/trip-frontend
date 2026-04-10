import type { Metadata } from 'next';
import WriteStoryLoader from '@/components/WriteStoryLoader';

export const metadata: Metadata = {
  title: 'Write a Travel Story | YlooTrips',
  description: 'Share your travel adventure with the YlooTrips community.',
};

export default function WriteStoryPage() {
  return <WriteStoryLoader />;
}
