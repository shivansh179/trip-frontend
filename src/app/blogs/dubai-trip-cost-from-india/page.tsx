import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, MessageCircle, DollarSign, Plane, Hotel, Utensils, MapPin, TrendingDown } from 'lucide-react';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Dubai Trip Cost from India 2026 — Complete Budget Breakdown | YlooTrips',
  description: 'How much does a Dubai trip from India cost in 2026? Complete cost breakdown: flights, visa, hotel, food, activities. Budget trip ₹35,000 to luxury ₹1,20,000. Real numbers.',
  keywords: 'Dubai trip cost from India, Dubai trip budget India 2026, how much does Dubai trip cost, Dubai package price from India, Dubai travel expenses, Dubai trip planning India',
  openGraph: {
    title: 'Dubai Trip Cost from India 2026 — Complete Budget Breakdown',
    description: 'Full cost breakdown for a Dubai trip from India — flights, visa, hotel, food, activities. From budget ₹35K to luxury ₹1.2L per person.',
    url: 'https://www.ylootrips.com/blogs/dubai-trip-cost-from-india',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80', width: 1200, height: 630, alt: 'Dubai skyline Burj Khalifa trip cost from India 2026' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/blogs/dubai-trip-cost-from-india' },
};

const costTable = [
  { category: 'Return Flights', budget: '₹18,000–₹25,000', mid: '₹25,000–₹35,000', luxury: '₹35,000–₹70,000', notes: 'IndiGo/Air Arabia vs Emirates Business' },
  { category: 'UAE Tourist Visa', budget: '₹1,500–₹2,000', mid: '₹1,500–₹2,000', luxury: '₹1,500–₹2,000', notes: 'Same for all — 30-day single entry' },
  { category: 'Hotel (5 nights)', budget: '₹8,000–₹12,000', mid: '₹15,000–₹25,000', luxury: '₹40,000–₹1,00,000', notes: '3★ Deira vs 4★ Marina vs 5★ Palm' },
  { category: 'Food & Drinks', budget: '₹3,000–₹5,000', mid: '₹6,000–₹10,000', luxury: '₹15,000–₹30,000', notes: 'Shawarma/Indian restaurants vs DIFC dining' },
  { category: 'Activities', budget: '₹5,000–₹8,000', mid: '₹10,000–₹15,000', luxury: '₹20,000–₹40,000', notes: 'Burj Khalifa, Desert Safari, Water Park' },
  { category: 'Transport (local)', budget: '₹1,500–₹2,500', mid: '₹2,500–₹4,000', luxury: '₹5,000–₹12,000', notes: 'Metro/taxi vs private car hire' },
  { category: 'Shopping', budget: '₹0–₹5,000', mid: '₹5,000–₹20,000', luxury: '₹20,000–₹1,00,000+', notes: 'Souks vs Dubai Mall vs luxury brands' },
  { category: 'Travel Insurance', budget: '₹800–₹1,200', mid: '₹800–₹1,200', luxury: '₹1,500–₹3,000', notes: 'Strongly recommended for medical cover' },
];

const activities = [
  { name: 'Burj Khalifa At The Top (124F)', cost: '₹2,800–₹4,500', tip: 'Book early morning (9–10 AM) for clearest views. Skip the expensive "At The Top Sky" (148F) unless you want to splurge.' },
  { name: 'Desert Safari with BBQ Dinner', cost: '₹2,500–₹4,500', tip: 'Standard shared safari is ₹2,500. Private safari (6-seater) is ₹8,000. Evening departure (3:30 PM) includes sunset dune bashing + BBQ.' },
  { name: 'Dubai Aquarium & Underwater Zoo', cost: '₹1,800–₹2,800', tip: 'Free tunnel viewing from inside Dubai Mall. Pay only if you want the full aquarium experience.' },
  { name: 'Palm Jumeirah Monorail', cost: '₹350–₹600', tip: 'Round trip is better value. Hop off at Atlantis for photos but entry to waterpark is separate (₹5,500+).' },
  { name: 'Dubai Frame', cost: '₹1,200–₹1,500', tip: 'Great value. See old Dubai on one side, modern Dubai on the other from a glass-floored sky bridge.' },
  { name: 'Dubai Creek Abra Ride', cost: '₹50–₹150', tip: 'The most authentic and cheapest activity in Dubai. Traditional wooden water taxi across the historic Creek.' },
  { name: 'Ski Dubai (Mall of Emirates)', cost: '₹3,200–₹4,500', tip: 'Interesting novelty but pricey. Best for families with kids. Snow Park pass is cheaper than full skiing.' },
  { name: 'Dhow Dinner Cruise', cost: '₹2,000–₹3,500', tip: 'Marina or Creek route. Good for couples. Includes buffet dinner and live entertainment.' },
];

