import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.ylootrips.com';

    // Core pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/destinations`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/destinations/domestic`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        },
        {
            url: `${baseUrl}/destinations/international`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        },
        {
            url: `${baseUrl}/trips`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/events`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.85,
        },
        {
            url: `${baseUrl}/blogs`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 0.3,
        },
    ];

    // TODO: Fetch dynamic pages from API (destinations, trips, blogs)
    // const destinations = await fetch(API_BASE_URL + '/destinations').then(r => r.json());
    // const destinationPages = destinations.map(...);

    return staticPages;
}
