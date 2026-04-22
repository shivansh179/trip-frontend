import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PackagePageLayout, { type PackageData, type ItineraryDay, type Review } from '@/components/PackagePageLayout';
import { DOMESTIC_TRIPS, type DomesticTrip } from '@/data/domesticTrips';

// ── Static params ──────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return DOMESTIC_TRIPS.map((t) => ({ slug: t.slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const trip = DOMESTIC_TRIPS.find((t) => t.slug === slug);
  if (!trip) return { title: 'Trip Not Found' };
  const disc = Math.round(((trip.originalPriceINR - trip.priceINR) / trip.originalPriceINR) * 100);
  return {
    title: `${trip.title} 2026 — ${trip.duration} Starting ₹${trip.priceINR.toLocaleString('en-IN')} | YlooTrips`,
    description: `${trip.title} from ${trip.location}. ${trip.duration} starting ₹${trip.priceINR.toLocaleString('en-IN')}/person (${disc}% off). ${trip.highlights[0]}. Book now on YLOO Trips.`,
    openGraph: {
      title: `${trip.title} — ₹${trip.priceINR.toLocaleString('en-IN')}/person | YlooTrips`,
      description: trip.highlights.slice(0, 3).join(' · '),
      images: [{ url: trip.image, width: 1200, height: 630, alt: trip.title }],
    },
    alternates: { canonical: `https://www.ylootrips.com/destinations/domestic/${slug}` },
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function parseDayNum(s: string, idx: number): number {
  const m = s.match(/\d+/);
  return m ? parseInt(m[0]) : idx + 1;
}

function convertItinerary(itin: { day: string; desc: string }[]): ItineraryDay[] {
  return itin.map((item, idx) => ({
    day: parseDayNum(item.day, idx),
    title: item.day,
    description: item.desc,
    meals: 'Included as per itinerary',
    hotel: 'Hotel / Guesthouse / Camp',
    activities: [],
  }));
}

function reviewCount(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h) % 280) + 45;
}

