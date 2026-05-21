import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Sun, Thermometer, Users, Tag, MessageCircle } from 'lucide-react';

interface MonthData {
  name: string;
  season: string;
  emoji: string;
  weather: string;
  tempRange: string;
  crowdLevel: string;
  priceLevel: string;
  summary: string;
  domesticPicks: { dest: string; why: string; href?: string }[];
  internationalPicks: { dest: string; why: string; href?: string }[];
  festivals: string[];
  avoid: string[];
  tips: string[];
}

const MONTHS: Record<string, MonthData> = {
  january: {
    name: 'January', season: 'Peak Winter', emoji: '❄️',
    weather: 'Clear, cool, and dry across most of India. North India 8–20°C. South India 22–30°C.',
    tempRange: '8–30°C (region dependent)',
    crowdLevel: 'High (peak season)',
    priceLevel: 'High (book 2–3 months ahead)',
    summary: 'January is peak season for south and west India — Goa, Rajasthan, Kerala are at their best. The weather is perfect: sunny days, cool nights, no rain. The downside is crowded beaches and premium prices. North India has pleasant days but cold nights. Himachal and Uttarakhand see snowfall.',
    domesticPicks: [
      { dest: 'Goa', why: 'Perfect beach weather, all beach shacks open, festive atmosphere', href: '/goa-tour-package' },
      { dest: 'Rajasthan', why: 'Best month for the desert — warm days, cold nights, Jaipur Literature Festival', href: '/rajasthan-tour-package' },
      { dest: 'Kerala', why: 'Backwaters, beaches, and wildlife at their peaceful best', href: '/kerala-tour-package' },
      { dest: 'Andaman', why: 'Crystal clear waters, best visibility for scuba diving', href: '/andaman-tour-package' },
      { dest: 'Ranthambore', why: 'Best tiger spotting — dry vegetation makes wildlife visible' },
    ],
    internationalPicks: [
      { dest: 'Dubai', why: 'Dubai\'s finest month — Dubai Shopping Festival, 22°C, outdoor activities', href: '/dubai-tour-package-from-delhi' },
      { dest: 'Maldives', why: 'Dry season peak — crystal blue waters, minimal rain', href: '/maldives-luxury-package' },
      { dest: 'Sri Lanka', why: 'West coast is perfect; cultural triangle at its best', href: '/sri-lanka-tour-package' },
    ],
    festivals: ['Jaipur Literature Festival (Jan 30–Feb 3)', 'Bikaner Camel Festival', 'Republic Day (Jan 26)', 'Pongal (Tamil Nadu)'],
    avoid: ['Ladakh (road closed)', 'Spiti Valley (winter road inaccessible)', 'High Himalayan treks'],
    tips: [
      'Book Goa and Rajasthan hotels 2–3 months in advance — they fill up',
      'Rajasthan evenings get cold (5–10°C) — carry a warm layer',
      'Andaman ferry tickets sell out in January — book early',
      'Dubai Shopping Festival has incredible deals — great for shopping',
    ],
  },
  february: {
    name: 'February', season: 'Late Winter', emoji: '🌸',
    weather: 'Similar to January but slightly warmer. Still ideal across South and West India.',
    tempRange: '10–32°C',
    crowdLevel: 'High but easing by end of month',
    priceLevel: 'High early month, better end-month deals',
    summary: 'February continues January\'s perfect weather in south India. Crowds and prices begin easing by the second half. Valentines season makes it popular for couples. Manali sees heavy snow. Northeast India starts warming up nicely.',
    domesticPicks: [
      { dest: 'Goa', why: 'Still peak — Goa Carnival (Feb) is a highlight', href: '/goa-tour-package' },
      { dest: 'Rajasthan', why: 'Jaisalmer Desert Festival (Feb) — camels, music, folk dance', href: '/rajasthan-tour-package' },
      { dest: 'Kerala', why: 'Stunning backwaters, Kathakali, Theyyam performances', href: '/kerala-tour-package' },
      { dest: 'Hampi', why: 'Vijayanagara ruins without the summer heat — perfect' },
      { dest: 'Manali', why: 'Snow activities — skiing, snowfall, snow-covered peaks', href: '/manali-tour-package' },
    ],
    internationalPicks: [
      { dest: 'Bali', why: 'Dry season — Nyepi (Balinese New Year, variable date) is unique', href: '/bali-honeymoon-package' },
      { dest: 'Dubai', why: 'Still excellent weather, Dubai Marathon, Dubai Tennis Championships', href: '/dubai-tour-package-from-delhi' },
      { dest: 'Singapore', why: 'Chinese New Year decorations and celebrations', href: '/singapore-tour-package' },
    ],
    festivals: ['Goa Carnival (February)', 'Jaisalmer Desert Festival', 'Vasant Panchami', 'Valentines Day'],
    avoid: ['Ladakh', 'Spiti Valley', 'High altitude Himalayan areas'],
    tips: [
      'February is best for a honeymoon in Rajasthan or Goa',
      'Goa Carnival (Feb) is wild — book accommodation well in advance',
      'Manali snow is beautiful but roads can be slippery — 4WD recommended',
    ],
  },
  march: {
    name: 'March', season: 'Pre-Summer', emoji: '🌺',
    weather: 'Temperatures rising. North India 18–30°C. Plains heating up. Hills delightful.',
    tempRange: '15–38°C',
    crowdLevel: 'Moderate — post-peak shoulder season',
    priceLevel: 'Good deals starting from mid-March',
    summary: 'March is the month of Holi, India\'s most colourful festival — plan around it. The hills come alive as snow melts. Goa and Rajasthan start winding down but still enjoyable. Himachal Pradesh routes starting to open. Great time for budget travel.',
    domesticPicks: [
      { dest: 'Mathura/Vrindavan', why: 'Holi celebrations — the most authentic Holi in India' },
      { dest: 'Himachal Pradesh', why: 'Snow melt, hill stations awakening, good hotel prices', href: '/himachal-tour-package' },
      { dest: 'Kodaikanal', why: 'Pleasant hill station, misty forests, affordable' },
      { dest: 'Andaman', why: 'Water still clear, off-peak prices, uncrowded beaches', href: '/andaman-tour-package' },
      { dest: 'Goa', why: 'Last good month — emptier beaches, lower prices', href: '/goa-tour-package' },
    ],
    internationalPicks: [
      { dest: 'Thailand', why: 'Pre-Songkran (Thai New Year water festival, April) prep', href: '/thailand-budget-trip' },
      { dest: 'Vietnam', why: 'Ideal time for central and north Vietnam', href: '/vietnam-tour-package' },
      { dest: 'Nepal', why: 'Rhododendron season, clear Himalayan views', href: '/nepal-tour-package' },
    ],
    festivals: ['Holi (March)', 'Elephant Festival (Jaipur)', 'Gangaur (Rajasthan)', 'Shivratri'],
    avoid: ['Rajasthan (heating up)', 'South Indian plains cities (humid)'],
    tips: [
      'Book Mathura/Vrindavan for Holi months ahead — biggest festival for hotels',
      'Himachal Pradesh in March = excellent prices, fewer crowds',
      'March is great for budget international trips — Bali, Thailand, Vietnam all off-peak',
    ],
  },
  april: {
    name: 'April', season: 'Early Summer', emoji: '☀️',
    weather: 'Hills are perfect. Plains are getting hot. South India hot and humid.',
    tempRange: '20–42°C (plains hot, hills 15–25°C)',
    crowdLevel: 'Low (great for hill stations)',
    priceLevel: 'Best deals of the year for hills',
    summary: 'April is summer in the plains but heaven in the mountains. Manali, Shimla, Mussoorie, Ooty, Kodaikanal are at their freshest. School holidays begin end-April so book ahead. International travel to Bali, Singapore, and Vietnam is excellent.',
    domesticPicks: [
      { dest: 'Manali', why: 'Pre-snow melt — good snow activities, Rohtang opens', href: '/manali-tour-package' },
      { dest: 'Shimla', why: 'Lush green arrival, pleasant 20°C, colonial charm' },
      { dest: 'Ladakh', why: 'Road begins opening — early adventurers get solitude' },
      { dest: 'Mussoorie', why: 'Off-peak hill station — great prices, few crowds' },
      { dest: 'Darjeeling', why: 'Best month for clear Kanchenjunga views' },
    ],
    internationalPicks: [
      { dest: 'Bali', why: 'Dry season continuing — Nyepi (Balinese New Year) if aligned', href: '/bali-honeymoon-package' },
      { dest: 'Singapore', why: 'Great weather, Garden Rhapsody light shows', href: '/singapore-tour-package' },
      { dest: 'Japan', why: 'Cherry blossom season — must-visit once in a lifetime' },
    ],
    festivals: ['Baisakhi (April 13)', 'Tamil/Bengali New Year', 'Mahavir Jayanti'],
    avoid: ['Rajasthan (extremely hot)', 'Goa (humid, shack season ending)', 'Andaman (pre-monsoon swell)'],
    tips: [
      'April = cheapest month for Himachal and Uttarakhand hill stations',
      'Ladakh road opens around late April/early May from Manali side',
      'Japan cherry blossoms are life-changing — plan 12–18 months ahead',
    ],
  },
  may: {
    name: 'May', season: 'Peak Summer', emoji: '🌞',
    weather: 'Very hot in plains (40–48°C). Mountain paradises are perfect.',
    tempRange: '15–48°C (plains extremely hot)',
    crowdLevel: 'High in hills (school summer holidays)',
    priceLevel: 'High in hill stations, low in plains destinations',
    summary: 'May school holidays send families to hill stations — Manali, Shimla, Mussoorie are packed. Ladakh fully opens from Manali (Rohtang Pass) and Srinagar. Valley of Flowers trek begins. International: Europe is beautiful but expensive.',
    domesticPicks: [
      { dest: 'Ladakh', why: 'Fully accessible — Pangong, Nubra, Tso Moriri at their best', href: '/ladakh-tour-package' },
      { dest: 'Spiti Valley', why: 'Road open — dramatic landscapes, Key Monastery', href: '/spiti-valley-tour-package' },
      { dest: 'Kashmir', why: 'Dal Lake, Gulmarg, Pahalgam — perfect 20°C weather', href: '/kashmir-tour-package' },
      { dest: 'Manali', why: 'High season — packed but fun, Rohtang snow', href: '/manali-tour-package' },
      { dest: 'Shillong / Meghalaya', why: 'Living root bridges, cleanest rivers, misty hills' },
    ],
    internationalPicks: [
      { dest: 'Europe', why: 'Late spring — tulips in Netherlands, Florence without August crowds', href: '/europe-tour-package-from-india' },
      { dest: 'Nepal', why: 'Everest Base Camp trekking season peak', href: '/nepal-tour-package' },
      { dest: 'Vietnam', why: 'Before monsoon — north Vietnam, Halong Bay at their best', href: '/vietnam-tour-package' },
    ],
    festivals: ['Buddha Purnima', 'Hemis Festival (Ladakh, June–July)'],
    avoid: ['Rajasthan (48°C, deadly hot)', 'Goa (monsoon approaching)', 'Delhi/Mumbai plains'],
    tips: [
      'Book Ladakh permits (ILP) well in advance for May',
      'Spiti Valley road from Shimla opens around May 15 — check before booking',
      'Europe in May is perfect but book 3–4 months ahead',
    ],
  },
  june: {
    name: 'June', season: 'Monsoon Begins', emoji: '🌧️',
    weather: 'Monsoon hits Kerala June 1 and spreads north. Most beach destinations get heavy rain.',
    tempRange: '25–35°C, very humid in rain zones',
    crowdLevel: 'Very low (except Ladakh)',
    priceLevel: 'Lowest prices of the year for most destinations',
    summary: 'June is perfect for budget travel. Ladakh is the star — while the rest of India gets rained on, Ladakh enjoys its best weather. Valley of Flowers trek opens. Coorg is magical in monsoon green. Huge discounts everywhere.',
    domesticPicks: [
      { dest: 'Ladakh', why: 'Peak season begins — clear skies while rest of India rains', href: '/ladakh-tour-package' },
      { dest: 'Spiti Valley', why: 'Fully accessible, minimal crowds', href: '/spiti-valley-tour-package' },
      { dest: 'Coorg', why: 'Monsoon magic — coffee estates, waterfalls, misty hills' },
      { dest: 'Meghalaya', why: 'World\'s wettest place — spectacular waterfalls, living root bridges' },
      { dest: 'Uttarakhand', why: 'Valley of Flowers opens June 1 — short season, stunning blooms', href: '/uttarakhand-tour-package' },
    ],
    internationalPicks: [
      { dest: 'Europe', why: 'Shoulder season — great weather, lower than July prices', href: '/europe-tour-package-from-india' },
      { dest: 'Dubai', why: 'Extremely hot (42°C) but indoor activities — and massive hotel discounts' },
    ],
    festivals: ['Rath Yatra preparations', 'Bakrid (June/July)', 'Hemis Festival (Ladakh)'],
    avoid: ['Goa (heavy rain, closed beaches)', 'Kerala (peak monsoon)', 'Rajasthan (hot + starting to rain)'],
    tips: [
      'June is the CHEAPEST month for Goa, Kerala, and Rajasthan hotels — great for staycations',
      'Valley of Flowers is only open June–October — short window',
      'Ladakh in June = best time, perfect weather, no queues',
    ],
  },
  july: {
    name: 'July', season: 'Monsoon Peak', emoji: '⛈️',
    weather: 'Heavy monsoon across most of India. Northeast and Western Ghats extremely wet.',
    tempRange: '22–35°C, very humid and rainy',
    crowdLevel: 'Very low everywhere except Ladakh',
    priceLevel: 'Lowest prices — hotels 30–50% cheaper than peak',
    summary: 'July is peak monsoon — but Ladakh and Spiti remain dry and spectacular. The rest of India is incredibly lush and green. Waterfalls are magnificent. Lowest hotel prices of the year make it ideal for budget-conscious travelers.',
    domesticPicks: [
      { dest: 'Ladakh', why: 'Best time — Hemis Festival, Pangong clear, Nubra accessible', href: '/ladakh-tour-package' },
      { dest: 'Valley of Flowers', why: 'Peak bloom — Himalayan flowers in full riot of colour', href: '/uttarakhand-tour-package' },
      { dest: 'Kerala (houseboat)', why: 'Backwaters are beautiful in monsoon — green, quiet, serene', href: '/kerala-tour-package' },
      { dest: 'Coorg / Wayanad', why: 'Most beautiful in monsoon — waterfalls, tea estates' },
    ],
    internationalPicks: [
      { dest: 'Bali', why: 'Dry season in Bali (Bali\'s rain is different from India\'s)', href: '/bali-honeymoon-package' },
      { dest: 'Europe', why: 'Summer peak — Paris, Rome, Barcelona full. Book very far ahead', href: '/europe-tour-package-from-india' },
    ],
    festivals: ['Rath Yatra (Puri, Odisha)', 'Hemis Festival (Ladakh)', 'Teej (Rajasthan)'],
    avoid: ['Goa', 'Andaman', 'Rajasthan', 'Most beach destinations'],
    tips: [
      'July hotel prices are 30–50% cheaper — great time if you don\'t mind rain',
      'Ladakh in July = absolute peak — book 3–4 months in advance',
      'Bali is counterintuitively good in July (northern hemisphere wet = southern dry)',
    ],
  },
  august: {
    name: 'August', season: 'Monsoon', emoji: '🌿',
    weather: 'Still heavy monsoon. India is at its greenest and most lush.',
    tempRange: '22–33°C',
    crowdLevel: 'Low (Independence Day weekend busy)',
    priceLevel: 'Low — good deals everywhere except Ladakh',
    summary: 'August is India at its lushest. Ladakh and Spiti are still excellent. Valley of Flowers is in full bloom. Independence Day (Aug 15) sees domestic travel spike. Northeast India is green paradise. Good budget month internationally.',
    domesticPicks: [
      { dest: 'Ladakh', why: 'Still excellent — last good month before October close', href: '/ladakh-tour-package' },
      { dest: 'Valley of Flowers / Kedarnath', why: 'Best month for trekking — flowers, clear skies above rain line', href: '/uttarakhand-tour-package' },
      { dest: 'Spiti Valley', why: 'Accessible and beautiful, last chance before October close', href: '/spiti-valley-tour-package' },
      { dest: 'Hampi', why: 'Lush backdrop to the ruins — beautiful though very hot' },
      { dest: 'Munnar (Kerala)', why: 'Tea estates look incredible in monsoon mist' },
    ],
    internationalPicks: [
      { dest: 'Bali', why: 'Dry season continues — excellent', href: '/bali-honeymoon-package' },
      { dest: 'Thailand', why: 'Monsoon in Thailand but manageable — good deals', href: '/thailand-budget-trip' },
    ],
    festivals: ['Independence Day (Aug 15)', 'Onam preparations (Kerala)', 'Raksha Bandhan', 'Janmashtami'],
    avoid: ['Manali (landslide risk on Rohtang)', 'Goa', 'Rajasthan (heat + rain)'],
    tips: [
      'Book Kedarnath helicopter for August well in advance — fills up',
      'Coorg and Wayanad are gorgeous in August — just carry rain gear',
      'Onam in Kerala (late August/September) is a unique cultural experience',
    ],
  },
  september: {
    name: 'September', season: 'Monsoon End', emoji: '🌤️',
    weather: 'Monsoon tapering. Skies clearing by end of month. Temperatures comfortable.',
    tempRange: '22–35°C, reducing humidity',
    crowdLevel: 'Very low — best month for deals',
    priceLevel: 'Lowest prices — best month to travel for value',
    summary: 'September is the hidden gem of Indian travel. Monsoon ends, destinations are clean and green, prices are rock-bottom, and crowds are minimal. Goa begins reopening. October 1 marks "season opening" across India.',
    domesticPicks: [
      { dest: 'Rajasthan', why: 'Opens after monsoon — lush green desert, lowest prices', href: '/rajasthan-tour-package' },
      { dest: 'Goa', why: 'Reopening beaches, cheapest prices of the year, lush green hills', href: '/goa-tour-package' },
      { dest: 'Himachal Pradesh', why: 'Apple harvest season — orchards full, beautiful light', href: '/himachal-tour-package' },
      { dest: 'Kashmir', why: 'Apple harvest, Chinar trees starting to turn, sublime', href: '/kashmir-tour-package' },
      { dest: 'Hampi', why: 'Green ruins, budget season, almost no crowds' },
    ],
    internationalPicks: [
      { dest: 'Europe', why: 'September = best month — summer crowds gone, warm, 20–25°C', href: '/europe-tour-package-from-india' },
      { dest: 'Sri Lanka', why: 'East coast (Trincomalee) at its best; west coast recovering', href: '/sri-lanka-tour-package' },
    ],
    festivals: ['Ganesh Chaturthi (September)', 'Onam (Kerala)', 'Navratri begins'],
    avoid: [],
    tips: [
      'September is the BEST value month — everything is 30–50% cheaper',
      'September in Europe = warm, cheap, no queues. Perfect timing',
      'Rajasthan in September = lush and dramatic (contradicts the usual dry desert image)',
    ],
  },
  october: {
    name: 'October', season: 'Post-Monsoon', emoji: '🍂',
    weather: 'Excellent across all of India. Clear skies, fresh air, comfortable temperatures.',
    tempRange: '18–32°C — near perfect everywhere',
    crowdLevel: 'Moderate and building',
    priceLevel: 'Moderate — rising toward peak',
    summary: 'October is arguably the best month to travel anywhere in India. Monsoon has passed, skies are clear, landscapes are lush, prices haven\'t hit peak levels yet. Dussehra and Diwali (if in October) add to the magic.',
    domesticPicks: [
      { dest: 'Rajasthan', why: 'Best green + golden Rajasthan moment', href: '/rajasthan-tour-package' },
      { dest: 'Goa', why: 'Beaches reopen properly — fresh, green, not yet crowded', href: '/goa-tour-package' },
      { dest: 'Kerala', why: 'Backwaters at their scenic best', href: '/kerala-tour-package' },
      { dest: 'Hampi', why: 'Post-monsoon ruins look incredible — cool and green' },
      { dest: 'Pushkar', why: 'Pushkar Camel Fair (October/November) — unmissable festival' },
      { dest: 'Kashmir', why: 'Chinar trees turning gold and red — Autumn Kashmir is magical', href: '/kashmir-tour-package' },
    ],
    internationalPicks: [
      { dest: 'Bali', why: 'Dry season continues — superb', href: '/bali-honeymoon-package' },
      { dest: 'Europe', why: 'Autumn colours in Alps/Tuscany — fewer crowds, good prices', href: '/europe-tour-package-from-india' },
      { dest: 'Maldives', why: 'Transitional — some resorts offer good October deals', href: '/maldives-luxury-package' },
    ],
    festivals: ['Dussehra (October)', 'Diwali (October/November)', 'Pushkar Camel Fair'],
    avoid: ['Ladakh (roads closing, cold)'],
    tips: [
      'October is THE month — best weather, reasonable prices, everywhere is beautiful',
      'Autumn Kashmir (Chinar leaves) is one of the most beautiful sights in India',
      'Book Dussehra/Diwali destinations early — hotels fill up fast',
    ],
  },
  november: {
    name: 'November', season: 'Early Winter', emoji: '🍁',
    weather: 'Winter season begins. North India cooling down. South India perfect.',
    tempRange: '12–30°C (north cooler, south warm)',
    crowdLevel: 'High and building to peak',
    priceLevel: 'Rising — book early',
    summary: 'November marks the start of India\'s peak travel season. Goa, Rajasthan, and Kerala fill up rapidly. Pushkar Camel Fair (if in November) is an iconic experience. Perfect time for international trips to Bali, Thailand, and Maldives.',
    domesticPicks: [
      { dest: 'Goa', why: 'Peak begins — all shacks open, best weather, international vibe', href: '/goa-tour-package' },
      { dest: 'Rajasthan', why: 'Perfect time — Pushkar Fair, cool days, great light', href: '/rajasthan-tour-package' },
      { dest: 'Kerala', why: 'Backwaters at their best — blue skies, green coconut groves', href: '/kerala-tour-package' },
      { dest: 'Andaman', why: 'Season opening — flights filling up, book now', href: '/andaman-tour-package' },
    ],
    internationalPicks: [
      { dest: 'Bali', why: 'Pre-wet season — still dry, slightly fewer tourists', href: '/bali-honeymoon-package' },
      { dest: 'Thailand', why: 'Dry season begins — Loy Krathong (lights festival) is magical', href: '/thailand-budget-trip' },
      { dest: 'Maldives', why: 'Dry season peak — perfect visibility for diving', href: '/maldives-luxury-package' },
      { dest: 'Vietnam', why: 'Best weather for south Vietnam — Hoi An, Ho Chi Minh', href: '/vietnam-tour-package' },
    ],
    festivals: ['Pushkar Camel Fair', 'Diwali (if not October)', 'Guru Nanak Jayanti'],
    avoid: ['Ladakh (fully closed)', 'Spiti Valley (road closing)'],
    tips: [
      'November Goa fills up fast — book hotels and flights by September',
      'Pushkar Fair is one of the world\'s great spectacles — stay 2+ nights',
      'Thailand Loy Krathong (lantern/float festival) is beautiful — worth timing your trip',
    ],
  },
  december: {
    name: 'December', season: 'Peak Winter', emoji: '🎄',
    weather: 'Best weather in south India. North India cold. Mountains snowy.',
    tempRange: '8–30°C (north cold, south warm)',
    crowdLevel: 'Peak (Christmas-New Year = most crowded)',
    priceLevel: 'Highest of the year (especially Dec 20 – Jan 5)',
    summary: 'December is the most popular travel month but also the most expensive. Christmas and New Year in Goa is legendary. Rajasthan is at its most vibrant. Kerala, Andaman, and Thailand are all brilliant. Book 3–4 months ahead for all peak destinations.',
    domesticPicks: [
      { dest: 'Goa', why: 'Christmas and New Year — best beach parties, nightlife, international crowd', href: '/goa-tour-package' },
      { dest: 'Rajasthan', why: 'Amber Fort, Jaisalmer fort, camel safaris in perfect winter light', href: '/rajasthan-tour-package' },
      { dest: 'Kerala', why: 'Christmas in Kerala (Christian community) is uniquely beautiful', href: '/kerala-tour-package' },
      { dest: 'Manali (snow)', why: 'White Christmas — snow activities, quiet compared to summer', href: '/manali-tour-package' },
      { dest: 'Andaman', why: 'Best diving visibility, quiet beaches before peak Jan', href: '/andaman-tour-package' },
    ],
    internationalPicks: [
      { dest: 'Bangkok', why: 'Christmas and New Year celebrations, cool 25°C weather', href: '/thailand-budget-trip' },
      { dest: 'Bali', why: 'Pre-wet season New Year celebrations — incredible', href: '/bali-honeymoon-package' },
      { dest: 'Dubai', why: 'New Year fireworks at Burj Khalifa (world-famous)', href: '/dubai-tour-package-from-delhi' },
    ],
    festivals: ['Christmas (Dec 25)', 'New Year (Dec 31)', 'Hornbill Festival (Nagaland, Dec 1–10)'],
    avoid: ['Budget travel Dec 20–Jan 5 (prices 2–3x normal)'],
    tips: [
      'December 20 – January 5: prices peak across all destinations — book 4–6 months early',
      'Hornbill Festival (Nagaland, Dec 1–10) is extraordinary — tribal culture at its best',
      'Goa New Year is incredible but chaotic — decide if that\'s your vibe',
      'Consider December 1–15 for perfect weather with pre-peak prices',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(MONTHS).map((month) => ({ month }));
}

export async function generateMetadata({ params }: { params: Promise<{ month: string }> }): Promise<Metadata> {
  const { month } = await params;
  const data = MONTHS[month];
  if (!data) return {};
  return {
    title: `Best Places to Visit in ${data.name} 2026 — India & International | YlooTrips`,
    description: `Where to travel in ${data.name}: ${data.domesticPicks.map(d => d.dest).join(', ')}. ${data.summary.slice(0, 100)}...`,
    alternates: { canonical: `https://www.ylootrips.com/best-time-to-travel/${month}` },
    openGraph: {
      title: `Best Places to Visit in ${data.name} — YlooTrips`,
      description: `Complete travel guide for ${data.name}. Weather, destinations, festivals, and expert tips.`,
      url: `https://www.ylootrips.com/best-time-to-travel/${month}`,
    },
  };
}

export default async function MonthTravelPage({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const data = MONTHS[month];
  if (!data) notFound();

  const allMonths = Object.keys(MONTHS);
  const currentIndex = allMonths.indexOf(month);
  const prevMonth = currentIndex > 0 ? allMonths[currentIndex - 1] : null;
  const nextMonth = currentIndex < allMonths.length - 1 ? allMonths[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">

        <div className="pt-8 pb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/best-time-to-travel" className="hover:text-gray-700 flex items-center gap-1"><ArrowLeft size={12} /> Travel Calendar</Link>
          <span>/</span>
          <span className="text-gray-600">{data.name}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">{data.emoji}</span>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">{data.season}</p>
              <h1 className="font-serif text-4xl font-bold text-gray-900">Travel in {data.name}</h1>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{data.summary}</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Sun, label: 'Weather', val: data.weather.split('.')[0] },
            { icon: Thermometer, label: 'Temperature', val: data.tempRange },
            { icon: Users, label: 'Crowds', val: data.crowdLevel },
            { icon: Tag, label: 'Prices', val: data.priceLevel },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
              <s.icon size={14} className="text-gray-400 mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{s.label}</p>
              <p className="font-semibold text-gray-900 text-xs mt-0.5">{s.val}</p>
            </div>
          ))}
        </div>

        {/* India picks */}
        <div className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">🇮🇳 Best Indian Destinations</h2>
          <div className="space-y-3">
            {data.domesticPicks.map((d) => (
              <div key={d.dest} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{d.dest}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{d.why}</p>
                </div>
                {d.href && (
                  <Link href={d.href} className="shrink-0 text-xs font-semibold text-gray-900 border border-gray-300 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* International picks */}
        <div className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">🌍 International Picks</h2>
          <div className="space-y-3">
            {data.internationalPicks.map((d) => (
              <div key={d.dest} className="flex items-start gap-3 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 text-sm">{d.dest}</p>
                  <p className="text-xs text-blue-700 mt-0.5">{d.why}</p>
                </div>
                {d.href && (
                  <Link href={d.href} className="shrink-0 text-xs font-semibold text-blue-900 border border-blue-300 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors whitespace-nowrap">
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Festivals */}
        {data.festivals.length > 0 && (
          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-3">Festivals in {data.name}</h2>
            <div className="flex flex-wrap gap-2">
              {data.festivals.map((f) => (
                <span key={f} className="bg-amber-50 text-amber-800 border border-amber-100 text-xs font-medium px-3 py-1.5 rounded-full">
                  🎉 {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Avoid */}
        {data.avoid.length > 0 && (
          <div className="mb-8 bg-red-50 border border-red-100 rounded-2xl p-4">
            <h2 className="font-semibold text-red-800 mb-2 text-sm">Avoid in {data.name}</h2>
            <ul className="space-y-1">
              {data.avoid.map((a) => (
                <li key={a} className="text-sm text-red-700 flex items-center gap-2">
                  <span>✕</span>{a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Expert tips */}
        <div className="mb-8 bg-gray-50 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Expert Tips for {data.name}</h2>
          <ul className="space-y-2">
            {data.tips.map((tip) => (
              <li key={tip} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-gray-400 mt-0.5 shrink-0">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mb-8">
          {prevMonth ? (
            <Link href={`/best-time-to-travel/${prevMonth}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full px-4 py-2">
              ← {MONTHS[prevMonth].name}
            </Link>
          ) : <div />}
          {nextMonth ? (
            <Link href={`/best-time-to-travel/${nextMonth}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-full px-4 py-2 ml-auto">
              {MONTHS[nextMonth].name} →
            </Link>
          ) : <div />}
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-3xl p-8 text-center text-white">
          <Calendar className="w-9 h-9 mx-auto mb-3 text-gray-400" />
          <h2 className="font-serif text-xl font-bold mb-2">Plan Your {data.name} Trip</h2>
          <p className="text-white/60 text-sm mb-5">Get a personalised itinerary for {data.name} from our team</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/trip-planner"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm">
              AI Trip Planner
            </Link>
            <Link href={`https://wa.me/918427831127?text=Hi%20I%20want%20to%20plan%20a%20trip%20for%20${encodeURIComponent(data.name)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors text-sm">
              <MessageCircle size={14} /> WhatsApp Us
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
