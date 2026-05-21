import type { Metadata } from 'next';
import PackagePageLayout, { type PackageData } from '@/components/PackagePageLayout';
import { getPackagePrice } from '@/lib/packagePrices';

export const metadata: Metadata = {
  title: 'Rajasthan Tour Package 2026 — 6 Nights Starting ₹14,999 | YlooTrips',
  description: 'Book Rajasthan tour packages starting ₹14,999. Jaipur, Jodhpur, Jaisalmer, Udaipur — 6 nights / 7 days of forts, palaces, desert safaris, and lake city romance.',
  keywords: 'Rajasthan tour package, Rajasthan trip from Delhi, Jaipur Jodhpur Jaisalmer Udaipur package, Rajasthan holiday package 2026, Golden Triangle Rajasthan, desert safari Rajasthan, Rajasthan 7 days itinerary',
  openGraph: {
    title: 'Rajasthan Tour Package 2026 — 6 Nights Starting ₹14,999',
    description: 'Jaipur forts, Jodhpur Blue City, Jaisalmer desert, Udaipur lakes — 6 nights covering the Royal Rajasthan circuit.',
    url: 'https://www.ylootrips.com/rajasthan-tour-package',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80', width: 1200, height: 630, alt: 'Rajasthan fort palace tour package' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/rajasthan-tour-package' },
};