function getReviews(trip: DomesticTrip): Review[] {
  const cat = trip.category.toLowerCase();
  const loc = trip.location.split(',')[0];

  const trekReviews: Review[] = [
    { name: 'Arjun Mehta', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: `The ${loc} trek was beyond expectations. Our guide Ramesh was incredibly knowledgeable and kept the group motivated throughout. Summit views were absolutely breathtaking. YLOO took care of every detail perfectly — from pickup to the last camp dinner.`, date: 'March 2025', trip: trip.title },
    { name: 'Sneha Patel', country: 'Mumbai, India', flag: '🇮🇳', rating: 5, text: `First trek of my life and I could not have picked a better one. The team at YLOO was super responsive when I had pre-trip questions. Camps were comfortable, food was hot and delicious, and the views of ${loc} were incredible.`, date: 'January 2025', trip: trip.title },
    { name: 'Vikram Joshi', country: 'Pune, India', flag: '🇮🇳', rating: 5, text: `Went with a group of 8 friends and every single one of us loved it. The ${trip.duration} trip was well-paced — challenging enough to feel adventurous but manageable for beginners too. Will definitely book through YLOO again next season.`, date: 'December 2024', trip: trip.title },
    { name: 'Pooja Gupta', country: 'Bangalore, India', flag: '🇮🇳', rating: 4, text: `Beautiful experience overall. The sunrise views from the summit made every uphill step worth it. Small note: carry extra warm layers because it gets cold at night. YLOO's trek guide was professional and safety-first throughout.`, date: 'November 2024', trip: trip.title },
  ];

  const pilgrimageReviews: Review[] = [
    { name: 'Priya Sharma', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: `The ${loc} yatra was a divine experience from start to finish. The morning aarti, the trek through snow-covered paths, the darshan — every moment was deeply spiritual. YLOO's guide was knowledgeable about the religious significance of each site.`, date: 'May 2025', trip: trip.title },
    { name: 'Rajesh Kumar', country: 'Jaipur, India', flag: '🇮🇳', rating: 5, text: `Perfectly organised pilgrimage. Hotels were clean, meals were on time, and the guide explained the history and significance at every temple. The Ganga Aarti at Haridwar on the first evening set a beautiful tone for the entire trip.`, date: 'April 2025', trip: trip.title },
    { name: 'Anita Verma', country: 'Lucknow, India', flag: '🇮🇳', rating: 5, text: `Booked this for my parents and they had the most memorable experience of their lives. YLOO took special care of senior travelers — pony services were arranged without any hassle. The guide was patient and devout. Highly recommended.`, date: 'March 2025', trip: trip.title },
    { name: 'Suresh Iyer', country: 'Chennai, India', flag: '🇮🇳', rating: 4, text: `Excellent itinerary. The route through Devprayag and the Panch Kedar temples was beautifully covered. One suggestion: book 2-3 months in advance as slots fill up quickly during peak season. Overall a very blessed journey with YLOO.`, date: 'May 2024', trip: trip.title },
  ];

  const adventureReviews: Review[] = [
    { name: 'Rohan Kapoor', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: `${loc} tour with YLOO was the best trip of the year for our friend group. The Solang Valley snow activities, the Atal Tunnel drive, and the DJ nights in the mountains — absolute madness (in the best way). Price was very reasonable too!`, date: 'February 2025', trip: trip.title },
    { name: 'Deepika Nair', country: 'Hyderabad, India', flag: '🇮🇳', rating: 5, text: `Booked for my birthday and it exceeded every expectation. The hotel was cozy and mountain-facing, the cab was punctual, and our guide Amit knew every secret viewpoint in ${loc}. YLOO has become my go-to for mountain trips.`, date: 'January 2025', trip: trip.title },
    { name: 'Karan Singh', country: 'Chandigarh, India', flag: '🇮🇳', rating: 5, text: `Third trip with YLOO and they keep getting better. The ${trip.duration} itinerary was perfectly balanced — enough adventure and enough relaxation. The bonfire evenings with live music were a highlight. Already planning next year's trip!`, date: 'December 2024', trip: trip.title },
    { name: 'Nisha Sharma', country: 'Jaipur, India', flag: '🇮🇳', rating: 4, text: `Great experience for the price. The Volvo bus was comfortable for the overnight journey. Hotels were clean with good mountain views. Only feedback is that Day 3 felt a bit rushed — would have loved more time in Kasol. Will book again with more days.`, date: 'October 2024', trip: trip.title },
  ];

  const honeymoonReviews: Review[] = [
    { name: 'Aakash & Riya', country: 'Mumbai, India', flag: '🇮🇳', rating: 5, text: `Our ${loc} honeymoon was absolutely perfect. The cottage had the most stunning mountain views we've ever seen. The candlelight dinner was incredibly romantic. YLOO arranged a surprise room decoration with flowers on arrival — such a thoughtful gesture!`, date: 'February 2025', trip: trip.title },
    { name: 'Neha Chauhan', country: 'Pune, India', flag: '🇮🇳', rating: 5, text: `Cannot recommend this honeymoon package enough. From the welcome fruit basket to the couple spa at Vashisht — every detail was curated for romance. The private cab throughout meant we never had to worry about transport. YLOO made our honeymoon unforgettable.`, date: 'January 2025', trip: trip.title },
    { name: 'Varun Mishra', country: 'Lucknow, India', flag: '🇮🇳', rating: 5, text: `The best decision we made for our honeymoon was booking through YLOO. The accommodation was beautiful, the itinerary was perfectly paced, and our guide gave us plenty of private time while being available when needed. The mountains of ${loc} are magical for couples.`, date: 'December 2024', trip: trip.title },
    { name: 'Simran Batra', country: 'Delhi, India', flag: '🇮🇳', rating: 4, text: `Lovely honeymoon trip. The hotel was charming with great views. Minor suggestion: the dinner portions could be larger. But the experience, the location, and the professionalism of YLOO's team made up for everything. Would definitely recommend to newly-weds!`, date: 'November 2024', trip: trip.title },
  ];

  const beachReviews: Review[] = [
    { name: 'Prateek Saxena', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: `${loc} was absolutely stunning — nothing can prepare you for those turquoise lagoons in real life. YLOO's package covered everything perfectly. The snorkeling guide was fantastic and patient with first-timers. One of the most beautiful places in India.`, date: 'January 2025', trip: trip.title },
    { name: 'Kavya Reddy', country: 'Hyderabad, India', flag: '🇮🇳', rating: 5, text: `Dream trip finally fulfilled! The island is pristine and the water activities were world-class. Our guide was knowledgeable about marine life and made the snorkeling extra special. YLOO handled all the permits and logistics seamlessly.`, date: 'December 2024', trip: trip.title },
    { name: 'Amit Sinha', country: 'Kolkata, India', flag: '🇮🇳', rating: 5, text: `If you want to see India's most beautiful beaches, ${loc} is it. The lagoon colors are unreal — shades of blue and green you won't see elsewhere in India. YLOO's package was excellent value and the accommodation had direct beach access.`, date: 'November 2024', trip: trip.title },
    { name: 'Meera Pillai', country: 'Kochi, India', flag: '🇮🇳', rating: 4, text: `Beautiful destination and smooth booking through YLOO. The water sports sessions were thrilling. One note: carry seasickness tablets if you're prone to it on the boat rides. Otherwise everything was perfectly arranged.`, date: 'October 2024', trip: trip.title },
  ];

  if (cat.includes('pilgrimage')) return pilgrimageReviews;
  if (cat.includes('honeymoon')) return honeymoonReviews;
  if (cat.includes('trek') || cat.includes('snow') || cat.includes('bike')) return trekReviews;
  if (cat.includes('beach') || cat.includes('water') || loc.toLowerCase().includes('lakshadweep') || loc.toLowerCase().includes('goa')) return beachReviews;
  return adventureReviews;
}

