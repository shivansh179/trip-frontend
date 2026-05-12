import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manali Trip Cost for 2 Persons 2026 — Complete Budget Breakdown',
  description: 'Exact Manali trip cost for 2 persons in 2026: budget, mid-range and luxury breakdowns. Includes bus/flight, hotel, food, activities and how to save money. Plan from ₹12,000 for a couple.',
  keywords: 'Manali trip cost for 2 persons, Manali trip budget for couple, Manali package cost 2026, how much does Manali trip cost, Manali couple trip budget',
  openGraph: {
    title: 'Manali Trip Cost for 2 Persons 2026 — Complete Budget Breakdown',
    description: 'Exact cost breakdown for a Manali couple trip: bus, hotel, food, activities. Budget from ₹12,000 for 2 people.',
    url: 'https://www.ylootrips.com/blogs/manali-trip-cost-for-2',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', width: 1200, height: 630, alt: 'Manali mountains couple trip' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/blogs/manali-trip-cost-for-2' },
};

const faqs = [
  { question: 'What is the total Manali trip cost for 2 persons?', answer: 'A 5-night Manali trip for 2 persons costs ₹12,000–₹20,000 on a budget (shared transport, budget hotel, local food). Mid-range couples spend ₹25,000–₹40,000. A comfortable package through YlooTrips starts at ₹13,998 for 2 (₹6,999/person) including hotel, transfers and guide.' },
  { question: 'Is Manali expensive for couples?', answer: 'No. Manali is one of India\'s most affordable hill destinations for couples. A double room in a decent hotel costs ₹800–₹2,000/night. Food for two costs ₹500–₹800/day. The main costs are transport (₹1,800–₹3,000 for Volvo bus) and activities (₹3,000–₹5,000 for 2).' },
  { question: 'What is the cheapest way to do Manali trip for 2?', answer: 'Take HRTC Volvo bus from Delhi (₹1,800–₹3,000 for 2), stay in Old Manali guesthouses (₹600–₹1,200/night for a double), eat at local dhabas (₹300–₹500/day for 2), and book activities directly. Total for 5 nights: ₹10,000–₹14,000 for 2 people.' },
  { question: 'Should couples book a Manali package or go independently?', answer: 'A package is better value for most couples. YlooTrips\' Manali package (₹6,999/person) includes hotel, Volvo bus, local transfers, guide and Rohtang jeep — booking these separately costs ₹9,000–₹12,000/person. The package also saves planning time and avoids common tourist traps.' },
  { question: 'What is the best time for a couple trip to Manali?', answer: 'October–November (clear skies, fewer crowds, good for romance) and December–January (snow, cozy stays, Christmas magic) are most popular for couples. March–May is great for adventure activities. Avoid July–August (landslide risk).' },
];

const COSTS = [
  { item: 'Volvo bus Delhi–Manali–Delhi (2 persons)', budget: '₹3,600–₹5,000', mid: '₹5,000–₹7,000', note: 'Book HRTC or private Volvo' },
  { item: 'Hotel (5 nights, double room)', budget: '₹4,000–₹7,000', mid: '₹10,000–₹20,000', note: 'Budget = Old Manali guesthouse' },
  { item: 'Food (5 days, 3 meals)', budget: '₹3,000–₹5,000', mid: '₹6,000–₹10,000', note: 'Dhabas vs cafés' },
  { item: 'Rohtang Pass jeep (shared)', budget: '₹1,600–₹2,400', mid: '₹3,000–₹4,000', note: 'Plus ₹1,000 permit for car' },
  { item: 'Solang Valley activities', budget: '₹1,000–₹2,000', mid: '₹2,500–₹4,000', note: 'Paragliding, ATV, cable car' },
  { item: 'Hadimba, Old Manali, local sightseeing', budget: '₹500–₹1,000', mid: '₹1,000–₹2,000', note: 'Shared taxi or walk' },
  { item: 'Miscellaneous (tips, sim, shopping)', budget: '₹1,000–₹2,000', mid: '₹2,000–₹3,000', note: '' },
  { item: 'TOTAL for 2 persons (5 nights)', budget: '₹14,700–₹24,400', mid: '₹29,500–₹50,000', note: '' },
];

