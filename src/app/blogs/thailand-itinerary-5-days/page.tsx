import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, MessageCircle, MapPin, Clock, Utensils, Star } from 'lucide-react';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Thailand Itinerary 5 Days 2026 — Bangkok to Phuket Perfect Plan | YlooTrips',
  description: 'Best 5-day Thailand itinerary for Indians in 2026. Day-by-day Bangkok + Phuket plan — temples, Phi Phi Islands, floating market, nightlife. Budget breakdown included.',
  keywords: 'Thailand itinerary 5 days, Thailand 5 day trip plan, Bangkok Phuket 5 days, Thailand trip plan from India, Thailand 6 days itinerary 2026, Thailand travel guide India',
  openGraph: {
    title: 'Thailand Itinerary 5 Days 2026 — Bangkok to Phuket Perfect Plan',
    description: 'Day-by-day 5-day Thailand itinerary for Indians: Bangkok temples, floating market, Phi Phi Islands, elephant sanctuary, Bangla Road.',
    url: 'https://www.ylootrips.com/blogs/thailand-itinerary-5-days',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80', width: 1200, height: 630, alt: 'Thailand Bangkok Grand Palace 5-day itinerary from India' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/blogs/thailand-itinerary-5-days' },
};

const itinerary = [
  {
    day: 1,
    title: 'Arrive Bangkok — First Evening on Khao San Road',
    city: 'Bangkok',
    image: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800&q=80',
    morning: 'Land at Suvarnabhumi Airport (BKK). Most IndiGo/AirAsia flights from India arrive morning or afternoon. Skip the expensive airport taxi — take the Airport Rail Link to Phaya Thai station (₹130, 30 min), then a regular taxi to your hotel for another ₹100–₹150.',
    afternoon: 'Check into your hotel in central Bangkok (recommended areas: Silom, Sukhumvit Soi 11, or near Khao San Road). Rest for 2 hours — jet lag is minimal since Thailand is only 1.5 hours ahead of India.',
    evening: 'Head to Khao San Road for your first taste of Bangkok. This legendary backpacker street is lined with street food, cocktail bars, travel agents, and a carnival atmosphere. Try Pad Thai from a street cart (₹80), Mango Sticky Rice (₹60), and a Chang beer. Optional upgrade: rooftop bar at Vertigo (Banyan Tree Hotel) for Bangkok skyline views.',
    meals: 'Street food on Khao San Road',
    stay: 'Bangkok',
    budget: '₹1,500–₹3,000 (food + local transport + drinks)',
    tips: ['Most direct flights from India land in the morning — book accommodation from Day 1', 'Exchange currency at Superrich Thailand (airport or city) for the best rates', 'Get a Thai SIM card at the airport (₹400 for 15-day unlimited data)'],
  },
  {
    day: 2,
    title: 'Bangkok: Grand Palace + Floating Market + Chinatown',
    city: 'Bangkok',
    image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80',
    morning: 'Leave by 6:30 AM for Damnoen Saduak Floating Market (90 min from Bangkok). Arriving before 8 AM means fewer tourists and more authentic market activity. Buy fresh fruits, boat noodles, and Pad Krapao from vendors in wooden boats. Hire a longtail boat (₹400 for 30-min tour) for a full market experience.',
    afternoon: 'Return to Bangkok for the Grand Palace and Wat Phra Kaew (Temple of the Emerald Buddha) — Thailand\'s most sacred and spectacular site. Entry fee: ₹1,200 per person. Dress code strict (covered shoulders, long trousers/skirt). Then take the Chao Phraya ferry (₹25) to Wat Arun (Temple of Dawn) across the river — a stunning riverside photo opportunity.',
    evening: 'Bangkok Chinatown (Yaowarat Road) comes alive after 6 PM with the city\'s best street seafood. Fresh crab, tom yum soup, fried oysters, and Thai iced tea at outdoor tables under neon signs. Budget ₹600–₹900 per person for dinner here.',
    meals: 'Breakfast: Thai from market. Dinner: Yaowarat seafood street',
    stay: 'Bangkok',
    budget: '₹2,500–₹4,000 (floating market + Grand Palace + food + transport)',
    tips: ['Grand Palace closes at 3:30 PM — arrive by 11 AM to have enough time', 'Wear light, breathable clothing but carry a scarf for temple entry', 'The Chao Phraya Express Boat (orange flag) is the cheapest and most fun way to travel along the river'],
  },
  {
    day: 3,
    title: 'Bangkok to Phuket — Beach Life Begins',
    city: 'Bangkok → Phuket',
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80',
    morning: 'Hotel breakfast and checkout by 9 AM. Transfer to Suvarnabhumi Airport for the AirAsia Bangkok–Phuket domestic flight (1 hour). Flights depart roughly every 2 hours — your package will include a pre-booked ticket.',
    afternoon: 'Land at Phuket International Airport and transfer to your beach hotel (Patong, Kata, or Karon Beach recommended). Patong is the liveliest; Kata is more relaxed and family-friendly. First afternoon: hit the beach. The Andaman Sea is warm (28°C), clear, and perfect for swimming. Rent a sunbed (₹200), try jet skiing (₹1,500/15 min), or parasailing (₹1,200).',
    evening: 'Explore Bangla Road — Phuket\'s legendary entertainment street. Bars, clubs, live music, Simon Cabaret shows, food carts, and a buzzing crowd. Budget: ₹500–₹1,500 depending on how much you drink.',
    meals: 'Breakfast: hotel. Dinner: Bangla Road area restaurants',
    stay: 'Phuket',
    budget: '₹2,000–₹3,500 (transfers + first beach day + evening)',
    tips: ['Tuk-tuks in Phuket are notoriously overpriced — use Grab app instead', 'Kata Beach is 15 min south of Patong — much quieter and cleaner', 'Most package tours from India include the Bangkok–Phuket flight'],
  },
  {
    day: 4,
    title: 'Phi Phi Islands Speedboat Day Trip — The Highlight',
    city: 'Phuket / Phi Phi Islands',
    image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=800&q=80',
    morning: 'Depart Phuket pier at 8 AM by speedboat to the Phi Phi archipelago (45 min). This is the unequivocal highlight of any Phuket trip. The boat stops at multiple locations — Viking Cave (ancient paintings), Loh Samah Bay, and the stunning Pileh Lagoon with its impossibly turquoise water enclosed by vertical limestone walls. You\'ll snorkel here — bring reef-safe sunscreen.',
    afternoon: 'Stop at Phi Phi Don (the main island) for lunch and beach time (1–2 hours). The village has restaurants, shops, and an incredible sunset viewpoint (30-min walk up a hill — worth every step). Depending on NPS regulations at the time of visit, you may also get to see the famous Maya Bay (where The Beach was filmed) — now strictly controlled with limited daily visitor permits.',
    evening: 'Return to Phuket by 5 PM. Dinner at a seafood restaurant near Kata or Patong Beach — order fresh grilled fish, Tom Kha Gai (coconut soup), and Mango Sticky Rice for dessert. This is the best meal of the trip.',
    meals: 'Breakfast: hotel. Lunch: Phi Phi Don village. Dinner: Phuket seafood restaurant',
    stay: 'Phuket',
    budget: '₹3,500–₹5,000 (Phi Phi tour ₹2,200 + meals + evening)',
    tips: ['Book the Phi Phi speedboat tour, not the slow ferry — it visits more stops and saves 3 hours', 'Wear full swimwear under clothes — you will be snorkeling at multiple stops', 'Maya Bay entry is now limited — check permit availability with your operator'],
  },
  {
    day: 5,
    title: 'Elephant Sanctuary + Big Buddha + Muay Thai Night',
    city: 'Phuket',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80',
    morning: 'Visit a reputable ethical elephant sanctuary (we recommend Phuket Elephant Care or Elephant Jungle Sanctuary). No riding — observe, feed, and watch elephants bathe in their natural habitat. Most sanctuaries run morning sessions (8 AM–12 PM). Entry fee: ₹2,200–₹2,800. Lunch is usually included. A genuinely moving experience — these are rescued elephants given a second life.',
    afternoon: 'Drive to the Big Buddha viewpoint — a 45-metre-tall white marble Buddha statue on Nakkerd Hill with 360° panoramic views of Phuket, Kata Beach, and Chalong Bay. Free entry, small donation appreciated. Nearby: Chalong Temple (Wat Chalong) — Phuket\'s most important Buddhist temple, beautiful and peaceful.',
    evening: 'Watch a live Muay Thai boxing match at Bangla Boxing Stadium or Patong Boxing Stadium (₹1,200–₹1,800). This is the real thing — professional fighters, not a tourist show. Electrifying atmosphere. Have your last Thai dinner at a favourite restaurant from earlier in the trip.',
    meals: 'Breakfast: hotel (included). Lunch: sanctuary. Dinner: last Thai dinner',
    stay: 'Phuket',
    budget: '₹4,500–₹6,000 (sanctuary + activities + Muay Thai + dinner)',
    tips: ['Book the elephant sanctuary the day before — morning slots fill up fast', 'Big Buddha is best visited at 4–5 PM for golden hour light and cooler temperature', 'Muay Thai: buy tickets at the stadium gate same day, front row costs more but is worth it for atmosphere'],
  },
  {
    day: 6,
    title: 'Morning Beach + Departure Day',
    city: 'Phuket → India',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80',
    morning: 'Final morning at Phuket\'s beach — wake up early (6:30–7 AM) for the beach before crowds arrive. Collect shells, swim one last time, and order a coconut from a beach vendor. Hotel checkout by noon. Pack up souvenirs: Tiger Balm, dried mango, Thai silk scarves, and elephant figurines from the night market.',
    afternoon: 'Transfer to Phuket International Airport for your return flight to India. Most flights to Delhi/Mumbai/Bangalore depart afternoon or evening and arrive back late evening or next morning. Land in India, clear customs, and your Thailand adventure is complete.',
    evening: 'Back in India.',
    meals: 'Breakfast: hotel (included)',
    stay: 'Departure',
    budget: '₹500–₹1,000 (last souvenirs + airport coffee)',
    tips: ['Phuket airport is 45 min from Patong — allow 2.5 hours before departure', 'Check your duty-free allowance: you can bring 2L of liquor into India', 'Thai Baht leftover? Exchange at the airport or keep for next time'],
  },
];