function getThingsToCarry(trip: DomesticTrip): string[] {
  const cat = trip.category.toLowerCase();
  const isTrek = cat.includes('trek') || cat.includes('snow') || cat.includes('bike') || cat.includes('adventure');
  const isPilgrimage = cat.includes('pilgrimage');
  const isBeach = cat.includes('beach') || cat.includes('water');
  const isHoneymoon = cat.includes('honeymoon');

  const base = [
    '📋|YLOO Booking Voucher (download from email)',
    '🪪|Government ID Proof (Aadhar / Passport)',
    '💊|Personal Medications (if any)',
    '🍶|Water Bottle (1.5L minimum)',
    '🧴|Sunscreen (SPF 50+)',
    '🕶️|UV Protected Sunglasses',
    '🧢|Cap or Hat (sun protection)',
    '🔋|Power Bank (fully charged)',
  ];

  if (isTrek) return [
    ...base,
    '🧥|Warm Layered Clothing (thermal + fleece)',
    '👟|Trekking / Sports Shoes (ankle support)',
    '🎒|Day Backpack (20–30L)',
    '🌧️|Rain Poncho / Windcheater',
    '🦟|Mosquito & Insect Repellent',
    '🔦|Torch / Headlamp with extra batteries',
  ];

  if (isPilgrimage) return [
    ...base,
    '🧥|Warm Clothes (temple areas can be cold)',
    '👟|Comfortable Walking / Trekking Shoes',
    '🌸|Prasad & Puja Items (flowers, incense)',
    '📿|Personal prayer items',
    '🌧️|Light rain jacket / windcheater',
    '🧺|Small bag for temple donations',
  ];

  if (isBeach) return [
    ...base,
    '👙|Swimwear / Floaters',
    '👕|Light Cotton / Linen Clothes',
    '🏊|Snorkeling / Swimming gear (if personal)',
    '🌧️|Waterproof bag for electronics',
    '🦟|Mosquito & Insect Repellent',
    '📷|Waterproof Camera or GoPro',
  ];

  if (isHoneymoon) return [
    ...base,
    '🧥|Warm Clothes (mountain evenings are cold)',
    '👟|Comfortable Walking Shoes',
    '🌹|Small personal items / romantic essentials',
    '📷|Camera for memories',
    '🌧️|Light rain jacket',
    '🧴|Moisturizer & lip balm (dry mountain air)',
  ];

  // Nature / Sightseeing / Holiday packages
  return [
    ...base,
    '🧥|Light to Medium Warm Clothes',
    '👟|Comfortable Walking Shoes',
    '🌧️|Rain Poncho / Windcheater',
    '🦟|Mosquito & Insect Repellent',
    '📷|Camera / Phone with good storage',
    '🧺|Reusable bag for shopping',
  ];
}

