import HomeClient from './HomeClient';
import type { Destination } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://trip-backend-65232427280.asia-south1.run.app/api';

interface CmsContent {
  pageKey: string;
  pageTitle: string;
  pageDescription: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  sections: Array<{
    sectionKey: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    backgroundColor: string;
  }>;
  stats: Array<{ value: string; label: string }>;
  features: Array<{ icon: string; title: string; description: string }>;
}

export default async function Home() {
  let content: CmsContent | null = null;
  let destinations: Destination[] = [];

  try {
    // Single request for all homepage data, cached for 60 seconds
    const res = await fetch(`${API_BASE_URL}/homepage`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      content = data.content ?? null;
      destinations = data.featuredDestinations ?? [];
    }
  } catch {
    // Render with fallback content — HomeClient handles null gracefully
  }

  return <HomeClient content={content} destinations={destinations} />;
}