const budgetBreakdown = [
  { item: 'Return flights Delhi–Bangkok (IndiGo/AirAsia)', amount: '₹18,000–₹24,000' },
  { item: 'Bangkok–Phuket domestic flight (included in package)', amount: '₹3,000–₹5,000' },
  { item: 'Hotel Bangkok 2 nights (3-star, central)', amount: '₹4,000–₹6,000' },
  { item: 'Hotel Phuket 3 nights (3-star, beach)', amount: '₹5,000–₹8,000' },
  { item: 'Grand Palace + Wat Phra Kaew entry', amount: '₹1,200/person' },
  { item: 'Floating Market + longtail boat', amount: '₹800–₹1,200' },
  { item: 'Phi Phi Islands speedboat day trip', amount: '₹2,200–₹2,800' },
  { item: 'Ethical elephant sanctuary', amount: '₹2,200–₹2,800' },
  { item: 'Muay Thai boxing match', amount: '₹1,200–₹1,800' },
  { item: 'Food (5 days — mostly street food + 2 restaurants)', amount: '₹5,000–₹8,000' },
  { item: 'Local transport (Grab, metro, tuk-tuk)', amount: '₹2,000–₹3,000' },
  { item: 'Shopping (souvenirs, clothes, snacks)', amount: '₹2,000–₹8,000' },
];