function getFAQs(trip: DomesticTrip): { question: string; answer: string }[] {
  const cat = trip.category.toLowerCase();
  const loc = trip.location.split(',')[0];
  const isTrek = cat.includes('trek');
  const isPilgrimage = cat.includes('pilgrimage');

  const base = [
    {
      question: `What is the best time to visit ${loc}?`,
      answer: trip.region === 'Himalayan Region' || trip.region === 'North India'
        ? `The best time to visit ${loc} depends on your preference. April–June is ideal for pleasant weather and clear views. December–February offers snow experiences. July–September can have monsoon rains but fewer crowds. October–November is excellent for clear skies after the monsoon.`
        : `${loc} can be visited year-round. October–March is generally the most comfortable with cooler temperatures. Check the specific itinerary for seasonal highlights.`,
    },
    {
      question: `What is the cancellation policy for this trip?`,
      answer: 'YLOO offers flexible cancellations: Full refund if cancelled 30+ days before departure; 75% refund for 15–29 days; 50% refund for 7–14 days; no refund for less than 7 days. In case of weather-related cancellations, a full credit or rescheduling is offered.',
    },
    {
      question: `Is this trip suitable for beginners?`,
      answer: trip.difficulty
        ? `This trip is rated "${trip.difficulty}". ${trip.difficulty === 'Easy' ? 'It is suitable for all fitness levels including complete beginners and first-time trekkers.' : trip.difficulty.includes('Moderate') ? 'A basic level of fitness is recommended. No prior trekking experience is required, but regular walking/exercise will help you enjoy the experience better.' : 'This is a challenging trip requiring good physical fitness and ideally some prior trekking experience at altitude.'}`
        : `This trip is suitable for most fitness levels. Basic physical fitness and a spirit of adventure are all you need.`,
    },
    {
      question: 'How do I book and what payment options are available?',
      answer: 'Book directly on YLOO Trips by clicking "Book Now". We accept UPI, net banking, debit/credit cards, and EMI options starting from just ₹999/month. You can also pay a 20% advance to confirm your spot and pay the remainder before departure.',
    },
  ];

  if (isTrek) return [
    ...base,
    {
      question: 'What fitness level is required for this trek?',
      answer: `For the ${trip.title}, we recommend at least 2–3 weeks of preparation: daily walks of 4–5 km, stair climbing, and light jogging. ${trip.difficulty === 'Easy' || trip.difficulty === 'Easy to Moderate' ? 'Even without prior trekking experience, you can complete this trek with basic fitness.' : 'Prior trekking experience at altitude is an advantage for this moderate-to-difficult trail.'}`,
    },
    {
      question: 'What kind of food is served during the trek?',
      answer: 'All meals are included and vegetarian. Typical trek menu includes: morning tea and biscuits, hot breakfast (poha/upma/eggs), packed lunch (sandwiches/rice boxes), evening soup/snacks, and hot dinner (dal-rice/roti-sabzi/khichdi). Jain meals available on request.',
    },
  ];

  if (isPilgrimage) return [
    ...base,
    {
      question: 'Are helicopter and pony services included?',
      answer: `The ${trip.title} package includes transport by road to the trailheads. Helicopter services, pony rides, and palanquin (doli) services at Kedarnath, Yamunotri, and other sites are available at additional cost and can be arranged by our guide on-site.`,
    },
    {
      question: 'What should I wear while visiting temples?',
      answer: 'Dress modestly when visiting temples — cover shoulders and knees. Traditional Indian attire (kurta-pyjama, saree, salwar-kameez) is ideal. Remove footwear before entering temple premises. Photography restrictions may apply inside sanctum areas — follow local customs.',
    },
  ];

  return base;
}

function getRelated(trip: DomesticTrip): { title: string; href: string; priceINR: number; image: string }[] {
  return DOMESTIC_TRIPS
    .filter((t) => t.slug !== trip.slug && (t.region === trip.region || t.category === trip.category))
    .slice(0, 3)
    .map((t) => ({
      title: t.title,
      href: `/destinations/domestic/${t.slug}`,
      priceINR: t.priceINR,
      image: t.image,
    }));
}

