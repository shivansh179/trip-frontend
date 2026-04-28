import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { MessageCircle, ArrowRight, CheckCircle, MapPin, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: "Manali Trip Guide 2026 — Complete Travel Guide (Summer & Winter)",
  description: "Complete Manali travel guide 2026: best time to visit, how to reach, things to do, budget breakdown, packing list, and tips for first-timers in summer and winter.",
  keywords: "Manali trip guide 2026, Manali travel guide, best time to visit Manali, Manali budget trip, things to do in Manali, Manali winter trip, Manali summer trip, Rohtang Pass, Solang Valley",
  openGraph: {
    title: "Manali Trip Guide 2026 — Complete Travel Guide (Summer & Winter)",
    description: "Everything you need for a Manali trip: when to visit, how to reach, what to do in summer vs winter, budget, and packing tips.",
    url: "https://www.ylootrips.com/blogs/manali-trip-guide",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Manali mountains snow-capped peaks Himachal Pradesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manali Trip Guide 2026 — Complete Travel Guide (Summer & Winter)",
    description: "Best time to visit, budget, things to do, packing list — everything for a perfect Manali trip.",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/manali-trip-guide" },
};

const seasonActivities = [
  { activity: 'Rohtang Pass visit', summer: '✓ Open (May–Oct)', winter: '✗ Closed (snowbound)' },
  { activity: 'Solang Valley', summer: 'Paragliding, zorbing, ATV', winter: 'Skiing, snow tubing' },
  { activity: 'River rafting (Beas)', summer: '✓ Great (Jul–Sep best)', winter: '✗ Not available' },
  { activity: 'Snow activities', summer: '✗ No snow at lower altitudes', winter: '✓ Snowfall Nov–Feb' },
  { activity: 'Trekting (Hampta Pass etc)', summer: '✓ Prime season', winter: '✗ High-altitude trails closed' },
  { activity: 'Camping', summer: '✓ Riverside camps open', winter: 'Snow camping (for experts only)' },
  { activity: 'Spiti Valley extension', summer: '✓ Accessible', winter: '✗ Road closed Nov–Apr' },
  { activity: 'Old Manali café hopping', summer: '✓ Lively and crowded', winter: '✓ Cozy and peaceful' },
];

const faqs = [
  {
    question: "What is the best time to visit Manali?",
    answer: "October–November (post-monsoon, clear skies, fewer crowds) and March–June (summer, all passes open) are the sweet spots. December–February is best if you want heavy snowfall and a white Christmas vibe, but expect road closures. Avoid July–August if you dislike crowds and landslides — though the Beas is great for rafting.",
  },
  {
    question: "How do I reach Manali from Delhi?",
    answer: "By bus: HRTC Volvo overnight buses (₹900–₹1,500 one way, ~14 hrs). By car: Delhi → Chandigarh → Mandi → Manali (~550km, 12–14 hrs). Nearest airport: Kullu-Manali Airport (Bhuntar), 50km away — flights from Delhi in 1 hr but expensive and weather-dependent. Most travelers take the overnight bus — affordable and you save a night's hotel cost.",
  },
  {
    question: "How much does a Manali trip cost per person?",
    answer: "Budget traveler: ₹8,000–₹12,000 for 5 nights (hostel dorms, local food, shared taxis). Mid-range: ₹18,000–₹25,000 (decent hotel, activities, private transport). Premium: ₹35,000+ (resort stay, private vehicle, guided experiences). Costs spike 20–30% during peak summer (June) and Christmas-New Year week.",
  },
  {
    question: "Is Manali safe to visit in winter?",
    answer: "Yes, but come prepared. Old Manali and Mall Road remain accessible year-round. Rohtang Pass and Spiti roads close. Carry warm layers (temperature drops to -10°C at night in January). Book accommodation in advance as options thin out in winter. AMS (altitude sickness) is less of a risk in winter as roads beyond Manali are shut, so you stay at lower elevations.",
  },
  {
    question: "Do I need a permit for Rohtang Pass?",
    answer: "Yes. Rohtang Pass requires an online permit (₹500 per vehicle for non-HP-registered vehicles) from the Himachal Pradesh government portal (rohtangpermits.nic.in). Only ~1,200 vehicles are allowed per day. Book 2–3 days in advance in peak summer. Your hotel or travel agent in Manali can also arrange this for a small fee.",
  },
];

export default function ManaliTripGuide() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Manali Trip Guide', url: 'https://www.ylootrips.com/blogs/manali-trip-guide' },
      ]} />
      <ArticleJsonLd
        headline="Manali Trip Guide 2026 — Complete Travel Guide (Summer & Winter)"
        description="Complete Manali travel guide 2026: best time to visit, how to reach, things to do, budget breakdown, packing list, and tips for first-timers."
        url="https://www.ylootrips.com/blogs/manali-trip-guide"
        image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
        datePublished="2025-04-12"
        dateModified="2026-01-01"
        keywords={['Manali trip guide', 'Manali travel', 'Rohtang Pass', 'Manali winter', 'Manali budget']}
        authorName="Priya Verma"
        authorUrl="https://www.ylootrips.com/blogs/authors/priya-verma"
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
          alt="Snow-capped peaks of Manali, Himachal Pradesh"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-cream/70 uppercase tracking-widest text-xs mb-4 font-medium">Travel Guides · April 2026</span>
          <h1 className="font-display text-3xl md:text-5xl text-cream max-w-3xl leading-tight">
            Manali Trip Guide 2026
          </h1>
          <p className="text-cream/80 mt-4 max-w-xl text-sm md:text-base">Complete Travel Guide — Summer &amp; Winter</p>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 text-caption text-primary/40 uppercase tracking-wider mb-8">
          <span className="flex items-center gap-1"><Clock size={12} /> 10 min read</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> Himachal Pradesh, India</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> Updated April 2026</span>
        </div>

        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Manali is one of India&apos;s most visited hill stations — and for good reason. Snow-capped peaks, river valleys, Buddhist monasteries, adventure sports, and some of the best mountain food in the country. Whether you&apos;re chasing snow in January or wildflowers in June, this guide covers everything.
        </p>

        <div className="text-primary/75 space-y-10">

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">When to Visit Manali</h2>
            <p className="mb-4">Manali is a year-round destination, but what you experience changes dramatically by season.</p>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { season: 'March – June', label: 'Summer (Best Overall)', desc: 'Snow on high passes, pleasant temps (5–20°C), Rohtang and Spiti accessible. Peak tourist season — book ahead.' },
                { season: 'July – September', label: 'Monsoon', desc: 'Landslides possible on NH3. Beas River full for rafting. Lush green valleys, fewer tourists. Exercise caution on roads.' },
                { season: 'October – November', label: 'Post-Monsoon (Hidden Gem)', desc: 'Clear skies, golden light, Rohtang still open in Oct. Fewer crowds. Best for photography and trekking.' },
                { season: 'December – February', label: 'Winter', desc: 'Heavy snowfall, temperatures -10°C at night. Magical for snow lovers. Rohtang closed. Carry serious winter gear.' },
              ].map(({ season, label, desc }) => (
                <div key={season} className="border border-primary/10 bg-cream-light p-4">
                  <div className="font-medium text-primary text-sm">{season}</div>
                  <div className="text-caption text-secondary uppercase tracking-wider mb-1">{label}</div>
                  <p className="text-sm text-primary/60">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">How to Reach Manali</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                <div><strong className="text-primary">By Bus (most popular):</strong> HRTC Volvo AC sleeper from ISBT Kashmiri Gate, Delhi. Departs ~6–7pm, arrives ~8–9am. Fare: ₹900–₹1,500. Book on RedBus or HRTC app.</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                <div><strong className="text-primary">By Car:</strong> Delhi → Chandigarh → Mandi → Manali. ~550km, 12–14 hrs. NH-3 is well-maintained until Mandi; narrow and winding after. Avoid driving at night.</div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
                <div><strong className="text-primary">By Flight:</strong> Kullu-Manali Airport (Bhuntar), 50km from Manali. Flights from Delhi (~1 hr, ₹4,000–₹8,000). Heavily weather-dependent — don&apos;t rely on this for time-sensitive travel.</div>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Activities by Season</h2>
            <p className="mb-4">Manali&apos;s activity menu changes completely depending on when you visit. Here&apos;s the quick-reference comparison:</p>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Activity</th>
                    <th className="text-left p-3 font-medium">Summer (Mar–Oct)</th>
                    <th className="text-left p-3 font-medium">Winter (Nov–Feb)</th>
                  </tr>
                </thead>
                <tbody>
                  {seasonActivities.map((row, i) => (
                    <tr key={row.activity} className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-light'}>
                      <td className="p-3 font-medium text-primary border-b border-primary/10">{row.activity}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.summer}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.winter}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Top Things to Do in Manali</h2>
            <div className="not-prose space-y-3">
              {[
                { name: 'Rohtang Pass (3,978m)', tip: 'Book permit 2–3 days ahead online. Go early — permit window is 6am–1pm only. Jeep hire from Manali: ₹2,000–₹2,500 shared.' },
                { name: 'Solang Valley', tip: 'Only 14km from Manali. Summer: paragliding (₹1,800), ATV (₹500). Winter: skiing (₹500/hr equipment rental). Cable car ₹500 round trip.' },
                { name: 'Hadimba Temple', tip: 'Beautiful cedar forest temple, 2km from Mall Road. Best visited at sunrise before the crowds arrive. No entry fee.' },
                { name: 'Old Manali & Café Culture', tip: 'Cross the bridge to Old Manali for budget guesthouses, excellent cafés (Lazy Dog, Drifters\' Inn), and a chilled-out backpacker vibe.' },
                { name: 'Beas River Rafting', tip: 'Grade 2–3 rapids between Pirdi and Jhiri (14km). Best July–September when water levels are high. Cost: ₹500–₹700/person.' },
                { name: 'Naggar Castle & Art Gallery', tip: '22km from Manali. Former royal residence with stunning valley views. Nicholas Roerich Art Gallery nearby. Great half-day trip.' },
              ].map(({ name, tip }) => (
                <div key={name} className="border-l-2 border-accent pl-4">
                  <div className="font-medium text-primary text-sm">{name}</div>
                  <p className="text-sm text-primary/65">{tip}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Budget Breakdown (5 Nights)</h2>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Category</th>
                    <th className="text-left p-3 font-medium">Budget</th>
                    <th className="text-left p-3 font-medium">Mid-Range</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat: 'Accommodation (5 nights)', budget: '₹3,000–₹5,000', mid: '₹8,000–₹15,000' },
                    { cat: 'Food (3 meals/day)', budget: '₹1,500–₹2,500', mid: '₹3,500–₹5,000' },
                    { cat: 'Transport (bus + local)', budget: '₹2,000–₹3,000', mid: '₹5,000–₹8,000' },
                    { cat: 'Activities', budget: '₹2,000–₹3,000', mid: '₹4,000–₹6,000' },
                    { cat: 'Total per person', budget: '₹8,500–₹13,500', mid: '₹20,500–₹34,000' },
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

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Packing List for Manali</h2>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                'Thermal innerwear (even in summer for high altitudes)',
                'Heavy jacket or puffer (mandatory in winter)',
                'Waterproof trekking shoes',
                'Sunscreen SPF 50+ (UV is intense at altitude)',
                'Sunglasses with UV protection',
                'Altitude sickness tablets (Diamox — consult a doctor)',
                'Power bank (cold drains batteries fast)',
                'First-aid kit with ORS packets',
                'Rain poncho (especially May–September)',
                'Cash — ATMs unreliable beyond Manali town',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-primary/70">
                  <CheckCircle size={14} className="text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Tips for First-Timers</h2>
            <ul className="space-y-3">
              {[
                'Spend your first day resting — acclimatize before heading to high altitudes. Rushing to Rohtang on Day 1 is a mistake many first-timers make.',
                'Book Rohtang permits online before your trip, not on arrival.',
                'Carry ₹5,000–₹7,000 in cash. Card acceptance is patchy beyond Mall Road.',
                'Negotiate jeep hire rates the evening before your trip — morning rates are inflated.',
                'Old Manali has better cafés and a more authentic vibe. Stay there if budget allows.',
                'If you plan to drive, leave Delhi by 4–5am to reach Manali by evening and avoid night mountain driving.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary/70">
                  <ArrowRight size={14} className="text-accent mt-0.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-sm p-6 not-prose">
            <div className="flex items-start gap-3">
              <MessageCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-primary mb-1">Plan your Manali trip with us</p>
                <p className="text-sm text-primary/65 mb-4">Tell us your travel dates, group size, and preferences — we&apos;ll build a custom Manali itinerary with pre-vetted stays and hassle-free transfers.</p>
                <a
                  href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20plan%20a%20Manali%20trip."
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
              { title: 'Kashmir Travel Guide 2026 — Complete Itinerary & Tips', href: '/blogs/kashmir-travel-guide' },
              { title: 'Long Weekend Getaways from Delhi 2026', href: '/blogs/long-weekend-getaways-delhi' },
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
