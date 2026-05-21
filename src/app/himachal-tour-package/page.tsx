import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Himachal Pradesh Tour Package 2026 — 5 Nights Starting ₹13,999 | YlooTrips',
  description: 'Book Himachal Pradesh tour packages starting ₹13,999. Manali, Shimla, Kasol, Spiti Valley, Dharamsala. 5 nights / 6 days — mountains, snow, rivers, and monasteries. Flights optional.',
  keywords: 'Himachal Pradesh tour package, Himachal tour package from Delhi, Shimla Manali package, Himachal holiday package 2026, Himachal Pradesh trip cost, Kasol trek package, Dharamsala trip package',
  openGraph: {
    title: 'Himachal Pradesh Tour Package 2026 — 5 Nights Starting ₹13,999',
    description: 'Manali, Shimla, Kasol, Dharamsala — 5 nights covering the best of Himachal Pradesh.',
    url: 'https://www.ylootrips.com/himachal-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80', width: 1200, height: 630, alt: 'Himachal Pradesh mountains snow tour' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/himachal-tour-package' },
};

export default async function HimachalPackagePage() {
  const prices = await getPackagePrice('himachal-tour-package');

  const pkg: PackageData = {
    slug: 'himachal-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/himachal-tour-package',
    metaTitle: 'Himachal Pradesh Tour Package 2026 — 5 Nights Starting ₹13,999 | YlooTrips',
    metaDescription: 'Book Himachal Pradesh tour packages starting ₹13,999. Manali, Shimla, Kasol, Dharamsala — 5 nights across the best mountain destinations.',
    keywords: 'Himachal Pradesh tour package from Delhi, Shimla Manali package',
    ogImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1600&q=85',
    heroTitle: 'Himachal Pradesh Tour Package',
    heroSubtitle: 'Manali · Shimla · Kasol · Dharamsala — Mountains, Snow & Monasteries in 6 Days',
    tagline: "India's Mountain Soul",

    duration: '5 Nights / 6 Days',
    groupSize: 'Solo, Couple, Family or Group',
    difficulty: 'Easy to Moderate',
    startLocation: 'Delhi → Himachal Pradesh',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 25,

    overview: [
      'Himachal Pradesh is India\'s mountain heartland — a state of snow-capped peaks, sacred rivers, ancient monasteries, hill station charm, and adventure at every turn. From the colonial elegance of Shimla to the bohemian backpacker scene of Kasol, from the Buddhist monasteries of Dharamsala to the adventure capital of Manali — Himachal has something for every kind of traveller.',
      'Our 5-night package covers the essential Himachal circuit. You\'ll start in the pleasant hill town of Shimla, pass through the riverside hamlet of Kasol in the Parvati Valley (beloved by trekkers and nature lovers), and end in Manali — with its snow peaks, river crossings, and gateway to Rohtang Pass.',
      'All road transport is in comfortable AC vehicles. Our experienced mountain drivers know these roads intimately. The package is designed for first-time Himachal visitors seeking a comprehensive overview without the exhaustion of a rushed itinerary.',
      'Best months: October–December and March–June. Summer (April–June) is ideal for snow activities. Winter (December–February) brings snowfall but some roads close.',
    ],

    highlights: [
      'Shimla — Mall Road, Christ Church, Jakhu Temple',
      'Kufri — Horse riding, snow activities (seasonal)',
      'Parvati Valley — Kasol riverside, Kheerganga trek',
      'Dharamsala / McLeod Ganj — Dalai Lama\'s residence, Buddhist vibe',
      'Manali — Hadimba Temple, Vashisht hot springs',
      'Solang Valley — zip-lining, paragliding, snow activities',
      'Old Manali — cafes, riverside walks, backpacker culture',
      'Rohtang Pass (seasonal) — snow, glaciers, panoramic views',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80', alt: 'Manali snow mountains Himachal Pradesh', label: 'Manali' },
      { src: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80', alt: 'Shimla Mall Road colonial hill station', label: 'Shimla' },
      { src: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80', alt: 'Kasol Parvati Valley river camp', label: 'Kasol' },
      { src: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800&q=80', alt: 'Dharamsala McLeod Ganj monastery', label: 'Dharamsala' },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Himachal Pradesh mountain landscape snow peaks', label: 'Mountain Views' },
    ],

    itinerary: [
      { day: 1, title: 'Delhi → Shimla — Mall Road & Colonial Charm', description: 'Depart Delhi by overnight Volvo bus or early morning drive. Arrive Shimla by mid-morning. Check in to hotel. Explore the famous Mall Road — the colonial promenade lined with Victorian buildings, cafes, and shops. Visit Christ Church (1857) — the second oldest church in North India. Take the ropeway to Jakhu Hill for views of snow peaks and the giant Hanuman statue. Evening at the Ridge with panoramic views of the mountains.', meals: 'Dinner', hotel: '3★ Hotel in Shimla', activities: ['Shimla Mall Road', 'Christ Church', 'Jakhu Hill', 'The Ridge'] },
      { day: 2, title: 'Shimla — Kufri Day Trip + Scenic Drive', description: 'Morning drive to Kufri (16 km from Shimla, 2,600m) — a small hill resort famous for yak and horse rides, a mini zoo, and panoramic Himalayan views. Continue to Chail — the highest cricket ground in the world (Chail Palace). Afternoon: explore Shimla\'s lower bazaar for Himachali handicrafts, shawls, and woolens. Try a traditional himachali thali for dinner.', meals: 'Breakfast, Dinner', hotel: '3★ Hotel in Shimla', activities: ['Kufri horse/yak rides', 'Chail Palace & cricket ground', 'Shimla bazaar shopping'] },
      { day: 3, title: 'Shimla → Kasol — Parvati Valley Discovery', description: 'Drive to Kasol through the Kullu Valley (5–6 hours). Kasol is a small hamlet on the Parvati River that has become a beloved destination for trekkers, nature lovers, and those seeking a peaceful riverside escape. Check in to a riverside camp or guesthouse. Evening walk along the Parvati River. Try Israeli food at one of Kasol\'s famous cafes — the Israeli influence makes Kasol\'s food scene unique in India.', meals: 'Breakfast', hotel: 'Riverside Camp/Guesthouse in Kasol', activities: ['Parvati Valley drive', 'Kasol riverside walk', 'Israeli cafes', 'Malana Village nearby (optional extra)'] },
      { day: 4, title: 'Kasol → Dharamsala/McLeod Ganj', description: 'Drive to Dharamsala (3–4 hours) — home of the Dalai Lama and the Tibetan government-in-exile. McLeod Ganj (Upper Dharamsala) is the heart of Little Tibet in India. Visit the Tsuglagkhang Complex (Dalai Lama\'s temple and residence). Explore the Tibetan Museum. Browse McLeod Ganj\'s streets for Tibetan handicrafts, prayer flags, and momos. Evening meditation session (optional) at a local Tibetan centre.', meals: 'Breakfast', hotel: '3★ Hotel in McLeod Ganj', activities: ['Tsuglagkhang Temple', 'Tibetan Museum', 'McLeod Ganj market', 'Bhagsu Waterfall'] },
      { day: 5, title: 'Dharamsala → Manali — Adventure Capital Arrival', description: 'Drive to Manali (5–6 hours through Kullu Valley). Stop at Kullu for Kullu shawl factory visit. Arrive Manali and check in. Evening explore Old Manali — the original village with apple orchards, the iconic Manu Maharishi Temple, and the famous backpacker cafes on Manali\'s Old Village Road. Vashisht hot springs for a relaxing soak after the long drive.', meals: 'Breakfast, Dinner', hotel: '3★ Hotel in Manali', activities: ['Kullu shawl factory', 'Old Manali exploration', 'Manu Maharishi Temple', 'Vashisht hot springs'] },
      { day: 6, title: 'Manali — Solang Valley, Hadimba & Return Drive', description: 'Morning at Solang Valley — 14 km from Manali — for adventure activities: zip-lining, rope crossing, and seasonal snow activities. Visit Hadimba Devi Temple (1553) — a unique pagoda-style temple nestled in a cedar forest. Drive to Rohtang Pass (if open, seasonal): 51 km from Manali at 3,978m — dramatic glaciers, barren terrain, and panoramic Himalayan views. Afternoon drive back toward Delhi/Chandigarh.', meals: 'Breakfast', hotel: 'Departure', activities: ['Solang Valley adventure activities', 'Hadimba Devi Temple', 'Rohtang Pass (seasonal)', 'Return journey'] },
    ],

    includes: [
      'All road transport in private AC vehicles throughout',
      '5 nights accommodation (3-star) — Shimla (2N), Kasol (1N), Dharamsala (1N), Manali (1N)',
      'Daily breakfast throughout',
      'Professional mountain driver',
      'Solang Valley adventure activities',
      'Dedicated YlooTrips coordinator',
      '24/7 WhatsApp emergency support',
    ],

    excludes: [
      'Delhi to Shimla transport (overnight Volvo bus ~₹800 each way)',
      'Rohtang Pass permit (₹500/vehicle, seasonal)',
      'Meals except breakfasts and two dinners',
      'Adventure sports (paragliding, trekking gear)',
      'Travel insurance (recommended)',
      'Personal expenses and tips',
    ],

    reviews: [
      { name: 'Amit & Neha Sharma', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'Perfect Himachal trip — Kasol was a hidden gem we hadn\'t expected to love so much. McLeod Ganj was spiritual and beautiful. Manali capped it perfectly. Great value for money.', date: 'May 2026', trip: 'Himachal 5N Package' },
      { name: 'Rahul Verma', country: 'Pune, India', flag: '🇮🇳', rating: 5, text: 'Went with a group of college friends. The Solang Valley activities were incredible and Shimla\'s Mall Road is as good as advertised. YlooTrips made everything seamless.', date: 'April 2026', trip: 'Himachal Group Package' },
      { name: 'Shruti Kapoor', country: 'Mumbai, India', flag: '🇮🇳', rating: 4, text: 'Really well-organised itinerary — covered so much without feeling rushed. Dharamsala was my favourite — the Tibetan culture is unlike anything else in India.', date: 'June 2026', trip: 'Himachal Pradesh Tour Package' },
    ],

    avgRating: 4.8,
    reviewCount: 1840,

    related: [
      { title: 'Manali Tour Package — 4 Nights', href: '/manali-tour-package', priceINR: 6999, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
      { title: 'Kashmir Tour Package — 5 Nights', href: '/kashmir-tour-package', priceINR: 24999, image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80' },
      { title: 'Ladakh Tour Package — 6 Nights', href: '/ladakh-tour-package', priceINR: 22999, image: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Himachal Pradesh Tour Package (5 nights ₹13,999). Please share availability.",
    bookingHref: '/contact?package=himachal-tour-package',

    faqs: [
      { question: 'What is the best time to visit Himachal Pradesh?', answer: 'For snow and cold activities (skiing, snowfall): December–February (roads may close). For trekking and mild weather: March–June and September–November. Avoid July–August (heavy monsoon, landslide risk on some routes). October is the best overall month.' },
      { question: 'Is Himachal Pradesh safe for solo travelers?', answer: 'Yes — Himachal is one of India\'s safest states. The locals are extremely welcoming. Solo female travelers routinely visit Kasol, McLeod Ganj, and Manali independently. Our package provides private transport so you\'re never dependent on shared vehicles.' },
      { question: 'Do I need to carry warm clothes?', answer: 'Yes, even in summer. Nights in Shimla, Kasol, and Manali drop to 8–12°C. Carry a light down jacket or heavy fleece, woollen socks, and a cap. For winter (Dec–Feb) bring thermal inners, heavy jacket, and gloves.' },
      { question: 'Can I extend to include Spiti Valley?', answer: 'Yes — Spiti Valley is one of India\'s most dramatic landscapes. We offer a separate Spiti extension (3 additional nights: Nako → Kaza → Chandratal Lake) — WhatsApp us for a custom quote.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
