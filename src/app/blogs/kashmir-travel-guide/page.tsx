import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { MessageCircle, CheckCircle, MapPin, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: "Kashmir Travel Guide 2026 — Complete Itinerary, Best Time & Travel Tips",
  description: "Complete Kashmir travel guide 2026: Srinagar, Gulmarg, Pahalgam, Sonamarg, houseboat stays, month-by-month best time to visit, safety, and practical travel tips for Indian tourists.",
  keywords: "Kashmir travel guide 2026, Kashmir itinerary, best time to visit Kashmir, Srinagar travel guide, Gulmarg Pahalgam Sonamarg, Kashmir houseboat, Kashmir trip tips, is Kashmir safe to visit",
  openGraph: {
    title: "Kashmir Travel Guide 2026 — Complete Itinerary, Best Time & Travel Tips",
    description: "Srinagar, Gulmarg, Pahalgam, Sonamarg — complete Kashmir travel guide with month-by-month timing, houseboat tips, and honest safety advice.",
    url: "https://www.ylootrips.com/blogs/kashmir-travel-guide",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Dal Lake Srinagar Kashmir with shikara boats at sunset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kashmir Travel Guide 2026 — Complete Itinerary, Best Time & Travel Tips",
    description: "Best time to visit Kashmir, Srinagar to Gulmarg itinerary, houseboat guide, and safety tips for 2026.",
    images: ["https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/kashmir-travel-guide" },
};

const monthlyGuide = [
  { month: 'January', rating: '★★★☆☆', weather: '-4 to 6°C. Heavy snowfall.', highlights: 'Snow world in Gulmarg, skiing season at peak', note: 'Ideal for snow lovers. Pahalgam and Sonamarg roads may be blocked.' },
  { month: 'February', rating: '★★★☆☆', weather: '-2 to 8°C. Snow continues.', highlights: 'Skiing, Gulmarg gondola, frozen Dal Lake', note: 'Fewer tourists than January. Excellent snow quality for skiing.' },
  { month: 'March', rating: '★★★★☆', weather: '4 to 14°C. Snow melting.', highlights: 'Almond blossom in Badami Bagh, spring colors', note: 'Shoulder season — good value. Srinagar gardens beginning to bloom.' },
  { month: 'April', rating: '★★★★★', weather: '8 to 20°C. Pleasant.', highlights: 'Tulip Garden (largest in Asia), cherry blossoms', note: 'Best month for Srinagar. The tulip garden (10–15 days) is unmissable.' },
  { month: 'May', rating: '★★★★★', weather: '12 to 25°C. Perfect.', highlights: 'All destinations accessible, flowers everywhere', note: 'Peak season begins. Book houseboat and hotels 4–6 weeks ahead.' },
  { month: 'June', rating: '★★★★★', weather: '15 to 28°C. Warm.', highlights: 'Amarnath Yatra begins, Sonamarg at its best', note: 'Busy but manageable. Great for Pahalgam and Sonamarg trekking.' },
  { month: 'July', rating: '★★★★☆', weather: '16 to 30°C. Warm, some rain.', highlights: 'Lush green meadows, Aru Valley, Betab Valley', note: 'Monsoon affects Jammu region but Kashmir Valley gets less rain than the rest of India.' },
  { month: 'August', rating: '★★★★☆', weather: '15 to 28°C. Slight rain.', highlights: 'Meadows in full bloom, Sonamarg glaciers', note: 'Good time overall. End of peak season means slightly lower prices.' },
  { month: 'September', rating: '★★★★★', weather: '10 to 22°C. Ideal.', highlights: 'Chinar trees turning gold, harvest season', note: 'Hidden gem month. Fewer crowds, gorgeous autumn colors, great weather.' },
  { month: 'October', rating: '★★★★★', weather: '5 to 15°C. Crisp.', highlights: 'Autumn foliage, chinar gold and red, apple orchards', note: 'Arguably the most beautiful month in Kashmir. Crowds thinning, prices fair.' },
  { month: 'November', rating: '★★★☆☆', weather: '0 to 10°C. Getting cold.', highlights: 'Early snowfall, quiet Dal Lake, Srinagar bazaars', note: 'Shoulder season. Lower prices, fewer tourists. Great for photography.' },
  { month: 'December', rating: '★★☆☆☆', weather: '-5 to 4°C. Cold & snow.', highlights: 'White Christmas, snow in Srinagar', note: 'Very cold. Some attractions limited. For snow enthusiasts only.' },
];

const faqs = [
  {
    question: "Is Kashmir safe to visit in 2026?",
    answer: "Yes. Kashmir, particularly the tourist areas of Srinagar, Gulmarg, Pahalgam, and Sonamarg, is welcoming tourists in significant numbers and the experience is genuinely peaceful. The Indian Army and local administration maintain a strong security presence in tourist zones. Exercise standard travel precautions: avoid areas under prohibitory orders, check local news before travel, register at your hotel. Millions of Indian tourists visit every year without incident. The Kashmiri people are famously hospitable.",
  },
  {
    question: "What is the best time to visit Kashmir?",
    answer: "April–June for spring blooms and summer greenery (most popular). September–October for stunning autumn foliage and fewer crowds (our top recommendation). December–February for skiing in Gulmarg. Avoid Kashmir during major elections or if there are active advisories — check before you go.",
  },
  {
    question: "Should I stay on a houseboat in Dal Lake?",
    answer: "Absolutely yes — it's one of the most unique accommodation experiences in India. Heritage houseboats have ornate woodwork, plush interiors, and personal shikara service. Prices: ₹2,500–₹5,000/night budget category, ₹6,000–₹15,000 for premium. Shikara rides at sunrise are included or cheap. Book through reputable operators or your hotel — avoid touts at the ghat offering 'special deals'.",
  },
  {
    question: "How many days should I plan for Kashmir?",
    answer: "Minimum 5 days to cover Srinagar (2 nights) + Gulmarg (1 night) + Pahalgam (1 night). 7 days allows you to add Sonamarg and truly relax. 10 days lets you explore the Aru Valley, Betab Valley, take longer treks, and enjoy each place without rushing. Don't try to fit Kashmir into a 3-day weekend — it deserves more.",
  },
  {
    question: "What should I pack for Kashmir?",
    answer: "Even in summer: a medium-weight jacket (evenings are cool at altitude), comfortable walking shoes, sun protection. In winter: serious thermal layers, down jacket, waterproof boots, gloves, and a balaclava. Year-round: cash in INR (many areas have limited ATMs), portable charger, rain poncho (June–August). If trekking to Amarnath or Sonamarg glaciers, add trekking poles and crampons.",
  },
];

export default function KashmirTravelGuide() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Kashmir Travel Guide', url: 'https://www.ylootrips.com/blogs/kashmir-travel-guide' },
      ]} />
      <ArticleJsonLd
        headline="Kashmir Travel Guide 2026 — Complete Itinerary, Best Time & Travel Tips"
        description="Complete Kashmir travel guide: Srinagar, Gulmarg, Pahalgam, Sonamarg, houseboat stays, month-by-month timing, and safety tips."
        url="https://www.ylootrips.com/blogs/kashmir-travel-guide"
        image="https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80"
        datePublished="2025-04-12"
        dateModified="2026-01-01"
        keywords={['Kashmir travel guide', 'Kashmir itinerary', 'Gulmarg skiing', 'Srinagar houseboat', 'best time Kashmir']}
        authorName="Priya Verma"
        authorUrl="https://www.ylootrips.com/authors/priya-verma"
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566837945700-30057527ade0?w=1200&q=80"
          alt="Dal Lake Srinagar Kashmir with shikara boats"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-cream/70 uppercase tracking-widest text-xs mb-4 font-medium">Travel Guides · April 2026</span>
          <h1 className="font-display text-3xl md:text-5xl text-cream max-w-3xl leading-tight">
            Kashmir Travel Guide 2026
          </h1>
          <p className="text-cream/80 mt-4 max-w-xl text-sm md:text-base">Complete Itinerary, Best Time to Visit &amp; Practical Travel Tips</p>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 text-caption text-primary/40 uppercase tracking-wider mb-8">
          <span className="flex items-center gap-1"><Clock size={12} /> 12 min read</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> Jammu & Kashmir, India</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> Updated April 2026</span>
        </div>

        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Kashmir is not just a destination — it&apos;s an experience that stays with you for life. Dal Lake at dawn, the meadows of Gulmarg, the wooden bridges of Pahalgam, the glaciers of Sonamarg. This guide covers everything you need to plan a safe, well-timed, deeply satisfying Kashmir trip.
        </p>

        <div className="text-primary/75 space-y-10">

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">The Kashmir Circuit: Key Destinations</h2>
            <div className="not-prose space-y-3">
              {[
                { place: 'Srinagar', dist: 'Base city', desc: 'Dal Lake, Nagin Lake, Mughal Gardens (Shalimar Bagh, Nishat Bagh), Shankaracharya Temple, and the old city bazaar. Stay in a houseboat on Dal Lake — it\'s unmissable.' },
                { place: 'Gulmarg', dist: '56km from Srinagar', desc: 'Highest gondola in the world (3,979m). Winter: India\'s best skiing destination. Summer: meadows, pony rides, trekking. Day trip or 1-night stay.' },
                { place: 'Pahalgam', dist: '96km from Srinagar', desc: 'Base for Amarnath Yatra. Betab Valley, Aru Valley, Chandanwari, Baisaran Meadow (mini Switzerland of India). 2 nights recommended.' },
                { place: 'Sonamarg', dist: '80km from Srinagar', desc: 'Gateway to Leh (Zoji La pass). Thajiwas Glacier is the highlight — pony ride or 3km hike. Best May–October. Day trip from Srinagar.' },
              ].map(({ place, dist, desc }) => (
                <div key={place} className="border-l-2 border-accent pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-primary text-sm">{place}</div>
                    <div className="text-caption text-primary/40">— {dist}</div>
                  </div>
                  <p className="text-sm text-primary/65">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Suggested 7-Day Kashmir Itinerary</h2>
            <div className="not-prose space-y-2">
              {[
                { day: 'Day 1', plan: 'Arrive Srinagar. Check into houseboat on Dal Lake. Sunset shikara ride. Rest.' },
                { day: 'Day 2', plan: 'Srinagar city: Mughal Gardens, Shankaracharya Temple, Old City bazaar (Lal Chowk). Dal Lake dawn shikara at 6am.' },
                { day: 'Day 3', plan: 'Drive to Gulmarg (2 hrs). Gondola ride to Phase 2 (3,979m). Meadow walk. Night in Gulmarg.' },
                { day: 'Day 4', plan: 'Return to Srinagar, then drive to Pahalgam (3 hrs). Check in. Explore Betab Valley and Aru Valley by evening.' },
                { day: 'Day 5', plan: 'Full day in Pahalgam: Baisaran Meadow (pony ride or walk), Chandanwari, Lidder River.' },
                { day: 'Day 6', plan: 'Drive to Sonamarg (3 hrs from Pahalgam via Srinagar). Thajiwas Glacier. Return to Srinagar by evening.' },
                { day: 'Day 7', plan: 'Morning free in Srinagar. Last shikara. Shopping for Pashmina and saffron at Polo View Market. Departure.' },
              ].map(({ day, plan }) => (
                <div key={day} className="flex gap-3 p-3 border border-primary/10 bg-cream-light">
                  <div className="font-medium text-secondary text-sm min-w-[48px] shrink-0">{day}</div>
                  <p className="text-sm text-primary/70">{plan}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Month-by-Month: When to Visit Kashmir</h2>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Month</th>
                    <th className="text-left p-3 font-medium">Rating</th>
                    <th className="text-left p-3 font-medium">Weather</th>
                    <th className="text-left p-3 font-medium">Highlights</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyGuide.map((row, i) => (
                    <tr key={row.month} className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-light'}>
                      <td className="p-3 font-medium text-primary border-b border-primary/10 whitespace-nowrap">{row.month}</td>
                      <td className="p-3 text-amber-500 border-b border-primary/10 whitespace-nowrap">{row.rating}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.weather}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.highlights}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Houseboat Guide: Dal Lake</h2>
            <p className="mb-4">Staying on a houseboat is the defining Kashmir experience. Here&apos;s how to do it right:</p>
            <ul className="space-y-3">
              {[
                'Book through reputable operators or your travel agent. Avoid accepting deals from shikara touts at the ghat — they earn commissions that inflate your costs.',
                'Categories: Deluxe (₹2,500–₹4,000), A-Grade (₹4,000–₹7,000), Heritage/Luxury (₹8,000–₹20,000). Heritage boats have hand-carved walnut woodwork and antique furnishings.',
                'Morning shikara service is usually included — your boatman will take you to the floating vegetable market.',
                'The lake is divided into zones — boats near Boulevard Road are noisier but more convenient. Nagin Lake is quieter and more serene.',
                'Meals are typically included or at extra cost. Try the Wazwan dinner (a traditional multi-course Kashmiri feast) at least once.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary/70">
                  <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Budget Estimate for 7 Days</h2>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Budget Range</th>
                    <th className="text-left p-3 font-medium">Mid-Range</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Houseboat / hotel (7 nights)', budget: '₹7,000–₹14,000', mid: '₹20,000–₹35,000' },
                    { cat: 'Food (all meals)', budget: '₹3,500–₹5,000', mid: '₹7,000–₹12,000' },
                    { cat: 'Local transport (shared taxis)', budget: '₹4,000–₹6,000', mid: '₹10,000–₹16,000 (private cab)' },
                    { cat: 'Activities (gondola, shikara, pony)', budget: '₹3,000–₹5,000', mid: '₹5,000–₹8,000' },
                    { cat: 'Flights Delhi–Srinagar (return)', budget: '₹6,000–₹10,000', mid: '₹10,000–₹18,000' },
                    { cat: 'Total per person', budget: '₹23,500–₹40,000', mid: '₹52,000–₹89,000' },
                  ].map((row, i) => (
                    <tr key={row.cat} className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-light'}>
                      <td className="p-3 font-medium text-primary border-b border-primary/10">{row.cat}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.budget}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.mid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-sm p-6 not-prose">
            <div className="flex items-start gap-3">
              <MessageCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-primary mb-1">Plan your Kashmir trip with YlooTrips</p>
                <p className="text-sm text-primary/65 mb-4">We arrange Kashmir trips with verified houseboat operators, private transfers, and 24/7 on-ground support. WhatsApp us your dates.</p>
                <a
                  href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20plan%20a%20Kashmir%20trip."
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
              { title: 'Manali Trip Guide 2026 — Summer & Winter', href: '/blogs/manali-trip-guide' },
              { title: 'Kedarnath Yatra 2026 — Complete Guide', href: '/blogs/kedarnath-yatra-guide' },
              { title: 'Best Honeymoon Destinations in India 2026', href: '/blogs/best-honeymoon-destinations-india' },
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
