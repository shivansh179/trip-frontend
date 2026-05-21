import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Spiti Valley Tour Package 2026 — 7 Nights Starting ₹19,999 | YlooTrips',
  description: 'Book Spiti Valley tour packages starting ₹19,999. Kaza, Key Monastery, Chandratal Lake, Kunzum Pass, Chitkul. 7 nights / 8 days — one of the most dramatic landscapes in India.',
  keywords: 'Spiti Valley tour package, Spiti Valley trip from Delhi, Kaza Spiti tour, Chandratal Lake tour, Key Monastery trip, Spiti Valley road trip, Spiti holiday package 2026, cold desert Himachal Pradesh',
  openGraph: {
    title: 'Spiti Valley Tour Package 2026 — 7 Nights Starting ₹19,999',
    description: 'Kaza, Key Monastery, Chandratal Lake, Kunzum Pass — 7 nights in India\'s remote cold desert.',
    url: 'https://www.ylootrips.com/spiti-valley-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1598346762291-aee88549193f?w=1200&q=80', width: 1200, height: 630, alt: 'Spiti Valley Key Monastery cold desert Himachal' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/spiti-valley-tour-package' },
};

export default async function SpitiPackagePage() {
  const prices = await getPackagePrice('spiti-valley-tour-package');

  const pkg: PackageData = {
    slug: 'spiti-valley-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/spiti-valley-tour-package',
    metaTitle: 'Spiti Valley Tour Package 2026 — 7 Nights Starting ₹19,999 | YlooTrips',
    metaDescription: 'Key Monastery, Chandratal Lake, Kaza, Kunzum Pass — 7 nights across India\'s most dramatic cold desert.',
    keywords: 'Spiti Valley tour package from Delhi, Key Monastery Kaza trip, Chandratal Lake trek',
    ogImage: 'https://images.unsplash.com/photo-1598346762291-aee88549193f?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1598346762291-aee88549193f?w=1600&q=85',
    heroTitle: 'Spiti Valley Tour Package',
    heroSubtitle: 'Kaza · Key Monastery · Chandratal Lake · Kunzum Pass — India\'s Cold Desert in 8 Days',
    tagline: 'The Middle Land Between India and Tibet',

    duration: '7 Nights / 8 Days',
    groupSize: 'Adventure couples, friends, groups',
    difficulty: 'Moderate–Challenging (remote roads)',
    startLocation: 'Shimla → Spiti Valley → Manali circuit',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 30,

    overview: [
      'Spiti Valley is India\'s last great frontier — a remote, high-altitude cold desert in northern Himachal Pradesh, wedged between the Himalayas and Kunlun ranges, bordering Tibet. The landscape is extraordinary: barren ochre mountains, turquoise rivers, 1,000-year-old monasteries perched on impossible cliff edges, and starry nights with no light pollution for hundreds of kilometres.',
      'Spiti is only accessible June–October. The two access routes are via Shimla (Hindustan Tibet Highway — open year-round) or via Manali over Rohtang and Kunzum Passes (open June–October). Our package does the classic Shimla → Spiti → Manali circuit — the most complete way to experience the valley.',
      'This is not a resort package. Accommodation is in homestays, guesthouses, and camp — some without running water. But the trade-off is access to landscapes that genuinely look like Mars, nights with 10,000 stars, and a culture unchanged for centuries. Experienced Spiti drivers are essential — we provide them.',
    ],

    highlights: [
      'Key Monastery — 11th century Buddhist monastery at 4,166m, the most photographed in Spiti',
      'Chandratal Lake (Moon Lake) — stunning crescent-shaped lake at 4,300m',
      'Kunzum La Pass (4,590m) — one of the highest passes in India',
      'Chitkul — the last inhabited Indian village on the Tibetan border',
      'Kibber Village — one of the highest motorable villages in the world',
      'Pin Valley National Park — snow leopard, Himalayan wolf, Ibex',
      'Dhankar Monastery and Dhankar Lake',
      'Tabo Monastery — 1,017-year-old monastery (UNESCO tentative list)',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1598346762291-aee88549193f?w=800&q=80', alt: 'Key Monastery Spiti Valley Himachal Pradesh', label: 'Key Monastery' },
      { src: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80', alt: 'Chandratal Lake Moon Lake Spiti Valley', label: 'Chandratal Lake' },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Spiti Valley cold desert landscape mountains', label: 'Spiti Landscape' },
      { src: 'https://images.unsplash.com/photo-1580580349798-b7d0e9a3c0c2?w=800&q=80', alt: 'Chitkul village last Indian village Tibet border', label: 'Chitkul Village' },
      { src: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800&q=80', alt: 'Tabo Monastery ancient 1000 years Spiti', label: 'Tabo Monastery' },
    ],

    itinerary: [
      { day: 1, title: 'Delhi → Shimla — Gateway to Spiti', description: 'Overnight Volvo bus or drive to Shimla. Check in to hotel. Afternoon: Shimla Mall Road and Jakhu Temple. Begin altitude adjustment (Shimla is at 2,200m).', meals: 'Dinner', hotel: '3★ Hotel in Shimla', activities: ['Shimla Mall Road', 'Jakhu Temple', 'Rest and acclimatisation'] },
      { day: 2, title: 'Shimla → Sangla Valley (Chitkul)', description: 'Drive into the Sangla Valley via Rampur and Jeori. The landscape changes dramatically — from lush Himachal to stark, granite mountains. Visit Chitkul — the last inhabited Indian village on the Indo-Tibetan border. The village is only accessible by one road; beyond it is Tibet and a military restricted zone. Explore the ancient wooden temple. Overnight in a Sangla guesthouse.', meals: 'Breakfast, Dinner', hotel: 'Guesthouse, Sangla Valley', activities: ['Sangla Valley drive', 'Chitkul last village', 'Chitkul wooden temple', 'River views'] },
      { day: 3, title: 'Sangla → Tabo — Ancient Monastery', description: 'Drive to Tabo (via Nako and Hangrang Valley) — one of the most dramatic drives in India. Tabo Monastery (established 996 CE) is one of the oldest continuously functioning Buddhist monasteries in the world. Its cave temples contain 10th-century murals and stucco figures of extraordinary quality. Nako Lake en route. Overnight at Tabo.', meals: 'Breakfast, Dinner', hotel: 'Guesthouse in Tabo', activities: ['Nako Lake', 'Tabo Monastery (996 CE)', 'Cave temples with ancient murals'] },
      { day: 4, title: 'Tabo → Kaza — Spiti\'s Capital', description: 'Drive along the Spiti River to Kaza — the administrative capital of the Spiti Valley (3,800m). En route: Dhankar Monastery (spectacularly perched on a cliff with a small lake above) and Dhankar Lake trek (1.5 hours, excellent views). Afternoon: Kaza market — small but interesting. Ki Monastery visible from Kaza (visit Day 5).', meals: 'Breakfast', hotel: '3★ Guesthouse in Kaza', activities: ['Spiti River drive', 'Dhankar Monastery', 'Dhankar Lake trek', 'Kaza market'] },
      { day: 5, title: 'Kaza — Key Monastery, Kibber & Hikkim', description: 'The best day of the trip. Key Monastery (4,166m) — the iconic white monastery rising from a triangular hillock, home to 300 monks. Sunrise at Key is magical. Kibber Village (4,200m) — one of the highest motorable villages in the world. Hikkim has the world\'s highest post office — send a postcard! Komik has the world\'s highest monastery accessible by road. Pin Valley road crossing (snow leopard territory — spotting is rare but possible).', meals: 'Breakfast, Dinner', hotel: '3★ Guesthouse in Kaza', activities: ['Key Monastery', 'Kibber Village', 'Hikkim Post Office (highest in world)', 'Komik Monastery', 'Pin Valley'] },
      { day: 6, title: 'Kaza → Chandratal Lake (Moon Lake)', description: 'Drive towards Kunzum Pass (4,590m) via Batal. The road is rough and remote — prepare for adventure. Arrive Chandratal Lake at 4,300m — a crescent-shaped lake of extraordinary turquoise-blue colour. Overnight camping at Chandratal (basic tents, no electricity, no phone signal, 10,000+ stars). The best night of the trip.', meals: 'Breakfast, Dinner', hotel: 'Camping at Chandratal Lake', activities: ['Drive to Kunzum La', 'Chandratal Lake (Moon Lake)', 'Overnight camp', 'Stargazing at 4,300m'] },
      { day: 7, title: 'Chandratal → Manali (via Rohtang Pass)', description: 'Early morning at Chandratal — witness the lake change colour in morning light. Drive to Manali via Rohtang Pass (3,978m) — the high-mountain pass with snow even in July. Descend dramatically into the lush Kullu Valley. Arrive Manali. Hot shower, a proper meal, and rest — well deserved.', meals: 'Breakfast', hotel: '3★ Hotel in Manali', activities: ['Chandratal sunrise', 'Rohtang Pass', 'Kullu Valley descent', 'Manali arrival'] },
      { day: 8, title: 'Manali — Solang Valley & Departure to Delhi', description: 'Morning at Solang Valley for quick adventure activities or just views. Visit Hadimba Devi Temple. Afternoon drive to Delhi (12 hours) or fly from Bhuntar Airport near Kullu. End of an extraordinary journey through India\'s most dramatic landscape.', meals: 'Breakfast', hotel: 'Departure', activities: ['Solang Valley', 'Hadimba Devi Temple', 'Return to Delhi'] },
    ],

    includes: [
      'All road transport in private Innova/Scorpio with experienced Spiti driver',
      '7 nights accommodation: Shimla (1N), Sangla (1N), Tabo (1N), Kaza (2N), Chandratal Camp (1N), Manali (1N)',
      'Daily breakfast + 4 dinners',
      'Chandratal overnight camping (tent, sleeping bag, meals)',
      'Dhankar Lake guided trek',
      'Inner Line Permit documentation assistance',
      'Dedicated YlooTrips Spiti coordinator',
    ],

    excludes: [
      'Delhi–Shimla transport (bus or train)',
      'Manali–Delhi return (bus or flight)',
      'Meals except breakfasts and 4 dinners',
      'Travel insurance (essential — Spiti has no hospitals)',
      'Emergency helicopter (covered by travel insurance)',
    ],

    reviews: [
      { name: 'Arjun & Sanya Batra', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'Spiti is the most beautiful place in India. Period. The Chandratal camp night under the stars was the most incredible experience of our lives. YlooTrips\' driver was a genius on those roads.', date: 'August 2026', trip: 'Spiti Valley 7N Package' },
      { name: 'Nisha Desai', country: 'Ahmedabad, India', flag: '🇮🇳', rating: 5, text: 'I was nervous about the roads but the driver made me feel completely safe. Key Monastery at sunrise alone was worth the entire trip. The stargazing at Chandratal is something I will tell my grandchildren about.', date: 'July 2025', trip: 'Spiti Valley Tour' },
    ],

    avgRating: 4.9,
    reviewCount: 890,

    related: [
      { title: 'Ladakh Tour Package — 6 Nights', href: '/ladakh-tour-package', priceINR: 22999, image: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?w=600&q=80' },
      { title: 'Himachal Tour Package — 5 Nights', href: '/himachal-tour-package', priceINR: 13999, image: 'https://images.unsplash.com/photo-1580889240742-fd4db5f27f8a?w=600&q=80' },
      { title: 'Kashmir Tour Package — 5 Nights', href: '/kashmir-tour-package', priceINR: 24999, image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Spiti Valley Tour Package (7 nights ₹19,999). Please share availability.",
    bookingHref: '/contact?package=spiti-valley-tour-package',

    faqs: [
      { question: 'When is Spiti Valley accessible?', answer: 'June–October via Manali (Rohtang/Kunzum passes open). The Shimla–Spiti route (Hindustan Tibet Highway) is open year-round but difficult in winter. The classic circuit (Shimla in → Manali out) is only possible June–October.' },
      { question: 'How remote is Spiti?', answer: 'Very remote. Mobile networks are unreliable. BSNL works in major villages, Airtel in some areas. There are no hospitals in Spiti — the nearest is Kaza clinic (basic) or Manali. Travel insurance with helicopter evacuation cover is essential.' },
      { question: 'Is this package for physically fit people only?', answer: 'You don\'t need to be an athlete, but basic fitness is required. The Dhankar Lake trek (1.5h) and walking at altitude (4,200m) requires comfort at high elevation. The driving is in rough terrain — be prepared for 8–10 hour driving days on some days.' },
      { question: 'Can I see a snow leopard in Spiti?', answer: 'Snow leopards live in Pin Valley National Park and the higher elevations of Spiti. Sightings are rare (about 10% chance in winter, near-zero in summer when they move higher). However, you\'ll likely see ibex, Tibetan wild ass (kiang), and Himalayan marmot.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
