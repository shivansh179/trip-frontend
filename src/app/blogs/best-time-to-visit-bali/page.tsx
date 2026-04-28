import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, ArrowRight, MessageCircle, Calendar, Sun, CloudRain, Star } from 'lucide-react';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Best Time to Visit Bali 2026 — Month-by-Month Guide | YlooTrips',
  description: 'When is the best time to visit Bali? Complete 2026 month-by-month guide covering weather, festivals, crowds, and prices. Find your perfect Bali travel window.',
  keywords: 'best time to visit Bali, Bali weather month by month, Bali dry season wet season, when to visit Bali 2026, Bali travel tips India, Bali peak season',
  openGraph: {
    title: 'Best Time to Visit Bali 2026 — Month-by-Month Guide',
    description: 'Dry season, wet season, festivals, prices — the complete guide to choosing the best month to visit Bali from India.',
    url: 'https://www.ylootrips.com/blogs/best-time-to-visit-bali',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80', width: 1200, height: 630, alt: 'Bali Tegalalang rice terraces best time to visit' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/blogs/best-time-to-visit-bali' },
};

const months = [
  { name: 'January', weather: 'Wet Season', temp: '26–30°C', rain: 'High', crowd: 'Low', price: 'Low', tip: 'Cheaper rates, occasional heavy showers in the afternoon. Great for Ubud culture. Avoid if beach is priority.' },
  { name: 'February', weather: 'Wet Season', temp: '26–30°C', rain: 'High', crowd: 'Low', price: 'Low', tip: 'Similar to January. Nyepi (Day of Silence) can fall here — a unique cultural experience.' },
  { name: 'March', weather: 'Shoulder', temp: '27–31°C', rain: 'Medium', crowd: 'Medium', price: 'Medium', tip: 'Rain decreasing. Nyepi (Balinese New Year) is spectacular — the entire island goes silent for 24 hours.' },
  { name: 'April', weather: 'Dry Season Begins', temp: '27–32°C', rain: 'Low', crowd: 'Medium', price: 'Medium', tip: 'Excellent conditions starting. Great value before peak season. One of the best months to visit Bali.' },
  { name: 'May', weather: 'Dry Season', temp: '27–32°C', rain: 'Very Low', crowd: 'Medium', price: 'Good', tip: 'Ideal — clear skies, comfortable temperatures, fewer crowds than July. Highly recommended.' },
  { name: 'June', weather: 'Dry Season', temp: '26–31°C', rain: 'Very Low', crowd: 'High', price: 'High', tip: 'Peak season begins. Perfect weather but prices rising. Book 2–3 months ahead.' },
  { name: 'July', weather: 'Dry Season Peak', temp: '25–30°C', rain: 'Very Low', crowd: 'Very High', price: 'Peak', tip: 'Most popular month. Ideal weather but most crowded and expensive. Book 4–6 months ahead.' },
  { name: 'August', weather: 'Dry Season Peak', temp: '25–30°C', rain: 'Very Low', crowd: 'Very High', price: 'Peak', tip: 'Same as July. The absolute best weather — cool breeze, no humidity, perfect beach days.' },
  { name: 'September', weather: 'Dry Season', temp: '26–31°C', rain: 'Low', crowd: 'Medium', price: 'High', tip: 'Great weather continues, crowds thin out. The sweet spot between peak summer and shoulder season.' },
  { name: 'October', weather: 'Shoulder', temp: '27–32°C', rain: 'Low-Medium', crowd: 'Medium', price: 'Medium', tip: 'Transition month. Still mostly fine with increasing afternoon showers. Good value.' },
  { name: 'November', weather: 'Wet Season Begins', temp: '27–32°C', rain: 'Medium', crowd: 'Low', price: 'Low', tip: 'Rain picking up but mornings are still beautiful. Great for budget travel and cultural experiences.' },
  { name: 'December', weather: 'Wet Season', temp: '26–30°C', rain: 'High', crowd: 'High', price: 'High', tip: 'Christmas/New Year spike. Expensive but festive. Heavy rain possible — choose itinerary accordingly.' },
];

