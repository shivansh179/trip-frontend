import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { MessageCircle, ArrowRight, CheckCircle, MapPin, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: "Goa on a Budget 2026 — How to Visit for Under ₹15,000",
  description: "Complete Goa budget travel guide 2026: cheap stays, cheap food, free beaches, North vs South Goa, best season, transport hacks, and a full 5-day budget breakdown under ₹15,000.",
  keywords: "Goa budget trip 2026, cheap Goa trip, Goa under 15000, budget travel Goa, North Goa vs South Goa, cheap hotels Goa, Goa backpacker guide, Goa travel tips",
  openGraph: {
    title: "Goa on a Budget 2026 — How to Visit for Under ₹15,000",
    description: "How to do Goa without spending a fortune. Real budget breakdown, best cheap stays, free beaches, and season guide.",
    url: "https://www.ylootrips.com/blogs/goa-budget-trip-guide",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Goa beach sunset with palm trees and golden water",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Goa on a Budget 2026 — How to Visit for Under ₹15,000",
    description: "Budget breakdown, cheap stays, North vs South Goa, best season — everything for an affordable Goa trip.",
    images: ["https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/goa-budget-trip-guide" },
};

const budgetTable = [
  { category: 'Accommodation', perDay: '₹400–₹700 (hostel dorm) / ₹1,200–₹2,000 (budget guesthouse)', fiveNights: '₹2,000–₹10,000' },
  { category: 'Food (3 meals)', perDay: '₹300–₹500 (local shacks + thali)', fiveNights: '₹1,500–₹2,500' },
  { category: 'Local Transport (scooter rental)', perDay: '₹300–₹450/day (scooter)', fiveNights: '₹1,500–₹2,250' },
  { category: 'Activities & entry fees', perDay: '₹200–₹400 avg', fiveNights: '₹1,000–₹2,000' },
  { category: 'Flights or train (return)', perDay: '—', fiveNights: '₹3,000–₹6,000 (train) / ₹5,000–₹12,000 (flight)' },
  { category: 'Total (5 nights, budget mode)', perDay: '₹1,200–₹2,000/day', fiveNights: '₹9,000–₹22,750' },
];

const faqs = [
  {
    question: "What is the cheapest time to visit Goa?",
    answer: "May–September (monsoon season) is the cheapest — hotel rates drop 40–60%, flights are cheaper, and beaches are peaceful. The sea is rough (swimming not recommended), many shacks close, but the landscape is lush and green. If you want both budget and beach, October (shoulder season) is the sweet spot — prices haven't fully spiked yet and the weather is good.",
  },
  {
    question: "Is North Goa or South Goa better for budget travelers?",
    answer: "North Goa for budget travelers: more hostels, more cheap food options, busier nightlife, easier to find fellow travelers. Arambol and Anjuna in North Goa have backpacker guesthouses from ₹400/night. South Goa is quieter and slightly pricier but more peaceful. Budget: choose North Goa. Couples/honeymooners on a moderate budget: South Goa.",
  },
  {
    question: "Can I visit Goa for ₹15,000 including flights?",
    answer: "Yes, if you book flights 6–8 weeks in advance (aim for ₹4,000–₹6,000 return), stay in hostel dorms or cheap guesthouses (₹400–₹800/night), eat at local thali joints (₹100–₹150/meal), and rent a scooter (₹300/day) instead of taxis. A 5-night trip including flights and all expenses can fit in ₹13,000–₹16,000 if you're disciplined.",
  },
  {
    question: "How do I get around Goa cheaply?",
    answer: "Rent a scooter — ₹300–₹450/day is the single best transport decision in Goa. You need a valid driving license. Alternatively, rent a bicycle (₹100–₹150/day) for flat stretches near the beach. Local buses exist but are infrequent. Avoid tourist taxis (₹600–₹1,200 per trip) — they'll eat your budget fast.",
  },
  {
    question: "Which beaches in Goa are free and worth visiting?",
    answer: "All beaches in Goa are technically free — you only pay if you use a beach shack sunbed. Best free beaches: Arambol (North, hippie vibe, sunsets), Anjuna (flea market on Wednesdays), Vagator (dramatic rocky cliffs), Cola Beach (South, hidden gem with freshwater lagoon), Butterfly Beach (South, accessible by boat). Baga and Calangute are the most crowded and touristy — skip them if you value peace.",
  },
];

export default function GoaBudgetTripGuide() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Goa Budget Trip Guide', url: 'https://www.ylootrips.com/blogs/goa-budget-trip-guide' },
      ]} />
      <ArticleJsonLd
        headline="Goa on a Budget 2026 — How to Visit for Under ₹15,000"
        description="Complete Goa budget travel guide 2026: cheap stays, food, transport, beaches, and a full budget breakdown under ₹15,000."
        url="https://www.ylootrips.com/blogs/goa-budget-trip-guide"
        image="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80"
        datePublished="2025-04-12"
        dateModified="2026-01-01"
        keywords={['Goa budget trip', 'cheap Goa', 'Goa under 15000', 'North Goa vs South Goa', 'Goa backpacker']}
        authorName="Arjun Khanna"
        authorUrl="https://www.ylootrips.com/blogs/authors/arjun-khanna"
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80"
          alt="Goa beach at sunset with palm trees"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-cream/70 uppercase tracking-widest text-xs mb-4 font-medium">Budget Travel · April 2026</span>
          <h1 className="font-display text-3xl md:text-5xl text-cream max-w-3xl leading-tight">
            Goa on a Budget 2026
          </h1>
          <p className="text-cream/80 mt-4 max-w-xl text-sm md:text-base">How to Visit for Under ₹15,000 — Complete Guide</p>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 text-caption text-primary/40 uppercase tracking-wider mb-8">
          <span className="flex items-center gap-1"><Clock size={12} /> 9 min read</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> Goa, India</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> Updated April 2026</span>
        </div>

        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Goa has a reputation for being expensive — beach shacks charging ₹400 for a cocktail, resort rooms at ₹6,000 a night. But none of that is mandatory. With the right approach, Goa is one of the most affordable beach destinations in Asia. Here&apos;s how to do it on a real budget.
        </p>

        <div className="text-primary/75 space-y-10">

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">North Goa vs South Goa</h2>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-primary/10 bg-cream-light p-5">
                <div className="font-display text-xl text-primary mb-2">North Goa</div>
                <ul className="space-y-2 text-sm text-primary/65">
                  <li className="flex items-start gap-2"><CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> More hostels and budget guesthouses</li>
                  <li className="flex items-start gap-2"><CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> Better nightlife (Anjuna, Vagator, Morjim)</li>
                  <li className="flex items-start gap-2"><CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> Arambol — the backpacker HQ</li>
                  <li className="flex items-start gap-2"><CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> More street food & local thali joints</li>
                  <li className="flex items-start gap-2"><ArrowRight size={13} className="text-red-400 mt-0.5 shrink-0" /> Busier, more touristy near Baga/Calangute</li>
                </ul>
              </div>
              <div className="border border-primary/10 bg-cream-light p-5">
                <div className="font-display text-xl text-primary mb-2">South Goa</div>
                <ul className="space-y-2 text-sm text-primary/65">
                  <li className="flex items-start gap-2"><CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> Quieter, cleaner beaches (Palolem, Agonda)</li>
                  <li className="flex items-start gap-2"><CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> Better for couples and honeymooners</li>
                  <li className="flex items-start gap-2"><CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> More relaxed pace, fewer touts</li>
                  <li className="flex items-start gap-2"><ArrowRight size={13} className="text-red-400 mt-0.5 shrink-0" /> Fewer ultra-budget options</li>
                  <li className="flex items-start gap-2"><ArrowRight size={13} className="text-red-400 mt-0.5 shrink-0" /> Farther from airport (40–50km)</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-primary/60 italic">Budget verdict: Stay in North Goa (Arambol or Anjuna), make a day trip to South Goa (Palolem is 2 hrs by scooter).</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Cheap Stays in Goa</h2>
            <div className="not-prose space-y-3">
              {[
                { type: 'Hostel dorm (6–8 bed)', price: '₹400–₹700/night', ex: 'Jungle Youth Hostel (Anjuna), Bamboo Breeze (Arambol)' },
                { type: 'Budget guesthouse (private room)', price: '₹800–₹1,500/night', ex: 'Dozens of family-run guesthouses in Arambol and Anjuna. Book direct — better rates than OTAs.' },
                { type: 'Beach hut (shack stays)', price: '₹600–₹1,200/night', ex: 'Basic bamboo huts on less-touristy stretches like Mandrem or Agonda. No AC, but the vibe is unbeatable.' },
                { type: 'Budget hotel with AC', price: '₹1,200–₹2,000/night', ex: 'Available in Calangute and Panaji — decent option for families who need comfort without a resort price tag.' },
              ].map(({ type, price, ex }) => (
                <div key={type} className="border border-primary/10 bg-cream-light p-4">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <div className="font-medium text-primary text-sm">{type}</div>
                    <div className="text-sm font-medium text-secondary">{price}</div>
                  </div>
                  <p className="text-sm text-primary/60">{ex}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-primary/60 italic">Pro tip: In peak season (Dec–Jan), book guesthouses 4–6 weeks ahead. In October and February, you can walk in and negotiate.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Cheap Food in Goa</h2>
            <ul className="space-y-3">
              {[
                'Fish thali at a local joint: ₹100–₹150 — rice, dal, sabzi, pickle, papad, fish curry. This is real Goan food and it\'s exceptional.',
                'Pao with egg bhurji from a street stall: ₹30–₹50. The Goan breakfast of champions.',
                'Kingfish fry at a beach shack: ₹200–₹350. Yes, beach shacks are pricey — but kingfish in Goa is worth it once.',
                'Coconut water from beach vendors: ₹30–₹50. Avoid the resort-side vendors who charge ₹100.',
                'Bebinca and Dodol from Goa market: ₹80–₹120/pack. Traditional Goan sweets — take some home.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary/70">
                  <ArrowRight size={14} className="text-accent mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Daily Budget Breakdown</h2>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Per Day</th>
                    <th className="text-left p-3 font-medium">5 Nights Total</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetTable.map((row, i) => (
                    <tr key={row.category} className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-light'}>
                      <td className="p-3 font-medium text-primary border-b border-primary/10">{row.category}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.perDay}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.fiveNights}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-primary/60 italic">Numbers are for one person traveling solo. Couples sharing a room save significantly on accommodation.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Best Season to Visit Goa on a Budget</h2>
            <div className="not-prose space-y-3">
              {[
                { month: 'October–November', verdict: 'Best value', note: 'Shoulder season: weather perfect, prices moderate, beaches uncrowded. The smartest time to go.' },
                { month: 'December–January', verdict: 'Peak season (expensive)', note: 'Christmas and NYE week: prices triple, beaches packed. Worth it for the atmosphere but budget travelers should avoid.' },
                { month: 'February–March', verdict: 'Good value', note: 'Carnival in February is fun. Weather still great, prices start dropping after mid-Jan. Good window.' },
                { month: 'May–September', verdict: 'Cheapest but monsoon', note: 'Flights and hotels at rock-bottom prices. Sea is rough. Great for budget travelers who don\'t need to swim.' },
              ].map(({ month, verdict, note }) => (
                <div key={month} className="flex gap-3 border border-primary/10 bg-cream-light p-4">
                  <div className="min-w-[120px]">
                    <div className="font-medium text-primary text-sm">{month}</div>
                    <div className="text-caption text-secondary uppercase tracking-wider">{verdict}</div>
                  </div>
                  <p className="text-sm text-primary/60">{note}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-sm p-6 not-prose">
            <div className="flex items-start gap-3">
              <MessageCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-primary mb-1">Want help planning your Goa trip?</p>
                <p className="text-sm text-primary/65 mb-4">We can put together a Goa itinerary that fits your budget — whether that&apos;s ₹8,000 or ₹25,000. Message us on WhatsApp.</p>
                <a
                  href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20plan%20a%20Goa%20trip."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              </div>
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
              { title: 'Kashmir Travel Guide 2026 — Itinerary & Tips', href: '/blogs/kashmir-travel-guide' },
              { title: 'Best Honeymoon Destinations in India 2026', href: '/blogs/best-honeymoon-destinations-india' },
              { title: 'Manali Trip Guide 2026 — Summer & Winter', href: '/blogs/manali-trip-guide' },
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
