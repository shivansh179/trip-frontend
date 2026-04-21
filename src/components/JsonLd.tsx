/**
 * JSON-LD structured data components for rich Google results.
 * Usage: <OrganizationJsonLd /> in layout, <TourJsonLd ... /> on tour pages, etc.
 */

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['TravelAgency', 'LocalBusiness'],
        '@id': 'https://www.ylootrips.com/#organization',
        name: 'YlooTrips India Pvt. Ltd.',
        alternateName: 'YlooTrips',
        url: 'https://www.ylootrips.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.ylootrips.com/favicon.png',
          width: 512,
          height: 512,
          caption: 'YlooTrips — Safe & Budget India Tour Packages',
        },
        image: {
          '@type': 'ImageObject',
          url: 'https://www.ylootrips.com/favicon.png',
          width: 512,
          height: 512,
        },
        description:
          'YlooTrips India Pvt. Ltd. crafts bespoke India travel experiences — Golden Triangle, Kerala, Rajasthan, Himalayas and more. Trusted by 25,000+ travelers from 40+ countries since 2022.',
        foundingDate: '2022',
        numberOfEmployees: { '@type': 'QuantitativeValue', value: 50 },
        areaServed: ['IN', 'US', 'GB', 'AU', 'CA', 'DE', 'FR', 'SG'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'New Delhi',
          addressRegion: 'Delhi',
          addressCountry: 'IN',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+91-8427831127',
            email: 'hello@ylootrips.com',
            contactType: 'customer service',
            availableLanguage: ['English', 'Hindi'],
          },
        ],
        sameAs: [
          'https://www.instagram.com/ylootrips',
          'https://www.facebook.com/ylootrips',
          'https://twitter.com/ylootrips',
          'https://www.youtube.com/@ylootrips',
          'https://www.linkedin.com/company/ylootrips',
          'https://in.pinterest.com/ylootrips',
          'https://www.threads.net/@ylootrips',
          'https://g.co/kgs/ylootrips',
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '2400',
          bestRating: '5',
          worstRating: '1',
        },
        priceRange: '$$',
        currenciesAccepted: 'INR, USD, GBP, EUR, AUD',
        paymentAccepted: 'Visa, Mastercard, Amex, UPI, Bank Transfer',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.ylootrips.com/#website',
        url: 'https://www.ylootrips.com',
        name: 'YlooTrips',
        alternateName: ['YlooTrips India', 'Yloo Trips'],
        description: 'Safe & affordable domestic and international tour packages from India. Budget trips to Manali, Kedarnath, Goa, Bali, Dubai & more.',
        publisher: { '@id': 'https://www.ylootrips.com/#organization' },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://www.ylootrips.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        ],
      },
      // Sitelinks Search Box — shown in Google when users search "ylootrips"
      {
        '@type': 'WebSite',
        '@id': 'https://www.ylootrips.com/#sitelinks-searchbox',
        url: 'https://www.ylootrips.com',
        name: 'YlooTrips',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.ylootrips.com/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      // Sitelinks navigation — key pages Google shows as sub-links
      {
        '@type': 'ItemList',
        '@id': 'https://www.ylootrips.com/#sitelinks',
        name: 'YlooTrips — Key Pages',
        description: 'Quick links to popular YlooTrips pages',
        itemListElement: [
          {
            '@type': 'ListItem', position: 1,
            name: 'About Us',
            description: 'Learn about YlooTrips — India\'s trusted travel company since 2022',
            item: {
              '@type': 'WebPage',
              '@id': 'https://www.ylootrips.com/about',
              url: 'https://www.ylootrips.com/about',
              name: 'About YlooTrips | India\'s Trusted Travel Company',
            },
          },
          {
            '@type': 'ListItem', position: 2,
            name: 'Plan Your Dream Journey',
            description: 'Free AI-powered trip planner — get a custom India itinerary in minutes',
            item: {
              '@type': 'WebPage',
              '@id': 'https://www.ylootrips.com/trip-planner',
              url: 'https://www.ylootrips.com/trip-planner',
              name: 'Free AI Trip Planner — Plan Your Dream Journey | YlooTrips',
            },
          },
          {
            '@type': 'ListItem', position: 3,
            name: 'Tour Packages',
            description: 'Browse 150+ domestic & international tour packages from India',
            item: {
              '@type': 'WebPage',
              '@id': 'https://www.ylootrips.com/trips',
              url: 'https://www.ylootrips.com/trips',
              name: 'India Tour Packages — Domestic & International | YlooTrips',
            },
          },
          {
            '@type': 'ListItem', position: 4,
            name: 'International Tours',
            description: 'Bali, Dubai, Thailand, Singapore, Maldives — packages from India',
            item: {
              '@type': 'WebPage',
              '@id': 'https://www.ylootrips.com/destinations/international',
              url: 'https://www.ylootrips.com/destinations/international',
              name: 'International Tour Packages from India | YlooTrips',
            },
          },
          {
            '@type': 'ListItem', position: 5,
            name: 'Customer Reviews',
            description: '4.9★ rated by 2,400+ verified travelers',
            item: {
              '@type': 'WebPage',
              '@id': 'https://www.ylootrips.com/reviews',
              url: 'https://www.ylootrips.com/reviews',
              name: 'YlooTrips Reviews — Verified Traveler Testimonials',
            },
          },
          {
            '@type': 'ListItem', position: 6,
            name: 'Contact & Book',
            description: 'Book a trip or speak to a travel expert — call +91 84278 31127',
            item: {
              '@type': 'WebPage',
              '@id': 'https://www.ylootrips.com/contact',
              url: 'https://www.ylootrips.com/contact',
              name: 'Contact YlooTrips | Book a Tour or Get a Custom Quote',
            },
          },
        ],
      },
      // FAQ schema — helps appear in People Also Ask
      {
        '@type': 'FAQPage',
        '@id': 'https://www.ylootrips.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Is YlooTrips safe for travel?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. YlooTrips is an MSME-registered, GST-certified travel company trusted by 25,000+ travelers. All trips include verified guides, insured transport, and 24/7 support.' },
          },
          {
            '@type': 'Question',
            name: 'What are the best budget trips in India?',
            acceptedAnswer: { '@type': 'Answer', text: 'YlooTrips offers budget domestic trips starting from ₹4,999 — Manali, Kedarnath, Spiti Valley, Kasol, Goa, and more. International budget packages to Bali, Thailand start from ₹24,999.' },
          },
          {
            '@type': 'Question',
            name: 'How do I book a trip with YlooTrips?',
            acceptedAnswer: { '@type': 'Answer', text: 'Browse trips at ylootrips.com, click Book Now, and pay online. Or use the free AI Trip Planner to get a custom itinerary in 1 hour. WhatsApp +91 84278 31127 for help.' },
          },
          {
            '@type': 'Question',
            name: 'Does YlooTrips offer group tours?',
            acceptedAnswer: { '@type': 'Answer', text: 'Yes. YlooTrips offers group tours, family packages, honeymoon trips, and solo travel packages across 150+ domestic and 50+ international destinations.' },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface TourJsonLdProps {
  name: string;
  description: string;
  url: string;
  image: string;
  price: string;
  currency?: string;
  duration: string;
  startLocation: string;
  highlights: string[];
  rating?: number;
  reviewCount?: number;
  destination?: string;
}

export function TourJsonLd({
  name,
  description,
  url,
  image,
  price,
  currency = 'INR',
  duration,
  startLocation,
  highlights,
  rating = 4.9,
  reviewCount = 847,
  destination,
}: TourJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // TouristTrip — correct type for travel packages (enables rich snippets)
      {
        '@type': 'TouristTrip',
        '@id': `${url}#trip`,
        name,
        description,
        url,
        image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
        touristType: ['FamilyTourist', 'HoneymoonTourist', 'GroupTourist', 'SoloTourist'],
        availableLanguage: ['English', 'Hindi'],
        itinerary: {
          '@type': 'ItemList',
          name: `${name} — Day by Day`,
          description: `Complete ${duration} itinerary for ${name}`,
        },
        provider: {
          '@type': 'TravelAgency',
          name: 'YlooTrips',
          url: 'https://www.ylootrips.com',
          telephone: '+91-8427831127',
          email: 'hello@ylootrips.com',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: currency,
          price,
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url,
          validFrom: '2026-01-01',
          seller: {
            '@type': 'TravelAgency',
            name: 'YlooTrips',
            url: 'https://www.ylootrips.com',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toString(),
          reviewCount: reviewCount.toString(),
          bestRating: '5',
          worstRating: '1',
        },
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Duration', value: duration },
          { '@type': 'PropertyValue', name: 'Departure City', value: startLocation },
          ...(destination ? [{ '@type': 'PropertyValue', name: 'Destination', value: destination }] : []),
          ...highlights.slice(0, 6).map((h) => ({
            '@type': 'PropertyValue',
            name: 'Highlight',
            value: h,
          })),
        ],
      },
      // Product schema — enables price + star ratings in Google Shopping & SERPs
      {
        '@type': 'Product',
        '@id': `${url}#product`,
        name,
        description,
        image,
        brand: { '@type': 'Brand', name: 'YlooTrips' },
        offers: {
          '@type': 'Offer',
          priceCurrency: currency,
          price,
          availability: 'https://schema.org/InStock',
          url,
          seller: { '@type': 'Organization', name: 'YlooTrips', url: 'https://www.ylootrips.com' },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating.toString(),
          reviewCount: reviewCount.toString(),
          bestRating: '5',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Reviews page: AggregateRating + Review list for Google rich snippets ──────
export function ReviewsPageJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.ylootrips.com/#organization',
    name: 'YlooTrips India Pvt. Ltd.',
    url: 'https://www.ylootrips.com',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2400',
      bestRating: '5',
      worstRating: '1',
    },
    review: [
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Sarah Mitchell' },
        datePublished: '2025-12-10',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Absolutely incredible trip to Kerala! YlooTrips arranged everything perfectly — the houseboat stay in Alleppey was magical. Our guide Arjun was knowledgeable and attentive. Highly recommend!',
        name: 'Kerala Backwaters — Magical Experience',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'James Thornton' },
        datePublished: '2025-11-20',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Booked the Golden Triangle tour for our family of 4. Seamless from airport pickup to checkout. The private guide made the Taj Mahal come alive with stories. Worth every rupee.',
        name: 'Golden Triangle — Perfect Family Tour',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Priya Sharma' },
        datePublished: '2025-10-15',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Solo female traveler here — I was nervous about India but YlooTrips made it so safe and easy. 24/7 WhatsApp support, clean hotels, professional guides. Already planning my next trip!',
        name: 'Rajasthan Solo Trip — Safe & Beautiful',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'David Chen' },
        datePublished: '2025-09-05',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Booked Manali package last minute. YlooTrips confirmed within hours, sent a full itinerary, and our guide was waiting at the hotel. Snow activities in Solang Valley were unreal!',
        name: 'Manali Last-Minute Trip — Exceeded Expectations',
      },
      {
        '@type': 'Review',
        author: { '@type': 'Person', name: 'Emma Wilson' },
        datePublished: '2025-08-22',
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: 'Honeymoon package to Bali arranged by YlooTrips. Every detail was perfect — surprise flower decoration at the villa, private sunset dinner, spa. Cannot recommend highly enough.',
        name: 'Bali Honeymoon — Absolutely Perfect',
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

// ── Speakable schema — helps Google Assistant / voice search ─────────────────
export function SpeakableJsonLd({ url, cssSelectors }: { url: string; cssSelectors: string[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url,
    speakable: { '@type': 'SpeakableSpecification', cssSelector: cssSelectors },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

interface ArticleJsonLdProps {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
}

export function ArticleJsonLd({
  headline,
  description,
  url,
  image,
  datePublished,
  dateModified,
  authorName = 'YlooTrips Editorial Team',
  keywords = [],
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    image: { '@type': 'ImageObject', url: image, width: 1200, height: 630 },
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
      url: 'https://www.ylootrips.com/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'YlooTrips',
      url: 'https://www.ylootrips.com',
      logo: { '@type': 'ImageObject', url: 'https://www.ylootrips.com/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: keywords.join(', '),
    inLanguage: 'en',
    about: { '@type': 'Thing', name: 'India Travel' },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ faqs }: { faqs: FaqItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