const faqs = [
  { question: 'Which month is the absolute best time to visit Bali?', answer: 'May, June, and September offer the best combination of great weather, manageable crowds, and reasonable prices. July and August have perfect weather but are the most crowded and expensive months of the year.' },
  { question: 'Is Bali good to visit in the monsoon/rainy season?', answer: 'Yes, with caveats. The wet season (November to March) brings afternoon downpours but mornings are usually clear and beautiful. Hotel rates are significantly cheaper (30–50% less than peak season), beaches are less crowded, and the jungle is lush and green. If beaches are your priority, go in dry season. If you want culture, Ubud, or budget travel — wet season can work well.' },
  { question: 'What is Nyepi in Bali and when does it happen?', answer: 'Nyepi is the Balinese Day of Silence — a Hindu New Year where the entire island goes silent for 24 hours. No vehicles, no lights, no activity outside. The airport closes. It falls in March (date varies by Saka calendar). It\'s a unique spiritual experience but requires planning — you must stay in your hotel all day. The evening before Nyepi, giant ogoh-ogoh demon effigies are paraded through the streets in spectacular processions.' },
  { question: 'How long should I spend in Bali?', answer: 'Minimum 5 nights to experience both Ubud (culture/nature) and the southern beaches. Ideal is 7–10 nights to add a volcano sunrise, Nusa Penida day trip, and more relaxation time. First-timers should split time between Ubud (2–3 nights) and Seminyak or Canggu (2–3 nights).' },
  { question: 'Is Bali safe to visit during the wet season?', answer: 'Yes, completely safe. The wet season brings heavy afternoon rain (usually 2–4 PM), not continuous all-day rain. Mornings are typically clear and sunny. Flash flooding can occasionally affect some roads. Check weather forecasts daily and adjust activities accordingly. The jungle and rice terraces are at their most dramatic and green during the wet season.' },
];