export default async function RajasthanPackagePage() {
  const prices = await getPackagePrice('rajasthan-tour-package');

  const pkg: PackageData = {
    slug: 'rajasthan-tour-package',
    canonicalUrl: 'https://www.ylootrips.com/rajasthan-tour-package',
    metaTitle: 'Rajasthan Tour Package 2026 — 6 Nights Starting ₹14,999 | YlooTrips',
    metaDescription: 'Jaipur, Jodhpur, Jaisalmer, Udaipur — 6 nights across the Royal Rajasthan circuit. Forts, palaces, desert camel safaris.',
    keywords: 'Rajasthan tour package from Delhi, Jaipur Jodhpur Udaipur package',
    ogImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80',

    heroImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1600&q=85',
    heroTitle: 'Rajasthan Tour Package',
    heroSubtitle: 'Jaipur · Jodhpur · Jaisalmer · Udaipur — Royal India in 7 Days',
    tagline: 'The Land of Kings',

    duration: '6 Nights / 7 Days',
    groupSize: 'Solo, Couple, Family or Group',
    difficulty: 'Easy (All Ages)',
    startLocation: 'Delhi → Jaipur (by road or train)',

    priceINR: prices.priceINR,
    priceUSD: Math.round(prices.priceINR / 83),
    originalPriceINR: prices.originalPriceINR,
    depositPercent: 25,

    overview: [
      'Rajasthan — the "Land of Kings" — is India at its most spectacular. Massive Mughal-era forts dominate skylines, painted havelis (mansions) line bazaar streets, camel caravans cross golden sand dunes, and lakes shimmer with palace reflections. No state delivers the visual drama of Rajasthan.',
      'Our 6-night circuit takes you through the four essential Rajasthan cities. Jaipur (the Pink City) — Amber Fort, City Palace, Hawa Mahal. Jodhpur (the Blue City) — Mehrangarh Fort towering over a sea of blue-painted houses. Jaisalmer (the Golden City) — a fort literally made of gold sandstone, rising from the Thar Desert. Udaipur (the City of Lakes) — the most romantic city in India, with its palaces floating on Lake Pichola.',
      'Best months: October–March. Winter evenings (December–February) are cold but magical. October has the best deals and post-monsoon green landscape against the golden forts.',
    ],

    highlights: [
      'Jaipur — Amber Fort, City Palace, Jantar Mantar (UNESCO), Hawa Mahal',
      'Jodhpur — Mehrangarh Fort (India\'s best fort), Jaswant Thada, Blue City walk',
      'Jaisalmer — Golden Fort (only living fort in India), Patwon Ki Haveli',
      'Sam Sand Dunes — sunset camel safari and desert camp with folk music',
      'Udaipur — City Palace, Lake Pichola sunset cruise, Jagdish Temple',
      'Traditional Rajasthani thali dinners',
      'Folk music and puppet show evening',
    ],

    gallery: [
      { src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', alt: 'Rajasthan Amber Fort Jaipur elephant', label: 'Amber Fort, Jaipur' },
      { src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80', alt: 'Jodhpur Blue City Mehrangarh Fort', label: 'Mehrangarh, Jodhpur' },
      { src: 'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&q=80', alt: 'Jaisalmer Golden Fort desert Rajasthan', label: 'Jaisalmer Fort' },
      { src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80', alt: 'Sam Sand Dunes camel safari sunset Rajasthan', label: 'Desert Safari' },
      { src: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800&q=80', alt: 'Udaipur City Palace Lake Pichola Rajasthan', label: 'Udaipur' },
    ],

    itinerary: [
      { day: 1, title: 'Delhi → Jaipur — The Pink City', description: 'Drive or take the fast train to Jaipur (5 hours by car, 4.5 hours by train). Jaipur is the capital of Rajasthan and anchor of the Golden Triangle. Afternoon: visit Hawa Mahal (Palace of Winds) — the iconic five-storey honeycomb facade built for royal ladies to observe street processions. City Palace — the royal residence still occupied by the Jaipur royal family. Jantar Mantar — the UNESCO-listed 18th century astronomical observatory. Evening: dinner at a traditional haveli restaurant with live folk music.', meals: 'Dinner', hotel: '3★ Hotel in Jaipur', activities: ['Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Jaipur bazaar'] },
      { day: 2, title: 'Jaipur — Amber Fort & Local Sights', description: 'Morning: Amber Fort — 11 km from Jaipur, the magnificent Rajput fort complex built in 1592. Explore the Sheesh Mahal (Hall of Mirrors), Diwan-e-Aam, and the dramatic ramparts with views over the lake and hills. Elephant rides available (optional). Afternoon: Nahargarh Fort for panoramic Jaipur views. Jaipur bazaars — Johari Bazaar (jewelry), Bapu Bazaar (textiles), and Nehru Bazaar (shoes) are famous across India. Block-printing workshop visit.', meals: 'Breakfast', hotel: '3★ Hotel in Jaipur', activities: ['Amber Fort', 'Sheesh Mahal (Hall of Mirrors)', 'Nahargarh Fort', 'Jaipur bazaar shopping'] },
      { day: 3, title: 'Jaipur → Jodhpur — The Blue City', description: 'Drive to Jodhpur (330 km, 5 hours). Jodhpur is jaw-dropping — thousands of houses painted the same shade of indigo-blue stretch to the base of Mehrangarh Fort, one of the largest forts in India. Visit Mehrangarh Fort — perched 120m above the city, its massive walls and intricate carvings are stunning. Jaswant Thada (marble cenotaph). Evening: walk through the winding lanes of the old city — indigo walls, chai shops, and spice vendors.', meals: 'Breakfast, Dinner', hotel: '3★ Hotel in Jodhpur', activities: ['Mehrangarh Fort', 'Jaswant Thada', 'Blue City walking tour', 'Sardar Market'] },
      { day: 4, title: 'Jodhpur → Jaisalmer — The Golden City', description: 'Drive to Jaisalmer (290 km, 4.5 hours) through the Thar Desert landscape. Jaisalmer Fort is India\'s only "living fort" — people still live inside. Explore Patwon Ki Haveli (the most ornate merchant mansion in Rajasthan) and Nathmal Ki Haveli. Late afternoon: check in and head to Sam Sand Dunes (42 km from Jaisalmer) for the golden-hour camel safari. Watch the sunset from camelback. Evening: desert camp with folk musicians, fire, and traditional dinner.', meals: 'Breakfast, Dinner (desert camp)', hotel: 'Desert Camp near Jaisalmer', activities: ['Jaisalmer Fort (living fort)', 'Patwon Ki Haveli', 'Sam Sand Dunes camel safari', 'Desert camp with folk music'] },
      { day: 5, title: 'Jaisalmer → Udaipur — The City of Lakes', description: 'Drive to Udaipur (545 km, 8.5 hours) — the most romantic city in India. Long drive through Rajasthan\'s landscape — stop at Ranakpur Jain Temples (one of the most impressive Jain temple complexes in India, 1,444 carved marble pillars). Arrive Udaipur. City Palace — the largest royal palace complex in Rajasthan, rising directly from Lake Pichola. Evening: sunset boat ride on Lake Pichola — the Lake Palace Hotel (Taj) appears to float in the middle of the lake.', meals: 'Breakfast', hotel: '3★ Hotel in Udaipur', activities: ['Ranakpur Jain Temples (en route)', 'City Palace, Udaipur', 'Lake Pichola sunset cruise', 'Jagdish Temple'] },
      { day: 6, title: 'Udaipur — Lakes, Palaces & Local Sights', description: 'Full day in Udaipur. Saheliyon Ki Bari — the Garden of Maidens built for royal ladies, with fountains, kiosks, and marble elephants. Fateh Sagar Lake — a peaceful spot locals love. Shilpgram Crafts Village — a living museum of rural Rajasthani art and craft (folk performances in evenings). Bagore Ki Haveli Museum for the famous Rajasthani puppet show and folk dance performance. Udaipur bazaars for miniature paintings, silver jewellery, and block-print textiles.', meals: 'Breakfast', hotel: '3★ Hotel in Udaipur', activities: ['Saheliyon Ki Bari', 'Fateh Sagar Lake', 'Shilpgram Village', 'Bagore Ki Haveli folk show'] },
      { day: 7, title: 'Udaipur — Morning Exploration & Return', description: 'Early morning walk along Lake Pichola at sunrise — the most beautiful hour in Udaipur. Visit the Monsoon Palace (Sajjangarh) for panoramic views of the city, lakes, and Aravalli Hills. Lunch in Udaipur. Afternoon: fly or drive back to Delhi.', meals: 'Breakfast', hotel: 'Departure', activities: ['Sunrise at Lake Pichola', 'Sajjangarh (Monsoon Palace)', 'Return to Delhi'] },
    ],

    includes: [
      'All road transport in private AC vehicles throughout',
      '6 nights accommodation (3-star): Jaipur (2N), Jodhpur (1N), Jaisalmer/Desert Camp (1N), Udaipur (2N)',
      'Daily breakfast throughout',
      'Camel safari at Sam Sand Dunes',
      'Desert camp with folk music and dinner',
      'Lake Pichola sunset cruise, Udaipur',
      'Professional guides at all major forts',
      'Dedicated YlooTrips coordinator and 24/7 support',
    ],

    excludes: [
      'Delhi–Jaipur transport (train recommended — ₹600–1,800/person)',
      'Udaipur–Delhi return (train or flight)',
      'Amber Fort entry and elephant ride (optional)',
      'Meals except breakfast and two dinners',
      'Travel insurance',
      'Personal expenses and shopping',
    ],

    reviews: [
      { name: 'David & Sarah Thompson', country: 'London, UK', flag: '🇬🇧', rating: 5, text: 'Rajasthan blew our minds. The camel safari at Jaisalmer watching the sunset was pure magic. Mehrangarh Fort is the most impressive thing either of us have ever seen. Seamless organisation from YlooTrips.', date: 'November 2025', trip: 'Rajasthan Royal Circuit' },
      { name: 'Priya Nair', country: 'Dubai, UAE', flag: '🇦🇪', rating: 5, text: 'Came back to India for this trip after 5 years abroad. Rajasthan exceeded every expectation. Udaipur is like a fairy tale. The desert camp experience was unforgettable.', date: 'January 2026', trip: 'Rajasthan 6N Package' },
      { name: 'Sanjay & Family', country: 'Hyderabad, India', flag: '🇮🇳', rating: 5, text: 'Took the family (2 kids, 8 and 12 years old). Perfect for families — forts are endlessly fascinating for children. The camel ride was the kids\' highlight. Great guides.', date: 'December 2025', trip: 'Rajasthan Family Tour' },
    ],

    avgRating: 4.9,
    reviewCount: 3780,

    related: [
      { title: 'Golden Triangle Tour — 10 Days', href: '/tours/golden-triangle-10-day', priceINR: 29999, image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80' },
      { title: 'Goa Tour Package — 3 Nights', href: '/goa-tour-package', priceINR: 9999, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' },
      { title: 'Kerala Tour Package — 5 Nights', href: '/kerala-tour-package', priceINR: 15999, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80' },
    ],
    whatsappMsg: "Hi! I'm interested in the Rajasthan Tour Package (6 nights ₹14,999). Please share availability.",
    bookingHref: '/contact?package=rajasthan-tour-package',

    faqs: [
      { question: 'What is the best time to visit Rajasthan?', answer: 'October–March is ideal. November–February is peak season with perfect cool weather (15–25°C days). October has best deals and post-monsoon fresh landscape. Avoid April–June (40–48°C, extremely hot).' },
      { question: 'Is Rajasthan safe for international tourists?', answer: 'Yes — Rajasthan is one of India\'s most tourist-friendly states. Jaipur, Jodhpur, Jaisalmer, and Udaipur are all accustomed to international visitors. We provide private AC transport throughout so you never depend on public transport.' },
      { question: 'Is the camel safari suitable for children?', answer: 'Yes — camel safaris at Sam Dunes are very gentle and suitable for all ages. The camels walk slowly across the dunes. Children love it.' },
      { question: 'Can I add more days for Pushkar or Ranthambore?', answer: 'Yes. Pushkar (camels, sacred lake, Brahma Temple) is 2 hours from Jaipur. Ranthambore (tigers) is 3 hours from Jaipur. We can extend your itinerary — WhatsApp us for a custom quote.' },
    ],
  };

  return <PackagePageLayout pkg={pkg} />;
}
