import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const AUTHORS: Record<string, {
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  articles: { title: string; href: string; date: string }[];
}> = {
  'priya-verma': {
    name: 'Priya Verma',
    role: 'Senior Travel Writer — India Specialist',
    bio: 'Priya has been travelling across India for over a decade and writing about it for eight years. She has trekked the Spiti circuit in winter, done solo trips to the Northeast, and covered the Char Dham Yatra twice. Her guides focus on practical, honest travel advice for both first-timers and seasoned explorers. At YlooTrips she covers the Himalayas, Rajasthan, South India, and pilgrimage routes.',
    expertise: ['Himalayas & hill stations', 'Rajasthan heritage tours', 'South India backwaters', 'Budget & solo travel in India', 'Pilgrimage & spiritual travel'],
    articles: [
      { title: 'First Time in India? Complete 2026 Guide', href: '/blogs/first-time-india-guide', date: 'April 2026' },
      { title: 'Best Time to Visit India — Month-by-Month', href: '/blogs/best-time-to-visit-india', date: 'March 2026' },
      { title: 'Manali Trip Guide 2026 — Summer & Winter', href: '/blogs/manali-trip-guide', date: 'March 2026' },
      { title: 'Kashmir Travel Guide 2026', href: '/blogs/kashmir-travel-guide', date: 'February 2026' },
      { title: 'Kedarnath Yatra Guide', href: '/blogs/kedarnath-yatra-guide', date: 'January 2026' },
      { title: '2-Week India Trip Budget Breakdown', href: '/blogs/2-week-india-trip-budget', date: 'December 2025' },
    ],
  },
  'arjun-khanna': {
    name: 'Arjun Khanna',
    role: 'International Travel Editor',
    bio: 'Arjun has visited 30+ countries and lived in Bali for six months while writing a travel column. He specialises in Southeast Asia and the Middle East travel from India — covering flights, visas, currency, and on-the-ground logistics so Indian travelers can plan their first international trip with confidence. At YlooTrips he covers Bali, Dubai, Thailand, Singapore, and Maldives.',
    expertise: ['Bali & Indonesia', 'Dubai & UAE', 'Thailand & Southeast Asia', 'International visa & flights from India', 'Budget international travel'],
    articles: [
      { title: 'Best Time to Visit Bali — Month-by-Month 2026', href: '/blogs/best-time-to-visit-bali', date: 'April 2026' },
      { title: 'Dubai Trip Cost from India — 2026 Budget Guide', href: '/blogs/dubai-trip-cost-from-india', date: 'April 2026' },
      { title: 'Thailand 5-Day Itinerary for First-Timers', href: '/blogs/thailand-itinerary-5-days', date: 'March 2026' },
      { title: 'India vs Thailand: Which Is Better for Your Next Trip?', href: '/blogs/india-vs-thailand', date: 'January 2026' },
      { title: 'Goa Budget Trip Guide', href: '/blogs/goa-budget-trip-guide', date: 'November 2025' },
    ],
  },
  'sneha-joshi': {
    name: 'Sneha Joshi',
    role: 'Travel Content Lead',
    bio: 'Sneha leads content strategy at YlooTrips and has a particular love for honeymoon travel, weekend getaways, and writing for female travelers. She has planned and covered trips from Rishikesh to Rann of Kutch, and writes in a warm, practical style that resonates with first-time travelers. Her guides consistently rank among the most-read on the YlooTrips blog.',
    expertise: ['Honeymoon & romantic travel', 'Weekend getaways from Delhi & Mumbai', 'Solo female travel safety', 'Family-friendly itineraries', 'Travel lifestyle & packing'],
    articles: [
      { title: 'Best Honeymoon Destinations in India', href: '/blogs/best-honeymoon-destinations-india', date: 'March 2026' },
      { title: 'Long Weekend Getaways from Delhi', href: '/blogs/long-weekend-getaways-delhi', date: 'February 2026' },
      { title: 'Solo Female Travel in India — Safety Guide', href: '/blogs/solo-female-travel-india', date: 'December 2025' },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(AUTHORS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = AUTHORS[slug];
  if (!author) return {};
  return {
    title: `${author.name} — ${author.role} | YlooTrips`,
    description: author.bio.slice(0, 160),
    openGraph: {
      title: `${author.name} | YlooTrips Travel Writers`,
      description: author.bio.slice(0, 160),
      url: `https://www.ylootrips.com/authors/${slug}`,
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = AUTHORS[slug];
  if (!author) notFound();

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `https://www.ylootrips.com/authors/${slug}`,
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    url: `https://www.ylootrips.com/authors/${slug}`,
    worksFor: {
      '@type': 'Organization',
      name: 'YlooTrips',
      url: 'https://www.ylootrips.com',
    },
    knowsAbout: author.expertise,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Authors', url: 'https://www.ylootrips.com/authors' },
        { name: author.name, url: `https://www.ylootrips.com/authors/${slug}` },
      ]} />

      <main className="min-h-screen bg-cream pt-20">
        <div className="max-w-3xl mx-auto px-4 py-12">

          {/* Header */}
          <div className="flex items-start gap-6 mb-10">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-3xl font-bold text-primary">
              {author.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-primary/40 mb-1">Author</p>
              <h1 className="text-3xl font-bold text-primary mb-1">{author.name}</h1>
              <p className="text-primary/60 text-sm">{author.role} · YlooTrips</p>
            </div>
          </div>

          {/* Bio */}
          <section className="mb-10">
            <p className="text-primary/80 leading-relaxed text-base">{author.bio}</p>
          </section>

          {/* Expertise */}
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-primary mb-3">Areas of Expertise</h2>
            <ul className="flex flex-wrap gap-2">
              {author.expertise.map((e) => (
                <li key={e} className="bg-primary/8 text-primary text-xs font-medium px-3 py-1.5 rounded-full">
                  {e}
                </li>
              ))}
            </ul>
          </section>

          {/* Articles */}
          <section>
            <h2 className="text-lg font-semibold text-primary mb-4">Articles by {author.name}</h2>
            <ul className="space-y-3">
              {author.articles.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className="flex items-center justify-between group bg-white rounded-xl px-4 py-3 border border-primary/10 hover:border-primary/30 transition-colors">
                    <span className="text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">{a.title}</span>
                    <span className="text-xs text-primary/40 shrink-0 ml-4">{a.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 pt-8 border-t border-primary/10">
            <Link href="/blogs" className="text-sm text-primary/50 hover:text-primary transition-colors">← All Travel Guides</Link>
          </div>
        </div>
      </main>
    </>
  );
}
