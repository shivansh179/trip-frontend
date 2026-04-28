import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { MessageCircle, ArrowRight, CheckCircle, MapPin, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: "Kedarnath Yatra 2026 — Complete Guide (Registration, Trek, Budget & Tips)",
  description: "Complete Kedarnath Yatra guide 2026: online registration, how to reach, trek route day-by-day, accommodation options, packing list, budget, do's & don'ts, and practical tips for first-time pilgrims.",
  keywords: "Kedarnath Yatra 2026, Kedarnath registration, Kedarnath trek guide, Kedarnath how to reach, Kedarnath budget, Kedarnath packing list, Kedarnath opening date 2026, Gaurikund to Kedarnath trek",
  openGraph: {
    title: "Kedarnath Yatra 2026 — Complete Guide (Registration, Trek, Budget & Tips)",
    description: "Everything for Kedarnath Yatra 2026: registration process, how to reach, trek plan, budget breakdown, and tips for a safe and fulfilling pilgrimage.",
    url: "https://www.ylootrips.com/blogs/kedarnath-yatra-guide",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Kedarnath temple surrounded by snow-capped Himalayas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kedarnath Yatra 2026 — Complete Guide",
    description: "Registration, trek route, budget, packing list and tips for Kedarnath Yatra 2026.",
    images: ["https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/kedarnath-yatra-guide" },
};

const trekItinerary = [
  { day: 'Day 1', location: 'Delhi → Haridwar / Rishikesh', details: 'Travel from Delhi by overnight train or bus. Haridwar to Rishikesh in ~30 mins. Rest and prepare. Attend Ganga Aarti at Triveni Ghat if arriving in the evening. Hotels at all budgets available.', altitude: '300m' },
  { day: 'Day 2', location: 'Haridwar → Sonprayag / Gaurikund', details: 'Drive Haridwar → Srinagar → Rudraprayag → Sonprayag (230km, ~7–8 hrs). Shared jeeps available from Rishikesh/Rudraprayag. Sonprayag is the last vehicle point. Take a shared jeep to Gaurikund (5km). Check in at Gaurikund. Hot springs available for a therapeutic soak.', altitude: '1,982m' },
  { day: 'Day 3', location: 'Gaurikund → Kedarnath (Trek)', details: 'The main trek: 16–17km, 6–8 hrs. Start no later than 6am. Trail: Gaurikund → Jungle Chatti (4km) → Bheembali (7km) → Lincholi (9km) → Kedarnath (16km). Horse/pony (₹2,500–₹3,500 one way), helicopter (₹6,000–₹9,000 one way), or palanquin (doli, ₹5,000+) are alternatives. Reach by early afternoon if trekking. Check in, rest, acclimatize.', altitude: '3,583m' },
  { day: 'Day 4', location: 'Kedarnath Temple Darshan', details: 'Wake at 4am for Abhishek Puja (₹1,500–₹2,500, pre-booked via devsthanamboard.uk.gov.in). Temple opens ~4am. VIP/special darshan passes available. After darshan, visit Bhairavnath Temple above the main town (30-min hike, great views). Optional: walk to Gandhi Sarovar lake or Shankar Samadhi. Begin descent by 2pm for safety.', altitude: '3,583m' },
  { day: 'Day 5', location: 'Kedarnath → Gaurikund → Sonprayag → Rudraprayag', details: 'Early morning descent to Gaurikund (16km, ~4–5 hrs). Jeep from Gaurikund to Sonprayag. Continue to Rudraprayag for night (or push to Haridwar if energy permits). Rudraprayag sits at the confluence of Alaknanda and Mandakini rivers — beautiful spot.', altitude: '895m' },
  { day: 'Day 6', location: 'Rudraprayag → Delhi', details: 'Drive Rudraprayag to Haridwar (~170km, 4.5 hrs). Train or bus from Haridwar/Rishikesh to Delhi. Alternatively, extend trip to visit Badrinath (via Joshimath, add 2 days for a Char Dham start).', altitude: 'Delhi: 220m' },
];

const packingList = [
  { cat: 'Clothing', items: ['Thermal innerwear (top and bottom)', 'Heavy fleece jacket', 'Waterproof windcheater/rain jacket', 'Full-sleeve trekking shirts (2–3)', 'Thick trekking trousers', 'Warm socks (4 pairs minimum)', 'Gloves and woollen cap', 'Gumboots/waterproof trekking shoes'] },
  { cat: 'Trek Gear', items: ['Trekking pole (reduces knee strain by 30%)', 'Day backpack 25–35L with rain cover', 'Headlamp with extra batteries', 'Energy bars, dry fruits, chikki for the trail', 'Reusable water bottle (2L minimum)'] },
  { cat: 'Medical', items: ['Diamox (altitude sickness — consult doctor)', 'Sorbiline / ORS packets for hydration', 'Paracetamol, ibuprofen, antacid', 'Bandages and antiseptic cream', 'Knee support brace if you have old injuries'] },
  { cat: 'Documents', items: ['Aadhar card (original + copy, mandatory)', 'Printed Yatra registration slip', 'Hotel booking confirmations', 'Emergency contact list (offline copy)'] },
];

const faqs = [
  {
    question: "When does Kedarnath open in 2026?",
    answer: "Kedarnath temple typically opens on Akshaya Tritiya (late April or early May) and closes on Bhai Dooj (late October or early November). The exact 2026 dates will be announced by the Badrinath-Kedarnath Temple Committee (BKTC) around January–February 2026. Check devsthanamboard.uk.gov.in for official dates. The best months to visit are May–June and September–October.",
  },
  {
    question: "How do I register for Kedarnath Yatra 2026?",
    answer: "Online registration is mandatory. Register at registrationandtouristcare.uk.gov.in. You need your Aadhar number, a passport-size photo, and a mobile number. Registration opens a few weeks before the temple's inauguration date. After registration, you'll receive a slip with your darshan date/time. Carry a printed copy and your original Aadhar on the yatra. Walk-in registration is also available at Haridwar, Rishikesh, and Sonprayag counters.",
  },
  {
    question: "How hard is the Kedarnath trek? Can elderly people do it?",
    answer: "The Gaurikund to Kedarnath trek is 16–17km with a steep elevation gain (from 1,982m to 3,583m). For a fit person, it takes 5–7 hours. Elderly people and those with health conditions should take a pony (₹2,500–₹3,500 one way), helicopter (₹6,000–₹9,000, book ahead), or palanquin (doli). The path is well-maintained with dhabas and rest points every 2–3km. Do not underestimate altitude — anyone with heart or respiratory conditions should consult a doctor before the trek.",
  },
  {
    question: "What is the total budget for Kedarnath Yatra from Delhi?",
    answer: "Budget yatra: ₹6,000–₹10,000 per person (sleeper train, shared transport, basic accommodation, trek on foot). Mid-range: ₹15,000–₹22,000 (AC train, decent hotels, pony for the trek, puja booking). Comfortable: ₹30,000–₹50,000 (flight to Dehradun, private cab, hotel + helicopter at Kedarnath). Helicopter packages from Guptkashi or Phata: ₹9,000–₹15,000 per person for a return flight — significant cost but worth it for elderly or unfit pilgrims.",
  },
  {
    question: "Is Kedarnath safe? What should I be careful about?",
    answer: "Yes, Kedarnath is safe with proper preparation. Key precautions: Start the trek early (by 6am) — afternoon weather can change suddenly with rain and thunderstorms. Don't stop at the summit if you feel breathless — descent is the immediate cure for altitude sickness symptoms. Drink 3–4 litres of water daily. Avoid alcohol (dehydrating at altitude). Trust the SDRF (State Disaster Response Force) rescue teams present throughout the route. Always carry your registration slip and ID. The 2013 cloudbursts are not a typical occurrence — but check weather before travel June–August.",
  },
];

export default function KedarnathYatraGuide() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Kedarnath Yatra Guide', url: 'https://www.ylootrips.com/blogs/kedarnath-yatra-guide' },
      ]} />
      <ArticleJsonLd
        headline="Kedarnath Yatra 2026 — Complete Guide (Registration, Trek, Budget & Tips)"
        description="Complete Kedarnath Yatra guide 2026: online registration, trek route, budget, packing list, and tips for first-time pilgrims."
        url="https://www.ylootrips.com/blogs/kedarnath-yatra-guide"
        image="https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80"
        datePublished="2025-04-12"
        dateModified="2026-01-01"
        keywords={['Kedarnath Yatra 2026', 'Kedarnath registration', 'Kedarnath trek', 'Gaurikund trek', 'Kedarnath budget']}
        authorName="Priya Verma"
        authorUrl="https://www.ylootrips.com/blogs/authors/priya-verma"
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80"
          alt="Kedarnath temple with snow-capped Himalayan peaks"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/65" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-cream/70 uppercase tracking-widest text-xs mb-4 font-medium">Pilgrimage Guide · April 2026</span>
          <h1 className="font-display text-3xl md:text-5xl text-cream max-w-3xl leading-tight">
            Kedarnath Yatra 2026
          </h1>
          <p className="text-cream/80 mt-4 max-w-xl text-sm md:text-base">Complete Guide — Registration, Trek, Budget &amp; Tips</p>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 text-caption text-primary/40 uppercase tracking-wider mb-8">
          <span className="flex items-center gap-1"><Clock size={12} /> 13 min read</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> Uttarakhand, India · 3,583m</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> Updated April 2026</span>
        </div>

        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Kedarnath is one of the 12 Jyotirlingas and a site of immense spiritual significance for Hindus. At 3,583 metres, cradled by snow-capped Himalayan peaks, the ancient temple is both a pilgrimage and an adventure. This guide covers everything — registration to darshan, trek logistics to budget.
        </p>

        <div className="text-primary/75 space-y-10">

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Registration: The First Step</h2>
            <div className="not-prose bg-amber-50 border border-amber-200 p-5 mb-4">
              <p className="font-medium text-primary text-sm mb-1">Registration is mandatory in 2026</p>
              <p className="text-sm text-primary/65">You cannot proceed to the yatra route without a valid registration slip. Register online well before your trip.</p>
            </div>
            <ul className="space-y-3">
              {[
                { step: 'Website', detail: 'Register at registrationandtouristcare.uk.gov.in — official Uttarakhand Tourism portal.' },
                { step: 'Required documents', detail: 'Aadhar card number (mandatory), passport-size photo, active mobile number for OTP.' },
                { step: 'Timing', detail: 'Registration opens ~2–4 weeks before the temple opening date. Check BKTC announcements in February 2026.' },
                { step: 'Offline option', detail: 'Registration counters at Haridwar, Rishikesh, Sonprayag, and Gaurikund for those without internet access.' },
                { step: 'Puja booking', detail: 'Special pujas (Abhishek, Rudrabhishek) can be booked separately on devsthanamboard.uk.gov.in. Do this early — slots fill within hours of opening.' },
              ].map(({ step, detail }) => (
                <li key={step} className="flex items-start gap-3 text-sm text-primary/70">
                  <ArrowRight size={14} className="text-accent mt-0.5 shrink-0" />
                  <div><strong className="text-primary">{step}:</strong> {detail}</div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">How to Reach Kedarnath</h2>
            <div className="not-prose space-y-3">
              {[
                { route: 'By Train', detail: 'Take a train to Haridwar (well-connected from Delhi, Mumbai, Lucknow). From Haridwar, drive ~230km to Sonprayag (7–8 hrs by shared taxi or private cab).' },
                { route: 'By Flight', detail: 'Fly to Jolly Grant Airport, Dehradun (1 hr from Delhi). Then drive to Haridwar (1 hr) and onward to Sonprayag.' },
                { route: 'By Road', detail: 'Delhi → Haridwar (230km, 5 hrs) → Srinagar (Garhwal) → Rudraprayag → Sonprayag. NH 58 is well-maintained. Shared taxis available throughout.' },
                { route: 'By Helicopter', detail: 'Helicopter services operate from Guptkashi, Sirsi, and Phata to Kedarnath. Return fare: ₹9,000–₹15,000. IRCTC and private operators offer packages. Book at irctc.co.in or pawanhanstourism.in.' },
              ].map(({ route, detail }) => (
                <div key={route} className="border-l-2 border-accent pl-4">
                  <div className="font-medium text-primary text-sm">{route}</div>
                  <p className="text-sm text-primary/65">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Day-by-Day Trek & Yatra Plan</h2>
            <div className="not-prose space-y-3">
              {trekItinerary.map((day) => (
                <div key={day.day} className="border border-primary/10 bg-cream-light p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-secondary text-sm">{day.day}</span>
                      <span className="font-medium text-primary text-sm">{day.location}</span>
                    </div>
                    <span className="text-caption text-primary/40">Alt: {day.altitude}</span>
                  </div>
                  <p className="text-sm text-primary/65 leading-relaxed">{day.details}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Accommodation Along the Route</h2>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Location</th>
                    <th className="text-left p-3 font-medium">Options</th>
                    <th className="text-left p-3 font-medium">Price Range</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { loc: 'Haridwar / Rishikesh', opts: 'Budget guesthouses to mid-range hotels', price: '₹500–₹3,000/night' },
                    { loc: 'Sonprayag', opts: 'Basic lodges, dharamshalas', price: '₹400–₹1,200/night' },
                    { loc: 'Gaurikund', opts: 'GMVN tourist rest house, private lodges', price: '₹600–₹1,500/night' },
                    { loc: 'Kedarnath (at top)', opts: 'GMVN deluxe tents, private lodges, dharamshalas', price: '₹800–₹3,500/night' },
                    { loc: 'Kedarnath GMVN Deluxe Camp', opts: 'Furnished tents with meals (book ahead)', price: '₹2,500–₹4,000/night' },
                  ].map((row, i) => (
                    <tr key={row.loc} className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-light'}>
                      <td className="p-3 font-medium text-primary border-b border-primary/10">{row.loc}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.opts}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-primary/60 italic">Book GMVN accommodation at gmvnl.com. Private bookings available on MakeMyTrip and Booking.com for lower sections. At Kedarnath itself, always book in advance — demand far exceeds supply during peak season.</p>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Packing List</h2>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4">
              {packingList.map(({ cat, items }) => (
                <div key={cat} className="border border-primary/10 bg-cream-light p-4">
                  <div className="font-medium text-primary text-sm mb-2">{cat}</div>
                  <ul className="space-y-1">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-primary/65">
                        <CheckCircle size={12} className="text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">Budget Breakdown</h2>
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
                    { cat: 'Delhi–Haridwar train (return)', budget: '₹800–₹1,400', mid: '₹2,000–₹3,500 (AC)' },
                    { cat: 'Haridwar–Sonprayag transport', budget: '₹400–₹700 (shared)', mid: '₹2,500–₹4,000 (private cab)' },
                    { cat: 'Accommodation (4 nights)', budget: '₹2,000–₹4,000', mid: '₹6,000–₹12,000' },
                    { cat: 'Food (6 days)', budget: '₹1,800–₹2,500', mid: '₹3,500–₹5,000' },
                    { cat: 'Trek (on foot)', budget: '₹0', mid: '₹2,500–₹3,500 (pony)' },
                    { cat: 'Puja & darshan fees', budget: '₹500–₹1,000', mid: '₹2,000–₹5,000' },
                    { cat: 'Helicopter (optional)', budget: '—', mid: '₹9,000–₹15,000 (return)' },
                    { cat: 'Total (without helicopter)', budget: '₹5,500–₹9,600', mid: '₹16,000–₹28,000' },
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
            <h2 className="font-display text-3xl text-primary mb-4">Do&apos;s and Don&apos;ts</h2>
            <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-green-600 text-sm mb-2 uppercase tracking-wider">Do&apos;s</div>
                <ul className="space-y-2">
                  {[
                    'Start the trek by 5–6am to reach before afternoon weather turns',
                    'Drink 4–5 litres of water daily on the trail',
                    'Carry printed registration and original Aadhar',
                    'Acclimatize at Gaurikund for 1 hour before the trek',
                    'Respect the temple rules — modest clothing, no leather inside',
                    'Descend if you experience severe headache or breathlessness',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-primary/65">
                      <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium text-red-500 text-sm mb-2 uppercase tracking-wider">Don&apos;ts</div>
                <ul className="space-y-2">
                  {[
                    'Don\'t trek alone without informing someone of your plan',
                    'Don\'t push through altitude sickness — descend immediately',
                    'Don\'t carry non-biodegradable waste — the mountain is sacred',
                    'Don\'t underestimate the cold — it can snow even in June at the top',
                    'Don\'t skip Gaurikund hot springs — it genuinely helps before the climb',
                    'Don\'t hire unregistered ponies — choose operators with visible ID badges',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-primary/65">
                      <span className="text-red-400 font-bold shrink-0 mt-0.5">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-sm p-6 not-prose">
            <div className="flex items-start gap-3">
              <MessageCircle className="text-green-600 shrink-0 mt-1" size={20} />
              <div>
                <p className="font-medium text-primary mb-1">Plan your Kedarnath Yatra with YlooTrips</p>
                <p className="text-sm text-primary/65 mb-4">We handle registration, verified accommodation, private transfers, and helicopter bookings. WhatsApp us your yatra dates for a complete itinerary.</p>
                <a
                  href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20plan%20a%20Kedarnath%20Yatra."
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
              { title: 'Long Weekend Getaways from Delhi 2026', href: '/blogs/long-weekend-getaways-delhi' },
              { title: 'Manali Trip Guide 2026 — Summer & Winter', href: '/blogs/manali-trip-guide' },
              { title: 'Kashmir Travel Guide 2026 — Complete Itinerary', href: '/blogs/kashmir-travel-guide' },
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
