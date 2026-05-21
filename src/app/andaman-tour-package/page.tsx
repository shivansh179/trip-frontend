import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Andaman Tour Package 2026 — 4 Nights Starting ₹24,999 | YlooTrips',
  description: 'Book Andaman tour packages starting ₹24,999. Port Blair, Havelock Island (Radhanagar Beach), Neil Island, Cellular Jail. 4 nights / 5 days — scuba diving, snorkelling, and pristine beaches.',
  keywords: 'Andaman tour package, Andaman Nicobar trip, Havelock Island package, Port Blair tour, Andaman holiday package 2026, Andaman scuba diving, Andaman trip cost from Delhi, Andaman package from India',
  openGraph: {
    title: 'Andaman Tour Package 2026 — 4 Nights Starting ₹24,999',
    description: 'Havelock Island, Neil Island, Port Blair, Cellular Jail — scuba diving, snorkelling, pristine beaches in 5 days.',
    url: 'https://www.ylootrips.com/andaman-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1200&q=80', width: 1200, height: 630, alt: 'Andaman Havelock Island crystal clear water beach' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/andaman-tour-package' },
};

export default async function AndamanPackagePage() {
  const prices = await getPackagePrice('andaman-tour-package');

  const pkg: PackageData = {
    slug: 'andaman-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/andaman-tour-package',
    metaTitle: 'Andaman Tour Package 2026 — 4 Nights Starting ₹24,999 | YlooTrips',
    metaDescription: 'Port Blair, Havelock, Neil Island — 4 nights scuba diving, snorkelling, and pristine beaches in the Andaman Islands.',
    keywords: 'Andaman tour package from Delhi, Havelock Island scuba diving',
    ogImage: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1600&q=85',
    heroTitle: 'Andaman Islands Tour Package',
    heroSubtitle: 'Havelock · Neil Island · Port Blair — Where India Meets the Andaman Sea',
    tagline: "India's Most Beautiful Beaches",

    duration: '4 Nights / 5 Days',
    groupSize: 'Couple, Family or Small Group',
    difficulty: 'Easy (beach destination)',
    startLocation: 'Delhi/Chennai/Kolkata → Port Blair (by air)',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 30,

    overview: [
      'The Andaman Islands are India\'s most spectacular beach destination — and one of the world\'s best. Over 570 islands in the Bay of Bengal, barely 37 of which are inhabited. Radhanagar Beach on Havelock Island is consistently ranked among Asia\'s best beaches. The coral reefs around Neil Island and Havelock host some of the most vibrant marine life in the Indian Ocean.',
      'Our 4-night package covers the essential Andaman circuit: Port Blair (the capital, history of the Cellular Jail), Havelock Island (the star — turquoise water, world-class scuba diving, Radhanagar Beach), and Neil Island (the quiet gem with fantastic snorkelling and natural rock bridges).',
      'The Andamans are remote — only accessible by air (2.5–3 hours from mainland) or a 3-day ferry. Our package includes flights + inter-island ferries + accommodation + activities. Everything is pre-arranged so you just step off the plane into paradise.',
    ],

    highlights: [
      'Radhanagar Beach (Havelock) — ranked among Asia\'s 10 best beaches',
      'Scuba diving — world-class visibility, coral gardens, manta rays, sea turtles',
      'Snorkelling at Neil Island\'s vibrant coral reefs',
      'Cellular Jail — the historic "Kala Pani" where freedom fighters were imprisoned',
      'Elephant Beach, Havelock — accessible only by boat, pristine and untouched',
      'Neil Island natural rock bridges and Bharatpur Beach',
      'Glass-bottom boat rides over coral reefs',
      'Mangrove creeks by kayak',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=800&q=80', alt: 'Havelock Island Radhanagar Beach Andaman crystal water', label: 'Radhanagar Beach' },
      { src: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&q=80', alt: 'Andaman scuba diving coral reef fish', label: 'Scuba Diving' },
      { src: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80', alt: 'Neil Island natural bridge Andaman', label: 'Neil Island' },
      { src: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=800&q=80', alt: 'Andaman mangrove kayaking creek', label: 'Mangrove Kayaking' },
      { src: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?w=800&q=80', alt: 'Port Blair Cellular Jail Andaman history', label: 'Cellular Jail' },
    ],

    itinerary: [
      { day: 1, title: 'Fly to Port Blair — Cellular Jail & History', description: 'Fly to Veer Savarkar International Airport, Port Blair (2.5h from Kolkata, 3h from Chennai/Delhi). Port Blair is the gateway to the Andamans — a fascinating place in its own right. Check in to hotel. Afternoon: Cellular Jail (Kala Pani) — the British colonial prison where Indian freedom fighters including Veer Savarkar were held in solitary confinement. The Sound & Light Show in the evening is deeply moving (1.5 hours). Corbyn\'s Cove beach for a sunset swim.', meals: 'Dinner', hotel: '3★ Hotel in Port Blair', activities: ['Cellular Jail & Sound and Light Show', 'Corbyn\'s Cove beach', 'Ross Island (optional, 30-min boat ride)'] },
      { day: 2, title: 'Port Blair → Havelock Island — Paradise Found', description: 'Morning: take the Makruzz or Green Ocean ferry to Havelock Island (Swaraj Dweep) — 1.5–2 hours across the bay. Havelock is the crown jewel of the Andamans. Check in. Afternoon: Radhanagar Beach — 7 km of pure white sand with turquoise water so clear you can see the sand 10m deep. This is your first full beach experience. Sunset at Radhanagar is extraordinary — colours you have to see to believe. Evening: fresh seafood dinner at beach shacks.', meals: 'Breakfast, Dinner', hotel: '3★ Beach Resort, Havelock', activities: ['Makruzz ferry Port Blair → Havelock', 'Radhanagar Beach (Beach No. 7)', 'Sunset on Radhanagar', 'Beachside seafood dinner'] },
      { day: 3, title: 'Havelock — Scuba Diving & Elephant Beach', description: 'Morning: scuba diving session with certified PADI instructors at sites around Havelock — Lighthouse, Fish Rock, and Mac Point are world-class. The coral is vibrant, visibility can reach 20–30m, and you will likely see sea turtles, moray eels, and reef sharks. Even beginners are welcome — no experience needed for a discovery dive. Afternoon: take a boat to Elephant Beach — a beach accessible only by sea, with incredible snorkelling right off the shore. Coral gardens 1–3 metres deep, glass-bottom boat option. Evening at leisure on Havelock.', meals: 'Breakfast', hotel: '3★ Beach Resort, Havelock', activities: ['Scuba diving at Havelock dive sites', 'Boat trip to Elephant Beach', 'Snorkelling at Elephant Beach', 'Glass-bottom boat'] },
      { day: 4, title: 'Havelock → Neil Island — The Quiet Gem', description: 'Morning ferry to Neil Island (Shaheed Dweep) — 45 minutes. Neil Island is smaller, quieter, and wilder than Havelock. Check in to beach guesthouse. Visit Natural Bridge — an arch of ancient coral rock formed over thousands of years, best seen at low tide. Bharatpur Beach — calm, shallow, perfect for snorkelling with an underwater world just 1–2 metres deep. Laxmanpur Beach at sunset — the prettiest sunset spot in the Andamans. Dinner at a Neil Island local restaurant.', meals: 'Breakfast, Dinner', hotel: 'Beachside Guesthouse, Neil Island', activities: ['Ferry to Neil Island', 'Natural Rock Bridge', 'Bharatpur Beach snorkelling', 'Laxmanpur Beach sunset'] },
      { day: 5, title: 'Neil Island → Port Blair — Departure', description: 'Early morning walk on the beach before the island wakes up. Return ferry to Port Blair (1.5 hours). Depending on your flight time: Samudrika Marine Museum (coral, fish, and Andamanese tribal exhibits) and North Bay Island (10-min boat from Port Blair — coral reef walk-in snorkelling). Transfer to airport for your return flight.', meals: 'Breakfast', hotel: 'Departure', activities: ['Morning beach walk', 'Ferry back to Port Blair', 'Samudrika Marine Museum', 'Airport departure'] },
    ],

    includes: [
      'Return flights from Delhi/Chennai/Kolkata to Port Blair',
      'Ferry tickets: Port Blair → Havelock → Neil Island → Port Blair (Makruzz)',
      '4 nights accommodation: Port Blair (1N), Havelock (2N), Neil Island (1N)',
      'Daily breakfast throughout',
      'Cellular Jail entry and Sound & Light Show',
      'Boat trip to Elephant Beach with snorkelling equipment',
      'Discovery scuba diving at Havelock (1 dive, certified instructor)',
      'All local transfers by auto and taxi',
      'Dedicated YlooTrips coordinator',
    ],

    excludes: [
      'Additional scuba dives (₹3,500/dive for certified divers)',
      'Sea-walk or underwater sea-walk (optional, ₹3,500/person)',
      'Meals except breakfasts and two dinners',
      'Travel insurance (strongly recommended)',
      'Alcohol and personal expenses',
    ],

    reviews: [
      { name: 'Rahul & Deepika Sharma', country: 'Delhi, India', flag: '🇮🇳', rating: 5, text: 'Radhanagar Beach is the most beautiful place we\'ve ever seen. The scuba diving on day 3 was life-changing — sea turtles, vibrant coral. YlooTrips took care of every detail perfectly.', date: 'February 2026', trip: 'Andaman 4N Package' },
      { name: 'James & Emma Wilson', country: 'Sydney, Australia', flag: '🇦🇺', rating: 5, text: 'Came to India specifically for Andamans. The diving rivals the Great Barrier Reef at a fraction of the cost. Havelock is stunning. YlooTrips sorted everything — great value.', date: 'January 2026', trip: 'Andaman Diving Package' },
      { name: 'Anita Krishnamurthy', country: 'Bangalore, India', flag: '🇮🇳', rating: 5, text: 'First time doing scuba — I was nervous but the instructors were patient and professional. Seeing fish and coral underwater for the first time is something I\'ll never forget.', date: 'March 2026', trip: 'Andaman Tour' },
    ],

    avgRating: 4.9,
    reviewCount: 1490,

    related: [
      { title: 'Goa Tour Package — 3 Nights', href: '/goa-tour-package', priceINR: 9999, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
      { title: 'Kerala Tour Package — 5 Nights', href: '/kerala-tour-package', priceINR: 15999, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80' },
      { title: 'Sri Lanka Tour Package — 5 Nights', href: '/sri-lanka-tour-package', priceINR: 28999, image: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Andaman Tour Package (4 nights ₹24,999). Please share availability.",
    bookingHref: '/contact?package=andaman-tour-package',

    faqs: [
      { question: 'What is the best time to visit Andaman?', answer: 'November to May is ideal — clear skies, calm seas, excellent visibility for diving and snorkelling. Peak season: December–February. Avoid June–September (heavy monsoon, most boats suspended).' },
      { question: 'Is Andaman suitable for non-swimmers?', answer: 'Yes. Many beach activities (sunbathing, glass-bottom boat, mangrove walks) don\'t require swimming. The discovery scuba dive is done with an instructor who guides you — you don\'t need to know how to swim independently.' },
      { question: 'Do I need a permit for Andaman?', answer: 'No permit is required for Indian nationals visiting Port Blair, Havelock, and Neil Island. Certain tribal-protected areas (Jarawa Reserve) are accessible only on the highway — photography strictly prohibited.' },
      { question: 'Are ATMs available on the islands?', answer: 'Port Blair has reliable ATMs. Havelock has 1–2 ATMs that often run out of cash on weekends. Neil Island has very limited ATM access. Carry sufficient cash from Port Blair — we strongly recommend this.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
