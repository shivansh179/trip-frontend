import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { MessageCircle, MapPin, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: "15 Best Honeymoon Destinations in India 2026 — Romantic Getaways",
  description: "15 best honeymoon destinations in India for 2026: Andaman, Kashmir, Goa, Kerala, Manali, Coorg, Udaipur, Darjeeling, Rishikesh, Ooty, Shimla, Munnar, Spiti, Mussoorie, Rann of Kutch. Budget, season & tips.",
  keywords: "best honeymoon destinations India 2026, romantic getaways India, honeymoon places India, Kashmir honeymoon, Andaman honeymoon, Kerala honeymoon, Goa honeymoon, Udaipur honeymoon, Manali honeymoon",
  openGraph: {
    title: "15 Best Honeymoon Destinations in India 2026 — Romantic Getaways",
    description: "From snow-capped Manali to tropical Andaman — the 15 most romantic places in India for honeymooners in 2026.",
    url: "https://www.ylootrips.com/blogs/best-honeymoon-destinations-india",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Romantic sunset at a beautiful Indian honeymoon destination",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "15 Best Honeymoon Destinations in India 2026",
    description: "Andaman, Kashmir, Goa, Kerala, Udaipur and 10 more — India's most romantic honeymoon destinations ranked and compared.",
    images: ["https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/best-honeymoon-destinations-india" },
};

const destinations = [
  { name: 'Andaman & Nicobar Islands', budget: '₹35,000–₹60,000', bestFor: 'Beach romance, diving, seclusion', season: 'October – May', emoji: '🌊', desc: 'Radhanagar Beach (Asia\'s best), bioluminescent plankton at night, scuba diving, private beach resorts. Havelock Island is the honeymooner\'s base. Fly from Chennai or Kolkata.' },
  { name: 'Kashmir', budget: '₹30,000–₹70,000', bestFor: 'Scenic beauty, houseboats, snow', season: 'April–June, Sep–Oct', emoji: '🏔️', desc: 'Dal Lake houseboat at sunrise, Gulmarg meadows, the garden of Shalimar Bagh. April (tulips) and October (autumn foliage) are the most romantic months.' },
  { name: 'Goa', budget: '₹20,000–₹45,000', bestFor: 'Beach, nightlife, luxury resorts', season: 'November – February', emoji: '🏖️', desc: 'South Goa (Palolem, Agonda) is best for couples — quieter beaches, boutique resorts, candlelit dinner at the shore. Skip touristy North Goa if you want romance.' },
  { name: 'Kerala (Backwaters & Munnar)', budget: '₹25,000–₹55,000', bestFor: 'Houseboat, tea gardens, Ayurveda', season: 'September – March', emoji: '🌿', desc: 'A private houseboat through the Alleppey backwaters is among the most romantic experiences in India. Combine with Munnar hills and a beach at Varkala for a perfect Kerala honeymoon.' },
  { name: 'Manali', budget: '₹18,000–₹40,000', bestFor: 'Mountains, snow, adventure', season: 'March–June, Dec–Jan', emoji: '❄️', desc: 'Cozy mountain hotels with fireplace, snowfall in winter, river walks in Solang Valley. March–May for spring wildflowers; December for a white honeymoon.' },
  { name: 'Coorg (Kodagu)', budget: '₹20,000–₹45,000', bestFor: 'Coffee estates, mist, privacy', season: 'October – March', emoji: '☕', desc: 'Misty coffee and spice estates with jungle lodges, waterfall walks, and Tibetan monasteries. Coorg is one of India\'s best-kept honeymoon secrets. Only 5 hrs from Bangalore.' },
  { name: 'Udaipur', budget: '₹22,000–₹60,000', bestFor: 'Royal romance, lake palace, heritage', season: 'October – March', emoji: '🏰', desc: 'The City of Lakes. Lake Palace Hotel (on a lake island), shikara rides on Lake Pichola, sunset from City Palace terrace. Udaipur is India\'s most romantic city by general consensus.' },
  { name: 'Darjeeling', budget: '₹18,000–₹35,000', bestFor: 'Tea gardens, Himalayan views, colonial charm', season: 'March–May, Sep–Nov', emoji: '🍵', desc: 'Tiger Hill sunrise over Kanchenjunga, toy train rides, tea estate walks with your partner, colonial-era hotels. Compact, charming, and unlike anywhere else in India.' },
  { name: 'Rishikesh', budget: '₹15,000–₹35,000', bestFor: 'Riverside camps, yoga, adventure', season: 'September – April', emoji: '🏕️', desc: 'Glamping tents on the banks of the Ganga, morning yoga by the river, the Ram Jhula at dusk. For adventure-loving couples: river rafting, cliff jumping, bungee. Quirky and very memorable.' },
  { name: 'Ooty (Nilgiris)', budget: '₹16,000–₹35,000', bestFor: 'Hill station, colonial feel, botanical gardens', season: 'April – June, Sep – Nov', emoji: '🌸', desc: 'Toy train through tea gardens, boating on Ooty Lake, Rose Garden in full bloom. South India\'s classic hill station honeymoon — reliable, beautiful, easy to reach.' },
  { name: 'Shimla', budget: '₹18,000–₹35,000', bestFor: 'Colonial hill station, snow, mall road', season: 'March–June, Dec–Jan', emoji: '🎿', desc: 'British-era heritage hotels, the famous Mall Road, snowfall in December–January, Kufri day trips. Quick getaway from Delhi (6 hrs by road, 5 hrs by train). Very honeymoon-friendly hotels.' },
  { name: 'Munnar', budget: '₹20,000–₹40,000', bestFor: 'Tea estates, cool weather, rolling hills', season: 'September – May', emoji: '🌄', desc: 'Endless emerald tea gardens, Eravikulam National Park (Nilgiri Tahr), misty mornings, tree-house resorts. Best combined with Alleppey backwaters for a Kerala honeymoon package.' },
  { name: 'Spiti Valley', budget: '₹25,000–₹45,000', bestFor: 'Off-beat, dramatic landscape, stargazing', season: 'June – September', emoji: '🌌', desc: 'For adventurous couples: Spiti\'s lunar landscapes, ancient monasteries, and the clearest night skies in India make for an extraordinary honeymoon. It\'s challenging — but deeply unforgettable.' },
  { name: 'Mussoorie', budget: '₹15,000–₹30,000', bestFor: 'Hill station, valley views, weekend getaway', season: 'March–June, Sep–Nov', emoji: '🌁', desc: 'The Queen of Hills, 300km from Delhi. Cable car over the valley, Kempty Falls, Gun Hill viewpoint, heritage Savoy Hotel. Perfect for a quick 3–4 day honeymoon from North India.' },
  { name: 'Rann of Kutch', budget: '₹20,000–₹40,000', bestFor: 'Unique, surreal, Rann Utsav', season: 'November – February', emoji: '🌕', desc: 'Walking on a vast salt desert under a full moon is one of the most otherworldly experiences in India. The Rann Utsav festival (Nov–Feb) adds cultural richness. Stay in a luxury tent city for the full experience.' },
];

const comparisonTable = [
  { dest: 'Andaman', budget: '₹35,000–₹60,000', bestFor: 'Beach & diving', season: 'Oct–May' },
  { dest: 'Kashmir', budget: '₹30,000–₹70,000', bestFor: 'Scenery & snow', season: 'Apr–Jun, Sep–Oct' },
  { dest: 'Goa', budget: '₹20,000–₹45,000', bestFor: 'Beach & nightlife', season: 'Nov–Feb' },
  { dest: 'Kerala', budget: '₹25,000–₹55,000', bestFor: 'Backwaters & Ayurveda', season: 'Sep–Mar' },
  { dest: 'Udaipur', budget: '₹22,000–₹60,000', bestFor: 'Royal romance', season: 'Oct–Mar' },
  { dest: 'Coorg', budget: '₹20,000–₹45,000', bestFor: 'Privacy & estates', season: 'Oct–Mar' },
  { dest: 'Manali', budget: '₹18,000–₹40,000', bestFor: 'Mountains & adventure', season: 'Mar–Jun, Dec–Jan' },
  { dest: 'Darjeeling', budget: '₹18,000–₹35,000', bestFor: 'Tea gardens & views', season: 'Mar–May, Sep–Nov' },
  { dest: 'Spiti', budget: '₹25,000–₹45,000', bestFor: 'Off-beat & stargazing', season: 'Jun–Sep' },
  { dest: 'Rann of Kutch', budget: '₹20,000–₹40,000', bestFor: 'Unique experience', season: 'Nov–Feb' },
];

const faqs = [
  {
    question: "Which is the best honeymoon destination in India under ₹30,000?",
    answer: "Coorg, Darjeeling, Mussoorie, Ooty, and Rishikesh all offer excellent honeymoon experiences under ₹30,000 for a couple (5 nights including travel). Manali and Shimla also fit this budget if you travel by train/bus rather than flying. For beach honeymoons under ₹30,000, Goa (South Goa, October–November) is achievable with smart booking.",
  },
  {
    question: "Which is better for honeymoon — Andaman or Goa?",
    answer: "Andaman for couples who want seclusion, pristine beaches, and a more exclusive feel. It's quieter, more naturally beautiful, and the beaches (Radhanagar, Elephant Beach) are genuinely world-class. Goa for couples who want a mix of beach, food, nightlife, and flexibility. Goa is easier and cheaper to reach. Budget: Goa is 30–40% cheaper overall. Uniqueness: Andaman wins clearly.",
  },
  {
    question: "What is the best month for a honeymoon in India?",
    answer: "October–November is the best all-around honeymoon window in India. Post-monsoon clarity, pleasant temperatures across most destinations, and no extreme crowds. December is also excellent if you book early (peak season pricing). February–March is another good window for Rajasthan, Kerala, and Goa. If you want snow for your honeymoon, target Manali or Shimla in December–January.",
  },
  {
    question: "Is Udaipur good for honeymoon?",
    answer: "Udaipur is consistently ranked India's most romantic city. Lake Palace Hotel (floating on Lake Pichola) is one of the most iconic romantic hotels in the world. Even at a modest budget, Udaipur delivers — sunset boat rides on the lake, rooftop restaurant dinners with palace views, and the city's beautiful old streets. 3–4 nights is ideal. Best season: October–March.",
  },
  {
    question: "How far in advance should I book a honeymoon trip in India?",
    answer: "For peak season travel (December–January, April–May), book hotels and flights 2–3 months in advance — popular houseboat and heritage hotel properties sell out quickly. For shoulder season (October, February–March), 4–6 weeks usually suffices. Always book houseboats and luxury tents (Rann Utsav, Spiti) well ahead — inventory is genuinely limited.",
  },
];

export default function BestHoneymoonDestinationsIndia() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Best Honeymoon Destinations in India', url: 'https://www.ylootrips.com/blogs/best-honeymoon-destinations-india' },
      ]} />
      <ArticleJsonLd
        headline="15 Best Honeymoon Destinations in India 2026 — Romantic Getaways"
        description="Top 15 honeymoon destinations in India for 2026: Andaman, Kashmir, Goa, Kerala, Manali, Coorg, Udaipur, Darjeeling and more — with budget, season, and tips."
        url="https://www.ylootrips.com/blogs/best-honeymoon-destinations-india"
        image="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1200&q=80"
        datePublished="2025-04-12"
        dateModified="2026-01-01"
        keywords={['honeymoon destinations India', 'romantic places India', 'Kashmir honeymoon', 'Andaman honeymoon', 'Kerala honeymoon']}
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=1200&q=80"
          alt="Romantic sunset at an Indian honeymoon destination"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-cream/70 uppercase tracking-widest text-xs mb-4 font-medium">Honeymoon Guide · April 2026</span>
          <h1 className="font-display text-3xl md:text-5xl text-cream max-w-3xl leading-tight">
            15 Best Honeymoon Destinations in India 2026
          </h1>
          <p className="text-cream/80 mt-4 max-w-xl text-sm md:text-base">Romantic Getaways — Ranked, Compared &amp; Planned</p>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 text-caption text-primary/40 uppercase tracking-wider mb-8">
          <span className="flex items-center gap-1"><Clock size={12} /> 12 min read</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> All Across India</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> Updated April 2026</span>
        </div>

        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          India offers an extraordinary range of honeymoon experiences — from salt deserts under full moons to houseboat drifts through backwaters, from skiing on Himalayan slopes to diving in emerald Andaman waters. Here are the 15 best honeymoon destinations in India for 2026, with real budget data and practical advice.
        </p>

        <div className="text-primary/75 space-y-10">

          <section>
            <h2 className="font-display text-3xl text-primary mb-6">Top 15 Honeymoon Destinations</h2>
            <div className="not-prose space-y-5">
              {destinations.map((dest, index) => (
                <div key={dest.name} className="border border-primary/10 bg-cream-light p-5">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl shrink-0">{dest.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                        <h3 className="font-display text-lg text-primary">{index + 1}. {dest.name}</h3>
                        <span className="text-sm font-medium text-secondary">{dest.budget}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-2">
                        <span className="text-caption text-primary/40 uppercase tracking-wider">Best for: {dest.bestFor}</span>
                        <span className="text-caption text-primary/40">Season: {dest.season}</span>
                      </div>
                      <p className="text-sm text-primary/65 leading-relaxed">{dest.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Quick Comparison Table</h2>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Destination</th>
                    <th className="text-left p-3 font-medium">Budget (couple)</th>
                    <th className="text-left p-3 font-medium">Best For</th>
                    <th className="text-left p-3 font-medium">Season</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, i) => (
                    <tr key={row.dest} className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-light'}>
                      <td className="p-3 font-medium text-primary border-b border-primary/10">{row.dest}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.budget}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.bestFor}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.season}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Honeymoon Planning Tips</h2>
            <ul className="space-y-3">
              {[
                'Book your main accommodation (houseboat, heritage hotel, tent resort) first — these are the bottlenecks that sell out earliest.',
                'Request honeymoon add-ons when booking: rose petal turndown, private candlelit dinner, complimentary cake. Most hotels offer these free or at ₹500–₹1,500 extra.',
                'Travel off-peak if budget matters — October and February offer excellent weather and 20–30% lower prices than December and May.',
                'Keep 1 full free day in your itinerary — no sightseeing, just the two of you. Best memories often come from unplanned moments.',
                'Get travel insurance that covers trip cancellation — honeymoon trips are often pre-paid and non-refundable.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary/70">
                  <span className="text-accent font-bold shrink-0 mt-0.5">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-sm p-6 not-prose">
            <div className="flex items-start gap-3">
              <MessageCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-primary mb-1">Plan your perfect honeymoon with YlooTrips</p>
                <p className="text-sm text-primary/65 mb-4">We specialize in romantic India travel — from Andaman beach packages to Kashmir houseboat honeymoons. Tell us your dream destination and budget.</p>
                <a
                  href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20plan%20my%20honeymoon%20trip."
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <MessageCircle size={16} /> Plan My Honeymoon
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
              { title: 'Kashmir Travel Guide 2026 — Complete Itinerary', href: '/blogs/kashmir-travel-guide' },
              { title: 'Goa Budget Trip Guide 2026 — Under ₹15,000', href: '/blogs/goa-budget-trip-guide' },
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
