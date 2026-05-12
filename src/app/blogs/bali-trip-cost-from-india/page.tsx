import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { CheckCircle, MessageCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bali Trip Cost from India 2026 — Complete Budget Guide (₹40K–₹1L)',
  description: 'Exact Bali trip cost from India 2026: flights, hotel, visa, food, activities. Budget ₹40,000–₹1,00,000 per person for 6 nights. Includes Ubud, Seminyak, Kuta, Nusa Penida costs.',
  keywords: 'Bali trip cost from India, Bali trip budget 2026, Bali package cost from India, how much does Bali trip cost from India, Bali honeymoon cost India',
  openGraph: {
    title: 'Bali Trip Cost from India 2026 — Complete Budget Guide',
    description: 'Exact cost of a Bali trip from India: flights, hotels, visa, activities. ₹40,000–₹1,00,000 per person.',
    url: 'https://www.ylootrips.com/blogs/bali-trip-cost-from-india',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80', width: 1200, height: 630, alt: 'Bali rice terraces temples Indonesia' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/blogs/bali-trip-cost-from-india' },
};

const faqs = [
  { question: 'What is the total Bali trip cost from India per person?', answer: 'A 6-night Bali trip from India costs ₹40,000–₹55,000/person on a budget (economy flight, mid-range hotel, local food). A comfortable trip with good resorts and activities: ₹60,000–₹90,000. YlooTrips\' Bali package starts at ₹42,999/person — all-inclusive with resort, transfers and guide.' },
  { question: 'Do Indians need a visa for Bali?', answer: 'Indians get a free Visa on Arrival in Bali (Indonesia) for up to 30 days. No pre-application needed. You pay $35 USD (~₹2,900) at Ngurah Rai Airport on arrival. Keep USD cash ready — card payment is sometimes unavailable.' },
  { question: 'What is the cheapest flight from India to Bali?', answer: 'Cheapest routes: Delhi/Mumbai to Bali via Singapore (IndiGo, Air Asia) or via Kuala Lumpur. Budget flights start at ₹12,000–₹18,000 return if booked 6–8 weeks ahead. Direct flights (IndiGo recently started) cost ₹18,000–₹30,000 return. Book on Skyscanner for best prices.' },
  { question: 'Is Bali good for Indian tourists?', answer: 'Excellent. Bali has a large Indian tourist community, Indian restaurants everywhere, Hindu temples (Tanah Lot, Uluwatu), vegetarian food options, and Hindi-speaking guides in tourist areas. Indians consistently rate Bali as one of the best international destinations for value, culture, and nightlife.' },
  { question: 'What is the best time to visit Bali from India?', answer: 'April–October is Bali\'s dry season — best weather, all activities available. May–June and September are the sweet spots (good weather, lower crowds). Avoid July–August (peak tourist season, highest prices). November–March is wet season but Ubud and inland areas are fine — beach areas get heavy rain.' },
];

const COSTS = [
  { item: 'Return flight India–Bali', budget: '₹14,000–₹20,000', mid: '₹22,000–₹35,000', note: 'Economy, includes 1 stopover' },
  { item: 'Visa on arrival (USD 35)', budget: '~₹2,900', mid: '~₹2,900', note: 'Same for all — pay in USD cash' },
  { item: 'Hotel/resort (6 nights)', budget: '₹9,000–₹15,000', mid: '₹18,000–₹40,000', note: 'Budget villa to 4★ resort' },
  { item: 'Airport transfers + local transport', budget: '₹4,000–₹6,000', mid: '₹8,000–₹12,000', note: 'Driver for the day: ₹1,500–₹2,500' },
  { item: 'Food (6 days)', budget: '₹5,000–₹8,000', mid: '₹10,000–₹18,000', note: 'Local warungs to beach clubs' },
  { item: 'Activities (temples, rice terraces, rafting)', budget: '₹5,000–₹8,000', mid: '₹10,000–₹18,000', note: 'Ubud tour, Nusa Penida day trip' },
  { item: 'Nusa Penida day trip (fast boat)', budget: '₹2,500–₹3,500', mid: '₹4,000–₹6,000', note: 'Kelingking Beach — unmissable' },
  { item: 'Miscellaneous (shopping, tips, travel insurance)', budget: '₹3,000–₹5,000', mid: '₹6,000–₹12,000', note: '' },
  { item: 'TOTAL per person (6 nights)', budget: '₹45,400–₹68,400', mid: '₹80,900–₹1,43,900', note: 'YlooTrips package: ₹42,999 all-in' },
];