export default function BestTimeToBaliPage() {
  return (
    <>
      <ArticleJsonLd
        headline="Best Time to Visit Bali 2026 — Month-by-Month Guide"
        description="When is the best time to visit Bali? Complete 2026 month-by-month guide covering weather, festivals, crowds, and prices."
        url="https://www.ylootrips.com/blogs/best-time-to-visit-bali"
        image="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80"
        datePublished="2026-01-15"
        dateModified="2026-04-09"
        keywords={['best time Bali', 'Bali weather', 'Bali travel guide', 'Bali dry season', 'when to visit Bali']}
        authorName="Arjun Khanna"
        authorUrl="https://www.ylootrips.com/authors/arjun-khanna"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Best Time to Visit Bali', url: 'https://www.ylootrips.com/blogs/best-time-to-visit-bali' },
      ]} />
      <FaqJsonLd faqs={faqs} />

      <article className="bg-cream min-h-screen pb-20">

        {/* Hero */}
        <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
          <Image src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&q=85" alt="Bali Tegalalang rice terraces best time to visit month guide" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="section-container pb-10 max-w-4xl">
              <nav className="flex items-center gap-1.5 text-white/60 text-xs uppercase tracking-wider mb-3">
                <Link href="/blogs" className="hover:text-white">Blog</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white/90">Best Time to Visit Bali</span>
              </nav>
              <div className="inline-flex items-center gap-2 bg-accent text-primary text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                <Calendar className="w-3 h-3" /> Destinations Guide
              </div>
              <h1 className="font-display text-display-lg text-white max-w-3xl">Best Time to Visit Bali — Complete 2026 Guide</h1>
              <p className="text-white/70 mt-3 text-base">Updated April 2026 · 11 min read · Arjun Khanna</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="section-container max-w-4xl py-12">

          {/* TOC */}
          <div className="bg-cream-dark border border-primary/10 rounded-2xl p-6 mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">In This Guide</p>
            <ol className="space-y-1.5 text-sm text-primary/70">
              {['Quick Answer: Best Months', 'Dry vs. Wet Season Explained', 'Month-by-Month Breakdown', 'Best Time by Traveler Type', 'Bali Festivals Calendar', 'Frequently Asked Questions'].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{i+1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="prose prose-sm max-w-none space-y-8 text-primary/75">

            {/* Quick Answer */}
            <section>
              <h2 className="font-display text-3xl text-primary mb-4">Quick Answer: Best Months to Visit Bali</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose mb-6">
                {[
                  { months: 'April – June', icon: '🌟', label: 'Best Overall', desc: 'Perfect weather, fewer crowds than peak, good prices' },
                  { months: 'July – August', icon: '☀️', label: 'Best Weather', desc: 'Ideal dry season but busiest and most expensive' },
                  { months: 'Nov – Jan', icon: '💰', label: 'Best Budget', desc: 'Cheapest rates, lush green, occasional afternoon rain' },
                ].map(({ months, icon, label, desc }) => (
                  <div key={label} className="bg-cream-light border border-primary/10 rounded-xl p-4">
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-bold text-primary text-sm">{label}</div>
                    <div className="text-accent font-semibold text-xs mt-0.5">{months}</div>
                    <p className="text-xs text-primary/55 mt-1 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
              <p className="leading-relaxed">The honest answer: <strong className="text-primary">Bali is worth visiting year-round</strong>. Unlike some tropical destinations where the wet season means week-long downpours, Bali&apos;s rainy season typically brings brief afternoon showers that clear by evening. The &quot;perfect&quot; time to visit depends on your priorities — we break it all down below.</p>
            </section>

            {/* Dry vs Wet */}
            <section>
              <h2 className="font-display text-3xl text-primary mb-4">Bali Dry Season vs. Wet Season</h2>
              <div className="grid sm:grid-cols-2 gap-5 not-prose mb-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sun className="w-5 h-5 text-amber-600" />
                    <h3 className="font-bold text-amber-800">Dry Season (April – October)</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-amber-900">
                    {['Clear skies and low humidity', 'Ideal for beaches and island hopping', 'Best visibility for snorkeling/diving', 'July–August: peak crowds and prices', 'Cool breezes, comfortable evenings'].map((p, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span>{p}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CloudRain className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-blue-800">Wet Season (November – March)</h3>
                  </div>
                  <ul className="space-y-1.5 text-sm text-blue-900">
                    {['30–50% cheaper hotel rates', 'Lush green rice terraces and waterfalls', 'Fewer tourists at major attractions', 'Afternoon rain (usually 2–4 PM)', 'Mornings typically clear and beautiful'].map((p, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Month by month */}
            <section>
              <h2 className="font-display text-3xl text-primary mb-2">Month-by-Month Bali Weather Guide</h2>
              <p className="text-sm text-primary/50 mb-5">Average temperatures, rainfall, crowds, and our verdict for each month</p>
              <div className="not-prose grid grid-cols-1 gap-3">
                {months.map((m) => (
                  <div key={m.name} className="bg-white border border-primary/8 rounded-xl p-4 flex items-start gap-4">
                    <div className="w-20 shrink-0 text-center">
                      <div className="font-bold text-primary text-sm">{m.name}</div>
                      <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block font-semibold ${
                        m.weather.includes('Peak') ? 'bg-green-100 text-green-800' :
                        m.weather.includes('Dry') ? 'bg-amber-100 text-amber-800' :
                        m.weather.includes('Wet') ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-700'
                      }`}>{m.weather}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-3 mb-2 text-xs">
                        <span className="text-primary/60">🌡 {m.temp}</span>
                        <span className={`font-semibold ${m.rain === 'Very Low' ? 'text-green-600' : m.rain === 'Low' ? 'text-emerald-600' : m.rain === 'High' ? 'text-blue-600' : 'text-amber-600'}`}>
                          🌧 Rain: {m.rain}
                        </span>
                        <span className={`font-semibold ${m.crowd === 'Very High' ? 'text-red-600' : m.crowd === 'High' ? 'text-orange-600' : m.crowd === 'Low' ? 'text-green-600' : 'text-amber-600'}`}>
                          👥 Crowds: {m.crowd}
                        </span>
                        <span className={`font-semibold ${m.price === 'Peak' ? 'text-red-600' : m.price === 'High' ? 'text-orange-600' : m.price === 'Low' ? 'text-green-600' : 'text-amber-600'}`}>
                          💰 Price: {m.price}
                        </span>
                      </div>
                      <p className="text-sm text-primary/65 leading-relaxed">{m.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* By traveler type */}
            <section>
              <h2 className="font-display text-3xl text-primary mb-5">Best Time to Visit Bali by Traveler Type</h2>
              <div className="not-prose grid sm:grid-cols-2 gap-4">
                {[
                  { type: '🥂 Honeymooners', best: 'April–June or September', why: 'Perfect weather, romantic atmosphere, good rates. Avoid July–August (too crowded for romance).' },
                  { type: '👨‍👩‍👧‍👦 Families', best: 'June or September', why: 'School holidays align, ideal weather, kids-friendly activities. Book early for June.' },
                  { type: '💰 Budget Travelers', best: 'November–February', why: 'Cheapest flights and hotels. Morning activities unaffected by afternoon rain.' },
                  { type: '🤿 Divers & Snorkelers', best: 'April–October', why: 'Best visibility, calmer seas. Mola-mola (sunfish) season: August–October at Nusa Penida.' },
                  { type: '🏄 Surfers', best: 'May–September', why: 'Indian Ocean swells peak. Uluwatu, Padang Padang, and Keramas are world-class in dry season.' },
                  { type: '🛕 Culture & Temples', best: 'March (Nyepi) or October', why: 'Nyepi is a once-in-a-lifetime spiritual experience. October has great festivals without peak crowds.' },
                ].map(({ type, best, why }) => (
                  <div key={type} className="bg-cream-light border border-primary/8 rounded-xl p-4">
                    <div className="font-bold text-primary text-sm mb-1">{type}</div>
                    <div className="text-xs font-semibold text-secondary mb-1.5">Best: {best}</div>
                    <p className="text-xs text-primary/60 leading-relaxed">{why}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Festivals */}
            <section>
              <h2 className="font-display text-3xl text-primary mb-5">Key Bali Festivals & Events 2026</h2>
              <div className="not-prose space-y-3">
                {[
                  { event: 'Nyepi — Balinese Day of Silence', month: 'March 2026', desc: 'The entire island goes silent for 24 hours. Airport closes. The evening before: giant ogoh-ogoh parade through streets.' },
                  { event: 'Galungan & Kuningan', month: 'April 2026', desc: 'Balinese Hindu celebration of good over evil. Elaborate penjor bamboo decorations adorn every home and temple.' },
                  { event: 'Bali Arts Festival', month: 'June–July 2026', desc: 'Month-long festival in Denpasar showcasing traditional dance, music, craft, and food. Free entry to many events.' },
                  { event: 'Kuta Karnival', month: 'October 2026', desc: 'Annual Kuta beach festival with surf competitions, cultural performances, and beach concerts.' },
                ].map(({ event, month, desc }) => (
                  <div key={event} className="flex items-start gap-3 border-l-4 border-accent pl-4 py-2">
                    <div>
                      <div className="font-semibold text-primary text-sm">{event}</div>
                      <div className="text-xs text-accent font-medium mt-0.5">{month}</div>
                      <p className="text-xs text-primary/60 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Internal CTA */}
            <div className="not-prose bg-primary rounded-2xl p-8 text-center">
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3">Ready to Book?</p>
              <h3 className="font-display text-2xl text-cream mb-3">Bali Honeymoon Package — 6 Nights from ₹42,999</h3>
              <p className="text-cream/60 text-sm mb-6 max-w-md mx-auto">Private pool villa in Ubud · Tanah Lot dinner · Tegalalang sunrise · Couples spa</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/bali-honeymoon-package" className="inline-flex items-center justify-center gap-2 bg-accent text-primary px-8 py-3.5 text-sm font-bold uppercase tracking-widest rounded-xl">
                  View Bali Package <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="https://wa.me/918427831127?text=Hi! I want to know the best time to visit Bali and book a package." target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-3.5 text-sm font-semibold rounded-xl">
                  <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
                </a>
              </div>
            </div>

            {/* FAQ */}
            <section>
              <h2 className="font-display text-3xl text-primary mb-5">Frequently Asked Questions</h2>
              <div className="not-prose space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border border-primary/10 rounded-xl overflow-hidden">
                    <div className="p-5">
                      <h3 className="font-semibold text-primary text-sm mb-2">{faq.question}</h3>
                      <p className="text-primary/65 text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Related blogs */}
            <section>
              <h2 className="font-display text-2xl text-primary mb-4">Related Articles</h2>
              <div className="not-prose grid sm:grid-cols-3 gap-4">
                {[
                  { title: 'Dubai Trip Cost from India — Complete Budget Guide 2026', href: '/blogs/dubai-trip-cost-from-india', tag: 'Budget Guide' },
                  { title: 'Thailand Itinerary 5 Days — Bangkok to Phuket Perfect Plan', href: '/blogs/thailand-itinerary-5-days', tag: 'Itinerary' },
                  { title: 'First Time in India? Complete 2026 Guide', href: '/blogs/first-time-india-guide', tag: 'Beginners Guide' },
                ].map(({ title, href, tag }) => (
                  <Link key={href} href={href} className="group block bg-cream-light border border-primary/8 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">{tag}</div>
                    <h3 className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors leading-snug">{title}</h3>
                  </Link>
                ))}
              </div>
            </section>

          </div>
        </div>
      </article>
    </>
  );
}