const moneySavingTips = [
  { tip: 'Book flights 6–8 weeks in advance', saving: 'Save ₹4,000–₹8,000', icon: '✈️' },
  { tip: 'Travel in May, June, September or October (not July/Aug/Dec)', saving: 'Save ₹3,000–₹6,000', icon: '📅' },
  { tip: 'Stay in Deira or Bur Dubai instead of Marina/JBR', saving: 'Save ₹4,000–₹8,000 on hotel', icon: '🏨' },
  { tip: 'Use Dubai Metro for city travel (not taxis)', saving: 'Save ₹2,000–₹3,000', icon: '🚇' },
  { tip: 'Eat at Indian/Pakistani restaurants in Deira or Al Rigga', saving: 'Save ₹3,000–₹5,000 on food', icon: '🍛' },
  { tip: 'Shop at Dragon Mart or Textile Souk, not Dubai Mall', saving: 'Save significantly on shopping', icon: '🛍️' },
  { tip: 'Book a package (flights + hotel + activities bundled)', saving: 'Save ₹5,000–₹12,000 vs booking separately', icon: '📦' },
  { tip: 'Get the Nol Card for unlimited metro/bus rides', saving: 'Save ₹500–₹1,000 over loose fares', icon: '💳' },
];

const faqs = [
  { question: 'How much does a 5-night Dubai trip from India cost in 2026?', answer: 'A budget Dubai trip for 5 nights from India costs ₹35,000–₹45,000 per person including flights, visa, 3-star hotel, and key activities. A mid-range trip (4-star hotel, all activities) is ₹55,000–₹75,000 per person. Luxury (5-star hotel, premium experiences) runs ₹1,00,000–₹1,50,000 per person. Our all-inclusive package starts at ₹35,999 per person from Delhi.' },
  { question: 'Is Dubai expensive for Indian tourists?', answer: 'Dubai is moderately expensive compared to Southeast Asia, but reasonable compared to Europe. The exchange rate (1 AED = ₹23–₹24) is the biggest factor. Budget travelers can manage on ₹3,500–₹5,000/day in Dubai (including food and local transport). The biggest costs are flights, hotel, and specific activities like Burj Khalifa. With a pre-booked package, you lock in the best rates.' },
  { question: 'Do I need a visa for Dubai from India and how much does it cost?', answer: 'Indian passport holders can get a UAE Tourist Visa on arrival free of charge (30 days, extendable). You do not need to apply in advance. You need a valid Indian passport with 6+ months validity, confirmed return ticket, and hotel booking. The visa itself is free — some travel agents charge ₹1,500–₹2,000 for "visa assistance" which is just help with the paperwork. Our packages include this assistance.' },
  { question: 'What is the cheapest time to visit Dubai from India?', answer: 'May to September is significantly cheaper due to the extreme heat (40°C+). Hotel rates drop 30–50%, and flight prices fall too. If you can handle the heat (most major sights are air-conditioned), June–August offers the best value. October and November are the sweet spot — reasonable weather and post-summer price drops. Avoid July–August school holidays and December–January (Christmas/New Year prices spike).' },
  { question: 'How much spending money should I take to Dubai for 5 days?', answer: 'For 5 days in Dubai, budget ₹8,000–₹15,000 as spending money (above your package cost) per person for: meals not covered in package (₹3,000–₹5,000), optional activities like Ski Dubai or dhow cruise (₹3,000–₹5,000), souvenirs and shopping (₹2,000–₹5,000), and tips/miscellaneous (₹1,000). Carry a mix of AED cash (converted in India for better rates) and a forex card.' },
  { question: 'Is it cheaper to book Dubai package or self-book flights + hotel?', answer: 'Packages are almost always cheaper for Dubai. Travel agents like YlooTrips buy flights and hotel rooms in bulk and can offer combined rates 15–25% below individual booking. Additionally, you save time on visa assistance, transfers, and activity bookings. The only time self-booking wins is if you are extremely flexible on dates and book flights 3–4 months in advance with a budget airline.' },
];

