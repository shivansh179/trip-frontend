import type { Metadata } from 'next';
import StoryDetail from '@/components/StoryDetail';

export const metadata: Metadata = {
  title: 'Travel Story | YlooTrips',
};

export default async function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoryDetail id={id} />;
}
