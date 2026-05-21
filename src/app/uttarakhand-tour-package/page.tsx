import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Uttarakhand Tour Package 2026 — 5 Nights Starting ₹11,999 | YlooTrips',
  description: 'Book Uttarakhand tour packages starting ₹11,999. Rishikesh, Haridwar, Mussoorie, Nainital, Valley of Flowers. 5 nights / 6 days — rivers, yoga, treks, and sacred temples.',
  keywords: 'Uttarakhand tour package, Rishikesh Haridwar package, Mussoorie Nainital tour, Uttarakhand holiday package 2026, Char Dham trip, Valley of Flowers tour, Uttarakhand travel package from Delhi',
  openGraph: {
    title: 'Uttarakhand Tour Package 2026 — 5 Nights Starting ₹11,999',
    description: 'Rishikesh rafting, Haridwar Ganga Aarti, Mussoorie hills, Nainital lake — 5 nights across Uttarakhand.',
    url: 'https://www.ylootrips.com/uttarakhand-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=1200&q=80', width: 1200, height: 630, alt: 'Rishikesh yoga and river rafting Uttarakhand' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/uttarakhand-tour-package' },
};

export default async function UttarakhandPackagePage() {
  const prices = await getPackagePrice('uttarakhand-tour-package');

  const pkg: PackageData = {
    slug: 'uttarakhand-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/uttarakhand-tour-package',
    metaTitle: 'Uttarakhand Tour Package 2026 — 5 Nights Starting ₹11,999 | YlooTrips',
    metaDescription: 'Rishikesh, Haridwar, Mussoorie, Nainital — 5 nights of rivers, yoga, mountains, and sacred temples in Uttarakhand.',
    keywords: 'Uttarakhand tour package from Delhi, Rishikesh Haridwar tour',
    ogImage: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=1600&q=85',
    heroTitle: 'Uttarakhand Tour Package',
    heroSubtitle: 'Rishikesh · Haridwar · Mussoorie · Nainital — Sacred Rivers & Himalayan Foothills',
    tagline: 'Devbhoomi — Land of the Gods',

    duration: '5 Nights / 6 Days',
    groupSize: 'Solo, Couple, Family or Group',
    difficulty: 'Easy (adventure optional)',
    startLocation: 'Delhi → Haridwar/Rishikesh',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 25,

    overview: [
      'Uttarakhand — the "Land of the Gods" — is one of India\'s most spiritually and naturally diverse states. The Ganga flows from the Himalayas through the sacred cities of Haridwar and Rishikesh. The hills host Mussoorie and Nainital — charming colonial hill stations. Higher up, the Char Dham pilgrimage circuit (Yamunotri, Gangotri, Kedarnath, Badrinath) draws millions each year.',
      'Our 5-night package takes you through Uttarakhand\'s most accessible and rewarding highlights. Start with the sacred Ganga Aarti at Haridwar — one of India\'s most moving rituals. Move to Rishikesh for white-water rafting on the Ganga, bungee jumping (India\'s highest at 83m), and yoga at sunrise. Head up to Mussoorie for colonial hill station charm. End at Nainital for the famous lake, cable car, and Kumaon views.',
      'Uttarakhand is the perfect destination for those seeking spirituality, adventure, and natural beauty all in one trip. Best visited March–May and September–November.',
    ],

    highlights: [
      'Haridwar Ganga Aarti at Har Ki Pauri — one of India\'s most sacred rituals',
      'Rishikesh — white-water rafting Grade 3-4 on the Ganga',
      'Bungee jumping at Jumpin Heights (83m — India\'s highest)',
      'Yoga and meditation at sunrise with certified instructors',
      'Mussoorie — Kempty Falls, Gun Hill, Mall Road colonial charm',
      'Nainital — boat ride on Naini Lake, cable car to Snow View Point',
      'Jim Corbett National Park (optional add-on) — tiger and elephant safaris',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1544731612-de7f96afe55f?w=800&q=80', alt: 'Rishikesh yoga sunrise Ganga river', label: 'Rishikesh' },
      { src: 'https://images.unsplash.com/photo-1588528402605-1f726a1e94be?w=800&q=80', alt: 'Haridwar Ganga Aarti evening lamps sacred', label: 'Haridwar Aarti' },
      { src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', alt: 'Nainital lake Kumaon hills', label: 'Nainital' },
      { src: 'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?w=800&q=80', alt: 'White water rafting Ganga Rishikesh', label: 'River Rafting' },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Mussoorie hill station Uttarakhand', label: 'Mussoorie' },
    ],

    itinerary: [
      { day: 1, title: 'Delhi → Haridwar — Sacred City of the Ganga', description: 'Drive or take the train to Haridwar (5–6 hours). Check in to hotel. Afternoon: visit Har Ki Pauri — the most sacred ghat in Haridwar where the Ganga is believed to flow at its most auspicious. Evening: attend the famous Ganga Aarti ceremony — hundreds of priests perform the ritual simultaneously at sunset with fire, music, and prayer. One of India\'s most moving experiences. Dinner and overnight.', meals: 'Dinner', hotel: '3★ Hotel in Haridwar', activities: ['Har Ki Pauri ghat', 'Ganga Aarti ceremony', 'Haridwar market'] },
      { day: 2, title: 'Haridwar → Rishikesh — Rafting & Yoga Capital', description: 'Drive to Rishikesh (25 km, 45 minutes). Check in. Morning yoga session with a certified teacher on the banks of the Ganga — sunrise yoga in Rishikesh is transcendent. Afternoon: white-water rafting on the Ganga — 16 km stretch with Grade 3-4 rapids (Roller Coaster, Golf Course, Three Blind Mice, Club House). The Ganga here is clear, fast, and thrilling. Evening: explore Laxman Jhula and Ram Jhula — the famous suspension bridges and the colourful spiritual town around them.', meals: 'Breakfast', hotel: '3★ Hotel in Rishikesh', activities: ['Sunrise yoga on Ganga bank', 'White-water rafting 16 km', 'Laxman Jhula / Ram Jhula', 'Cafe hopping in Rishikesh'] },
      { day: 3, title: 'Rishikesh Adventure Day — Bungee, Zip-line & Camping', description: 'Today is for adrenaline. Jumpin Heights Rishikesh offers India\'s highest bungee jump (83m) — not for the faint-hearted but completely safe and internationally certified. Giant swing (55m), zip-line, and flying fox also available. Afternoon: either relax at a Ganga beach (many excellent cafes on the riverbank) or do a short trek to Neergarh Waterfall (5 km, easy). Evening: riverside bonfire dinner at your camp (if camping option selected).', meals: 'Breakfast', hotel: '3★ Hotel or Riverside Camp in Rishikesh', activities: ['Bungee jumping (83m)', 'Giant swing / zip-line', 'Neergarh Waterfall trek', 'Ganga beach relaxation'] },
      { day: 4, title: 'Rishikesh → Mussoorie — The Queen of Hills', description: 'Drive to Mussoorie (105 km, 3 hours). Mussoorie is Uttarakhand\'s most beloved hill station — a charming colonial town at 2,000m with views of the Doon Valley and Himalayan peaks. Check in. Visit Kempty Falls — a spectacular waterfall 15 km from Mussoorie. Walk the famous Camel\'s Back Road for sunset views. Explore the Mall Road — shops, cafes, and colonial architecture. Cable car to Gun Hill for 360-degree mountain views.', meals: 'Breakfast, Dinner', hotel: '3★ Hotel in Mussoorie', activities: ['Kempty Falls', 'Cable car to Gun Hill', 'Camel\'s Back Road walk', 'Mussoorie Mall Road'] },
      { day: 5, title: 'Mussoorie → Nainital — The Lake District of India', description: 'Drive to Nainital (280 km, 5 hours). Nainital is a gem — a perfectly shaped lake (Naini Lake) surrounded by seven hills and colonial architecture. Check in. Boat ride on Naini Lake — pedal boats, rowboats, and sailboats available. Cable car (ropeway) to Snow View Point (2,270m) for views of Nanda Devi, Trishul, and other peaks. Evening walk around the Mall Road around the lake. Nainital has India\'s best hill station market.', meals: 'Breakfast', hotel: '3★ Hotel in Nainital', activities: ['Naini Lake boat ride', 'Cable car to Snow View Point', 'Nainital Mall Road', 'Hanuman Garhi Temple'] },
      { day: 6, title: 'Nainital — Morning Exploration & Return to Delhi', description: 'Early morning lake-side walk — Nainital at dawn is magical, with mist over the lake and minimal crowds. Visit Naina Devi Temple (on the northern shore of Naini Lake). Quick visit to Eco Cave Gardens. After lunch, drive back to Delhi (300 km, 6 hours). Arrive Delhi by evening.', meals: 'Breakfast', hotel: 'Departure', activities: ['Naini Lake dawn walk', 'Naina Devi Temple', 'Eco Cave Gardens', 'Return to Delhi'] },
    ],

    includes: [
      'All road transport in private AC vehicles throughout',
      '5 nights accommodation (3-star): Haridwar (1N), Rishikesh (2N), Mussoorie (1N), Nainital (1N)',
      'Daily breakfast throughout',
      'Ganga Aarti viewing at Haridwar Har Ki Pauri',
      'White-water rafting on Ganga (16 km)',
      'Sunrise yoga session in Rishikesh',
      'Professional mountain driver and YlooTrips coordinator',
      '24/7 WhatsApp support',
    ],

    excludes: [
      'Bungee jumping (optional — ₹3,550/person at Jumpin Heights)',
      'Meals except breakfasts and Mussoorie dinner',
      'Char Dham yatra (requires 7–14 additional days)',
      'Travel insurance (recommended)',
      'Jim Corbett safari (optional add-on — ₹4,500/person)',
    ],

    reviews: [
      { name: 'Priya & Rohan Mehta', country: 'Mumbai, India', flag: '🇮🇳', rating: 5, text: 'The Ganga Aarti was the most moving experience of our lives. Rishikesh rafting was thrilling. And Nainital lake at dawn was stunning. Perfect trip!', date: 'October 2025', trip: 'Uttarakhand 5N Package' },
      { name: 'Karan Singh', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'Did the bungee at Jumpin Heights — terrifying and incredible. The rafting day before was already amazing. YlooTrips sorted everything perfectly.', date: 'April 2026', trip: 'Uttarakhand Adventure Package' },
      { name: 'Ananya Iyer', country: 'Bangalore, India', flag: '🇮🇳', rating: 4, text: 'Loved the yoga session and the peaceful Rishikesh vibe. Nainital was beautiful. Good value package overall.', date: 'March 2026', trip: 'Uttarakhand Tour' },
    ],

    avgRating: 4.8,
    reviewCount: 2130,

    related: [
      { title: 'Himachal Tour Package — 5 Nights', href: '/himachal-tour-package', priceINR: 13999, image: 'https://images.unsplash.com/photo-1580889240742-fd4db5f27f8a?w=600&q=80' },
      { title: 'Kashmir Tour Package — 5 Nights', href: '/kashmir-tour-package', priceINR: 24999, image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80' },
      { title: 'Ladakh Tour Package — 6 Nights', href: '/ladakh-tour-package', priceINR: 22999, image: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Uttarakhand Tour Package (5 nights ₹11,999). Please share availability.",
    bookingHref: '/contact?package=uttarakhand-tour-package',

    faqs: [
      { question: 'What is the best time to visit Uttarakhand?', answer: 'March–June (summer) and September–November (post-monsoon) are the best months. Avoid July–August (heavy rain, landslides on mountain roads). Char Dham yatra: May–October.' },
      { question: 'Is Rishikesh good for non-adventurous travelers?', answer: 'Absolutely. Rishikesh is equally wonderful for those seeking spirituality and peace. The Ganga Aarti, yoga, temple visits, and riverside cafes require no physical adventure at all.' },
      { question: 'Is white-water rafting safe in Rishikesh?', answer: 'Yes — Rishikesh rafting is internationally certified, the operators are experienced, and life jackets and helmets are mandatory. The Ganga water is cold but crystal clear in Rishikesh.' },
      { question: 'Can I do Char Dham on this package?', answer: 'Char Dham (Kedarnath, Badrinath, Gangotri, Yamunotri) requires 7–14 additional days. We offer dedicated Char Dham packages — WhatsApp us for details.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