export default function ManaliTripCostFor2() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Manali Trip Cost for 2', url: 'https://www.ylootrips.com/blogs/manali-trip-cost-for-2' },
      ]} />
      <ArticleJsonLd
        headline="Manali Trip Cost for 2 Persons 2026 — Complete Budget Breakdown"
        description="Exact Manali trip cost for 2 persons: budget, mid-range and luxury breakdowns for a couple trip."
        url="https://www.ylootrips.com/blogs/manali-trip-cost-for-2"
        image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
        datePublished="2026-05-12"
        dateModified="2026-05-12"
        keywords={['Manali trip cost for 2', 'Manali couple budget', 'Manali trip price', 'Manali package cost']}
        authorName="Priya Verma"
        authorUrl="https://www.ylootrips.com/blogs/authors/priya-verma"
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85"
          alt="Manali snow mountains couple trip cost" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-primary/55" />
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-3 text-caption text-primary/40 uppercase tracking-wider mb-6">
          <span>Budget Guides</span><span>·</span><span>May 2026</span><span>·</span><span>8 min read</span>
        </div>

        <h1 className="font-display text-display-lg text-primary mb-6">
          Manali Trip Cost for 2 Persons (2026) — Exact Budget Breakdown
        </h1>
        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Planning a Manali trip for a couple and not sure how much to budget? This guide breaks down the exact costs — transport, hotel, food, activities — for 5 nights in Manali for 2 people in 2026.
        </p>

        <div className="text-primary/75 space-y-10">

          <section>
            <h2 className="font-display text-3xl text-primary mb-3">Quick Answer</h2>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: 'Budget Trip', cost: '₹14,000–₹20,000', desc: 'Bus, guesthouse, dhabas, shared activities' },
                { type: 'Mid-Range Trip', cost: '₹25,000–₹40,000', desc: 'Decent hotel, cafés, private jeep, all activities' },
                { type: 'YlooTrips Package', cost: '₹13,998 for 2', desc: 'All-inclusive: bus, hotel, transfers, guide' },
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
            <h2 className="font-display text-3xl text-primary mb-4">Full Cost Breakdown for 2 Persons</h2>
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
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">5 Ways to Save Money on Your Manali Trip</h2>
            <ul className="space-y-3">
              {[
                { tip: 'Travel on weekdays', detail: 'Bus tickets are 20–30% cheaper Monday–Thursday. Hotels also drop rates midweek.' },
                { tip: 'Book Rohtang jeep as shared, not private', detail: 'Shared jeep ₹800–₹1,200/person vs private ₹3,500–₹5,000. Same experience, same road.' },
                { tip: 'Stay in Old Manali, not Mall Road', detail: 'Double rooms in Old Manali are ₹600–₹1,500 vs ₹2,000–₹4,000 on Mall Road. Old Manali is quieter and has better cafés.' },
                { tip: 'Book a package instead of piece-by-piece', detail: 'YlooTrips\' ₹6,999/person package includes Volvo, hotel, local transfers and guide. Booking all separately costs ₹9,000–₹12,000/person.' },
                { tip: 'Avoid peak season (June & Christmas week)', detail: 'Hotel prices triple during peak. Late May, early July, September, October offer the same experience at 40% lower cost.' },
              ].map(({ tip, detail }) => (
                <li key={tip} className="border-l-2 border-accent pl-4">
                  <div className="font-medium text-primary text-sm">{tip}</div>
                  <p className="text-sm text-primary/65">{detail}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Is a Manali Package Worth It for Couples?</h2>
            <p className="mb-4">For most couples — yes. Here&apos;s the honest comparison:</p>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-primary/10 p-4 bg-cream-light">
                <div className="font-semibold text-primary mb-2 text-sm">DIY Trip (per couple)</div>
                <ul className="space-y-1 text-sm text-primary/65">
                  <li>• Volvo bus (2): ₹3,600</li>
                  <li>• Hotel 5N: ₹6,000</li>
                  <li>• Local taxi/jeep: ₹4,000</li>
                  <li>• Guide: ₹2,000</li>
                  <li className="font-semibold text-primary pt-1">Total: ~₹15,600+ (no guide, self-planned)</li>
                </ul>
              </div>
              <div className="border border-accent p-4 bg-cream-light">
                <div className="font-semibold text-primary mb-2 text-sm">YlooTrips Package (per couple)</div>
                <ul className="space-y-1 text-sm text-primary/65">
                  <li>• Volvo bus both ways: ✓</li>
                  <li>• Hotel 4N: ✓</li>
                  <li>• All local transfers: ✓</li>
                  <li>• Expert guide: ✓</li>
                  <li className="font-semibold text-primary pt-1">Total: ₹13,998 (everything included)</li>
                </ul>
              </div>
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 p-6 not-prose">
            <p className="font-medium text-primary mb-1">Book Manali for 2 — ₹6,999/person</p>
            <p className="text-sm text-primary/65 mb-4">All-inclusive Manali package: Volvo bus, hotel, transfers, guide. Pay only ₹2,500 advance to confirm.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/manali-tour-package" className="inline-flex items-center gap-2 bg-primary text-cream px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
                View Manali Package <ArrowRight size={14} />
              </Link>
              <a href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20book%20Manali%20trip%20for%202%20persons." target="_blank" rel="noopener noreferrer"
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
              { title: 'Manali Complete Travel Guide 2026', href: '/blogs/manali-trip-guide' },
              { title: 'Kashmir Trip Cost from Delhi 2026', href: '/blogs/kashmir-trip-cost-from-delhi' },
              { title: 'Best Budget Trips in India Under ₹10,000', href: '/blogs/2-week-india-trip-budget' },
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
