import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Ladakh Tour Package 2026 — 6 Nights Starting ₹22,999 | YlooTrips',
  description: 'Book Ladakh tour packages starting ₹22,999. Leh, Pangong Lake, Nubra Valley, Khardung La, Tso Moriri. 6 nights / 7 days — high-altitude adventure in the Himalayas.',
  keywords: 'Ladakh tour package, Leh Ladakh trip, Ladakh holiday package 2026, Pangong Lake trip, Nubra Valley tour, Ladakh trip from Delhi, Ladakh package cost, Khardung La pass trip',
  openGraph: {
    title: 'Ladakh Tour Package 2026 — 6 Nights Starting ₹22,999',
    description: 'Leh, Pangong Lake, Nubra Valley, Khardung La — 6 nights across the roof of India.',
    url: 'https://www.ylootrips.com/ladakh-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80', width: 1200, height: 630, alt: 'Ladakh mountains Pangong Lake blue sky' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/ladakh-tour-package' },
};

export default async function LadakhPackagePage() {
  const prices = await getPackagePrice('ladakh-tour-package');

  const pkg: PackageData = {
    slug: 'ladakh-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/ladakh-tour-package',
    metaTitle: 'Ladakh Tour Package 2026 — 6 Nights Starting ₹22,999 | YlooTrips',
    metaDescription: 'Leh, Pangong Tso, Nubra Valley, Khardung La — 6 nights across the world\'s most dramatic high-altitude landscape.',
    keywords: 'Ladakh tour package from Delhi, Leh Ladakh trip package, Pangong Lake tour',
    ogImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85',
    heroTitle: 'Ladakh Tour Package',
    heroSubtitle: 'Leh · Pangong Tso · Nubra Valley · Khardung La — The Roof of India in 7 Days',
    tagline: 'The Last Shangri-La',

    duration: '6 Nights / 7 Days',
    groupSize: 'Couple, Friends, Small Group',
    difficulty: 'Moderate (high altitude)',
    startLocation: 'Delhi → Leh (direct flight, 1.5h)',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 30,

    overview: [
      'Ladakh is unlike anywhere else on earth. At 3,500 metres altitude, the landscape is a staggering panorama of barren mountains, impossibly blue lakes, ancient monasteries, and Buddhist prayer flags fluttering in a crystal clear sky. The "Land of High Passes" earns its name — Khardung La (5,359m) is one of the highest motorable roads in the world.',
      'Our 6-night package covers the essential Ladakh circuit. You\'ll acclimatise in Leh (3,524m) before pushing to Pangong Tso (4,350m) — the extraordinary lake that turns from blue to green to turquoise depending on the angle of light. Nubra Valley (north of Khardung La) has double-humped Bactrian camels and the surreal dunes of Hunder. Then Tso Moriri (4,500m) — a remote, pristine lake that makes Pangong look crowded.',
      'Ladakh demands respect. The altitude is serious — we build 2 acclimatisation days into the itinerary and our vehicles always carry oxygen. Best season: June–September. July–August is peak but magnificent.',
    ],

    highlights: [
      'Pangong Tso — the most photographed lake in India (4,350m altitude)',
      'Khardung La Pass — one of the highest motorable roads in the world (5,359m)',
      'Nubra Valley — Bactrian camel rides on sand dunes at 10,000 feet',
      'Tso Moriri — remote sacred lake, flamingos, and no crowds',
      'Thiksey Monastery — the "Ladakhi Potala Palace" at sunrise',
      'Magnetic Hill and Gurudwara Pathar Sahib',
      'Leh Palace and Shanti Stupa',
      'Hemis Monastery — the richest monastery in Ladakh',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', alt: 'Pangong Tso Lake Ladakh blue mountains', label: 'Pangong Tso' },
      { src: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=800&q=80', alt: 'Nubra Valley Ladakh Bactrian camel sand dunes', label: 'Nubra Valley' },
      { src: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80', alt: 'Thiksey Monastery Ladakh sunrise', label: 'Thiksey Monastery' },
      { src: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800&q=80', alt: 'Leh Ladakh Buddhist monastery prayer flags', label: 'Buddhist Monastery' },
      { src: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&q=80', alt: 'Khardung La Pass highest road Ladakh', label: 'Khardung La' },
    ],

    itinerary: [
      { day: 1, title: 'Fly to Leh — Acclimatisation Day 1', description: 'Fly from Delhi to Leh (1.5 hours — one of the most dramatic flight approaches in the world, with Himalayan peaks at window level). Arrive Leh (3,524m). This is a HIGH-ALTITUDE destination — DO NOT exert yourself on Day 1. Rest in hotel, drink plenty of water, eat light. Brief afternoon walk to Shanti Stupa for panoramic city views (walk slowly). Leh Palace (external view only Day 1). Sunset from the rooftop. Early dinner and sleep.', meals: 'Breakfast, Dinner', hotel: '3★ Hotel/Guesthouse in Leh', activities: ['Acclimatisation rest', 'Shanti Stupa stroll (slow)', 'Leh Palace exterior', 'Rooftop sunset'] },
      { day: 2, title: 'Leh — Acclimatisation Day 2 + Local Sights', description: 'Day 2 acclimatisation — you should feel significantly better today. Morning: Leh Palace (interior) — the 17-storey palace abandoned in the 19th century, offers panoramic views of Leh city and the Indus Valley. Leh Market for Ladakhi handicrafts, pashmina, and thangka paintings. Afternoon: Hemis Monastery — 45 km from Leh, the richest and most ornate monastery in Ladakh. Thiksey Monastery (early morning is best for sunrise prayers — we\'ll go tomorrow at 5am). Stakna Monastery. Evening in Leh.', meals: 'Breakfast', hotel: '3★ Hotel/Guesthouse in Leh', activities: ['Leh Palace interior', 'Leh Market', 'Hemis Monastery', 'Thiksey Monastery (at dusk)'] },
      { day: 3, title: 'Leh → Pangong Tso (via Chang La Pass)', description: 'Early start. Drive to Pangong Tso (155 km, 5 hours) via Chang La Pass (5,360m — one of the highest passes in the world). The drive is unforgettable — barren lunar landscape, prayer flags, and sudden views of the lake. Pangong Tso stretches 134 km into Tibet; only 45 km is in India. The lake\'s colour shifts from deep blue to turquoise to green depending on the sun — nothing prepares you for it. Sunset at the lakeshore. Overnight in a camp/guesthouse at Pangong.', meals: 'Breakfast, Dinner', hotel: 'Camp/Guesthouse at Pangong Tso', activities: ['Chang La Pass (5,360m)', 'Pangong Tso Lake', 'Sunset at Pangong', 'Overnight at lake'] },
      { day: 4, title: 'Pangong → Nubra Valley (via Khardung La)', description: 'Sunrise at Pangong Tso — the lake turns gold. After breakfast, drive back to Leh and continue north over Khardung La Pass (5,359m — bring warm clothes, the summit is freezing and windy). Descend into Nubra Valley — a sudden burst of green, sand dunes, and warm temperatures after the cold mountains. Hunder Sand Dunes: ride a Bactrian double-humped camel across the dunes at sunset — one of Ladakh\'s most surreal experiences. Overnight at Hunder or Diskit.', meals: 'Breakfast, Dinner', hotel: 'Camp/Guesthouse in Nubra Valley', activities: ['Sunrise at Pangong', 'Khardung La Pass (5,359m)', 'Hunder Sand Dunes', 'Bactrian camel ride at sunset'] },
      { day: 5, title: 'Nubra Valley — Diskit Monastery & Return to Leh', description: 'Morning: Diskit Monastery — the oldest and largest monastery in Nubra Valley, with a 32-metre Maitreya (Future Buddha) statue overlooking the Shyok River. Sumur and Panamik hot springs (optional). Return to Leh via Khardung La (second crossing — you\'ll recognise the landscape now). Evening in Leh.', meals: 'Breakfast', hotel: '3★ Hotel/Guesthouse in Leh', activities: ['Diskit Monastery & Maitreya Buddha', 'Panamik hot springs (optional)', 'Return over Khardung La'] },
      { day: 6, title: 'Leh → Tso Moriri (Remote Sacred Lake)', description: 'Drive to Tso Moriri (220 km, 6 hours) via the Indus Valley and Chumathang hot springs. Tso Moriri (4,522m) is the most remote and pristine lake in Ladakh — fewer tourists, wild Tibetan wildlife (kiang/Tibetan wild ass, bar-headed geese, Brahminy ducks, and black-necked cranes). Moriri village has a small gompa and traditional Changpa nomad community. Sunset at the lake. Overnight at Korzok guesthouse on the lakeshore.', meals: 'Breakfast, Dinner', hotel: 'Guesthouse/Camp at Tso Moriri', activities: ['Indus Valley drive', 'Chumathang hot springs', 'Tso Moriri Lake', 'Korzok Monastery', 'Wildlife spotting'] },
      { day: 7, title: 'Tso Moriri → Leh → Delhi', description: 'Sunrise at Tso Moriri. Return drive to Leh (4–5 hours). Quick stop at Magnetic Hill (gravity-defying road optical illusion) and Gurudwara Pathar Sahib. Arrive Leh for afternoon flight to Delhi. End of an extraordinary journey.', meals: 'Breakfast', hotel: 'Departure', activities: ['Tso Moriri sunrise', 'Magnetic Hill', 'Gurudwara Pathar Sahib', 'Return flight to Delhi'] },
    ],

    includes: [
      'Return economy flights Delhi ↔ Leh',
      '6 nights accommodation: Leh guesthouse (3N), Pangong camp/guesthouse (1N), Nubra Valley camp (1N), Tso Moriri (1N)',
      'Daily breakfast throughout + 3 dinners',
      'Inner Line Permit (ILP) for Nubra, Pangong, and Tso Moriri',
      'Private Innova/Ertiga with experienced Ladakhi driver',
      'Bactrian camel ride at Hunder',
      'Oxygen cylinder in vehicle (emergency)',
      'Dedicated YlooTrips coordinator',
    ],

    excludes: [
      'Personal expenses and shopping',
      'Altitude sickness medication (bring Diamox prescribed by your doctor)',
      'Meals except breakfasts and 3 dinners',
      'Travel insurance (essential for Ladakh)',
      'Tips for driver and guide',
    ],

    reviews: [
      { name: 'Vikram & Shreya Nair', country: 'Bangalore, India', flag: '🇮🇳', rating: 5, text: 'Ladakh destroyed all our benchmarks. Pangong Tso is indescribably beautiful. Nubra with the camels was surreal. And Tso Moriri was the most peaceful place I have ever been. YlooTrips was flawless.', date: 'July 2026', trip: 'Ladakh 6N Package' },
      { name: 'Tom & Helen Parker', country: 'Vancouver, Canada', flag: '🇨🇦', rating: 5, text: 'We\'ve been to Patagonia, Namibia, and Mongolia. Ladakh rivals all of them. The altitude is real — Day 1 rest rule is essential. But from Day 2 onwards: pure magic.', date: 'August 2025', trip: 'Ladakh Grand Circuit' },
      { name: 'Harsh Agarwal', country: 'Mumbai, India', flag: '🇮🇳', rating: 5, text: 'Third time in Ladakh and this was the best organised trip. Tso Moriri is criminally undervisited. ILP permits, accommodation, driver — everything sorted perfectly by YlooTrips.', date: 'June 2026', trip: 'Ladakh Tour Package' },
    ],

    avgRating: 4.9,
    reviewCount: 2050,

    related: [
      { title: 'Kashmir Tour Package — 5 Nights', href: '/kashmir-tour-package', priceINR: 24999, image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&q=80' },
      { title: 'Spiti Valley Tour — 7 Nights', href: '/spiti-valley-tour-package', priceINR: 19999, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80' },
      { title: 'Himachal Tour Package — 5 Nights', href: '/himachal-tour-package', priceINR: 13999, image: 'https://images.unsplash.com/photo-1580889240742-fd4db5f27f8a?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Ladakh Tour Package (6 nights ₹22,999). Please share availability.",
    bookingHref: '/contact?package=ladakh-tour-package',

    faqs: [
      { question: 'Is altitude sickness a real concern in Ladakh?', answer: 'Yes — Leh is at 3,524m and Khardung La is at 5,359m. Most people feel mild symptoms (headache, fatigue) on arrival. Our 2-day acclimatisation schedule prevents serious AMS. Take Diamox (consult your doctor before the trip), drink 3–4 litres of water daily, and avoid alcohol for the first 48 hours.' },
      { question: 'What is the best time to visit Ladakh?', answer: 'June–September. The road from Manali opens around late May. July–August is peak season — best weather, all roads open, festivals. September is ideal for fewer crowds and lower prices. The airport is open year-round but winter roads are closed.' },
      { question: 'Do I need a permit for Ladakh?', answer: 'Indian nationals need an Inner Line Permit (ILP) to visit Nubra Valley, Pangong Tso, and Tso Moriri. The ILP is obtained in Leh on arrival — we handle this for you. Foreign nationals need additional documentation.' },
      { question: 'Can I do this package on a motorbike?', answer: 'Yes — we offer a dedicated Ladakh bike trip package (Enfield/Himalayan rental included). WhatsApp us for the separate Ladakh Bike Trip quote.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
