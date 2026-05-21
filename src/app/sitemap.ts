import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.ylootrips.com';
const API_URL = 'https://trip-backend-65232427280.asia-south1.run.app/api';

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/trips`, lastModified: now, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/destinations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/destinations/domestic`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/destinations/international`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/events`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/hotels`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blogs`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/reviews`, lastModified: now, changeFrequency: 'weekly', priority: 0.88 },
    { url: `${BASE_URL}/tripadvisor`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/trip-planner`, lastModified: now, changeFrequency: 'weekly', priority: 0.92 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },

    // International SEO pages
    { url: `${BASE_URL}/india-travel-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },

    // Curated tour itinerary pages
    { url: `${BASE_URL}/tours/golden-triangle-10-day`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tours/kerala-south-india-14-day`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/tours/rajasthan-heritage-7-day`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // Careers & legal
    { url: `${BASE_URL}/careers`, lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/partnerships`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Feature pages
    { url: `${BASE_URL}/tours`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/offbeat`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/daycations`, lastModified: now, changeFrequency: 'weekly', priority: 0.78 },
    { url: `${BASE_URL}/hidden-spots`, lastModified: now, changeFrequency: 'weekly', priority: 0.78 },
    { url: `${BASE_URL}/cashback`, lastModified: now, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${BASE_URL}/share-and-earn`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/stories`, lastModified: now, changeFrequency: 'weekly', priority: 0.72 },

    // Author pages
    { url: `${BASE_URL}/blogs/authors/priya-verma`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blogs/authors/arjun-khanna`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/blogs/authors/sneha-joshi`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Blog posts
    { url: `${BASE_URL}/blogs/first-time-india-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/blogs/best-time-to-visit-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/blogs/india-vs-thailand`, lastModified: now, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${BASE_URL}/blogs/solo-female-travel-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/blogs/2-week-india-trip-budget`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    // High-traffic SEO blog pages
    { url: `${BASE_URL}/blogs/best-time-to-visit-bali`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${BASE_URL}/blogs/dubai-trip-cost-from-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${BASE_URL}/blogs/thailand-itinerary-5-days`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${BASE_URL}/blogs/best-honeymoon-destinations-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${BASE_URL}/blogs/manali-trip-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${BASE_URL}/blogs/kashmir-travel-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.92 },
    { url: `${BASE_URL}/blogs/kedarnath-yatra-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blogs/goa-budget-trip-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/blogs/long-weekend-getaways-delhi`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/blogs/manali-trip-cost-for-2`, lastModified: now, changeFrequency: 'monthly', priority: 0.93 },
    { url: `${BASE_URL}/blogs/kashmir-trip-cost-from-delhi`, lastModified: now, changeFrequency: 'monthly', priority: 0.93 },
    { url: `${BASE_URL}/blogs/bali-trip-cost-from-india`, lastModified: now, changeFrequency: 'monthly', priority: 0.93 },

    // International package landing pages (high-conversion SEO)
    { url: `${BASE_URL}/dubai-tour-package-from-delhi`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/bali-honeymoon-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/thailand-budget-trip`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/maldives-luxury-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/singapore-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/kashmir-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/manali-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/goa-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/kerala-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },

    // New domestic package landing pages
    { url: `${BASE_URL}/himachal-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/uttarakhand-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/rajasthan-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/andaman-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/ladakh-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/spiti-valley-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.92 },

    // New international package landing pages
    { url: `${BASE_URL}/europe-tour-package-from-india`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/vietnam-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/sri-lanka-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/nepal-tour-package`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },

    // Feature pages
    { url: `${BASE_URL}/group-travel`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/travel-insurance`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE_URL}/packing-checklist`, lastModified: now, changeFrequency: 'monthly', priority: 0.82 },
    { url: `${BASE_URL}/best-time-to-travel`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },
    { url: `${BASE_URL}/visa`, lastModified: now, changeFrequency: 'monthly', priority: 0.88 },

    // Visa destination pages
    ...['bali','dubai','thailand','singapore','maldives','malaysia','vietnam','sri-lanka','nepal','europe','uk','usa','canada','australia','japan','turkey','kenya','egypt'].map(d => ({
      url: `${BASE_URL}/visa/${d}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.82,
    })),

    // Month travel pages
    ...['january','february','march','april','may','june','july','august','september','october','november','december'].map(m => ({
      url: `${BASE_URL}/best-time-to-travel/${m}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.80,
    })),

    // Packing checklist pages
    ...['manali','goa','kashmir','kerala','rajasthan','ladakh','bali','dubai','thailand','europe','andaman','uttarakhand'].map(d => ({
      url: `${BASE_URL}/packing-checklist/${d}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.75,
    })),
  ];

  // ── Dynamic: trip detail pages ────────────────────────────────
  const tripsData = await fetchJson<{ content?: Array<{ id: number }> } | Array<{ id: number }>>('/trips/paginated?page=0&size=200');
  const tripItems: Array<{ id: number }> = Array.isArray(tripsData)
    ? tripsData
    : (tripsData as any)?.content ?? [];

  const tripPages: MetadataRoute.Sitemap = tripItems.map((t) => ({
    url: `${BASE_URL}/trips/${t.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ── Dynamic: destination pages ────────────────────────────────
  const destinations = await fetchJson<Array<{ slug?: string; id: number }>>('/destinations');
  const destinationPages: MetadataRoute.Sitemap = (destinations ?? []).map((d) => ({
    url: d.slug ? `${BASE_URL}/destinations/${d.slug}` : `${BASE_URL}/destinations/${d.id}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // ── Dynamic: event pages ──────────────────────────────────────
  const eventsData = await fetchJson<{ content?: Array<{ id: number; slug?: string }> } | Array<{ id: number; slug?: string }>>('/events?page=0&size=100');
  const eventItems: Array<{ id: number; slug?: string }> = Array.isArray(eventsData)
    ? eventsData
    : (eventsData as any)?.content ?? [];

  // Filter out internal/test/payment events
  const INTERNAL_SLUGS = ['flight-payment-internal', 'internal', 'test', 'payment-internal'];
  const publicEvents = eventItems.filter((e) => {
    const slug = String(e.slug || e.id).toLowerCase();
    return !INTERNAL_SLUGS.some((s) => slug.includes(s));
  });

  const eventPages: MetadataRoute.Sitemap = publicEvents.map((e) => ({
    url: `${BASE_URL}/events/${e.slug || e.id}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...tripPages, ...destinationPages, ...eventPages];
}