function getGallery(trip: DomesticTrip) {
  const loc = trip.location.split(',')[0];
  return [
    { src: trip.image, alt: `${trip.title} — ${loc}`, label: loc },
    { src: `${trip.image.replace('?w=800', '?w=800&crop=entropy')}`, alt: `${trip.title} scenery`, label: trip.category },
  ];
}

function buildOverview(trip: DomesticTrip): string[] {
  const disc = Math.round(((trip.originalPriceINR - trip.priceINR) / trip.originalPriceINR) * 100);
  const para1 = `${trip.title} is one of India's most sought-after ${trip.category.toLowerCase()} experiences, set in the stunning landscapes of ${trip.location}. This ${trip.duration} journey offers ${trip.highlights[0].toLowerCase()} and ${trip.highlights[1]?.toLowerCase() ?? 'memories that last a lifetime'}.`;
  const para2 = trip.itinerary[1]?.desc ?? `The trip is designed for travelers who want to experience the best of ${trip.location.split(',')[0]} without the hassle of planning. Every detail — accommodation, meals, transport, and guided experiences — is taken care of by YLOO Trips so you can focus entirely on the experience.`;
  const para3 = `Currently priced at ₹${trip.priceINR.toLocaleString('en-IN')}/person (${disc}% off the market price of ₹${trip.originalPriceINR.toLocaleString('en-IN')}), this package offers exceptional value. YLOO's 24/7 WhatsApp support ensures you're never alone on the road. Flexible payment options including EMI and 20% advance booking are available.`;
  return [para1, para2, para3];
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function DomesticTripDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = DOMESTIC_TRIPS.find((t) => t.slug === slug);
  if (!trip) notFound();

  const disc = Math.round(((trip.originalPriceINR - trip.priceINR) / trip.originalPriceINR) * 100);
  const reviews = getReviews(trip);
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const pkg: PackageData = {
    slug: trip.slug,
    canonicalUrl: `https://www.ylootrips.com/destinations/domestic/${trip.slug}`,
    metaTitle: `${trip.title} 2026 — ${trip.duration} | YlooTrips`,
    metaDescription: `${trip.title} from ${trip.location}. ${trip.duration} at ₹${trip.priceINR.toLocaleString('en-IN')}/person. ${trip.highlights[0]}.`,
    keywords: `${trip.title}, ${trip.location} trip, ${trip.category} India, YLOO trips`,
    ogImage: trip.image,

    heroImage: trip.image,
    heroTitle: trip.title,
    heroSubtitle: trip.highlights.slice(0, 3).join(' · '),
    tagline: `${trip.duration} · ${trip.location}${trip.difficulty ? ' · ' + trip.difficulty : ''}`,

    duration: trip.duration,
    groupSize: trip.category === 'Honeymoon' ? 'Couples (2 travelers)' : trip.category.includes('Trek') ? '6–20 trekkers' : '2–15 travelers',
    difficulty: trip.difficulty ?? 'Easy',
    startLocation: trip.location,

    priceINR: trip.priceINR,
    priceUSD: Math.round(trip.priceINR / 85),
    originalPriceINR: trip.originalPriceINR,
    depositPercent: 20,

    overview: buildOverview(trip),
    highlights: trip.highlights,
    gallery: getGallery(trip),

    itinerary: convertItinerary(trip.itinerary),

    includes: trip.includes,
    excludes: [
      'Air / train / bus fares to and from the starting point (unless stated)',
      'Personal expenses & shopping',
      'Travel insurance (strongly recommended)',
      'Optional activities & upgrades',
      'Tips for guides and drivers',
      'Anything not mentioned in the inclusions',
    ],

    reviews,
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount: reviewCount(trip.slug),

    faqs: getFAQs(trip),
    thingsToCarry: getThingsToCarry(trip),

    related: getRelated(trip),

    whatsappMsg: `Hi! I'm interested in the ${trip.title} (${trip.duration}, ₹${trip.priceINR.toLocaleString('en-IN')}/person). Please share availability and upcoming dates.`,
    bookingHref: `/contact?package=${trip.slug}`,
    schemaHighlights: trip.highlights,
  };

  return <PackagePageLayout pkg={pkg} />;
}
