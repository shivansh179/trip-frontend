import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Write a Travel Story | YlooTrips',
  description: 'Share your travel adventure with the YlooTrips community.',
};

// TipTap is ~80KB — load only when this page is visited
const WriteStory = dynamic(() => import('@/components/WriteStory'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-cream-light flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function WriteStoryPage() {
  return <WriteStory />;
}