export default function BaliTripCostFromIndia() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Bali Trip Cost from India', url: 'https://www.ylootrips.com/blogs/bali-trip-cost-from-india' },
      ]} />
      <ArticleJsonLd
        headline="Bali Trip Cost from India 2026 — Complete Budget Guide"
        description="Exact Bali trip cost from India: flights, visa, hotel, food, activities. ₹40,000–₹1,00,000 per person."
        url="https://www.ylootrips.com/blogs/bali-trip-cost-from-india"
        image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
        datePublished="2026-05-12"
        dateModified="2026-05-12"
        keywords={['Bali trip cost India', 'Bali budget from India', 'Bali package price', 'Bali honeymoon cost']}
        authorName="Sneha Joshi"
        authorUrl="https://www.ylootrips.com/blogs/authors/sneha-joshi"
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1400&q=85"
          alt="Bali rice terraces Tegallalang Ubud Indonesia" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-primary/55" />
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex items-center gap-3 text-caption text-primary/40 uppercase tracking-wider mb-6">
          <span>International Budget Guides</span><span>·</span><span>May 2026</span><span>·</span><span>9 min read</span>
        </div>

        <h1 className="font-display text-display-lg text-primary mb-6">
          Bali Trip Cost from India 2026 — Complete Budget Breakdown
        </h1>
        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Bali is India&apos;s most popular international destination — and far more affordable than most people think. Here&apos;s exactly what a 6-night Bali trip costs from India in 2026, with honest numbers for every expense.
        </p>

        <div className="text-primary/75 space-y-10">

          <section>
            <h2 className="font-display text-3xl text-primary mb-3">Quick Answer</h2>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: 'Budget Trip', cost: '₹45,000–₹55,000', desc: 'Per person, 6N, economy flights' },
                { type: 'Comfortable Trip', cost: '₹65,000–₹90,000', desc: 'Good resort, all activities included' },
                { type: 'YlooTrips Package', cost: '₹42,999/person', desc: 'All-inclusive: flight, resort, guide, transfers' },
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
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Top 5 Things to Do in Bali (with Costs)</h2>
            <div className="not-prose space-y-3">
              {[
                { name: 'Nusa Penida Day Trip', cost: '₹2,500–₹3,500/person', note: 'Fast boat + driver. Kelingking Beach, Angel\'s Billabong, Crystal Bay. The most popular day trip from Bali.' },
                { name: 'Ubud Full-Day Tour', cost: '₹1,500–₹2,500/person', note: 'Tegallalang rice terraces, Tirta Empul temple, Monkey Forest, art villages. Book a private driver.' },
                { name: 'Uluwatu Temple Sunset + Kecak Dance', cost: '₹300–₹500/person', note: 'Entry ₹50K IDR (~₹250). Kecak fire dance at sunset is unmissable. Go between 5–7pm.' },
                { name: 'Ubud White Water Rafting', cost: '₹1,500–₹2,500/person', note: 'Ayung River rafting, 2 hours, Grade 2–3. Fun for couples and groups. Includes lunch.' },
                { name: 'Seminyak/Canggu Beach Club', cost: '₹500–₹3,000/person', note: 'Minimum spend at Potato Head or La Plancha. Budget beach clubs free entry, premium ones ₹1,000–₹3,000 minimum.' },
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
            <h2 className="font-display text-3xl text-primary mb-4">Visa & Practical Info for Indians</h2>
            <div className="not-prose space-y-2">
              {[
                'Visa on Arrival: Free entry up to 30 days. Pay $35 USD at airport (keep cash ready).',
                'Currency: Indonesian Rupiah (IDR). 1 INR = ~190 IDR. ATMs everywhere in tourist areas.',
                'SIM card: Buy Telkomsel or XL at airport (₹500–₹1,000 for 10GB data).',
                'Language: English widely spoken in all tourist areas. No Hindi needed.',
                'Power sockets: Type C/F (same as India — most Indian chargers work directly).',
                'Best areas to stay: Seminyak (nightlife), Ubud (culture), Canggu (digital nomads), Nusa Dua (families).',
              ].map((tip) => (
                <div key={tip} className="flex items-start gap-2 text-sm text-primary/70">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                  {tip}
                </div>
              ))}
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 p-6 not-prose">
            <p className="font-medium text-primary mb-1">Bali Package — ₹42,999/person all-inclusive</p>
            <p className="text-sm text-primary/65 mb-4">Flights, resort, Nusa Penida, Ubud tour, transfers, English-speaking guide. Perfect for honeymoons, couples and groups.</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/bali-honeymoon-package" className="inline-flex items-center gap-2 bg-primary text-cream px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors">
                View Bali Package <ArrowRight size={14} />
              </Link>
              <a href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20know%20Bali%20trip%20cost%20from%20India." target="_blank" rel="noopener noreferrer"
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
              { title: 'Best Time to Visit Bali from India', href: '/blogs/best-time-to-visit-bali' },
              { title: 'Dubai Trip Cost from India 2026', href: '/blogs/dubai-trip-cost-from-india' },
              { title: 'Thailand 5-Day Itinerary from India', href: '/blogs/thailand-itinerary-5-days' },
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