const faqs = [
  { question: 'Is 5 days enough for Thailand?', answer: '5 nights / 6 days is the minimum to experience both Bangkok and Phuket. You will see the Grand Palace, Phi Phi Islands, temples, floating market, and beach — which covers the greatest hits. For a more relaxed pace or to add Chiang Mai or Koh Samui, extend to 8–10 days. That said, 5 nights is the most popular itinerary for Indian travelers because the weekend + 4 days off = return to work on Monday.' },
  { question: 'How much does a 5-day Thailand trip cost from India?', answer: 'A budget Thailand trip (5 nights) costs ₹25,000–₹35,000 per person including flights, hotels, and major activities. A mid-range trip with better hotels and all activities is ₹40,000–₹55,000. Our all-inclusive package starts at ₹28,999 per person — the best value we offer. Budget ₹8,000–₹12,000 extra for personal meals, shopping, and nightlife.' },
  { question: 'Do I need a visa for Thailand from India?', answer: 'No! Indians get a 30-day visa-free entry to Thailand since November 2024. You simply clear immigration on arrival with a valid passport (6+ months), confirmed return ticket, and hotel booking proof. No advance application, no fee. Thailand is currently the most visa-friendly international destination for Indian travelers.' },
  { question: 'What is the best base for a 5-day Thailand trip — Bangkok or Phuket?', answer: 'The ideal 5-day trip splits between both. Bangkok for 2 nights (culture, temples, nightlife, food) and Phuket for 3 nights (beaches, islands, water activities). Spending all 5 nights in one place means you miss the other. The Bangkok–Phuket flight is just 1 hour and is often included in travel packages.' },
  { question: 'When is the best time to visit Thailand from India?', answer: 'November to April is the best time — cool, dry weather, calm Andaman Sea perfect for Phi Phi Islands speedboat trips. May to October has occasional rain (especially afternoons) but dramatically lower prices (save ₹5,000–₹10,000 per person on packages). The sea can be rougher May–October, which occasionally cancels Phi Phi boat tours. If beaches are your priority, go November–April.' },
  { question: 'Is Thailand safe for solo Indian travelers and women?', answer: 'Thailand is extremely safe and tourist-friendly. Solo female travelers from India report feeling comfortable and well-treated throughout the country. Standard precautions apply (don\'t leave drinks unattended, be cautious in very touristy areas for bag-snatching). The local population is overwhelmingly friendly. Use Grab for safe, metered transport instead of unlicensed tuk-tuks. Our coordinator is on WhatsApp 24/7 during your trip.' },
];

