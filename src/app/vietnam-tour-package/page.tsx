import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Vietnam Tour Package from India 2026 — 6 Nights Starting ₹38,999 | YlooTrips',
  description: 'Book Vietnam tour packages from India starting ₹38,999. Hanoi, Ha Long Bay, Hoi An, Ho Chi Minh City. 6 nights / 7 days — UNESCO heritage, street food, and Southeast Asia at its best.',
  keywords: 'Vietnam tour package from India, Vietnam trip from India, Hanoi Ha Long Bay tour, Hoi An Vietnam package, Ho Chi Minh City tour, Vietnam holiday package 2026, Vietnam trip cost India',
  openGraph: {
    title: 'Vietnam Tour Package from India 2026 — 6 Nights Starting ₹38,999',
    description: 'Hanoi, Ha Long Bay cruise, Hoi An, Ho Chi Minh City — 6 nights across Vietnam\'s best destinations.',
    url: 'https://www.ylootrips.com/vietnam-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80', width: 1200, height: 630, alt: 'Ha Long Bay Vietnam limestone karsts boats' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/vietnam-tour-package' },
};

export default async function VietnamPackagePage() {
  const prices = await getPackagePrice('vietnam-tour-package');

  const pkg: PackageData = {
    slug: 'vietnam-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/vietnam-tour-package',
    metaTitle: 'Vietnam Tour Package from India 2026 — 6 Nights Starting ₹38,999 | YlooTrips',
    metaDescription: 'Hanoi, Ha Long Bay, Hoi An, Ho Chi Minh City — 6 nights of UNESCO heritage, street food, and Southeast Asian adventure.',
    keywords: 'Vietnam tour package from India, Ha Long Bay cruise, Hoi An tour',
    ogImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1600&q=85',
    heroTitle: 'Vietnam Tour Package',
    heroSubtitle: 'Hanoi · Ha Long Bay · Hoi An · Ho Chi Minh City — 7 Days Across Vietnam',
    tagline: 'Southeast Asia\'s Most Complete Country',

    duration: '6 Nights / 7 Days',
    groupSize: 'Solo, Couple, Friends or Group',
    difficulty: 'Easy',
    startLocation: 'Delhi/Mumbai → Hanoi (HAN)',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 25,

    overview: [
      'Vietnam is one of Southeast Asia\'s most rewarding destinations — an incredibly long, diverse country stretching 1,650 km from the Chinese border to the Mekong Delta. In 6 nights, our package covers the north (Hanoi), the legendary Ha Long Bay, the heritage town of Hoi An, and the dynamic south (Ho Chi Minh City). Four very different experiences, each unforgettable.',
      'Vietnam is budget-friendly compared to India\'s other international options — excellent food is available for ₹200–500, hotels are good value, and internal flights are cheap. The e-visa is simple (USD 25, 3 days processing). Vietnamese cuisine — pho, banh mi, fresh spring rolls — is world-class.',
      'Best months: November–April for north and south Vietnam. Central Vietnam (Hoi An) is best October–April. Avoid May–October for central Vietnam (typhoon season). We design itineraries around the current best weather.',
    ],

    highlights: [
      'Ha Long Bay — UNESCO overnight cruise through 1,600+ limestone karsts',
      'Hoi An Ancient Town — UNESCO World Heritage, lantern-lit streets at night',
      'Hanoi Old Quarter — 36 Streets, Hoan Kiem Lake, street food',
      'Ho Chi Minh City — War Remnants Museum, Cu Chi Tunnels, Bui Vien Street',
      'My Son Sanctuary — ancient Cham temple complex (UNESCO)',
      'Vietnamese cooking class in Hoi An',
      'Phong Nha Caves (optional) — the world\'s largest cave system',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', alt: 'Ha Long Bay Vietnam limestone karsts UNESCO', label: 'Ha Long Bay' },
      { src: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80', alt: 'Hoi An Ancient Town lanterns at night Vietnam', label: 'Hoi An' },
      { src: 'https://images.unsplash.com/photo-1559592413-7cbb1a8d1b68?w=800&q=80', alt: 'Hanoi Hoan Kiem Lake Vietnam', label: 'Hanoi' },
      { src: 'https://images.unsplash.com/photo-1555921015-5532091f6026?w=800&q=80', alt: 'Ho Chi Minh City Notre Dame Cathedral Vietnam', label: 'Ho Chi Minh City' },
      { src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', alt: 'Vietnamese pho street food bowl', label: 'Vietnamese Food' },
    ],

    itinerary: [
      { day: 1, title: 'Arrive Hanoi — Old Quarter & Street Food', description: 'Fly to Hanoi Noi Bai International Airport. Transfer to hotel in the Old Quarter (36 Streets). The Old Quarter is one of Asia\'s most fascinating urban areas — each street historically specialised in a single trade (Paper Street, Tin Street, Bamboo Street etc). Hoan Kiem Lake — the jade-coloured lake at the centre of Hanoi with Ngoc Son Temple on a small island. Evening: street food crawl — pho (noodle soup), bun cha (grilled pork noodles), banh mi, and bia hoi (fresh draft beer, 15,000 VND / ₹50 a glass). Hanoi\'s street food scene is extraordinary.', meals: 'Dinner', hotel: '3★ Hotel, Hanoi Old Quarter', activities: ['Arrive Hanoi', 'Old Quarter exploration', 'Hoan Kiem Lake', 'Street food crawl'] },
      { day: 2, title: 'Hanoi → Ha Long Bay — Overnight Cruise', description: 'Morning: Ho Chi Minh Mausoleum and One Pillar Pagoda. Temple of Literature (Van Mieu, 1076 CE) — Vietnam\'s first university. After lunch, transfer to Ha Long Bay (3.5 hours). Board your overnight cruise boat — Ha Long Bay has 1,969 limestone karsts rising from emerald water, a UNESCO World Heritage Site. Kayaking through hidden caves. Sunset on the upper deck. Seafood dinner on board. Overnight in cabin on Ha Long Bay.', meals: 'Breakfast, Lunch, Dinner', hotel: 'Cruise Cabin, Ha Long Bay', activities: ['Ho Chi Minh Mausoleum', 'Temple of Literature', 'Ha Long Bay cruise embarkation', 'Kayaking through caves', 'Sunset cruise'] },
      { day: 3, title: 'Ha Long Bay → Hanoi → Fly to Da Nang', description: 'Sunrise on Ha Long Bay. Morning activities: Titov Beach (swimming, volleyball), Sung Sot Cave (Surprise Cave — enormous stalactite cavern). Return to harbour. Drive back to Hanoi, transfer to airport. Evening flight to Da Nang (1 hour). Transfer to Hoi An (30 km).', meals: 'Breakfast, Lunch', hotel: '3★ Hotel, Hoi An', activities: ['Ha Long Bay sunrise', 'Titov Beach', 'Sung Sot Cave', 'Fly Hanoi → Da Nang'] },
      { day: 4, title: 'Hoi An — Ancient Town & Lantern Making', description: 'Hoi An is one of Southeast Asia\'s most beautiful towns — a UNESCO World Heritage Site preserved as a 15th-century trading port. The Old Town is a maze of yellow-walled houses, covered bridges, silk shops, and tailors who can make a custom suit overnight. Morning: Japanese Covered Bridge (1593), Phuc Kien Assembly Hall, Tan Ky Old House. Afternoon: Vietnamese cooking class — learn to make fresh spring rolls, pho, and banh xeo. Evening: Hoi An Ancient Town comes alive with colourful lanterns — boat ride on Thu Bon River with floating lanterns is magical.', meals: 'Breakfast', hotel: '3★ Hotel, Hoi An', activities: ['Japanese Covered Bridge', 'Tan Ky Old House', 'Cooking class', 'Lantern boat ride'] },
      { day: 5, title: 'Hoi An — My Son Sanctuary & Beach', description: 'Morning: My Son Sanctuary (35 km from Hoi An) — a complex of ancient Cham Hindu temples built between the 4th–14th centuries, UNESCO World Heritage. The Cham civilization was Southeast Asia\'s most powerful Hindu kingdom — these temples predate Angkor Wat. Afternoon: An Bang Beach — 5 km from Hoi An Old Town, a quiet, beautiful beach with good restaurants. Evening: traditional silk lantern purchase in Hoi An night market.', meals: 'Breakfast', hotel: '3★ Hotel, Hoi An', activities: ['My Son Sanctuary UNESCO', 'An Bang Beach', 'Hoi An night market'] },
      { day: 6, title: 'Fly to Ho Chi Minh City — Cu Chi Tunnels', description: 'Morning flight from Da Nang to Ho Chi Minh City (formerly Saigon — locals still call it Saigon). Check in. Afternoon: Cu Chi Tunnels (40 km from city) — the 250 km network of tunnels used by Viet Cong guerrillas during the Vietnam War. Crawling through the tunnels is intense and fascinating. Back to the city for Bui Vien Street (Walking Street) — the most energetic street in Vietnam.', meals: 'Breakfast', hotel: '3★ Hotel, Ho Chi Minh City', activities: ['Fly Da Nang → Ho Chi Minh City', 'Cu Chi Tunnels', 'Bui Vien Walking Street'] },
      { day: 7, title: 'Ho Chi Minh City — War Museum & Departure', description: 'Morning: War Remnants Museum — one of the most powerful war museums in the world, documenting the American War (Vietnam War). Reunification Palace (where the war ended April 30, 1975). Ben Thanh Market for Vietnamese coffee, pho seasoning, and lacquerware. Saigon Central Post Office (French colonial, designed by Eiffel). Transfer to airport.', meals: 'Breakfast', hotel: 'Departure', activities: ['War Remnants Museum', 'Reunification Palace', 'Ben Thanh Market', 'Return flight to India'] },
    ],

    includes: [
      'Return economy flights India ↔ Vietnam (with one stop)',
      'Internal flights: Hanoi → Da Nang, Da Nang → Ho Chi Minh City',
      '6 nights accommodation: Hanoi (1N), Ha Long Bay cruise (1N), Hoi An (2N), HCMC (1N) + 1 bonus',
      'Ha Long Bay 1-night cruise (meals on board)',
      'Daily breakfast throughout',
      'Vietnamese cooking class in Hoi An',
      'All airport and hotel transfers',
      'Vietnam e-visa documentation support',
      'Dedicated YlooTrips Vietnam coordinator',
    ],

    excludes: [
      'Vietnam e-visa fee (USD 25 / ~₹2,100)',
      'Cu Chi Tunnels entry (USD 12)',
      'My Son Sanctuary entry (USD 15)',
      'Meals except breakfasts and Ha Long cruise meals',
      'Travel insurance (recommended)',
    ],

    reviews: [
      { name: 'Aditya & Pooja Singh', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'Vietnam was the best trip we\'ve ever taken. Ha Long Bay at sunrise is one of life\'s great experiences. Hoi An is magical — the lantern boat ride moved Pooja to tears. And the food everywhere was incredible.', date: 'February 2026', trip: 'Vietnam 6N Package' },
      { name: 'Kenji & Aisha Tanaka', country: 'Singapore', flag: '🇸🇬', rating: 5, text: 'We\'ve been to Vietnam before but this was the most organised tour. Cu Chi Tunnels was sobering and fascinating. Excellent value compared to other operators.', date: 'January 2026', trip: 'Vietnam Tour Package' },
    ],

    avgRating: 4.8,
    reviewCount: 1640,

    related: [
      { title: 'Thailand Budget Trip — 5 Nights', href: '/thailand-budget-trip', priceINR: 24999, image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80' },
      { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 52499, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
      { title: 'Singapore Tour Package', href: '/singapore-tour-package', priceINR: 42999, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Vietnam Tour Package (6 nights ₹38,999). Please share availability.",
    bookingHref: '/contact?package=vietnam-tour-package',

    faqs: [
      { question: 'Do Indians need a visa for Vietnam?', answer: 'Yes — Indian nationals need a Vietnam e-visa (USD 25, ~₹2,100). Apply online at evisa.xuatnhapcanh.gov.vn. Processing takes 3 business days. The e-visa allows 90 days multiple entry.' },
      { question: 'What is the best time to visit Vietnam?', answer: 'November–April is generally the best time. North Vietnam (Hanoi, Ha Long Bay) is best October–April. Central Vietnam (Hoi An, Da Nang) is best February–July. South Vietnam (Ho Chi Minh) is pleasant October–May. Our package is designed to work year-round with the circuit adjusted.' },
      { question: 'Is Vietnamese food vegetarian-friendly?', answer: 'Vietnam is not traditionally very vegetarian-friendly — meat and seafood are central. However, most restaurants can accommodate vegetarians with advance notice. Hoi An has excellent vegetarian and vegan restaurants. We flag dietary requirements to all our accommodation and activity partners.' },
      { question: 'Can I extend to Cambodia (Angkor Wat)?', answer: 'Yes — Angkor Wat is 1 hour by plane from Ho Chi Minh City. We offer Vietnam + Cambodia combo packages (add 2–3 nights in Siem Reap). WhatsApp us for the combo quote.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
