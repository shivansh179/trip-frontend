import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kashmir Trip Cost from Delhi 2026 — Complete Budget Guide',
  description: 'Exact Kashmir trip cost from Delhi in 2026: flights, hotel, houseboat, food, activities. Budget ₹18,000–₹45,000 per person for 6 nights. Includes Gulmarg, Pahalgam, Sonamarg pricing.',
  keywords: 'Kashmir trip cost from Delhi, Kashmir trip budget 2026, Kashmir tour package cost, how much does Kashmir trip cost, Kashmir holiday budget per person',
  openGraph: {
    title: 'Kashmir Trip Cost from Delhi 2026 — Complete Budget Guide',
    description: 'Exact cost of a Kashmir trip from Delhi: flights, houseboat, Gulmarg, Pahalgam. Budget to luxury breakdown.',
    url: 'https://www.ylootrips.com/blogs/kashmir-trip-cost-from-delhi',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80', width: 1200, height: 630, alt: 'Dal Lake Kashmir houseboat Srinagar' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/blogs/kashmir-trip-cost-from-delhi' },
};

const faqs = [
  { question: 'What is the total Kashmir trip cost from Delhi per person?', answer: 'A 6-night Kashmir trip from Delhi costs ₹18,000–₹25,000/person on a budget (shared transport, budget hotel, no houseboat). Mid-range with houseboat: ₹28,000–₹40,000/person. YlooTrips\' all-inclusive Kashmir package costs ₹18,999/person including flights, houseboat, hotel, transfers and guide.' },
  { question: 'What is the cheapest way to reach Kashmir from Delhi?', answer: 'By flight: Delhi–Srinagar is ~1.5 hours and tickets start at ₹2,500–₹5,000 one way (book 3–4 weeks ahead on IndiGo or Air India). By bus/train: Delhi to Jammu (₹800–₹1,500 AC train), then Jammu to Srinagar by shared taxi (₹600–₹800, 8 hrs). Train + taxi is cheaper but much longer.' },
  { question: 'How much does a Kashmir houseboat cost?', answer: 'Dal Lake houseboats range from ₹1,500–₹3,000/night for budget category (basic amenities) to ₹5,000–₹12,000/night for deluxe. A 2-night houseboat stay for a couple costs ₹3,000–₹6,000 (budget) to ₹10,000–₹24,000 (luxury). YlooTrips includes 1–2 nights houseboat in all Kashmir packages.' },
  { question: 'Is Kashmir safe to visit in 2026?', answer: 'Yes. Kashmir has been consistently safe for tourists since 2022. Over 2.5 crore tourists visited in 2024 — a record. Tourist zones (Srinagar, Gulmarg, Pahalgam, Sonamarg) are fully functional with excellent infrastructure. YlooTrips has run 200+ Kashmir trips in 2025 without any safety incidents.' },
  { question: 'What is the best time to visit Kashmir?', answer: 'April–June: tulip gardens, pleasant weather, everything accessible. September–October: golden autumn chinar trees — the most beautiful season. December–February: heavy snowfall in Gulmarg (skiing), Dal Lake may partially freeze. Avoid late July–August (some rain, crowded).' },
];

const COSTS = [
  { item: 'Delhi–Srinagar–Delhi flight', budget: '₹5,000–₹9,000', mid: '₹9,000–₹16,000', note: 'Book 3–4 weeks ahead for best price' },
  { item: 'Dal Lake houseboat (2 nights)', budget: '₹3,000–₹5,000', mid: '₹8,000–₹16,000', note: 'Budget to deluxe category' },
  { item: 'Hotel Srinagar (2 nights)', budget: '₹2,000–₹4,000', mid: '₹5,000–₹10,000', note: '' },
  { item: 'Gulmarg + Pahalgam (2 nights)', budget: '₹3,000–₹5,000', mid: '₹7,000–₹14,000', note: 'Shared vs private room' },
  { item: 'Local transport (private cab, 6 days)', budget: '₹6,000–₹8,000', mid: '₹10,000–₹15,000', note: 'Essential — no good public transport' },
  { item: 'Food (6 days)', budget: '₹3,000–₹5,000', mid: '₹6,000–₹10,000', note: 'Wazwan meal ₹500–₹800/person' },
  { item: 'Activities (Gulmarg gondola, shikara, pony)', budget: '₹2,000–₹3,500', mid: '₹5,000–₹8,000', note: '' },
  { item: 'Miscellaneous', budget: '₹1,000–₹2,000', mid: '₹2,000–₹4,000', note: '' },
  { item: 'TOTAL per person (6 nights)', budget: '₹25,000–₹41,500', mid: '₹52,000–₹93,000', note: 'YlooTrips package: ₹18,999 all-in' },
];