export default function ThailandItinerary5DaysPage() {
  return (
    <>
      <ArticleJsonLd
        headline="Thailand Itinerary 5 Days 2026 — Bangkok to Phuket Perfect Plan"
        description="Best 5-day Thailand itinerary for Indians in 2026. Day-by-day Bangkok + Phuket plan with budget breakdown."
        url="https://www.ylootrips.com/blogs/thailand-itinerary-5-days"
        image="https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80"
        datePublished="2026-02-01"
        dateModified="2026-04-09"
        keywords={['Thailand itinerary 5 days', 'Bangkok Phuket 5 days', 'Thailand trip plan India', 'Thailand 6 days itinerary']}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Thailand 5-Day Itinerary', url: 'https://www.ylootrips.com/blogs/thailand-itinerary-5-days' },
      ]} />
      <FaqJsonLd faqs={faqs} />

      <article className="bg-cream min-h-screen pb-20">

        {/* Hero */}
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1600&q=85" alt="Thailand Bangkok Grand Palace 5 day itinerary from India" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="section-container pb-10 max-w-4xl">
              <nav className="flex items-center gap-1.5 text-white/60 text-xs uppercase tracking-wider mb-3">
                <Link href="/blogs" className="hover:text-white">Blog</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/90">Thailand 5-Day Itinerary</span>
              </nav>
              <div className="inline-flex items-center gap-2 bg-accent text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                <MapPin className="w-3 h-3" /> Itinerary Guide
              </div>
              <h1 className="font-display text-display-lg text-white max-w-3xl">Thailand Itinerary 5 Days — Bangkok to Phuket Perfect Plan 2026</h1>
              <p className="text-white/70 mt-3 text-base">Updated April 2026 · 14 min read · YlooTrips Editorial</p>
            </div>
          </div>
        </div>

        <div className="section-container max-w-4xl py-12">

          {/* Intro */}
          <div className="mb-10">
            <p className="text-xl text-primary/80 leading-relaxed font-medium">
              Five days in Thailand is all you need to have the trip of your life. Bangkok gives you ancient temples, world-class street food, and chaotic urban energy. Phuket gives you white sand beaches, crystal-clear water, and the Phi Phi Islands — arguably the most beautiful island day trip in all of Southeast Asia.
            </p>
            <p className="text-primary/70 leading-relaxed mt-4">
              This itinerary is designed for Indian travelers — flights from Delhi/Mumbai land early morning, and the internal Bangkok–Phuket flight is just 1 hour. No visa needed, no jet lag, and your rupee goes further here than almost anywhere else in the world. Here is the best way to spend 5 nights in Thailand.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: <Clock className="w-5 h-5" />, label: 'Duration', value: '5 Nights / 6 Days' },
              { icon: <MapPin className="w-5 h-5" />, label: 'Route', value: 'Bangkok → Phuket' },
              { icon: <Utensils className="w-5 h-5" />, label: 'Cuisine', value: 'Thai + Street Food' },
              { icon: <Star className="w-5 h-5" />, label: 'Difficulty', value: 'Easy (All Ages)' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 border border-secondary/20 text-center">
                <div className="text-accent flex justify-center mb-2">{stat.icon}</div>
                <div className="text-xs text-primary/50 uppercase tracking-wide">{stat.label}</div>
                <div className="font-semibold text-primary text-sm mt-1">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Day-by-Day Itinerary */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-8">Day-by-Day Thailand 5-Night Itinerary</h2>
            <div className="space-y-10">
              {itinerary.map((day) => (
                <div key={day.day} className="bg-white rounded-2xl overflow-hidden border border-secondary/20">
                  {/* Day Header */}
                  <div className="relative h-48 overflow-hidden">
                    <Image src={day.image} alt={`Thailand Day ${day.day} - ${day.title}`} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full">Day {day.day}</span>
                        <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">{day.city}</span>
                      </div>
                      <h3 className="font-display text-xl text-white">{day.title}</h3>
                    </div>
                  </div>

                  {/* Day Content */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
                      <div>
                        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Morning</div>
                        <p className="text-sm text-primary/70 leading-relaxed">{day.morning}</p>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Afternoon</div>
                        <p className="text-sm text-primary/70 leading-relaxed">{day.afternoon}</p>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Evening</div>
                        <p className="text-sm text-primary/70 leading-relaxed">{day.evening}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-secondary/10">
                      <div className="flex items-start gap-2">
                        <Utensils className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-primary/50 uppercase">Meals</div>
                          <div className="text-xs text-primary/70">{day.meals}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-primary/50 uppercase">Budget</div>
                          <div className="text-xs text-primary/70">{day.budget}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-primary/50 uppercase mb-1">Pro Tips</div>
                        <ul className="space-y-0.5">
                          {day.tips.map((tip) => (
                            <li key={tip} className="text-xs text-primary/60 flex items-start gap-1">
                              <span className="text-accent mt-0.5">→</span> {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Budget Breakdown */}
          <section className="mb-12 bg-primary text-cream rounded-2xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-accent mb-6">Complete Budget Breakdown — 5-Night Thailand Trip Per Person</h2>
            <div className="space-y-3">
              {budgetBreakdown.map((row) => (
                <div key={row.item} className="flex justify-between items-center border-b border-white/10 pb-3 last:border-0">
                  <span className="text-cream/70 text-sm">{row.item}</span>
                  <span className="font-semibold text-accent text-sm shrink-0 ml-4">{row.amount}</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-cream">TOTAL (budget trip)</span>
                <span className="font-bold text-accent text-xl">₹46K–₹72K</span>
              </div>
              <p className="text-cream/40 text-xs">*Our all-inclusive package starts at ₹28,999 — significantly cheaper than booking separately due to bulk rates on flights and hotels.</p>
            </div>
          </section>

          {/* Getting Around Thailand */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-6">Getting Around Thailand — Transport Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { mode: 'Bangkok BTS Skytrain & MRT Metro', cost: '₹50–₹150 per trip', desc: 'Fast, air-conditioned, and connects all major tourist areas in Bangkok. Buy a rabbit card for convenience. Best way to beat Bangkok traffic.' },
                { mode: 'Grab (Uber equivalent)', cost: '₹100–₹400 per trip', desc: 'Use Grab app for fixed-price rides in both Bangkok and Phuket. Much fairer than unmetered tuk-tuks. Works well at any hour.' },
                { mode: 'Tuk-Tuk', cost: '₹200–₹500 per trip', desc: 'Fun for short hops and photos, but negotiate HARD before getting in. Never accept a free ride — it always ends at a gem or tailor shop.' },
                { mode: 'Bangkok to Phuket Flight', cost: '₹1,500–₹3,000 per person', desc: 'AirAsia, Thai Lion Air, and Thai Smile run hourly flights. Takes 1h 20m. Included in most tour packages from India.' },
                { mode: 'Songthaew (shared taxi truck)', cost: '₹50–₹120 per trip', desc: 'Phuket\'s shared red trucks run fixed routes between Patong, Kata, and Karon. Cheapest way to move between Phuket beaches.' },
                { mode: 'Scooter Rental (Phuket)', cost: '₹300–₹500/day', desc: 'Excellent for Phuket day trips. License technically required. Ride carefully — Phuket roads have accident risks. Wear a helmet always.' },
              ].map((t) => (
                <div key={t.mode} className="bg-white rounded-xl p-5 border border-secondary/20">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-primary text-sm">{t.mode}</h3>
                    <span className="text-accent font-bold text-sm ml-2 shrink-0">{t.cost}</span>
                  </div>
                  <p className="text-xs text-primary/60">{t.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-gradient-to-br from-accent/20 to-secondary/10 border border-accent/30 rounded-2xl p-6 md:p-8 mb-12 text-center">
            <div className="text-3xl mb-3">🌏</div>
            <h2 className="font-display text-2xl text-primary mb-2">Book This Exact Itinerary — Pre-Organised</h2>
            <p className="text-primary/70 mb-2">
              Our Thailand Budget Trip follows this exact itinerary — starting at <span className="font-bold text-accent text-lg">₹28,999 per person</span>. Flights, hotels, all transfers, and key activities included.
            </p>
            <p className="text-primary/50 text-sm mb-6">No research. No booking hassle. No airport confusion. Our coordinator is on WhatsApp throughout your entire trip.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/thailand-budget-trip" className="inline-flex items-center gap-2 bg-primary text-cream px-6 py-3 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                View Thailand Package <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="https://wa.me/918427831127?text=Hi!+I+read+the+Thailand+5-day+itinerary+guide+and+want+to+book+a+trip." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors">
                <MessageCircle className="w-4 h-4" /> Book on WhatsApp
              </a>
            </div>
          </div>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="font-display text-2xl text-primary mb-6">Thailand Trip FAQs for Indian Travelers</h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="bg-white rounded-2xl p-6 border border-secondary/20">
                  <h3 className="font-semibold text-primary mb-2">{faq.question}</h3>
                  <p className="text-primary/70 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Related */}
          <section>
            <h2 className="font-display text-2xl text-primary mb-6">More Travel Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Best Time to Visit Bali — 2026 Month Guide', href: '/blogs/best-time-to-visit-bali', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', tag: 'Bali' },
                { title: 'Dubai Trip Cost from India — Full Breakdown', href: '/blogs/dubai-trip-cost-from-india', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', tag: 'Dubai' },
                { title: 'Thailand Budget Trip — 5 Nights ₹28,999', href: '/thailand-budget-trip', img: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=600&q=80', tag: 'Package' },
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