export default function DubaiTripCostPage() {
  return (
    <>
      <ArticleJsonLd
        headline="Dubai Trip Cost from India 2026 — Complete Budget Breakdown"
        description="How much does a Dubai trip from India cost in 2026? Complete breakdown: flights, visa, hotel, food, activities."
        url="https://www.ylootrips.com/blogs/dubai-trip-cost-from-india"
        image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80"
        datePublished="2026-01-20"
        dateModified="2026-04-09"
        keywords={['Dubai trip cost India', 'Dubai budget India', 'Dubai trip expenses', 'Dubai package price India 2026']}
        authorName="Arjun Khanna"
        authorUrl="https://www.ylootrips.com/authors/arjun-khanna"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Dubai Trip Cost from India', url: 'https://www.ylootrips.com/blogs/dubai-trip-cost-from-india' },
      ]} />
      <FaqJsonLd faqs={faqs} />

      <article className="bg-cream min-h-screen pb-20">

        {/* Hero */}
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1600&q=85" alt="Dubai Burj Khalifa skyline trip cost from India 2026 guide" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="section-container pb-10 max-w-4xl">
              <nav className="flex items-center gap-1.5 text-white/60 text-xs uppercase tracking-wider mb-3">
                <Link href="/blogs" className="hover:text-white">Blog</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/90">Dubai Trip Cost from India</span>
              </nav>
              <div className="inline-flex items-center gap-2 bg-accent text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                <DollarSign className="w-3 h-3" /> Budget Guide
              </div>
              <h1 className="font-display text-display-lg text-white max-w-3xl">Dubai Trip Cost from India 2026 — Complete Budget Breakdown</h1>
              <p className="text-white/70 mt-3 text-base">Updated April 2026 · 12 min read · Arjun Khanna</p>
            </div>
          </div>
        </div>

        <div className="section-container max-w-4xl py-12">

          {/* Intro */}
          <div className="prose-section mb-10">
            <p className="text-xl text-primary/80 leading-relaxed font-medium">
              Dubai is India&apos;s most popular international destination — and for good reason. It&apos;s just 3 hours from Delhi, no visa required for Indians, and the exchange rate makes it surprisingly accessible. But &quot;how much does a Dubai trip actually cost from India?&quot; is the most-asked travel question we receive.
            </p>
            <p className="text-primary/70 leading-relaxed mt-4">
              This guide breaks down every rupee you will spend — from the moment you book your flight to the moment you land back in India. We cover budget trips (₹35,000 per person), mid-range (₹60,000), and luxury (₹1,20,000+), so you can plan for your exact budget. All figures are based on 2026 real prices.
            </p>
          </div>

          {/* Quick Summary Box */}
          <div className="bg-primary text-cream rounded-2xl p-6 mb-12">
            <h2 className="font-display text-xl text-accent mb-4">Dubai Trip Cost at a Glance (5 Nights / 6 Days)</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-accent">₹35K–45K</div>
                <div className="text-sm text-cream/70 mt-1">Budget Trip</div>
                <div className="text-xs text-cream/50 mt-1">3★ hotel, Metro, Indian food</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 ring-2 ring-accent">
                <div className="text-2xl font-bold text-accent">₹55K–75K</div>
                <div className="text-sm text-cream/70 mt-1">Mid-Range (Popular)</div>
                <div className="text-xs text-cream/50 mt-1">4★ hotel, all activities</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-accent">₹1L–1.5L</div>
                <div className="text-sm text-cream/70 mt-1">Luxury</div>
                <div className="text-xs text-cream/50 mt-1">5★ Palm, Business flights</div>
              </div>
            </div>
            <p className="text-cream/60 text-xs mt-4 text-center">Prices per person. Family of 4 can often save 20–30% on packages.</p>
          </div>

          {/* Cost Breakdown Table */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-2">Full Cost Breakdown: Budget vs Mid-Range vs Luxury</h2>
            <p className="text-primary/60 mb-6">Every expense category for a 5-night Dubai trip from India in 2026.</p>
            <div className="overflow-x-auto rounded-2xl border border-secondary/20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-left p-4 font-semibold">Budget</th>
                    <th className="text-left p-4 font-semibold">Mid-Range</th>
                    <th className="text-left p-4 font-semibold">Luxury</th>
                    <th className="text-left p-4 font-semibold hidden md:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {costTable.map((row, i) => (
                    <tr key={row.category} className={i % 2 === 0 ? 'bg-white' : 'bg-cream/40'}>
                      <td className="p-4 font-medium text-primary">{row.category}</td>
                      <td className="p-4 text-green-700 font-medium">{row.budget}</td>
                      <td className="p-4 text-blue-700 font-medium">{row.mid}</td>
                      <td className="p-4 text-purple-700 font-medium">{row.luxury}</td>
                      <td className="p-4 text-primary/50 text-xs hidden md:table-cell">{row.notes}</td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5 font-bold">
                    <td className="p-4 text-primary font-bold">TOTAL (excl. shopping)</td>
                    <td className="p-4 text-green-700 font-bold">₹37K–₹53K</td>
                    <td className="p-4 text-blue-700 font-bold">₹60K–₹90K</td>
                    <td className="p-4 text-purple-700 font-bold">₹1.2L–₹2.5L+</td>
                    <td className="p-4 hidden md:table-cell"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Flights Section */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-2">
              <Plane className="inline w-6 h-6 mr-2 text-accent" />
              Flights: Delhi to Dubai — What to Expect
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              Return flights from Delhi (DEL) to Dubai (DXB) are the biggest single cost in your Dubai budget. The flight takes 3h 15m — one of the shortest international routes from India, which keeps costs manageable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-2xl p-5 border border-secondary/20">
                <h3 className="font-semibold text-primary mb-3">Budget Airlines (Cheapest)</h3>
                <ul className="space-y-2 text-sm text-primary/70">
                  <li className="flex justify-between"><span>IndiGo (Delhi–Dubai)</span><span className="font-semibold text-green-700">₹9,000–₹14,000 return</span></li>
                  <li className="flex justify-between"><span>Air Arabia</span><span className="font-semibold text-green-700">₹10,000–₹15,000 return</span></li>
                  <li className="flex justify-between"><span>flydubai</span><span className="font-semibold text-green-700">₹10,000–₹16,000 return</span></li>
                </ul>
                <p className="text-xs text-primary/40 mt-3">Book 6–8 weeks ahead for these prices</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-secondary/20">
                <h3 className="font-semibold text-primary mb-3">Full-Service Airlines</h3>
                <ul className="space-y-2 text-sm text-primary/70">
                  <li className="flex justify-between"><span>Air India (Delhi–Dubai)</span><span className="font-semibold text-blue-700">₹14,000–₹22,000 return</span></li>
                  <li className="flex justify-between"><span>Emirates Economy</span><span className="font-semibold text-blue-700">₹20,000–₹35,000 return</span></li>
                  <li className="flex justify-between"><span>Emirates Business</span><span className="font-semibold text-purple-700">₹45,000–₹80,000 return</span></li>
                </ul>
                <p className="text-xs text-primary/40 mt-3">Extra legroom, meals, and premium service</p>
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm text-primary/70">
              <strong className="text-primary">Pro tip:</strong> Delhi to Dubai is the cheapest route. Mumbai–Dubai is ₹2,000–₹4,000 more expensive. Bangalore and Chennai to Dubai are mid-range. If flying from South India, Air India and IndiGo are usually the best value.
            </div>
          </section>

          {/* Hotel Section */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-2">
              <Hotel className="inline w-6 h-6 mr-2 text-accent" />
              Hotels in Dubai — Where to Stay and What It Costs
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              Dubai has a huge range of hotels across all price points. Where you stay significantly affects your daily transport costs too — staying in Deira or Bur Dubai puts you near the metro, while Marina is further from Old Dubai attractions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-secondary/20">
                <div className="text-lg font-bold text-green-700 mb-1">₹1,600–₹2,400/night</div>
                <h3 className="font-semibold text-primary mb-2">3-Star Hotels</h3>
                <p className="text-sm text-primary/60 mb-3">Best areas: Deira, Bur Dubai, Al Rigga</p>
                <ul className="text-xs text-primary/60 space-y-1">
                  <li>• Close to Gold Souk and Creek</li>
                  <li>• Metro accessible to all sights</li>
                  <li>• Many good Indian restaurants nearby</li>
                  <li>• Total 5-night: ₹8,000–₹12,000</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-5 border-2 border-accent">
                <div className="text-lg font-bold text-blue-700 mb-1">₹3,000–₹5,000/night</div>
                <h3 className="font-semibold text-primary mb-2">4-Star Hotels ⭐ Most Popular</h3>
                <p className="text-sm text-primary/60 mb-3">Best areas: Downtown, Sheikh Zayed Rd, JBR</p>
                <ul className="text-xs text-primary/60 space-y-1">
                  <li>• Pool, gym, business facilities</li>
                  <li>• Close to Burj Khalifa and Dubai Mall</li>
                  <li>• Breakfast included at many</li>
                  <li>• Total 5-night: ₹15,000–₹25,000</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-secondary/20">
                <div className="text-lg font-bold text-purple-700 mb-1">₹8,000–₹20,000+/night</div>
                <h3 className="font-semibold text-primary mb-2">5-Star Hotels</h3>
                <p className="text-sm text-primary/60 mb-3">Best areas: Palm Jumeirah, DIFC, Marina</p>
                <ul className="text-xs text-primary/60 space-y-1">
                  <li>• Atlantis, Burj Al Arab, Address</li>
                  <li>• Private beach, infinity pool</li>
                  <li>• Butler service, premium amenities</li>
                  <li>• Total 5-night: ₹40,000–₹1,00,000+</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Food Section */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-2">
              <Utensils className="inline w-6 h-6 mr-2 text-accent" />
              Food Costs in Dubai for Indians
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              Dubai&apos;s food scene is massive and suits every budget. The city has a large South Asian community, which means excellent Indian and Pakistani restaurants at very reasonable prices — you can eat well for ₹400–₹700 per meal if you know where to go.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-primary mb-3">Budget Eating (₹400–₹700/meal)</h3>
                <ul className="space-y-2 text-sm text-primary/70">
                  <li className="flex items-start gap-2"><span className="text-accent mt-0.5">•</span><span>Indian/Pakistani restaurants in Deira — full thali for ₹400–₹600</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-0.5">•</span><span>Shawarma from street stalls (Al Rolla Square) — ₹80–₹150 per wrap</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-0.5">•</span><span>Food courts in malls — Arabian, Indian, fast food ₹300–₹600</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-0.5">•</span><span>Al Rigga Road restaurant row — best value in Dubai</span></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-primary mb-3">Mid-Range Dining (₹1,200–₹2,500/meal)</h3>
                <ul className="space-y-2 text-sm text-primary/70">
                  <li className="flex items-start gap-2"><span className="text-accent mt-0.5">•</span><span>Casual dining at Dubai Mall, JBR, or Marina — ₹1,500–₹2,500 per person</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-0.5">•</span><span>Lebanese restaurants (excellent quality) — ₹1,200–₹2,000</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-0.5">•</span><span>Seafood restaurants at Creek — ₹1,500–₹3,000</span></li>
                  <li className="flex items-start gap-2"><span className="text-accent mt-0.5">•</span><span>Rooftop restaurants with Burj Khalifa views — ₹2,000–₹4,000</span></li>
                </ul>
              </div>
            </div>
            <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm text-primary/70">
              <strong className="text-primary">Budget reality:</strong> An Indian family of 4 eating mostly at Indian/Pakistani restaurants + one nice dinner per day spends ₹4,000–₹6,000 total per day on food. A couple spending carefully can do ₹2,000–₹3,000/day including all meals.
            </div>
          </section>

          {/* Activities Section */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-2">
              <MapPin className="inline w-6 h-6 mr-2 text-accent" />
              Activity Costs: What Everything Costs in Dubai
            </h2>
            <p className="text-primary/70 leading-relaxed mb-6">
              Dubai activities range from free (beach, Creek walk, mall exploration, Fountain show) to expensive (Burj Khalifa, theme parks). Here&apos;s exactly what the major attractions cost in 2026.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activities.map((act) => (
                <div key={act.name} className="bg-white rounded-xl p-4 border border-secondary/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-primary text-sm">{act.name}</h3>
                    <span className="text-accent font-bold text-sm ml-2 shrink-0">{act.cost}</span>
                  </div>
                  <p className="text-xs text-primary/60">{act.tip}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
              <strong>Free activities in Dubai:</strong> Dubai Fountain show (every 30 min from 6 PM at Dubai Mall), JBR beach, Dubai Creek walk, Gold Souk and Spice Souk browsing, Dubai Frame exterior, Palm Jumeirah boardwalk, La Mer beach.
            </div>
          </section>

          {/* Money Saving Tips */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-2">
              <TrendingDown className="inline w-6 h-6 mr-2 text-accent" />
              8 Proven Ways to Cut Your Dubai Trip Cost
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {moneySavingTips.map((item) => (
                <div key={item.tip} className="bg-white rounded-xl p-4 border border-secondary/20 flex gap-3">
                  <span className="text-2xl shrink-0">{item.icon}</span>
                  <div>
                    <div className="font-medium text-primary text-sm">{item.tip}</div>
                    <div className="text-accent text-xs font-semibold mt-1">{item.saving}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Sample Budget for 2 People */}
          <section className="mb-12 bg-primary text-cream rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-accent mb-6">Sample Budget: Couple&apos;s 5-Night Dubai Trip from Delhi</h2>
            <div className="space-y-3">
              {[
                { item: 'Return flights × 2 (IndiGo, booked 6 weeks ahead)', inr: '₹40,000' },
                { item: 'UAE Tourist Visa × 2 (included in package)', inr: '₹3,000' },
                { item: '4-star hotel in Downtown (5 nights, breakfast)', inr: '₹20,000' },
                { item: 'All airport + hotel transfers (private)', inr: '₹5,000' },
                { item: 'Burj Khalifa × 2 (124th floor, morning slot)', inr: '₹8,000' },
                { item: 'Desert Safari × 2 (shared, BBQ dinner)', inr: '₹5,000' },
                { item: 'Dubai Aquarium × 2', inr: '₹4,000' },
                { item: 'Palm Monorail × 2', inr: '₹1,000' },
                { item: 'Dubai Metro (5 days, Nol card)', inr: '₹1,500' },
                { item: 'Food: 4 casual + 1 nice dinner (5 days)', inr: '₹12,000' },
                { item: 'Shopping (souvenirs, spices, perfumes)', inr: '₹8,000' },
                { item: 'Travel insurance × 2', inr: '₹2,000' },
              ].map((row) => (
                <div key={row.item} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
                  <span className="text-cream/70 text-sm">{row.item}</span>
                  <span className="font-semibold text-accent text-sm shrink-0 ml-4">{row.inr}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-cream">TOTAL for 2 people</span>
                <span className="font-bold text-accent text-xl">₹1,09,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-cream">Per person</span>
                <span className="font-bold text-accent text-xl">₹54,750</span>
              </div>
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-br from-accent/20 to-secondary/10 border border-accent/30 rounded-2xl p-6 md:p-8 mb-12 text-center">
            <div className="text-3xl mb-3">✈️</div>
            <h2 className="font-display text-2xl text-primary mb-2">Book Our All-Inclusive Dubai Package</h2>
            <p className="text-primary/70 mb-2">
              5 nights from Delhi starting at <span className="font-bold text-accent text-lg">₹35,999 per person</span> — flights, visa, 4-star hotel, Burj Khalifa, Desert Safari, all transfers included.
            </p>
            <p className="text-primary/50 text-sm mb-6">Skip the math — we&apos;ve done it. Lock in the best rate with just ₹5,000 advance. Free cancellation up to 14 days before.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/dubai-tour-package-from-delhi" className="inline-flex items-center gap-2 bg-primary text-cream px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                View Dubai Package <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/918427831127?text=Hi!+I+read+the+Dubai+cost+guide+and+want+a+quote+for+a+Dubai+trip+from+India." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
                <MessageCircle className="w-4 h-4" /> Get Custom Quote on WhatsApp
              </a>
            </div>
          </div>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-white rounded-2xl p-6 border border-secondary/20">
                  <h3 className="font-semibold text-primary mb-2">{faq.question}</h3>
                  <p className="text-primary/70 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Articles */}
          <section>
            <h2 className="font-display text-2xl text-primary mb-6">More Travel Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Best Time to Visit Bali — 2026 Guide', href: '/blogs/best-time-to-visit-bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tag: 'Bali' },
                { title: 'Thailand 5-Day Itinerary: Bangkok to Phuket', href: '/blogs/thailand-itinerary-5-days', img: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&q=80', tag: 'Thailand' },
                { title: 'Dubai Tour Package from Delhi — ₹35,999', href: '/dubai-tour-package-from-delhi', img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80', tag: 'Package' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="group block bg-white rounded-2xl overflow-hidden border border-secondary/20 hover:shadow-lg transition-shadow">
                  <div className="relative h-40 overflow-hidden">
                    <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-accent text-primary text-xs font-bold px-2 py-1 rounded-full">{item.tag}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-primary text-sm group-hover:text-accent transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-1 text-accent text-xs mt-2 font-medium">Read more <ArrowRight className="w-3 h-3" /></div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </article>
    </>
  );
}
