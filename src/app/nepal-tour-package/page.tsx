import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Nepal Tour Package from India 2026 — 5 Nights Starting ₹18,999 | YlooTrips',
  description: 'Book Nepal tour packages from India starting ₹18,999. Kathmandu, Pokhara, Chitwan, Nagarkot. 5 nights / 6 days — Everest views, temples, wildlife safaris, and Himalayan lakes.',
  keywords: 'Nepal tour package from India, Nepal trip from India, Kathmandu Pokhara tour, Nepal holiday package 2026, Everest Base Camp trek, Chitwan National Park, Nepal trip cost India, Pokhara Phewa Lake',
  openGraph: {
    title: 'Nepal Tour Package from India 2026 — 5 Nights Starting ₹18,999',
    description: 'Kathmandu, Pokhara, Chitwan, Nagarkot — 5 nights with Everest views, temples, and wildlife.',
    url: 'https://www.ylootrips.com/nepal-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80', width: 1200, height: 630, alt: 'Nepal Pokhara Phewa Lake Himalayas' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/nepal-tour-package' },
};

export default async function NepalPackagePage() {
  const prices = await getPackagePrice('nepal-tour-package');

  const pkg: PackageData = {
    slug: 'nepal-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/nepal-tour-package',
    metaTitle: 'Nepal Tour Package from India 2026 — 5 Nights Starting ₹18,999 | YlooTrips',
    metaDescription: 'Kathmandu, Pokhara, Chitwan, Nagarkot — 5 nights of Himalayan views, ancient temples, and Nepal at its best.',
    keywords: 'Nepal tour package from India, Kathmandu Pokhara Chitwan package',
    ogImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85',
    heroTitle: 'Nepal Tour Package',
    heroSubtitle: 'Kathmandu · Pokhara · Chitwan · Nagarkot — Everest Views & Ancient Temples in 6 Days',
    tagline: 'Home of the Himalayas',

    duration: '5 Nights / 6 Days',
    groupSize: 'Solo, Couple, Family or Group',
    difficulty: 'Easy to Moderate',
    startLocation: 'Delhi → Kathmandu (KTM)',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 25,

    overview: [
      'Nepal is one of the world\'s most extraordinary countries — a tiny Himalayan kingdom that is home to 8 of the world\'s 14 highest mountains (including Everest at 8,849m), a rich Hindu-Buddhist cultural heritage, incredible wildlife, and one of the world\'s most dramatic landscapes. It\'s also extremely accessible from India — a 1.5-hour flight from Delhi, no visa required for Indians, and very familiar cuisine.',
      'Our 5-night circuit covers Nepal\'s essential highlights. Kathmandu (the ancient capital with the densest concentration of UNESCO World Heritage Sites per square kilometre in the world) → Nagarkot (sunrise Himalayan views, 8 peaks visible including Everest) → Pokhara (Nepal\'s most beautiful city on Phewa Lake, with the Annapurna range as a backdrop) → Chitwan (one of Asia\'s best national parks for rhinos and tigers).',
      'Indians do not need a visa for Nepal — entry is possible with just an Aadhaar card or Voter ID. The currency exchange rate is excellent (1 INR = 1.6 NPR). Best months: October–November (clearest views, post-monsoon) and March–April (rhododendron season).',
    ],

    highlights: [
      'Kathmandu — Pashupatinath Temple, Boudhanath Stupa (UNESCO), Swayambhunath (Monkey Temple)',
      'Nagarkot Sunrise — 360° views of Himalayan peaks including Everest',
      'Pokhara — Phewa Lake, Davis Falls, Gupteshwar Cave, paragliding',
      'Sarangkot Sunrise — best viewpoint for Annapurna, Machhapuchchhre, and Dhaulagiri',
      'Chitwan National Park — one-horned rhinos, Bengal tigers, elephant rides',
      'Patan Durbar Square — Newari architecture UNESCO heritage',
      'Mountain flight (optional) — 1 hour Everest views from above the clouds',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Nepal Pokhara Phewa Lake Machhapuchchhre', label: 'Pokhara' },
      { src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', alt: 'Kathmandu Boudhanath Stupa UNESCO Nepal', label: 'Boudhanath Stupa' },
      { src: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800&q=80', alt: 'Nepal Himalayan mountains sunrise snow peaks', label: 'Himalayan Sunrise' },
      { src: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=800&q=80', alt: 'Chitwan National Park Nepal rhino elephant', label: 'Chitwan Safari' },
      { src: 'https://images.unsplash.com/photo-1606928673853-5ee4b1d5da94?w=800&q=80', alt: 'Pashupatinath Temple Hindu Nepal Kathmandu', label: 'Pashupatinath' },
    ],

    itinerary: [
      { day: 1, title: 'Arrive Kathmandu — Ancient Sacred City', description: 'Fly from Delhi to Kathmandu Tribhuvan Airport (1.5 hours). The Kathmandu Valley is a UNESCO World Heritage Site — seven monument zones spread across three ancient cities (Kathmandu, Patan, Bhaktapur). Check in to Thamel — the backpacker neighbourhood full of cafes, restaurants, and trekking shops. Afternoon: Pashupatinath Temple — the holiest Hindu temple in Nepal, where evening cremation ghats on the Bagmati River are a profound experience. Boudhanath Stupa — the largest Buddhist stupa in Nepal and one of the most important in the world.', meals: 'Dinner', hotel: '3★ Hotel, Thamel, Kathmandu', activities: ['Arrive Kathmandu', 'Pashupatinath Temple', 'Boudhanath Stupa', 'Thamel exploration'] },
      { day: 2, title: 'Kathmandu — Patan & Swayambhunath', description: 'Morning: Patan Durbar Square (Lalitpur) — the finest example of Newari architecture, with the old royal palace, Krishna Mandir (pure stone), and dozens of ancient temples packed into one square. Patan has the oldest Buddhist monasteries in Nepal. Kathmandu Durbar Square — Kumari Ghar (home of the living goddess). Afternoon: Swayambhunath (Monkey Temple) — 2,500-year-old Buddhist site on a hillock with 360-degree Kathmandu Valley views. The eyes of Buddha on the stupa\'s tower are Nepal\'s most recognisable symbol.', meals: 'Breakfast', hotel: '3★ Hotel, Kathmandu', activities: ['Patan Durbar Square UNESCO', 'Krishna Mandir', 'Kathmandu Durbar Square', 'Swayambhunath Monkey Temple'] },
      { day: 3, title: 'Kathmandu → Nagarkot Sunrise → Pokhara', description: 'Pre-dawn drive to Nagarkot (32 km, 1.5 hours). Nagarkot is a ridgetop village at 2,195m with perhaps the most spectacular Himalayan panorama accessible by road. On clear days, 8 mountain ranges are visible including Everest (8,849m), Lhotse (8,516m), Makalu (8,485m), and Ganesh Himal. Sunrise over the Himalayas from Nagarkot is one of Nepal\'s iconic experiences. After sunrise, drive to Pokhara (200 km, 5 hours). Pokhara is Nepal\'s most beautiful city — Phewa Lake reflects the perfect triangular peak of Machhapuchchhre (Fishtail Mountain).', meals: 'Breakfast', hotel: '3★ Hotel, Pokhara', activities: ['Nagarkot Himalayan sunrise', 'Drive to Pokhara', 'Phewa Lake arrival', 'Barahi Temple on island'] },
      { day: 4, title: 'Pokhara — Sarangkot, Paragliding & Phewa Lake', description: 'Sarangkot sunrise — drive to the viewpoint (1,592m) for the clearest views of Annapurna I (8,091m), Annapurna South, Machhapuchchhre, and Dhaulagiri. After sunrise: paragliding from Sarangkot (a 30-minute tandem flight over Phewa Lake with Annapurna as backdrop — one of the world\'s most scenic paragliding sites). Afternoon: boat ride on Phewa Lake to Barahi Temple. Davis Falls (water disappears underground dramatically). Gupteshwar Mahadev Cave. Old Bazaar for Nepali handicrafts.', meals: 'Breakfast, Dinner', hotel: '3★ Hotel, Pokhara', activities: ['Sarangkot sunrise viewpoint', 'Tandem paragliding', 'Phewa Lake boat ride', 'Davis Falls & Gupteshwar Cave'] },
      { day: 5, title: 'Pokhara → Chitwan National Park', description: 'Drive to Chitwan National Park (150 km, 4 hours). Chitwan is one of Asia\'s premier wildlife destinations — the last refuge of the Indian one-horned rhinoceros outside Assam, and a stronghold of the Bengal tiger. Afternoon: elephant-back safari in the jungle (alternative: jeep safari). Spot rhinos, gharial crocodiles, spotted deer, monkeys, and (if lucky) tigers. Evening: tharu cultural dance show at the lodge.', meals: 'Breakfast, Dinner', hotel: 'Jungle Resort, Chitwan', activities: ['Drive to Chitwan', 'Elephant safari/jeep safari', 'Rhino and bird spotting', 'Tharu cultural show'] },
      { day: 6, title: 'Chitwan → Kathmandu → Return to India', description: 'Early morning bird walk in the jungle — Chitwan has 544 species of birds. Canoe ride on the Rapti River — gharial crocodiles bask on the banks. Drive to Kathmandu Airport (200 km, 4.5 hours). Return flight to Delhi.', meals: 'Breakfast', hotel: 'Departure', activities: ['Dawn bird walk', 'Rapti River canoe ride', 'Drive to Kathmandu airport', 'Return flight to India'] },
    ],

    includes: [
      'Return economy flights Delhi ↔ Kathmandu',
      '5 nights accommodation: Kathmandu (2N), Pokhara (2N), Chitwan Jungle Resort (1N)',
      'Daily breakfast + 3 dinners',
      'Nagarkot sunrise drive and viewpoint',
      'Sarangkot sunrise viewpoint',
      'Phewa Lake boat ride',
      'Chitwan elephant/jeep safari',
      'All private road transfers',
      'YlooTrips Nepal coordinator',
    ],

    excludes: [
      'No Nepal visa needed for Indians (enter with Aadhaar/Voter ID)',
      'Paragliding from Sarangkot (optional — ~₹7,000/person)',
      'Mountain flight (optional — Everest views by air, ~₹18,000)',
      'Meals except breakfasts and 3 dinners',
      'Travel insurance',
    ],

    reviews: [
      { name: 'Anjali & Pradeep Kumar', country: 'Hyderabad, India', flag: '🇮🇳', rating: 5, text: 'Nepal is everything India is but calmer, cleaner, and cheaper. The Nagarkot sunrise made my wife cry. Pokhara is the most beautiful place I\'ve been. YlooTrips sorted everything perfectly — even the paragliding.', date: 'October 2025', trip: 'Nepal 5N Package' },
      { name: 'Rishi Gupta', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'First international trip and it was incredible. No visa needed, familiar food, and extraordinary views. Chitwan was the surprise — seeing a rhino 10 metres away from an elephant is unforgettable.', date: 'April 2026', trip: 'Nepal Tour Package' },
    ],

    avgRating: 4.8,
    reviewCount: 2340,

    related: [
      { title: 'Sri Lanka Tour Package — 5 Nights', href: '/sri-lanka-tour-package', priceINR: 28999, image: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=600&q=80' },
      { title: 'Himachal Tour Package — 5 Nights', href: '/himachal-tour-package', priceINR: 13999, image: 'https://images.unsplash.com/photo-1580889240742-fd4db5f27f8a?w=600&q=80' },
      { title: 'Ladakh Tour Package — 6 Nights', href: '/ladakh-tour-package', priceINR: 22999, image: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Nepal Tour Package (5 nights ₹18,999). Please share availability.",
    bookingHref: '/contact?package=nepal-tour-package',

    faqs: [
      { question: 'Do Indians need a visa for Nepal?', answer: 'No. Indian nationals can enter Nepal without a visa. You can use any Indian government ID — Aadhaar card, Voter ID, or passport. A Voter ID without a passport is sufficient for most Indians visiting Nepal.' },
      { question: 'What is the best time to visit Nepal?', answer: 'October–November (post-monsoon, crystal clear mountain views — best trekking season) and March–April (spring, rhododendrons in bloom, good visibility). Avoid June–September (heavy monsoon in Pokhara and Kathmandu Valley).' },
      { question: 'Can I see Everest on this trip?', answer: 'Yes — from Nagarkot and Sarangkot viewpoints on clear days, Everest (8,849m) is visible in the distance. For close-up views, we offer a 1-hour mountain flight from Kathmandu that flies along the Himalayan range at close range. Everest Base Camp Trek is a separate 14-day adventure.' },
      { question: 'Is Nepal expensive?', answer: 'Nepal is one of the cheapest international destinations from India. Meals cost ₹150–400, local beer ₹200, and transport is very affordable. Trekking permits are the main added cost for those going to Annapurna or EBC.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
