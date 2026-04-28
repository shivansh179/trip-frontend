import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';
import { MessageCircle, MapPin, Clock, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: "20 Best Long Weekend Getaways from Delhi 2026 — Under 500km",
  description: "20 best weekend trips from Delhi in 2026: Agra, Jaipur, Rishikesh, Manali, Shimla, Jim Corbett, Nainital, Mussoorie, Mathura, Haridwar, Kasauli and more — grouped by distance and drive time.",
  keywords: "long weekend getaways from Delhi, weekend trips from Delhi 2026, places to visit near Delhi under 500km, Delhi weekend trip, Rishikesh from Delhi, Shimla from Delhi, Jim Corbett from Delhi, short trips from Delhi",
  openGraph: {
    title: "20 Best Long Weekend Getaways from Delhi 2026 — Under 500km",
    description: "Best weekend getaways from Delhi grouped by distance: under 3 hours, 3–5 hours, and 5–8 hours drive. All under 500km.",
    url: "https://www.ylootrips.com/blogs/long-weekend-getaways-delhi",
    type: "article",
    images: [
      {
        url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "India Gate Delhi — gateway to weekend getaways across North India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "20 Best Long Weekend Getaways from Delhi 2026",
    description: "20 weekend trips from Delhi ranked by distance — Agra, Rishikesh, Shimla, Manali, Jim Corbett, Nainital and more.",
    images: ["https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80"],
  },
  alternates: { canonical: "https://www.ylootrips.com/blogs/long-weekend-getaways-delhi" },
};

const under3hrs = [
  { name: 'Agra', dist: '230km · ~3 hrs', desc: 'Taj Mahal at sunrise, Agra Fort, Fatehpur Sikri, Mehtab Bagh for the perfect Taj reflection shot. Go on a Thursday (Taj closed Friday) or weekend. Avoid public holidays.', best: 'Oct–Mar' },
  { name: 'Mathura & Vrindavan', dist: '160km · ~2.5 hrs', desc: 'Krishna\'s birthplace. Vrindavan\'s 5,000 temples, Holi festival in March (the most intense in India), Banke Bihari Temple. Best for a spiritual short break.', best: 'Oct–Mar, Holi' },
  { name: 'Alwar & Sariska', dist: '160km · ~2.5 hrs', desc: 'Sariska Tiger Reserve — the closest tiger reserve to Delhi. Bhangarh Fort (reputedly India\'s most haunted). Siliserh Lake palace hotel. Great 1-night trip.', best: 'Oct–Apr' },
  { name: 'Bharatpur Bird Sanctuary', dist: '180km · ~2.5 hrs', desc: 'Keoladeo Ghana National Park — a UNESCO site. In winter (November–February), thousands of migratory birds including Siberian cranes. Bicycle hire available inside.', best: 'Nov–Feb' },
  { name: 'Neemrana Fort', dist: '125km · ~2 hrs', desc: 'A magnificent 15th-century stepwell fort converted into a heritage hotel. Even if not staying, a day trip for a heritage meal and fort exploration is worth it. Day-tripper entry allowed.', best: 'Oct–Mar' },
];

const hrs3to5 = [
  { name: 'Jaipur', dist: '280km · ~4.5 hrs', desc: 'The Pink City. Amber Fort, Hawa Mahal, City Palace, Nahargarh sunset, the best dal baati churma of your life. 2 nights minimum. Rajasthan state bus or IRCTC train from Delhi.', best: 'Oct–Mar' },
  { name: 'Rishikesh', dist: '240km · ~4.5 hrs', desc: 'White-water rafting, bungee jumping, Beatles Ashram, Triveni Ghat aarti at sunset, Ram Jhula. Best for adventure seekers and yoga lovers. Combine with Haridwar for 2 nights.', best: 'Sep–Jun' },
  { name: 'Haridwar', dist: '220km · ~4 hrs', desc: 'Har Ki Pauri ghat aarti — one of the most spiritually overwhelming experiences in India. Best visited alongside Rishikesh. Arrive by evening for the sunset Ganga Aarti.', best: 'Year-round' },
  { name: 'Jim Corbett National Park', dist: '260km · ~4.5 hrs', desc: 'India\'s oldest national park, home to Bengal tigers, elephants, leopards. Safari zones: Bijrani, Dhikala, Jhirna. Book safaris and accommodation 4–6 weeks ahead. 2 nights minimum.', best: 'Oct–Jun' },
  { name: 'Lansdowne', dist: '250km · ~4.5 hrs', desc: 'A quiet, unspoilt cantonment hill station at 1,706m — no crowds, no traffic jams, pine forests, and colonial churches. Perfect for those who find Mussoorie too busy.', best: 'Year-round' },
  { name: 'Kasauli', dist: '295km · ~4.5 hrs', desc: 'A compact Himachal hill town with a colonial English feel — narrow lanes, Victorian bungalows, pine forests. Gilbert Trail offers magnificent valley views. Far more peaceful than Shimla.', best: 'Mar–Jun, Sep–Nov' },
  { name: 'Chakrata', dist: '320km · ~5 hrs', desc: 'Uttarakhand\'s best-kept secret hill station at 2,118m. Dense oak forests, Tiger Falls (Asia\'s highest waterfall), no crowds, great camping spots. Ideal for nature lovers.', best: 'Mar–Jun, Sep–Nov' },
];

const hrs5to8 = [
  { name: 'Nainital', dist: '310km · ~6 hrs', desc: 'The iconic lake hill station — Naini Lake, boating, Mall Road, Snow View Point, Nainital Zoo. Cable car for panoramic views. Peak season June–July — visit in May or October instead.', best: 'Mar–Jun, Sep–Nov' },
  { name: 'Mussoorie', dist: '295km · ~5.5 hrs', desc: 'The Queen of Hills. Kempty Falls, Gun Hill, Camelback Road walk at dusk, Lal Tibba viewpoint on a clear day. Heritage Savoy Hotel for old-world charm. Better mid-week to avoid weekend crowds.', best: 'Mar–Jun, Sep–Nov' },
  { name: 'Shimla', dist: '370km · ~7 hrs by road', desc: 'The most famous hill station in North India. Mall Road, Jakhu Temple (beware the monkeys), toy train from Kalka (5 hrs — worth it for the experience), Colonial architecture, apple orchards in spring.', best: 'Mar–Jun, Dec–Jan' },
  { name: 'Dalhousie & Khajjiar', dist: '560km · ~9 hrs', desc: 'Khajjiar is called the Switzerland of India — rolling green meadow surrounded by deodar cedar forest and a lake. Combine with Dalhousie (colonial hill station). Best paired with an overnight train to Pathankot then drive.', best: 'Mar–Jun, Sep–Nov' },
  { name: 'Manali', dist: '545km · ~12 hrs overnight bus', desc: 'Worth the long journey — snow, adventure, mountains, monasteries, Rohtang Pass. Take the overnight Volvo (₹900–₹1,500, depart 6pm, arrive 8am) and you save both time and a hotel night.', best: 'Mar–Oct, Dec–Jan' },
  { name: 'Amritsar', dist: '450km · ~6.5 hrs', desc: 'Golden Temple — one of the most peaceful and awe-inspiring places in India. Attari-Wagah border ceremony at sunset. Kulcha and amritsari fish. Jallianwala Bagh. 2 nights perfectly placed.', best: 'Oct–Mar' },
  { name: 'Pushkar', dist: '400km · ~6 hrs', desc: 'One of the world\'s oldest cities, built around the sacred Pushkar Lake. Brahma Temple (one of few in India), camel rides on the dunes, Pushkar Camel Fair in November. Distinct spiritual energy.', best: 'Oct–Mar, Nov (Camel Fair)' },
  { name: 'Ranthambore', dist: '390km · ~5.5 hrs', desc: 'India\'s most photogenic tiger reserve — ancient fort ruins inside the park, high tiger sighting probability. Book safaris months in advance for peak season. Stay inside the reserve zone for best experience.', best: 'Oct–Jun' },
];

const faqs = [
  {
    question: "Which is the best weekend trip from Delhi under 300km?",
    answer: "Agra (230km, 3 hrs) for the Taj Mahal. Mathura-Vrindavan (160km, 2.5 hrs) for a spiritual break. Neemrana (125km, 2 hrs) for heritage and relaxation. Bharatpur (180km, 2.5 hrs) for birdwatching. Rishikesh (240km, 4.5 hrs) for adventure. All are doable as 1-night or 2-night weekend trips without exhaustion.",
  },
  {
    question: "Can I do Manali as a weekend trip from Delhi?",
    answer: "A long weekend (4 days) is the bare minimum for Manali from Delhi. Take the overnight bus Friday evening (departs ~6pm, arrives ~8am Saturday), giving you Saturday and Sunday in Manali, and the overnight bus back Sunday night arriving Delhi Monday morning. Doable but rushed. Recommended: 5–7 days for Manali to actually enjoy it.",
  },
  {
    question: "What is the best season for weekend trips from Delhi?",
    answer: "October–March is ideal for plains destinations (Agra, Jaipur, Amritsar, Ranthambore). March–June for hill stations (Shimla, Mussoorie, Nainital, Manali, Kasauli). September–November for Uttarakhand (Rishikesh, Jim Corbett, Lansdowne). Delhi summers (May–June) mean hill stations become very crowded — book well in advance.",
  },
  {
    question: "Which weekend trip from Delhi is best for couples?",
    answer: "Agra (Taj Mahal at sunrise — one of the most romantic moments possible), Mussoorie or Kasauli (hill station romance, misty walks), Neemrana Fort (heritage hotel stay in a 15th-century fort), Jim Corbett (wildlife safari adventure), or Rishikesh (riverside glamping and yoga). For a slightly longer trip: Jaipur is endlessly romantic with palace hotels.",
  },
  {
    question: "How do I travel between Delhi and Rishikesh cheaply?",
    answer: "Bus is the most economical: UPSRTC/GMOU Volvo from ISBT Kashmiri Gate (₹400–₹600 one way, ~4.5 hrs). Train: Haridwar Express from New Delhi station, then local bus/taxi to Rishikesh (₹350–₹600, 5–6 hrs total). Shared taxi from Haridwar: ₹100–₹150 per person. Avoid private taxis from Delhi (₹2,500–₹4,000 one way) unless traveling in a group of 4+.",
  },
];

export default function LongWeekendGetawaysDelhi() {
  return (
    <article className="bg-cream min-h-screen">
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Blog', url: 'https://www.ylootrips.com/blogs' },
        { name: 'Long Weekend Getaways from Delhi', url: 'https://www.ylootrips.com/blogs/long-weekend-getaways-delhi' },
      ]} />
      <ArticleJsonLd
        headline="20 Best Long Weekend Getaways from Delhi 2026 — Under 500km"
        description="20 best weekend getaways from Delhi grouped by distance: Agra, Jaipur, Rishikesh, Shimla, Jim Corbett, Nainital, Mussoorie, Amritsar and more."
        url="https://www.ylootrips.com/blogs/long-weekend-getaways-delhi"
        image="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80"
        datePublished="2025-04-12"
        dateModified="2026-01-01"
        keywords={['weekend trips from Delhi', 'long weekend getaways Delhi', 'places near Delhi', 'Delhi weekend trip 2026']}
        authorName="Sneha Joshi"
        authorUrl="https://www.ylootrips.com/authors/sneha-joshi"
      />
      <FaqJsonLd faqs={faqs} />

      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80"
          alt="India Gate Delhi at dusk"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-cream/70 uppercase tracking-widest text-xs mb-4 font-medium">Weekend Trips · April 2026</span>
          <h1 className="font-display text-3xl md:text-5xl text-cream max-w-3xl leading-tight">
            20 Best Long Weekend Getaways from Delhi 2026
          </h1>
          <p className="text-cream/80 mt-4 max-w-xl text-sm md:text-base">Under 500km — Grouped by Drive Time</p>
        </div>
      </div>

      <div className="section-container py-12 md:py-16 max-w-3xl">
        <div className="flex flex-wrap items-center gap-4 text-caption text-primary/40 uppercase tracking-wider mb-8">
          <span className="flex items-center gap-1"><Clock size={12} /> 11 min read</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> Delhi NCR, India</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> Updated April 2026</span>
        </div>

        <p className="text-body-lg text-primary/70 mb-10 leading-relaxed">
          Delhi sits at the centre of some of the most diverse travel terrain in India — Rajasthan deserts to the southwest, Himalayan foothills to the north, the sacred Gangetic plains to the east. You&apos;re never more than a few hours from something extraordinary. Here are 20 of the best weekend escapes, organized by how long it takes to get there.
        </p>

        <div className="text-primary/75 space-y-12">

          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">Under 3 Hours</div>
              <div className="text-sm text-primary/50">Quick escapes — ideal for a Saturday–Sunday trip</div>
            </div>
            <div className="not-prose space-y-4">
              {under3hrs.map((place) => (
                <div key={place.name} className="border border-primary/10 bg-cream-light p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                    <h3 className="font-medium text-primary">{place.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-caption text-primary/40">{place.dist}</span>
                      <span className="text-caption text-secondary uppercase tracking-wider">Best: {place.best}</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary/65">{place.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">3–5 Hours</div>
              <div className="text-sm text-primary/50">Long weekend territory — 2 nights recommended</div>
            </div>
            <div className="not-prose space-y-4">
              {hrs3to5.map((place) => (
                <div key={place.name} className="border border-primary/10 bg-cream-light p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                    <h3 className="font-medium text-primary">{place.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-caption text-primary/40">{place.dist}</span>
                      <span className="text-caption text-secondary uppercase tracking-wider">Best: {place.best}</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary/65">{place.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">5–8+ Hours</div>
              <div className="text-sm text-primary/50">For 4-day long weekends or overnight travel — worth every km</div>
            </div>
            <div className="not-prose space-y-4">
              {hrs5to8.map((place) => (
                <div key={place.name} className="border border-primary/10 bg-cream-light p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                    <h3 className="font-medium text-primary">{place.name}</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-caption text-primary/40">{place.dist}</span>
                      <span className="text-caption text-secondary uppercase tracking-wider">Best: {place.best}</span>
                    </div>
                  </div>
                  <p className="text-sm text-primary/65">{place.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-3xl text-primary mb-4">2026 Long Weekend Dates to Plan Around</h2>
            <div className="not-prose overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-primary text-cream">
                    <th className="text-left p-3 font-medium">Holiday</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-left p-3 font-medium">Long Weekend</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { holiday: 'Republic Day', date: '26 Jan (Mon)', weekend: '24–27 Jan (4 days)' },
                    { holiday: 'Holi', date: '2 Mar (Mon)', weekend: '28 Feb–3 Mar (4 days)' },
                    { holiday: 'Ram Navami', date: '27 Mar (Fri)', weekend: '27–29 Mar (3 days)' },
                    { holiday: 'Ambedkar Jayanti', date: '14 Apr (Tue)', weekend: '12–14 Apr (3 days)' },
                    { holiday: 'Independence Day', date: '15 Aug (Sat)', weekend: '15–17 Aug (3 days)' },
                    { holiday: 'Gandhi Jayanti', date: '2 Oct (Fri)', weekend: '2–5 Oct (4 days)' },
                    { holiday: 'Diwali', date: '19 Oct (Mon)', weekend: '18–21 Oct (4 days)' },
                    { holiday: 'Christmas', date: '25 Dec (Thu)', weekend: '25–28 Dec (4 days)' },
                  ].map((row, i) => (
                    <tr key={row.holiday} className={i % 2 === 0 ? 'bg-cream' : 'bg-cream-light'}>
                      <td className="p-3 font-medium text-primary border-b border-primary/10">{row.holiday}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.date}</td>
                      <td className="p-3 text-primary/70 border-b border-primary/10">{row.weekend}</td>
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
                <p className="font-medium text-primary mb-1">Need help planning your next weekend escape?</p>
                <p className="text-sm text-primary/65 mb-4">Tell us your dates, group size, and which destination interests you — we&apos;ll arrange transfers, hotels, and activities so you just show up and enjoy.</p>
                <a
                  href="https://wa.me/918427831127?text=Hi!%20I%20want%20to%20plan%20a%20weekend%20trip%20from%20Delhi."
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
              { title: 'Kashmir Travel Guide 2026 — Itinerary & Tips', href: '/blogs/kashmir-travel-guide' },
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
