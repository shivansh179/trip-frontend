import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';

export const metadata: Metadata = {
  title: 'Maldives Luxury Package 2026 — 4 Nights Overwater Villa from ₹89,999 | YlooTrips',
  description: 'Exclusive Maldives luxury packages from India starting ₹89,999. 4 nights in an overwater villa — private plunge pool, snorkeling, dolphin cruise, all-inclusive resort. Flights included.',
  keywords: 'Maldives luxury package India, Maldives overwater villa package, Maldives trip from India 2026, Maldives all inclusive package, Maldives honeymoon package, luxury Maldives holiday',
  openGraph: {
    title: 'Maldives Luxury Package 2026 — Overwater Villa ₹89,999 | YlooTrips',
    description: 'Overwater villa with plunge pool, house reef snorkeling, dolphin cruise, sunset fishing, spa. Ultimate Maldives luxury from India.',
    url: 'https://www.ylootrips.com/maldives-luxury-package',
    images: [{ url: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80', width: 1200, height: 630, alt: 'Maldives overwater villa turquoise lagoon luxury package India' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maldives Luxury Package — Overwater Villa from ₹89,999 | YlooTrips',
    description: 'Overwater villa · Plunge pool · Snorkeling · Dolphin cruise · Spa. The Maldives you always dreamed of.',
    images: ['https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80'],
  },
  alternates: { canonical: 'https://www.ylootrips.com/maldives-luxury-package' },
};

const pkg: PackageData = {
  slug: 'maldives-luxury-package',
  canonicalUrl: 'https://www.ylootrips.com/maldives-luxury-package',
  metaTitle: 'Maldives Luxury Package 2026 — 4 Nights Overwater Villa from ₹89,999',
  metaDescription: 'Exclusive Maldives luxury packages from India starting ₹89,999. 4 nights overwater villa with plunge pool, snorkeling, dolphin cruise. Flights included.',
  keywords: 'Maldives luxury package India',
  ogImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',

  heroImage: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&q=85',
  heroTitle: 'Maldives Luxury Package',
  heroSubtitle: 'Overwater Villas · Crystal Lagoons · Private Plunge Pools · Coral Reefs · Total Seclusion',
  tagline: '4 Nights · Overwater Villa · All-Inclusive',

  duration: '4 Nights / 5 Days',
  groupSize: 'Couples · Honeymooners',
  difficulty: 'Easy — Pure Luxury',
  startLocation: 'Delhi/Mumbai/Chennai → Malé (MLE)',

  priceINR: 89999,
  priceUSD: 1080,
  originalPriceINR: 119999,
  depositPercent: 30,

  overview: [
    'The Maldives is the pinnacle of tropical luxury — 1,192 coral islands scattered across the Indian Ocean like turquoise jewels, each surrounded by lagoons of impossible blue-green water and house reefs teeming with marine life. For Indians, it\'s the closest true luxury paradise: just 4 hours from most major Indian cities, no visa required, and jaw-dropping value compared to European luxury resorts.',
    'Our Maldives luxury package places you in an overwater villa — a traditional Maldivian architectural icon where your bedroom sits on stilts directly above the lagoon. Open your glass floor panel and watch fish swim beneath you. Step off your private deck directly into crystal water. Watch the sun rise over the horizon from your overwater hammock. Your own plunge pool, butler service, and a house reef 30 seconds from your door for snorkeling with turtles, rays, and reef sharks.',
    'This is an all-inclusive package: flights, speedboat transfer to your island resort, all meals (breakfast, lunch, and dinner), snorkeling gear, sunset dolphin cruise, night fishing trip, couple\'s spa treatment, non-motorized water sports (kayak, paddleboard, glass-bottom boat), and a private in-villa romantic dinner on your deck.',
    'The Maldives has no off-season — the water is warm (27–30°C) year-round, perfect for snorkeling and diving. November to April is the dry season with calmer seas; May to October has occasional showers but dramatically lower prices (save ₹20,000–₹40,000). Our team will match you to the best resort for your dates, budget, and preferences.',
  ],

  highlights: [
    'Overwater villa with private plunge pool (direct lagoon access)',
    'House reef snorkeling — turtles, rays, reef sharks, 500+ fish species',
    'Sunset dolphin cruise (spinner dolphins guaranteed)',
    'Traditional Maldivian night fishing with resort team',
    'Couple\'s 90-minute full-body spa treatment',
    'Private in-villa candlelit dinner on your overwater deck',
    'All meals included (breakfast + lunch + dinner)',
    'Non-motorized water sports: kayak, paddleboard, glass-bottom boat',
    'Speedboat transfer from Malé airport to resort',
    'No visa required for Indian passport holders',
  ],

  gallery: [
    { src: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', alt: 'Maldives overwater villa luxury turquoise lagoon', label: 'Overwater Villa' },
    { src: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80', alt: 'Maldives coral reef snorkeling tropical fish', label: 'Snorkeling' },
    { src: 'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80', alt: 'Maldives sunset overwater bungalow ocean view', label: 'Sunset' },
    { src: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800&q=80', alt: 'Maldives beach white sand crystal water palm', label: 'Beach' },
    { src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80', alt: 'Maldives luxury spa couple treatment', label: 'Spa' },
  ],

  itinerary: [
    { day: 1, title: 'Arrive Malé — Speedboat to Your Private Island', description: 'Fly into Velana International Airport, Malé. Our resort representative meets you at the arrivals and escorts you to the speedboat jetty. 30–45 minute scenic speedboat transfer across the turquoise Indian Ocean to your island resort. Check in to your overwater villa — open your deck, hear the silence, and let the Maldives cast its spell. Welcome drink, property orientation, and time to simply exist. Romantic dinner at the main overwater restaurant as the sun sets behind the horizon.', meals: 'Dinner', hotel: 'Overwater Villa, Private Island Resort', activities: ['Malé airport arrival', 'Speedboat to resort', 'Overwater villa check-in', 'Sunset dinner'] },
    { day: 2, title: 'House Reef Snorkeling + Dolphin Cruise', description: 'After a lavish breakfast on your villa deck, grab your snorkel gear (provided) and step directly off your villa into the lagoon for house reef snorkeling — one of the Maldives\' great privileges. The house reef (just 2–5 minutes from most villas) is home to sea turtles, eagle rays, reef sharks, colourful parrotfish, and thousands of tropical fish. Afternoon at leisure — kayak, paddleboard, or simply float in your plunge pool. Evening: sunset dolphin cruise on a traditional dhoni boat — spinner dolphins regularly accompany the boat as the sun sets.', meals: 'Breakfast, Lunch, Dinner', hotel: 'Overwater Villa', activities: ['Overwater villa breakfast', 'House reef snorkeling', 'Kayaking/paddleboarding', 'Sunset dolphin cruise'] },
    { day: 3, title: 'Spa + Sandbank Picnic + Night Fishing', description: 'Morning: 90-minute couples\' spa treatment at the overwater spa — traditional Maldivian massage with coconut and warm oils, suspended above the lagoon. Afternoon: private sandbank picnic — your butler packs a hamper and takes you by boat to a deserted sandbar in the middle of the ocean, entirely surrounded by turquoise water. Snorkel from the sandbank, have champagne on a strip of white sand with no land in sight. Evening: traditional Maldivian night fishing trip with the resort team — use traditional hand-lines to catch reef fish, then have your catch grilled for you as a private dinner.', meals: 'Breakfast, Sandbank Lunch, Grilled Fish Dinner', hotel: 'Overwater Villa', activities: ['Couples spa 90 minutes', 'Private sandbank picnic', 'Snorkeling from sandbank', 'Night fishing + grilled fish dinner'] },
    { day: 4, title: 'Full Day at Leisure + In-Villa Romantic Dinner', description: 'A completely free day — yours to design. Options: a PADI scuba diving session for beginners (2-hour reef dive with instructor, optional add-on), a sunrise kayak across the lagoon, reading in your overwater hammock, jet skiing or parasailing, or a cooking class with the resort chef learning to make Maldivian curry and mas huni. Your villa butler prepares a private candlelit dinner on your overwater deck as the final evening light fades — a white-tablecloth experience inches above the Indian Ocean, with wine and a 3-course menu chosen by you.', meals: 'Breakfast, Lunch, Private Villa Dinner', hotel: 'Overwater Villa', activities: ['Free day at leisure', 'Optional diving lesson', 'Sunrise kayak', 'Private candlelit dinner on villa deck'] },
    { day: 5, title: 'Final Sunrise + Departure', description: 'Last sunrise from your overwater deck — order room service breakfast and watch the ocean light up in shades of gold and rose. Check-out, pack up your suitcase, and say goodbye to your private piece of paradise. Speedboat back to Malé airport for your return flight to India. Land in Delhi/Mumbai/Chennai in the afternoon. Trip ends here.', meals: 'Breakfast', hotel: 'Departure', activities: ['Final sunrise on villa deck', 'Resort checkout', 'Speedboat to Malé', 'Return to India'] },
  ],

  includes: [
    'Return international flights India ↔ Malé (Sri Lankan/IndiGo/Air India)',
    'Round-trip speedboat transfer Malé airport ↔ resort',
    '4 nights overwater villa with private plunge pool',
    'Full board — all breakfasts, lunches, and dinners included',
    'Welcome drink and fresh fruit in villa on arrival',
    'Snorkeling equipment (mask, fins, vest) throughout stay',
    'Sunset dolphin cruise (45 min, traditional dhoni boat)',
    'Traditional Maldivian night fishing trip',
    'Couple\'s 90-minute full-body spa treatment',
    'Private sandbank picnic with transfer',
    'Private in-villa candlelit dinner (Day 4)',
    'Non-motorized water sports: kayak, paddleboard, glass-bottom boat',
    'Resort house reef snorkeling (unlimited)',
    '24/7 YlooTrips and resort butler support',
  ],

  excludes: [
    'Maldives visa (free for Indians — visa on arrival at Malé)',
    'Travel insurance (strongly recommended — mandatory for scuba)',
    'Alcoholic beverages and premium wines',
    'PADI scuba diving course/dives (optional — from ₹6,500)',
    'Motorized water sports: jet ski, parasailing, wakeboarding',
    'Seaplane upgrade (spectacular, optional — from ₹18,000/person)',
    'Gratuities for resort staff and butler',
    'Personal shopping at resort boutique',
    'International phone calls',
  ],

  reviews: [
    { name: 'Neha & Sahil', country: 'Mumbai, India', flag: '🇮🇳', rating: 5, text: 'Our honeymoon in the Maldives with YlooTrips was nothing short of a dream. Waking up and stepping into crystal clear water from our villa deck every morning... I still can\'t believe that was real. The private dinner on the deck was the most romantic evening of our lives. Worth every rupee.', date: 'March 2026', trip: 'Maldives Honeymoon Package' },
    { name: 'Rajan & Preethi', country: 'Chennai, India', flag: '🇮🇳', rating: 5, text: 'We spent our anniversary in the Maldives and it exceeded every expectation. The YlooTrips team was incredible — arranged a surprise rose petal decoration in the villa on our anniversary night. The dolphin cruise and sandbank picnic are experiences we will remember for the rest of our lives.', date: 'February 2026', trip: 'Maldives Luxury Anniversary' },
    { name: 'Ayesha Mirza', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'Saved up for 2 years for this trip and the Maldives delivered beyond imagination. The overwater villa, the house reef (we saw a whale shark!!), the couples spa — everything was perfect. YlooTrips made the booking completely stress-free. Will definitely return for our 5th anniversary.', date: 'January 2026', trip: 'Maldives Luxury Package' },
    { name: 'Kiran Reddy', country: 'Hyderabad, India', flag: '🇮🇳', rating: 5, text: 'The Maldives is worth every penny and YlooTrips got us the best rate I found anywhere online. The package is truly all-inclusive — we barely spent anything extra. The night fishing was unexpectedly the highlight — watching our fresh catch get grilled for dinner was amazing.', date: 'December 2025', trip: 'Maldives 5 Days Package' },
  ],

  avgRating: 5.0,
  reviewCount: 389,

  faqs: [
    { question: 'How much does a Maldives trip from India cost in 2026?', answer: 'Our all-inclusive Maldives luxury package starts at ₹89,999 per person (4 nights, overwater villa, all meals included). Couples spend ₹1,79,998 total for everything including flights. The main optional extras are scuba diving (₹6,500/person), seaplane upgrade (₹18,000/person), and alcohol.' },
    { question: 'Do Indians need a visa for the Maldives?', answer: 'No! Indian passport holders receive a free 30-day visa on arrival at Velana International Airport in Malé. You need a valid Indian passport, return flight ticket, hotel booking confirmation, and sufficient funds (approximately $100/day). No advance application required.' },
    { question: 'What is the best time to visit the Maldives from India?', answer: 'November to April (dry season) is the best time — calm seas, less rain, excellent visibility for snorkeling and diving. May to October (wet season) has occasional afternoon showers but is significantly cheaper (save ₹20,000–₹40,000 per couple) and the sea is still beautiful. The water temperature is 27–30°C year-round.' },
    { question: 'What is the difference between a beach villa and an overwater villa?', answer: 'Beach villas are on the island shoreline with direct beach access. Overwater villas are suspended on stilts above the lagoon with private plunge pools, direct water entry, and often a glass floor panel to watch fish below. Our package includes overwater villas — the most iconic and sought-after Maldives experience.' },
    { question: 'Should I upgrade to a seaplane transfer?', answer: 'Seaplane transfers are spectacular (views of the atolls from above are breathtaking) and worth it if budget allows. They cost ₹18,000–₹22,000 per person extra and are only available during daylight hours. Speedboat transfers (included in our package) take 30–45 minutes and are also scenic and enjoyable.' },
    { question: 'Can I add extra nights or upgrade the resort?', answer: 'Yes! We work with 40+ Maldives resorts across all price points. We can extend your stay, upgrade to a 5-star resort like Soneva Fushi, One&Only Reethi Rah, or Six Senses Laamu, or add activities. WhatsApp us at +91-84278-31127 for a custom luxury Maldives quote.' },
  ],

  related: [
    { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 42999, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { title: 'Dubai Tour Package from Delhi — 5 Nights', href: '/dubai-tour-package-from-delhi', priceINR: 35999, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
    { title: 'Thailand Budget Trip — 5 Nights', href: '/thailand-budget-trip', priceINR: 28999, image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=600&q=80' },
  ],

  whatsappMsg: "Hi! I'm interested in the Maldives Luxury Package (4 nights overwater villa ₹89,999). Please share availability.",
  bookingHref: '/contact?package=maldives-luxury-package',
  schemaHighlights: ['Overwater villa with private plunge pool', 'House reef snorkeling', 'Sunset dolphin cruise', 'Private sandbank picnic', 'All-inclusive full board'],
};

export default function MaldivesLuxuryPage() {
  return <PackagePageLayout pkg={pkg} />;
}
