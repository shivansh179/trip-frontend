import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Sri Lanka Tour Package from India 2026 — 5 Nights Starting ₹28,999 | YlooTrips',
  description: 'Book Sri Lanka tour packages from India starting ₹28,999. Colombo, Kandy, Ella, Sigiriya, Galle. 5 nights / 6 days — temples, tea estates, ancient ruins, and golden beaches.',
  keywords: 'Sri Lanka tour package from India, Sri Lanka trip from India, Colombo Kandy Ella tour, Sigiriya Sri Lanka, Sri Lanka holiday package 2026, Sri Lanka trip cost India, Ceylon tour package',
  openGraph: {
    title: 'Sri Lanka Tour Package from India 2026 — 5 Nights Starting ₹28,999',
    description: 'Colombo, Kandy, Ella, Sigiriya, Galle — 5 nights across the Pearl of the Indian Ocean.',
    url: 'https://www.ylootrips.com/sri-lanka-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=1200&q=80', width: 1200, height: 630, alt: 'Sri Lanka Sigiriya Lion Rock ancient ruins' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/sri-lanka-tour-package' },
};

export default async function SriLankaPackagePage() {
  const prices = await getPackagePrice('sri-lanka-tour-package');

  const pkg: PackageData = {
    slug: 'sri-lanka-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/sri-lanka-tour-package',
    metaTitle: 'Sri Lanka Tour Package from India 2026 — 5 Nights Starting ₹28,999 | YlooTrips',
    metaDescription: 'Colombo, Kandy, Ella, Sigiriya, Galle — 5 nights across Sri Lanka\'s most beautiful destinations.',
    keywords: 'Sri Lanka tour package from India, Sigiriya Kandy Ella tour',
    ogImage: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=1600&q=85',
    heroTitle: 'Sri Lanka Tour Package',
    heroSubtitle: 'Colombo · Kandy · Ella · Sigiriya · Galle — The Pearl of the Indian Ocean in 6 Days',
    tagline: "A Tearrop of Endless Wonder",

    duration: '5 Nights / 6 Days',
    groupSize: 'Solo, Couple, Family or Group',
    difficulty: 'Easy to Moderate',
    startLocation: 'Delhi/Chennai → Colombo (CMB)',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 25,

    overview: [
      'Sri Lanka is one of South Asia\'s most underrated destinations — a teardrop-shaped island with extraordinary diversity packed into a small area. Ancient Buddhist ruins, rolling tea plantations, colonial-era hill towns, wild elephants, pristine Indian Ocean beaches, and extraordinary street food — all within a 3–4 hour drive of each other.',
      'Our 5-night circuit is the classic Sri Lanka loop. Colombo (the capital) → Kandy (the cultural heart, home of the Temple of the Tooth) → Ella (the most beautiful hill country) → Sigiriya (the dramatic 5th-century Lion Rock fortress) → Galle (the UNESCO colonial fort town on the south coast).',
      'Sri Lanka is very close to India — direct flights from Chennai take just 1 hour. The ETA (e-visa) is free and same-day. It\'s the easiest international destination for Indian travelers, and one of the best value. Best months: November–April for most of Sri Lanka.',
    ],

    highlights: [
      'Sigiriya — "Lion Rock" 5th-century fortress rising 200m from the jungle (UNESCO)',
      'Dambulla Cave Temple — ancient Buddhist frescoes in volcanic rock caves (UNESCO)',
      'Temple of the Tooth (Kandy) — Buddhism\'s most sacred relic',
      'Ella — Nine Arch Bridge train journey, tea plantation hike',
      'Galle Fort — UNESCO colonial Dutch fort on the Indian Ocean',
      'Yala National Park — highest leopard density in the world (optional)',
      'Whale watching at Mirissa (optional, season dependent)',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=800&q=80', alt: 'Sigiriya Lion Rock Sri Lanka UNESCO', label: 'Sigiriya' },
      { src: 'https://images.unsplash.com/photo-1566296314736-6eaac1ca0cb9?w=800&q=80', alt: 'Ella Nine Arch Bridge train Sri Lanka', label: 'Ella Nine Arch Bridge' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', alt: 'Galle Fort Dutch colonial Sri Lanka', label: 'Galle Fort' },
      { src: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&q=80', alt: 'Sri Lanka tea plantation green hills', label: 'Tea Plantations' },
      { src: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80', alt: 'Kandy Temple of the Tooth Buddhist', label: 'Kandy' },
    ],

    itinerary: [
      { day: 1, title: 'Arrive Colombo — City Tour & Departure to Kandy', description: 'Fly to Bandaranaike International Airport, Colombo (1 hour from Chennai, 4 hours from Delhi). Brief Colombo city tour — National Museum, Independence Memorial Hall, Galle Face Green (the iconic beachside promenade). The red double-decker bus heritage route is a good way to see the city quickly. Afternoon: drive to Kandy (115 km, 3.5 hours). Kandy is Sri Lanka\'s cultural capital, situated in lush hill country.', meals: 'Dinner', hotel: '3★ Hotel, Kandy', activities: ['Arrive Colombo', 'Galle Face Green', 'National Museum', 'Drive to Kandy'] },
      { day: 2, title: 'Kandy — Temple of the Tooth & Botanical Gardens', description: 'Morning: Sri Dalada Maligawa (Temple of the Tooth Relic) — the most sacred Buddhist site in Sri Lanka, housing a tooth of the Gautama Buddha. The evening Puja ceremony is remarkable — drums, elephants, and incense. Royal Botanical Gardens of Peradeniya — 147 acres of extraordinary tropical plants, orchids, and the famous avenue of royal palms. Afternoon: Kandy Lake walk and view the city from the hilltops. Kandyan cultural dance show in the evening.', meals: 'Breakfast, Dinner', hotel: '3★ Hotel, Kandy', activities: ['Temple of the Tooth', 'Peradeniya Botanical Gardens', 'Kandy Lake', 'Kandyan dance show'] },
      { day: 3, title: 'Kandy → Ella — Scenic Train Journey', description: 'The Kandy–Ella train journey is one of the world\'s great train rides — 5.5 hours through tea plantations, misty mountain passes, and 59 tunnels. Book First Class Observation Car or Second Class reserved tickets in advance. Arrive Ella — a small village at 1,000m surrounded by tea estates. The Nine Arch Bridge is 15 minutes\' walk from the centre — wait for the train to cross for the most photogenic moment. Ella Rock trek (optional, 3 hours, amazing views).', meals: 'Breakfast', hotel: '3★ Hotel, Ella', activities: ['Kandy → Ella scenic train (5.5h)', 'Nine Arch Bridge walk', 'Ella Rock hike (optional)', 'Tea estate walk'] },
      { day: 4, title: 'Ella → Sigiriya — Lion Rock (UNESCO)', description: 'Drive to Sigiriya (3.5 hours). Lunch en route in Dambulla. Dambulla Cave Temple — five enormous Buddhist cave temples with 153 Buddha statues and 2,100 sqm of ancient frescoes, built into volcanic rock. Sigiriya Rock Fortress (5th century CE) — a 200-metre volcanic rock with a fortress built by King Kashyapa on top. The climb takes 45 minutes up steep staircases and metal ladders. At the top: ruins of the royal palace with panoramic views of the entire Cultural Triangle.', meals: 'Breakfast, Dinner', hotel: '3★ Hotel, Sigiriya', activities: ['Drive to Sigiriya', 'Dambulla Cave Temple UNESCO', 'Sigiriya Lion Rock climb', 'Sigiriya frescoes and mirror wall'] },
      { day: 5, title: 'Sigiriya → Galle — Colonial Fort on the Ocean', description: 'Morning: Minneriya or Kaudulla National Park (optional, elephant gathering — hundreds of elephants during August–October). Drive to Galle (4 hours). Galle Fort is a UNESCO World Heritage Site — a 17th-century Dutch colonial fortification containing an entire old town of colonial-era buildings, boutique hotels, cafes, and jewellery shops within its walls. Walk the fort ramparts at sunset with views over the Indian Ocean.', meals: 'Breakfast', hotel: '3★ Hotel, Galle', activities: ['Minneriya/Kaudulla Elephant Gathering (optional)', 'Drive to Galle', 'Galle Fort walking tour', 'Fort ramparts sunset'] },
      { day: 6, title: 'Galle — Beach & Return to Colombo', description: 'Morning: Hikkaduwa Beach (10 km from Galle) — good snorkelling directly from the beach with sea turtles in the surf zone. Galle Fort final morning walk. Drive to Colombo Airport (130 km, 2.5 hours). Return flight to India.', meals: 'Breakfast', hotel: 'Departure', activities: ['Hikkaduwa Beach & snorkelling', 'Final Galle Fort walk', 'Drive to Colombo Airport', 'Return flight to India'] },
    ],

    includes: [
      'Return economy flights India ↔ Colombo',
      '5 nights accommodation (3-star): Kandy (2N), Ella (1N), Sigiriya (1N), Galle (1N)',
      'Daily breakfast throughout + 2 dinners',
      'Kandy → Ella scenic train tickets (2nd class reserved)',
      'Sigiriya Rock entry (included)',
      'Dambulla Cave Temple entry',
      'All private road transfers',
      'ETA (Sri Lanka e-visa) documentation support',
      'Dedicated YlooTrips Sri Lanka coordinator',
    ],

    excludes: [
      'Sri Lanka ETA visa (currently free, apply at eta.gov.lk)',
      'Yala National Park jeep safari (optional add-on, ₹3,500/person)',
      'Whale watching at Mirissa (optional, seasonal)',
      'Meals except breakfasts and 2 dinners',
      'Travel insurance',
    ],

    reviews: [
      { name: 'Vikram & Meera Rao', country: 'Chennai, India', flag: '🇮🇳', rating: 5, text: 'Sri Lanka is like a smaller, slower India but with better beaches, better roads, and cheaper food. The Kandy-Ella train was the most beautiful journey. Sigiriya is breathtaking. Perfect first international trip.', date: 'January 2026', trip: 'Sri Lanka 5N Package' },
      { name: 'Alisha & Ben Carter', country: 'Melbourne, Australia', flag: '🇦🇺', rating: 5, text: 'We came to Sri Lanka after India and loved it. So much easier to navigate than India — everything is close together. Galle Fort is gorgeous. YlooTrips sorted the ETA and everything was smooth.', date: 'March 2026', trip: 'Sri Lanka Tour' },
    ],

    avgRating: 4.8,
    reviewCount: 1280,

    related: [
      { title: 'Nepal Tour Package — 5 Nights', href: '/nepal-tour-package', priceINR: 18999, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
      { title: 'Maldives Luxury Package', href: '/maldives-luxury-package', priceINR: 69999, image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80' },
      { title: 'Bali Honeymoon Package — 6 Nights', href: '/bali-honeymoon-package', priceINR: 52499, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Sri Lanka Tour Package (5 nights ₹28,999). Please share availability.",
    bookingHref: '/contact?package=sri-lanka-tour-package',

    faqs: [
      { question: 'Do Indians need a visa for Sri Lanka?', answer: 'Yes — Indian nationals need an Electronic Travel Authorization (ETA). It\'s currently free and processed same day at eta.gov.lk. Valid for 30 days, extendable to 6 months.' },
      { question: 'Is Sri Lanka suitable for vegetarians?', answer: 'Sri Lanka is excellent for vegetarians. Rice and curry with dhal, jackfruit, and vegetable dishes are staples. Indian-style vegetarian food is widely available, especially in the Cultural Triangle and Kandy.' },
      { question: 'What is the best time to visit Sri Lanka?', answer: 'November–April is ideal for the west and south coast (Colombo, Kandy, Galle, Ella, Sigiriya). The east coast (Trincomalee, Arugam Bay) is best May–September. Most Indian tourists visit in the winter holiday season (December–January).' },
      { question: 'How close is Sri Lanka to India?', answer: 'Only 30 km of ocean separates India and Sri Lanka. Direct flights from Chennai take just 1 hour (the closest international destination from India). Delhi flights take 3.5–4 hours with most airlines.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