export default function KashmirTripCostFromDelhi() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Kashmir Trip Cost from Delhi', url: 'https://www.ylootrips.com/blogs/kashmir-trip-cost-from-delhi' },
      ]} />
      <ArticleJsonLd
        headline="Kashmir Trip Cost from Delhi 2026 — Complete Budget Guide"
        description="Exact Kashmir trip cost from Delhi: flights, houseboat, Gulmarg, Pahalgam, food and activities."
        url="https://www.ylootrips.com/blogs/kashmir-trip-cost-from-delhi"
        image="https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80"
        datePublished="2026-05-12"
        dateModified="2026-05-12"
        keywords={['Kashmir trip cost', 'Kashmir budget from Delhi', 'Kashmir package price', 'Kashmir trip per person']}
        authorName="Arjun Khanna"
        authorUrl="https://www.ylootrips.com/blogs/authors/arjun-khanna"
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1400&q=85"
          alt="Dal Lake Kashmir houseboat Srinagar shikara" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-primary/55" />
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-3 text-caption text-primary/40 uppercase tracking-wider mb-6">
          <span>Budget Guides</span><span>·</span><span>May 2026</span><span>·</span><span>9 min read</span>
        </div>

        <h1 className="font-display text-display-lg text-primary mb-6">
          Kashmir Trip Cost from Delhi 2026 — Exact Budget Breakdown
        </h1>
        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Kashmir is India&apos;s most breathtaking destination — and more affordable than most people expect. Here&apos;s the exact cost of a 6-night Kashmir trip from Delhi in 2026, broken down by transport, accommodation, food and activities.
        </p>

        <div className="text-primary/75 space-y-10">

          <section>
            <h2 className="font-display text-3xl text-primary mb-3">Quick Answer</h2>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: 'Budget', cost: '₹18,000–₹25,000', desc: 'Per person, 6N, flight included' },
                { type: 'Mid-Range', cost: '₹30,000–₹45,000', desc: 'Houseboat, private cab, good hotels' },
                { type: 'YlooTrips Package', cost: '₹18,999/person', desc: 'All-inclusive: flight, houseboat, hotel, guide' },
              ].map(({ type, cost, desc }) => (
                <div key={type} className="border border-primary/10 bg-cream-light p-4 text-center">
                  <div className="font-display text-2xl text-primary font-bold">{cost}</div>
                  <div className="text-xs font-semibold text-secondary uppercase tracking-wider mt-1 mb-2">{type}</div>
                  <p className="text-xs text-primary/55">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Complete Cost Breakdown</h2>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Expense</th>
                    <th className="text-left p-3 font-medium">Budget</th>
                    <th className="text-left p-3 font-medium">Mid-Range</th>
                  </tr>
                </thead>
                <tbody>
                  {COSTS.map((row, i) => (
                    <tr key={row.item} className={`${i % 2 === 0 ? 'bg-cream' : 'bg-cream-light'} ${i === COSTS.length - 1 ? 'font-bold' : ''}`}>
                      <td className="p-3 text-primary border-b border-primary/10">
                        <div>{row.item}</div>
                        {row.note && <div className="text-xs text-primary/40 font-normal">{row.note}</div>}
                      </td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.budget}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.mid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-primary/50 mt-2">* DIY costs are per person assuming solo travel. Couples save ~30% on accommodation.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Must-Do Activities & Their Costs</h2>
            <div className="not-prose space-y-3">
              {[
                { name: 'Gulmarg Gondola (Phase 1 + 2)', cost: '₹900 + ₹1,050', note: 'World\'s highest cable car. Phase 2 goes to 3,980m. Book early morning to avoid queues.' },
                { name: 'Dal Lake Shikara ride', cost: '₹500–₹1,500/hr', note: 'Negotiate before boarding. Sunrise and sunset rides are magical. 1-hour minimum recommended.' },
                { name: 'Pahalgam horse trek', cost: '₹1,000–₹3,000', note: 'Fixed government rates. Baisaran valley (mini Switzerland) is the most popular route.' },
                { name: 'Sonamarg glacier visit', cost: '₹1,500–₹2,500', note: 'Thajiwas Glacier — pony + sledge included in most packages. Snow visible even in June.' },
                { name: 'Wazwan dinner', cost: '₹500–₹800/person', note: 'Traditional Kashmiri feast (30+ dishes). Ahdoos and Mughal Darbar are the best restaurants.' },
                { name: 'Snow activities in Gulmarg', cost: '₹500–₹2,000', note: 'Skiing equipment rental ₹500/hr, snow scooter ₹800, sledge ₹300.' },
              ].map(({ name, cost, note }) => (
                <div key={name} className="border-l-2 border-accent pl-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-primary text-sm">{name}</div>
                    <div className="text-sm font-semibold text-secondary shrink-0">{cost}</div>
                  </div>
                  <p className="text-sm text-primary/65">{note}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Is Kashmir Safe in 2026?</h2>
            <p className="mb-4">Yes — Kashmir recorded 2.5+ crore tourist arrivals in 2024, a historic high. The major tourist areas (Srinagar, Gulmarg, Pahalgam, Sonamarg) have excellent infrastructure, 4G connectivity, and regular police presence. YlooTrips has run 200+ Kashmir trips with zero safety incidents.</p>
            <div className="not-prose space-y-2">
              {[
                'Check J&K Tourism official advisories before traveling',
                'Stay in established hotels and houseboats — avoid unknown homestays',
                'Always carry a local SIM (Airtel or Jio) for connectivity',
                'YlooTrips provides 24/7 WhatsApp emergency support on all Kashmir trips',
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-sm text-primary/70">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 p-6 not-prose">
            <p className="font-medium text-primary mb-1">Kashmir Package — ₹18,999/person all-inclusive</p>
            <p className="text-sm text-primary/65 mb-4">Flights, Dal Lake houseboat, Gulmarg, Pahalgam, Sonamarg, private cab, guide. Pay ₹5,000 advance to confirm.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/kashmir-tour-package" className="inline-flex items-center gap-2 bg-primary text-cream px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
                View Kashmir Package <ArrowRight size={14} />
              </Link>
              <a href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20know%20more%20about%20Kashmir%20trip%20from%20Delhi." target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-green-700 transition-colors">
                <MessageCircle size={14} /> WhatsApp Us
              </a>
            </div>
          </div>

          <section>
            <h2 className="font-display text-3xl text-primary mb-6">Frequently Asked Questions</h2>
            <div className="not-prose space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="border border-primary/10 group">
                  <summary className="cursor-pointer p-4 font-medium text-primary text-sm flex justify-between items-center gap-3 list-none">
                    {faq.question}
                    <span className="text-primary/40 shrink-0 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="px-4 pb-4 text-sm text-primary/65 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-14 pt-10 border-t border-primary/10">
          <h3 className="font-display text-2xl text-primary mb-6">Continue Reading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'Kashmir Travel Guide 2026 — Complete Itinerary', href: '/blogs/kashmir-travel-guide' },
              { title: 'Manali Trip Cost for 2 Persons 2026', href: '/blogs/manali-trip-cost-for-2' },
              { title: 'Bali Trip Cost from India 2026', href: '/blogs/bali-trip-cost-from-india' },
            ].map(({ title, href }) => (
              <Link key={href} href={href} className="border border-primary/10 bg-cream-light p-5 hover:border-secondary transition-colors">
                <p className="text-sm font-medium text-primary">{title}</p>
                <p className="text-caption text-primary/40 mt-2 uppercase tracking-wider">Read More →</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
