'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle, ArrowUpRight, Mountain, Waves, Castle, TreePine,
  Sailboat, Sun, Shield, Users, Globe, Clock, Star, Check,
  CreditCard, MapPin, Phone, BadgeCheck, ChevronDown, ChevronUp,
  Calendar, Tag, X, Loader2, CheckCircle, BadgePercent, ShieldCheck,
} from 'lucide-react';
import PageHero from '@/components/PageHero';
import { useVisitor } from '@/context/VisitorContext';
import { useWallet } from '@/context/WalletContext';
import PaymentOptions from '@/components/PaymentOptions';
import PromoCodeInput from '@/components/PromoCodeInput';

// ── BanBanjara data + 5% markup ──────────────────────────────────────────────
interface DomesticTrip {
  slug: string;
  title: string;
  location: string;
  region: 'North India' | 'South India' | 'Himalayan Region' | 'Northeast India' | 'East India' | 'West India';
  category: string;
  duration: string;
  nights: number;
  priceINR: number;
  originalPriceINR: number;
  image: string;
  badge?: string;
  difficulty?: string;
  highlights: string[];
  includes: string[];
  itinerary: { day: string; desc: string }[];
}

const DOMESTIC_TRIPS: DomesticTrip[] = [
  {
    slug: 'auli-package-from-delhi',
    title: 'Auli Snow Package from Delhi',
    location: 'Auli, Uttarakhand',
    region: 'North India',
    category: 'Snow Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 6999,
    originalPriceINR: 7349,
    image: 'https://images.unsplash.com/photo-1742281413791-f3fe80e7f3bf?w=800&q=80',
    badge: 'Winter Favourite',
    highlights: ["Asia's longest cable car / ropeway", 'Views of Nanda Devi (India\'s 2nd highest peak)', 'Gorson Bugyal trek with a professional guide', 'Optional snow skiing'],
    includes: ['Hotel accommodation', 'All meals (dinner D1; breakfast+dinner D2–D3; breakfast D4)', 'Professional guide', 'Transport', 'Bonfire & local sightseeing'],
    itinerary: [
      { day: 'Day 1', desc: 'Your Auli snow adventure begins with an overnight departure from Delhi by Volvo AC bus at 9 PM from Majnu Ka Tilla Bus Stand (nearest metro: Vidhan Sabha). The scenic 500+ km journey winds through the Garhwal Himalayas as you cross the Gangetic plains and head toward Joshimath. Settle in comfortably, enjoy the cool mountain air as you gain altitude through the night, and rest as the peaks draw closer.' },
      { day: 'Day 2', desc: 'The bus makes a brief stop at Devprayag — the sacred confluence of the Bhagirathi and Alaknanda rivers — where you can step out to witness the dramatic meeting of two holy rivers. Continue to Srinagar (Garhwal) for a hearty breakfast at a local dhaba. By afternoon, reach Joshimath — the gateway to Auli — and check into the hotel. The evening features a warming bonfire in the crisp mountain air, with views of the snow-dusted peaks glowing in the twilight.' },
      { day: 'Day 3', desc: 'The highlight of the trip: board Asia\'s longest gondola cable car (4 km) from Joshimath to Auli, rising dramatically to 2,519 m with sweeping views of Nanda Devi — India\'s second highest peak — the Mana Group, Kamet, and Dronagiri ranges. Spend the morning enjoying snow activities — snowball fights, snow slides, and optional skiing (ski equipment available on rent). In the afternoon, trek through the stunning Gorson Bugyal meadows with your professional guide, where the snow-covered clearing offers one of Uttarakhand\'s finest panoramic views.' },
      { day: 'Day 4', desc: 'After breakfast and checkout, begin the journey back toward Delhi, stopping in the spiritual town of Rishikesh for a riverside lunch. Stroll across the iconic Laxman Jhula suspension bridge, visit the ghats, and soak in the ashram town\'s vibrant spiritual atmosphere. In the evening, enjoy dinner at a Rishikesh riverside restaurant before boarding the overnight bus back to Delhi.' },
      { day: 'Day 5', desc: 'Arrive back in Delhi at approximately 6–7 AM, concluding an exhilarating snow adventure in the Garhwal Himalayas. The memories of Auli\'s white slopes, the cable car ride above the clouds, and the majestic views of Nanda Devi will stay long after the journey ends.' },
    ],
  },
  {
    slug: 'jibhi-tirthan-valley-trip',
    title: 'Jibhi Tirthan Valley Trip',
    location: 'Jibhi, Himachal Pradesh',
    region: 'North India',
    category: 'Nature Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7699,
    originalPriceINR: 8199,
    image: 'https://images.unsplash.com/photo-1716186984512-24b1c43ca9c2?w=800&q=80',
    badge: 'Hidden Gem',
    highlights: ['Jalori Pass at 10,800 ft', 'Sarolsar Lake trek with 360° Himalayan views', 'Jibhi Waterfall & Thailand Pool', '"Yeh Jawaani Hai Deewani" filming location'],
    includes: ['Resort/camp accommodation', 'All meals (breakfast, lunch & dinner)', 'Local guide', 'Private vehicle with driver', 'Trek activities & bonfire'],
    itinerary: [
      { day: 'Day 1', desc: 'The journey commences at 6:30 PM from Vidhan Sabha Metro Station in Delhi. This overnight journey takes you through the Shivalik Hills and Kullu Valley, winding up toward the hidden village of Jibhi in the Tirthan Valley of Himachal Pradesh.' },
      { day: 'Day 2', desc: 'After a halt at a roadside dhaba for breakfast, arrive at Jibhi by morning. Following freshening up and relaxing at the resort, head to Jibhi Waterfall — a pristine cascade surrounded by apple orchards — and the famous Thailand Pool where the crystal-clear Tirthan river creates a turquoise natural pool. The evening features a bonfire, local music, and a sumptuous Himachali dinner at the resort.' },
      { day: 'Day 3', desc: 'After an early breakfast, drive to Jalori Pass (10,800 ft) for a 360-degree panoramic view of the Great Himalayan National Park. Trek further to visit the filming location of "Yeh Jawaani Hai Deewani" — the famous Bollywood movie shot in these meadows. Continue to the serene Serolsar Lake (10,600 ft) — a small but beautiful high-altitude lake surrounded by dense forests and home to the Budhi Nagin Devi temple. Evening bonfire, music, and dinner at the resort.' },
      { day: 'Day 4', desc: 'Wake up early to witness a breathtaking Himalayan sunrise from the resort. After breakfast and checkout, visit Choi Waterfall — a hidden gem accessible via a short forest trail. Walk along the banks of the Tirthan River — one of the cleanest rivers in India and a paradise for trout fishing. After an exciting morning, begin the evening departure toward Delhi.' },
      { day: 'Day 5', desc: 'Arrive back in Delhi at approximately 8:00 AM, concluding an unforgettable journey through the hidden valleys of Himachal Pradesh — Jibhi\'s pristine nature and the Tirthan Valley\'s raw beauty will stay etched in your memory.' },
    ],
  },
  {
    slug: 'manali-solang-kasol-tour',
    title: 'Manali, Solang & Kasol Tour',
    location: 'Manali + Kasol, Himachal Pradesh',
    region: 'North India',
    category: 'Adventure Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7150,
    originalPriceINR: 7699,
    image: 'https://images.unsplash.com/photo-1677820915334-d7ceba1e844a?w=800&q=80',
    badge: 'Best Seller',
    highlights: ['Solang Valley — zip-lining, ATV rides & snow activities', 'Atal Tunnel (world\'s longest highway tunnel) & Sissu', 'Hidimba Temple, Club House & Old Manali bazaar', 'Kasol, Chalal Village, Manikaran Sahib & DJ nights'],
    includes: ['Hotel accommodation (3-star)', 'Daily breakfast & dinner', 'Volvo AC bus Delhi–Manali–Delhi', 'Bonfire, DJ nights & music evenings', 'Sightseeing by private cab'],
    itinerary: [
      { day: 'Day 1', desc: 'Begin from the city of Delhi at 06 PM–08 PM from Majnu Ka Tilla. The nearest metro station is Vidhan Sabha metro station. Settle in for an overnight journey through the Himalayas.' },
      { day: 'Day 2', desc: 'Reach Manali in the morning and check in to the hotel. After freshening up, head to Club House, Hidimba Temple and explore the hippie alleys of Old Manali. Browse cafes on Mall Road and soak in the mountain town vibe. Evening features a bonfire, DJ night, and live music at the hotel.' },
      { day: 'Day 3', desc: 'After breakfast, experience time travel through the magnificent Manali. Visit Solang Valley for ATV rides, zip-lining, and snow activities. Drive through the legendary Atal Tunnel — the world\'s longest highway tunnel at 10,000 ft — and emerge into Sissu in Lahaul for stunning waterfall and meadow views. Return via Vashisht Temple and its famous sulphur hot springs. Evening includes a DJ party, bonfire, and live singing.' },
      { day: 'Day 4', desc: 'Following breakfast, drive to Bhuntar and onward to Kasol, the backpacker haven on the Parvati River. Explore Chalal Village along a short riverside trail and visit Manikaran Sahib Gurudwara — sacred for both Sikhs and Hindus — where natural hot springs bubble beside the Parvati River. Enjoy a langar meal at the Gurudwara before heading back toward Delhi in the evening.' },
      { day: 'Day 5', desc: 'Arrive back in Delhi by early morning (6–7 AM) carrying beautiful memories of the mountains, cafes, and the Parvati Valley.' },
    ],
  },
  {
    slug: 'manali-lahaul-trip-from-delhi',
    title: 'Manali & Lahaul Trip from Delhi',
    location: 'Manali + Lahaul Valley, Himachal Pradesh',
    region: 'North India',
    category: 'Adventure Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7699,
    originalPriceINR: 8199,
    image: 'https://images.unsplash.com/photo-1741790956655-d4679f77c63d?w=800&q=80',
    badge: 'Best Seller',
    highlights: ['Explore Lahaul Valley — beyond the tourist trail', 'Atal Tunnel (world\'s longest highway tunnel at 10,000 ft)', 'Sissu waterfall & Tandi confluence of Chandra & Bhaga rivers', 'Hadimba Temple, Solang Valley & Rohtang views'],
    includes: ['Hotel accommodation (3-star)', 'Daily breakfast & dinner', 'Volvo AC bus Delhi–Manali–Delhi', 'Private cab for all sightseeing', 'Experienced local guide'],
    itinerary: [
      { day: 'Day 1', desc: 'You will begin your trip from Delhi at around 6:30 PM, from the Vidhan Sabha Metro Station. This journey will be an overnight one — settle in and get some rest while traveling through the night toward the Himalayas.' },
      { day: 'Day 2', desc: 'Reach Manali in the morning and check in to the hotel. After freshening up and relaxing, head to Manu Temple and Hadimba Devi Temple set within ancient deodar forests. In the evening, do cafe hopping in Old Manali and explore Mall Road. Return to the hotel for a wonderful dinner, bonfire, and an early night.' },
      { day: 'Day 3', desc: 'Wake up and after breakfast, experience time travel through the beautiful Manali. Drive through the Atal Tunnel to emerge into the snow-blanketed Lahaul Valley — a world apart from the tourist buzz of Manali. After exploring Lahaul, visit Vashishtha Temple and take in some spirituality at the ancient sulphur hot springs. Return to the hotel for dinner, a bonfire, and a good night\'s sleep.' },
      { day: 'Day 4', desc: 'Wake up to one more gorgeous Himalayan morning. After breakfast, check out from the hotel and explore the hippie alleys of Old Manali City one last time. Visit Manali Mall Road for a shopping spree — pick up souvenirs, Himachali shawls, and dry fruits for friends and family. After some final mountain moments, head back to Delhi by 4 PM.' },
      { day: 'Day 5', desc: 'Reach back to Delhi by morning, carrying a bag full of beautiful memories and exciting stories from Lahaul and the Kullu Valley.' },
    ],
  },
  {
    slug: 'manali-honeymoon-package',
    title: 'Manali Honeymoon Package',
    location: 'Manali, Himachal Pradesh',
    region: 'North India',
    category: 'Honeymoon',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 9349,
    originalPriceINR: 9999,
    image: 'https://images.unsplash.com/photo-1548690375-1bdf6c661222?w=800&q=80',
    badge: 'Honeymoon Special',
    highlights: ['Candlelight dinner with snow-capped mountain views', 'Couple spa & wellness session at Vashisht hot springs', 'Private sightseeing — Solang Valley, Hadimba, Old Manali', 'Cozy riverside cottage stay with mountain views'],
    includes: ['Boutique hotel/cottage accommodation', 'Daily breakfast & candlelight dinner', 'Volvo AC bus Delhi–Manali–Delhi', 'Private cab for couple sightseeing', 'Welcome fruit basket & room decoration'],
    itinerary: [
      { day: 'Day 1', desc: 'Your romantic Manali getaway begins with an overnight Volvo AC bus departure from Delhi in the evening. Snuggle together as the bus winds northward through the night, leaving the plains behind and entering the pine-forested foothills of Himachal Pradesh. The journey sets the mood — a long, cozy ride toward the mountains, your honeymoon adventure just beginning.' },
      { day: 'Day 2', desc: 'Arrive in Manali in the morning and check in to your private riverside cottage — where the sound of the Beas River fills the room and snow-dusted peaks frame every window. After freshening up, enjoy a leisurely stroll along Manali\'s Mall Road, browse local shops for Himachali handicrafts and warm shawls, and settle in for a romantic candlelight dinner with Himalayan mountain views as your backdrop. The evening is yours — a perfect mountain honeymoon beginning.' },
      { day: 'Day 3', desc: 'Drive to Solang Valley (2,480 m) — Manali\'s ultimate adventure playground — for snow activities, ropeway rides, and a romantic morning with snow-capped peaks on all sides. Drive through the legendary Atal Tunnel at 10,000 ft — the world\'s longest highway tunnel — and emerge into the snow-blanketed Sissu meadows of Lahaul with their dramatic frozen waterfall backdrop. Return to Manali in the evening for a private bonfire night at your cottage, the valley twinkling below you.' },
      { day: 'Day 4', desc: 'Begin the day at the ancient Hadimba Devi Temple — set in a deodar forest, its pagoda-style architecture is one of Manali\'s most iconic sights. Then head to Vashisht village for your couple\'s spa and wellness session at the famous sulphur hot springs — a deeply relaxing experience that melts away any fatigue. Spend the afternoon at the bohemian cafes of Old Manali, sipping filter coffee and soaking in the last Himalayan moments before boarding the overnight bus back to Delhi.' },
      { day: 'Day 5', desc: 'Arrive back in Delhi in the early morning, carrying the warmth of the mountains and memories of your first honeymoon adventure together — the snow of Solang, the glow of the candlelit dinner, and the sound of the Beas River outside your cottage window.' },
    ],
  },
  {
    slug: 'spiti-valley-tour-from-manali',
    title: 'Spiti Valley Tour from Manali',
    location: 'Spiti Valley, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Adventure Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 17599,
    originalPriceINR: 18499,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1652131812743-07bc5dde8b91?w=800&q=80',
    badge: 'Likely to Sell Out',
    highlights: ['Rohtang Pass (13,054 ft) — gateway to Spiti', 'Key Monastery — 1,000-year-old Buddhist monastery at 13,668 ft', 'Chandratal Lake (Moon Lake) at 14,100 ft', 'Kaza town — the capital of Spiti Valley'],
    includes: ['Hotel + guesthouse accommodation', 'All meals (breakfast & dinner)', 'Private SUV/Innova for all transfers', 'Experienced Spiti guide', 'Inner line permits & oxygen support'],
    itinerary: [
      { day: 'Day 1', desc: 'We start our journey early in the morning from Manali, clustered in our transports, heading off to the beautiful town of Kaza (3,800 m). A 7–8 hour journey via Atal Tunnel and Kunzum Pass takes us to Kaza. Upon arriving, we halt for the night in a cozy homestay — eating by the Bukhari (traditional heating stove) and warming ourselves in the brisk mountain nights. We use this day to acclimatise to the high altitude by drinking lots of water and taking small strolls around town.' },
      { day: 'Day 2', desc: 'We head out to explore Pin Valley — travelling toward Mudh, a high-altitude village in the Pin Valley of Spiti District, famous for its Pin Valley National Park, home to the snow leopard and Siberian Ibex. From Mudh, we move on to Dhankar Monastery — a former administrative capital of Spiti, now a dramatic cliff-top monastery and a sacred site. We then proceed to Tabo, home to the ancient Tabo Monastery, considered one of the most sacred by His Holiness the Dalai Lama.' },
      { day: 'Day 3', desc: 'Today we explore the villages surrounding Kaza. We visit Komic — which translates to "eye of a snow cock" — the highest motorable village in the world at a stunning 4,587 metres. Next is Hikkim, home to the highest post office in the world where you can mail a postcard from the roof of the world. Langza offers an ancient thousand-year-old temple and marine fossils embedded in sedimentary rock. Finally, Key Monastery — the largest Gelugpa Sect Monastery in Spiti — a training center for lamas perched dramatically on a hill.' },
      { day: 'Day 4', desc: 'From Kaza we drive through Kibber to Chicham Bridge — described as the highest bridge in Asia — with stories of the ancient pulley trolleys that once connected these two cliffs. We cross Kunzum La at 15,000 feet before reaching Chandratal Lake, the "Lake of the Moon". This radiant high-altitude lake has no visible source of water, fed by underground springs, glowing turquoise under the Spiti sky. Overnight camping under a breathtaking canopy of stars.' },
      { day: 'Day 5', desc: 'We depart Chandratal toward Batal, home to the famous "Chachi ka Chandra Dhaba" — a legendary roadside stop for Spiti travellers. Drive alongside the Chandra River, pass through Gramphoo village, and cross the Atal Tunnel (Rohtang Tunnel) — an all-weather route through the Rohtang Pass designed to keep Lahaul and Spiti connected year-round. Arrive back in Manali by evening.' },
    ],
  },
  {
    slug: 'kullu-manali-tour-package',
    title: 'Kullu Manali Tour Package',
    location: 'Kullu + Manali, Himachal Pradesh',
    region: 'North India',
    category: 'Holiday Package',
    duration: '6 Days / 5 Nights',
    nights: 5,
    priceINR: 6599,
    originalPriceINR: 6999,
    image: 'https://images.unsplash.com/photo-1603612692333-7bac35e43500?w=800&q=80',
    badge: 'Best Value',
    highlights: ['Kullu — river rafting on the Beas & Great Himalayan National Park', 'Rohtang Pass views & Solang Valley snow activities', 'Hadimba Devi Temple & Van Vihar Nature Walk', 'Naggar Castle — ancient fort overlooking Kullu valley'],
    includes: ['Hotel accommodation (3-star)', 'Daily breakfast & dinner', 'Volvo AC bus Delhi–Manali–Delhi', 'Private cab for sightseeing', 'River rafting (Kullu)'],
    itinerary: [
      { day: 'Day 1', desc: 'Board the Volvo AC bus from Delhi in the evening (approximately 6 PM) from Majnu Ka Tilla Bus Stand. The overnight journey of around 550 km passes through Chandigarh, Bilaspur, and the beautiful Kullu Valley before arriving in Manali. Get some rest as the Himalayas unfold outside the window during the pre-dawn hours.' },
      { day: 'Day 2', desc: 'Arrive in Manali in the morning and check in to the hotel. After freshening up and a welcome breakfast, explore the most iconic sights of Manali — the Hadimba Devi Temple set in a deodar forest with its distinctive four-storied pagoda architecture, the Van Vihar National Park for a relaxing nature walk alongside the Beas River, and the hippie lanes of Old Manali bazaar with its colourful cafes and Tibetan market stalls. Evening includes a bonfire and dinner at the hotel.' },
      { day: 'Day 3', desc: 'After breakfast, head to Solang Valley for a thrilling morning of ATV rides, zip-lining across the gorge, and snow activities at this spectacular valley framed by snow-capped peaks. Drive through the iconic Atal Tunnel — the world\'s longest highway tunnel built at 10,000 ft — to emerge into Sissu in Lahaul, a completely different landscape of open snowfields and dramatic frozen waterfalls. Return to Manali via Vashisht Temple and its famous hot sulphur springs.' },
      { day: 'Day 4', desc: 'Depart for the scenic Kullu Valley, stopping at Naggar Castle — a 500-year-old fort-palace of the Kullu rulers perched dramatically above the Beas Valley. Continue down the valley to reach the Beas River for an exciting Grade 3 white-water rafting session (approximately 14 km) — one of the best rafting runs in Himachal Pradesh, with thrilling rapids and beautiful mountain scenery lining the riverbanks.' },
      { day: 'Day 5', desc: 'Spend the morning in Kullu town exploring the historic Dussehra Ground (site of the famous international Kullu Dussehra festival), visiting the local shawl factories and cooperatives where the famous Kullu shawls are woven by hand, and browsing the lively local market for pashmina, dry fruits, and local handicrafts. Board the evening bus back to Delhi.' },
      { day: 'Day 6', desc: 'Arrive back in Delhi at approximately 6–8 AM, carrying memories of Manali\'s snow, Kullu\'s river, and the incredible diversity of this Himachali dual-valley adventure.' },
    ],
  },
  {
    slug: 'kedarnath-yatra-from-delhi',
    title: 'Kedarnath Yatra from Delhi',
    location: 'Kedarnath, Uttarakhand',
    region: 'North India',
    category: 'Pilgrimage',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7999,
    originalPriceINR: 8399,
    image: 'https://images.unsplash.com/photo-1671881411337-d83d18382b04?w=800&q=80',
    highlights: ['One of 12 Jyotirlingas — sacred to Lord Shiva', '16 km trek Gaurikund → Kedarnath Temple (11,755 ft)', 'Devprayag confluence of Bhagirathi & Alaknanda', 'Route via Haridwar, Rishikesh, Guptkashi'],
    includes: ['AC bus Delhi–Haridwar', 'Hotel accommodation', 'All meals per itinerary', 'Professional tour guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Start your journey from Delhi by boarding an AC bus towards Haridwar. An overnight journey through the Gangetic plains takes you toward the sacred gateway of the Himalayas.' },
      { day: 'Day 2', desc: 'By morning the group arrives in Haridwar. The bus reaches Devprayag — stop here to witness breathtaking views of the Bhagirathi and Alaknanda rivers merging at this sacred confluence. Lunch is provided along the way. After an 8–9 hour drive covering approximately 210 km from Haridwar, the group arrives in Guptkashi by evening. Check into the hotel, have dinner, and relax overnight (1,319 m altitude).' },
      { day: 'Day 3', desc: 'Get up early and after breakfast, drive to Gaurikund — the trailhead for the Kedarnath trek. Enjoy a wonderful trekking experience in Kedarnath with breathtaking views of rivers and mountains covered in snow. The total distance of the Kedarnath trek is 19 km one way. Pony, doli (palanquin), or helicopter services are available at your own cost. By late evening, the group reaches Kedarnath (3,583 m). Have dinner and relax overnight at the guest house.' },
      { day: 'Day 4', desc: 'Get up early in the morning and visit the beautiful Kedarnath Temple dedicated to Lord Shiva — one of the 12 Jyotirlingas. Offer your prayers and seek blessings. Enjoy the mesmerizing beauty of the snow-clad peaks surrounding the temple. After breakfast, the group treks back down to Gaurikund and drives to Guptkashi. In the evening, rest and have dinner at the hotel overnight.' },
      { day: 'Day 5', desc: 'After breakfast at the hotel, pack your bags and check out. Drive back to Delhi from Guptkashi. A stop is made at Devprayag for lunch, after which the journey toward Delhi resumes. Arrive home with lots of great memories and blessings from Lord Shiva.' },
    ],
  },
  {
    slug: 'lakshadweep-tour-from-mumbai',
    title: 'Lakshadweep Island Tour',
    location: 'Agatti & Bangaram Islands, Lakshadweep',
    region: 'South India',
    category: 'Beach & Water Sports',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 22000,
    originalPriceINR: 23100,
    image: 'https://images.unsplash.com/photo-1746138810419-dfafd3603c02?w=800&q=80',
    badge: 'Luxury Pick',
    highlights: ['Snorkeling, scuba, kayaking & windsurfing', 'Bangaram Island — dolphins & turtles', 'Glass boat rides & island hopping', 'Thinnakara Island sandbank'],
    includes: ['AC rooms with beach views', 'Agatti Island entry permit', 'All meals (breakfast, lunch & dinner)', 'Airport transfers', 'Expert guide & water activity access'],
    itinerary: [
      { day: 'Day 1', desc: 'Fly from Kochi to Agatti Island Airport — one of India\'s most dramatic landing strips, where the runway ends just metres from the turquoise lagoon on all sides. As you descend, the brilliant blues and greens of Lakshadweep\'s coral reef system are visible through the aircraft windows. Transfer to your beachside accommodation and spend the afternoon on a glass-bottom boat tour over Agatti\'s reef — watching the spectacular coral gardens and tropical fish below without getting wet. Settle in for your first sunset over the Arabian Sea.' },
      { day: 'Day 2', desc: 'Take a boat excursion to the uninhabited Bangaram Island — a pristine circular atoll of white sand and swaying palms. Snorkel over some of Lakshadweep\'s most pristine coral reefs, where dolphins often play and green sea turtles glide serenely through the crystal-clear water. Continue to Thinnakara Island — a tiny sandbank in the lagoon — for a beach picnic and kayaking on water so clear you can see the seafloor 10 metres below.' },
      { day: 'Day 3', desc: 'A full day of water sports in Agatti\'s magnificent lagoon — choose from scuba diving, kayaking, windsurfing, and banana boat rides in warm, calm water with visibility up to 30 metres. Certified PADI scuba instructors take beginners on their first dive over the coral reef. Spend the late afternoon at the beautiful Lagoon Beach and Andhan Beach — arguably the most beautiful beaches in India, fringed with coconut palms and lapped by crystal-clear turquoise water.' },
      { day: 'Day 4', desc: 'Another day to explore Lakshadweep\'s extraordinary underwater world — snorkeling over different sections of the reef reveals new coral formations and fish species each time. Spend the late afternoon in peaceful beach relaxation — reading, swimming, or simply watching the play of light on the lagoon as the sun moves across the sky in this remote Indian Ocean paradise.' },
      { day: 'Day 5', desc: 'Enjoy a final breakfast with views of the lagoon before transferring to Agatti Airport for the 10 AM flight back to Kochi. The 90-minute flight provides one last aerial view of Lakshadweep\'s extraordinary ring of coral islands, each a jewel of turquoise set in the deep blue Arabian Sea — a sight that stays with you long after you return to the mainland.' },
    ],
  },
  {
    slug: 'coorg-tour-from-bangalore',
    title: 'Coorg Weekend Tour from Bangalore',
    location: 'Coorg (Kodagu), Karnataka',
    region: 'South India',
    category: 'Nature Tour',
    duration: '3 Days / 2 Nights',
    nights: 2,
    priceINR: 3287,
    originalPriceINR: 3499,
    image: 'https://images.unsplash.com/photo-1676140428072-62fa84ba5800?w=800&q=80',
    highlights: ['Mandalpatti Viewpoint', 'Abbey Falls', "Raja's Seat sunset", 'Elephant interaction at Harangi Camp', 'Namdroling Monastery (Golden Temple)'],
    includes: ['1 night accommodation', 'Breakfast (D2–D3) & dinner (D2)', 'Non-AC bus transport', 'Professional driver & tour guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Board the bus from Bangalore at your nearest pickup point in the evening, beginning the 270 km journey through the Karnataka plains and into the misty coffee-scented Kodagu (Coorg) hills. The road climbs dramatically through dense Western Ghats forest as you approach Madikeri — Coorg\'s picturesque district capital nestled at 1,150 m.' },
      { day: 'Day 2', desc: 'Arrive in Coorg in the morning and begin with the dramatic Mandalpatti Viewpoint — accessible by jeep safari through the Pushpagiri Wildlife Sanctuary, this dramatic hilltop lookout offers sweeping views of misty valleys and forest ridges stretching to the horizon. Visit the beautiful Abbey Falls — a 70-foot cascade set in a lush valley of coffee and spice plantations, accessible via a short forest trail. Spend the golden hour at Raja\'s Seat — the famous hilltop garden terrace where the Kodava kings watched the sunset — as the valleys below fill with evening mist. Campfire dinner and overnight at your estate accommodation.' },
      { day: 'Day 3', desc: 'Begin with a gentle morning at the elephant training camp near Harangi, where you can interact with and feed domesticated elephants in a natural forest setting — a memorable and ethical wildlife encounter. Continue to the spectacular Namdroling Monastery (Golden Temple) in Kushalnagar — a Tibetan Buddhist monastery of extraordinary beauty, with 60-foot gold statues of the Buddha, Padmasambhava, and Amitayus gleaming in the Coorg sunlight. Depart for Bangalore in the afternoon, arriving by late evening.' },
    ],
  },
  {
    slug: 'spiti-valley-winter-tour',
    title: 'Winter Spiti Valley Tour',
    location: 'Spiti Valley, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Adventure Tour',
    duration: '8 Days / 7 Nights',
    nights: 7,
    priceINR: 14999,
    originalPriceINR: 15749,
    image: 'https://images.unsplash.com/photo-1673246239376-f3c01a13bab0?w=800&q=80',
    badge: 'Epic Journey',
    highlights: ['Chicham Bridge — world\'s highest suspension bridge', 'Hikkim — world\'s highest post office (14,567 ft)', 'Key Monastery & Tabo Monastery', 'Chitkul — India\'s last village before Tibet'],
    includes: ['Homestay accommodation', 'All meals (breakfast, lunch & dinner)', 'Transportation throughout', 'Professional guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Board the overnight Volvo bus from Delhi to Shimla — approximately a 9-hour journey through the Shivalik Hills. Arrive in Shimla in the early morning, the colonial hill station draped in morning mist. Transfer to a private vehicle for the onward journey into Spiti, leaving behind the relative comfort of Shimla as the road climbs into more remote terrain.' },
      { day: 'Day 2', desc: 'Drive from Shimla deep into the Kinnaur district, following the turquoise Sutlej River through dramatic gorges, then turning onto the Baspa River valley road toward Sangla and Rakcham. In winter, the high-altitude world becomes increasingly snow-covered as you gain altitude. Overnight at Rakcham village (2,800 m) — a beautiful traditional Kinnauri village of slate-roofed homes and ancient wooden temples.' },
      { day: 'Day 3', desc: 'Drive to Chitkul (3,450 m) — India\'s last inhabited village before the Indo-Tibetan border — perched dramatically above the frozen Baspa River with views of snow-capped peaks on all sides. In winter, Chitkul is almost completely snow-covered and hauntingly beautiful. Then drive the long route through Spiti to Tabo, passing through the increasingly stark and lunar landscape of inner Spiti.' },
      { day: 'Day 4', desc: 'Spend the morning at Tabo Monastery — a 1,000-year-old Buddhist monastery considered one of the oldest continuously functioning monasteries in the Himalayan region. The Dalai Lama has expressed his wish to retire here. The monastery\'s mud-plastered walls contain extraordinary ancient murals and stucco sculptures. Drive on to Kaza (3,800 m) — the capital of Spiti Valley — and check into the homestay by evening.' },
      { day: 'Day 5', desc: 'Explore the iconic high-altitude villages near Kaza in our 4x4 vehicles. Visit Hikkim (4,400 m) — home to the world\'s highest post office, from where you can send a letter "from the roof of the world." Continue to Komic (4,587 m) — the world\'s highest motorable village, "the eye of a snow cock" — and Langza (4,400 m), known for its massive Lord Buddha statue and marine fossils found in the surrounding hillsides. All overnight in Kaza.' },
      { day: 'Day 6', desc: 'Drive to Key Monastery (4,166 m) — Spiti\'s most iconic structure, a whitewashed labyrinthine monastery dramatically perched on a conical hill above the valley, home to over 300 monks and containing ancient manuscripts, thangkas, and weapons. Continue to Chicham Bridge — described as Asia\'s highest suspension bridge, crossing a 150-metre deep gorge at 4,200 m — replacing the pulley trolley system villagers once used. Overnight in Kaza.' },
      { day: 'Day 7', desc: 'Drive from Kaza south through the stunning Spiti Valley back toward Kinnaur, stopping at Nako village (3,662 m) — a medieval settlement with a sacred lake and ancient monastery — before continuing to Kalpa (2,960 m) in the Sutlej Valley. Kalpa offers extraordinary close-up views of the Kinner Kailash range, whose peaks are considered sacred to Lord Shiva and change colour dramatically at sunset.' },
      { day: 'Day 8', desc: 'Visit the famous "Suicide Point" near Kalpa — a sheer cliff edge with a jaw-dropping 1,000-metre vertical drop into the Sutlej gorge — before beginning the long return journey via Shimla to Delhi. Arrive back in Delhi late at night after one of the most epic overland journeys in India — 8 days through the most remote and beautiful valleys of the Himalayas.' },
    ],
  },
  {
    slug: 'chopta-tungnath-chandrashila-trek',
    title: 'Chopta Tungnath & Chandrashila Trek',
    location: 'Chopta, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '3 Days / 2 Nights',
    nights: 2,
    priceINR: 4899,
    originalPriceINR: 5199,
    badge: 'Best Seller',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1547452377-a7a1502dfd27?w=800&q=80',
    highlights: ['Tungnath Temple — 1,000+ yrs old, highest Shiva temple', 'Chandrashila Peak at 13,000 ft', 'Deoriatal Lake with panoramic Himalayan views', 'Beginner-friendly weekend trek'],
    includes: ['AC group transport from Delhi/Rishikesh', 'Swiss tent accommodation & sleeping bags', 'All meals (breakfast, lunch & dinner)', 'Professional trek guide', 'Campfire'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi late at night by AC group transport, arriving in Rishikesh in the early morning for a pit-stop breakfast — your first glimpse of the Garhwal mountains. Continue driving through Devprayag, Rudraprayag, and Ukhimath, winding up through pine forests and Garhwali villages. Arrive at the Baniya Kund campsite near Chopta by late afternoon. The camp sits at the edge of a breathtaking meadow at 2,600 m, and the evening brings a blazing campfire under a spectacular star-filled Garhwal sky.' },
      { day: 'Day 2', desc: 'After a hot breakfast at camp, begin the 5 km ascent from Chopta to Tungnath Temple — one of the Panch Kedar shrines of Lord Shiva, and at 3,680 m the world\'s highest Shiva temple. The trail winds through ancient bugyal meadows and dense rhododendron forests, with views of Himalayan peaks unfolding at every bend. Continue the short 1 km ascent to Chandrashila Peak (4,000 m/13,100 ft) for a stunning 360-degree panorama of the Garhwal Himalayas — Nanda Devi, Trishul, Kedar Dome, Chaukhamba, and Kedarnath peaks all visible on clear days. Descend to camp and enjoy a warm dinner around the fire.' },
      { day: 'Day 3', desc: 'Wake early for a 2.5 km morning trek to the stunning Deoriatal Lake (2,438 m) — a serene high-altitude lake famous for its perfect mirror reflection of the Chaukhamba massif in still water. Descend to Sari Village by mid-morning before boarding the vehicle for the long drive back to Delhi, arriving late at night with memories of ancient temples, summit panoramas, and the peaceful Garhwal wilderness.' },
    ],
  },
  {
    slug: 'kedarkantha-trek-5day',
    title: 'Kedarkantha Trek',
    location: 'Sankri, Uttarkashi, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 4949,
    originalPriceINR: 5299,
    difficulty: 'Easy to Moderate',
    image: 'https://images.unsplash.com/photo-1606586544554-4596bb1bca0f?w=800&q=80',
    highlights: ['360° panoramic views at 12,500 ft', 'Juda Ka Talab — frozen lake camping', 'Views of Kalanag, Swargarohini & Bandarpoonch peaks', 'Dense rhododendron & oak forests'],
    includes: ['4 nights campsite accommodation', 'All meals (breakfast, lunch & dinner)', 'Professional trek guides & camping gear', 'Transport Dehradun–Sankri return', 'Forest permits'],
    itinerary: [
      { day: 'Day 1', desc: 'Representatives collect you from Dehradun railway station and you travel 200 km to Sankri village through scenic routes via Mussoorie, Netwar, and Purola, passing through dense forests and meadows. Arrival occurs by evening at a guest house or hotel in this charming mountain town. Your trek instructor briefs you on safety protocols and trek details before you enjoy a traditional Pahadi dinner and rest.' },
      { day: 'Day 2', desc: 'After breakfast, you trek 4 km through dense rhododendron and oak forests to reach Juda Ka Talab campsite, gaining altitude from 7,200 to 9,186 feet over 5–6 hours. Upon arrival, you enjoy lunch and rest in comfortable camps while witnessing the frozen lake\'s magical atmosphere. Evening includes group activities at the campsite before a delicious dinner and overnight stay.' },
      { day: 'Day 3', desc: 'This 4 km segment covers the ascent from 9,186 to 10,334 feet as you trek through steep, snow-covered terrain. You arrive at the Kedarkantha Base Camp in the afternoon, where dinner and evening refreshments await. The trek guide assists throughout, and you retire early for the next day\'s summit attempt.' },
      { day: 'Day 4', desc: 'An early 4 AM departure begins the steep, snowy 6 km climb to the 12,500-foot summit. You witness a spectacular sunrise while enjoying 360-degree panoramic views of Himalayan valleys and peaks including Kalanag, Swargarohini, and Bandarpoonch. Following the summit celebration, you descend carefully to Base Camp then continue to Juda Ka Talab, with careful footing on icy terrain and full guide assistance.' },
      { day: 'Day 5', desc: 'The final 6 km descent returns you to Sankri village within 2–3 hours. Representatives then drive you back to Dehradun, arriving by approximately 10:30 PM for onward travel — carrying memories of one of the finest winter summit experiences in the Himalayas.' },
    ],
  },
  {
    slug: 'kheerganga-trek-camping',
    title: 'Kheerganga Trek with Camping',
    location: 'Kasol / Barshaini, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 1265,
    originalPriceINR: 1399,
    difficulty: 'Easy to Moderate',
    image: 'https://images.unsplash.com/photo-1693131666642-ba86e6bd436d?w=800&q=80',
    highlights: ['Natural hot water springs at Kheerganga', 'Ideal first-timer trek (18 km round trip)', 'Apple orchards & pine forest trail', 'Bonfire & music sessions at camp'],
    includes: ['Professional guide (Barshaini to Barshaini)', 'Tea & dinner D1, breakfast D2', 'Twin/triple sharing tent', 'Music session & bonfire'],
    itinerary: [
      { day: 'Day 1', desc: 'Meet your guide at Barshaini (the trailhead) by 10:45 AM and begin the 9 km trek to Kheerganga through one of Himachal Pradesh\'s most beautiful forest trails. The path winds through apple and walnut orchards, dense pine and oak forests, past the serpent-shaped Rudra Nag waterfall, and through meadows carpeted with wildflowers. After approximately 5–6 hours of trekking, arrive at Kheerganga (2,960 m/9,711 ft) and plunge into the legendary natural hot water springs of Parvati Kund — a sacred healing soak with views of the valley below. Evening brings a bonfire, music, and stargazing at the overnight camp.' },
      { day: 'Day 2', desc: 'Rise early to catch the sunrise over the Parvati Valley from the meadows of Kheerganga — a breathtaking sight of alpenglow on the peaks above. After breakfast, begin the 9 km return trek to Barshaini (approximately 3–4 hours downhill). Optionally, on the way back stop at Kasol village to explore its famous Israeli cafes, browse the Chalal trail, or visit Manikaran Sahib Gurudwara with its sacred hot springs and free langar meal before heading home.' },
    ],
  },
  {
    slug: 'dayara-bugyal-trek',
    title: 'Dayara Bugyal Trek',
    location: 'Raithal, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '4 Days / 3 Nights',
    nights: 3,
    priceINR: 5299,
    originalPriceINR: 5599,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1652543422500-e808684e0257?w=800&q=80',
    highlights: ['28 sq km meadow at 12,000 ft — one of India\'s finest', 'Best winter trek in Himalayas', 'Panoramic Himalayan views', 'Beginner-friendly; accessible year-round'],
    includes: ['All permits & professional trek leader', '3 nights accommodation (tent/guesthouse)', 'All vegetarian meals D1 dinner to D4 breakfast', 'Transport Dehradun–Raithal return'],
    itinerary: [
      { day: 'Day 1', desc: 'Your journey begins at 7:30 AM with pickup from Dehradun and a 185 km drive through the Garhwal foothills to the quaint village of Raithal (2,200 m) — the base point for the Dayara Bugyal trek. The drive passes through Uttarkashi and follows the Bhagirathi River through beautiful Himalayan scenery. Arrive by evening, check into the guesthouse, and attend a trek briefing over a hot Pahadi dinner. The crisp mountain air and the silence of Raithal village sets the perfect mood for the trek ahead.' },
      { day: 'Day 2', desc: 'After an early breakfast, begin the 5 km forest trek from Raithal (2,200 m) to Gui Campsite (3,050 m) through magnificent oak, rhododendron, and birch forests. The trail gradually gains altitude, offering expanding views of the Gangotri range and Bandarpoonch peak above the treeline. Arrive at Gui by noon, set up at the campsite, and spend the afternoon on a short acclimatization walk to prepare for tomorrow\'s bugyal trek. Dinner and overnight at the camp.' },
      { day: 'Day 3', desc: 'The highlight of the trek: a 7 km round trip ascent from Gui to Dayara Bugyal (3,408 m/11,200 ft) — one of the finest alpine meadows in India, spanning 28 square kilometres. In winter, the entire bugyal is blanketed in snow; in summer and monsoon, wildflowers carpet every inch. Enjoy packed lunches at the viewpoint with panoramic views of Bandarpoonch, Draupadi Ka Danda, Srikanth, and the distant Gangotri peaks. Return to Gui camp for dinner and an early night.' },
      { day: 'Day 4', desc: 'After breakfast and camp breakdown, descend the 5 km trail back to Raithal through the beautiful forest, arriving by mid-morning. Board the vehicle for the 235 km return drive to Dehradun, arriving by evening — carrying memories of one of Uttarakhand\'s most spectacular high-altitude meadows.' },
    ],
  },
  {
    slug: 'nag-tibba-trek',
    title: 'Nag Tibba Trek',
    location: 'Dehradun, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 1499,
    originalPriceINR: 1599,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1768382671764-9c6fccffbee5?w=800&q=80',
    highlights: ['Summit at 9,915 ft — closest high-altitude trek from Delhi', 'Views of Kedarnath, Chaukamba & Gangotri peaks', 'Rhododendron & deodar forest trails', 'Ideal weekend getaway'],
    includes: ['Tea & dinner D1, breakfast D2', 'Professional trek guide', 'Shared dome tent & campfire', 'Transport (varies by variant) & permits'],
    itinerary: [
      { day: 'Day 1', desc: 'Start from Dehradun in the morning and drive through the scenic Doon Valley, crossing Mussoorie before descending to the Aglar River Valley and reaching Pantwari village — the base of the Nag Tibba trek. After lunch at Pantwari, begin the 4–5 km trek through dense deodar and rhododendron forests, following a clearly marked trail that steadily gains altitude through beautiful Garhwali countryside. Arrive at the Nag Tibba base camp by late afternoon. Set up tents, enjoy a campfire dinner under a canopy of stars, and rest early for the pre-dawn summit push.' },
      { day: 'Day 2', desc: 'Wake up at 4:30 AM for the final summit push to Nag Tibba Top (3,022 m/9,910 ft) — the highest peak of the lower Himalayan ranges of Garhwal, just 90 km from Dehradun. The 4 km ascent takes approximately 3 hours and arrives at the summit by 10 AM. On clear days, the panoramic view encompasses the Gangotri, Kedarnath, Bandarpoonch, and Swargarohini ranges — a 180-degree sweep of the central Himalayas. After soaking in the summit views, descend to Pantwari and drive back to Dehradun, arriving by evening.' },
    ],
  },
  {
    slug: 'hampta-pass-trek-chandratal',
    title: 'Hampta Pass Trek + Chandratal Lake',
    location: 'Manali, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7699,
    originalPriceINR: 8099,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1688804470994-271ad19db477?w=800&q=80',
    highlights: ['Cross Hampta Pass at 14,039 ft (Manali to Spiti)', 'Chandratal Lake at 14,100 ft — Himalayan reflections', '4 nights camping through meadows & alpine forests', 'Oxygen cylinders & first aid included'],
    includes: ['Professional trek leader & support team', '4 nights camping', 'All vegetarian meals D1 lunch to D5 breakfast', 'Round-trip transport from Manali', 'Permits, first aid & oxygen cylinders'],
    itinerary: [
      { day: 'Day 1', desc: 'Drive from Manali to Jobra (2,990 m, approximately 1 hour) — the roadhead beyond which all travel is on foot. Begin the 3 km trek through beautiful rhododendron and birch forests alongside the Rani Nallah stream, gaining altitude to reach Chika campsite (3,080 m/10,100 ft) in approximately 2 hours. The campsite sits in a picturesque clearing beside the stream, framed by high granite walls on either side. Set up tents, enjoy a hot lunch and dinner, and acclimatize to the altitude overnight.' },
      { day: 'Day 2', desc: 'Trek the scenic 5.8 km route from Chika to Balu Ka Ghera (3,650 m/12,000 ft) over approximately 5 hours, following the Rani Nallah through increasingly dramatic terrain as the valley narrows and the peaks close in. The trail passes through vast rhododendron forests — spectacular in bloom — before emerging onto boulder-strewn moraines. The campsite at Balu Ka Ghera sits in a wide mountain bowl with towering ridges on all sides. Dinner and overnight camping with views of the stars between the peaks.' },
      { day: 'Day 3', desc: 'This is the most exhilarating and physically demanding day — a 7 km trek crossing the legendary Hampta Pass (4,270 m/14,100 ft). The ascent from Balu Ka Ghera is steep and snowy, crossing snowfields to reach the pass where you\'ll experience the dramatic transition from the lush green Kullu Valley to the stark, arid landscape of Lahaul and Spiti. The descent to Siagoru (Lahaul side) is steep but rewarding — an unforgettable 8-hour day through one of Himachal\'s most dramatic high-altitude crossings.' },
      { day: 'Day 4', desc: 'A relatively easy 6 km morning trek from Siagoru brings you down to the vehicle at Chatru. Board the vehicle for the 3-hour drive to the legendary Chandratal Lake (4,300 m/14,100 ft) — the "Lake of the Moon" — one of the most beautiful high-altitude lakes in the Himalayas. Arrive by evening, set up camp by the lake, and watch the colours shift from brilliant turquoise to deep indigo as the sun sets behind the Spiti peaks above.' },
      { day: 'Day 5', desc: 'Spend the early morning watching the sunrise over Chandratal — the lake\'s reflections changing from pink to gold to electric blue as the light shifts across the surrounding peaks. After breakfast and camp breakdown, drive the 4–5 hour route back to Manali through the Lahaul Valley and Atal Tunnel, arriving by afternoon with the memories of one of India\'s most spectacular trekking journeys.' },
    ],
  },
  {
    slug: 'sar-pass-trek',
    title: 'Sar Pass Trek',
    location: 'Kasol, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 6489,
    originalPriceINR: 6299,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1700984017339-ce0abd1a5cc9?w=800&q=80',
    highlights: ['Cross Sar Pass at 13,799 ft through snow terrain', 'Frozen lakes & snow-capped Parvati Valley', '48 km total trekking distance', 'Trekking shoes & safety coverage included'],
    includes: ['Dome tent accommodation (shared)', 'Experienced guide & permits', 'All meals (breakfast, lunch, snacks & dinner)', 'Camping gear & safety coverage', 'Free trekking gear'],
    itinerary: [
      { day: 'Day 1', desc: 'Assemble at Kasol by morning and begin the 9 km trek to Grahan Village (2,380 m) — a traditional Himachali village nestled deep in the Parvati Valley forest. The trail crosses the Parvati River over a wooden bridge and climbs steadily through magnificent pine, oak, and rhododendron forests. The route takes approximately 5 hours, passing through remote terrain far from the tourist trail. Grahan is a beautifully preserved village with traditional stone-and-wood architecture. Set up camp, enjoy a bonfire dinner, and rest for the trek ahead.' },
      { day: 'Day 2', desc: 'Trek from Grahan to Min Thach (2,950 m) over 4–5 hours through steep forest terrain that gradually opens up to reveal alpine meadows and snowfields as altitude increases. The trail becomes progressively wilder, with thick conifer forests giving way to open ridgelines with expanding views of the Parvati Valley below. Min Thach is a high-altitude meadow campsite where the sky feels enormous and the stars overhead are impossibly bright. Enjoy a campfire dinner and warm sleeping bags.' },
      { day: 'Day 3', desc: 'The toughest day of the trek: a 6-hour climb from Min Thach to Nagaru camp (3,795 m) through increasingly steep snow terrain. The trail pushes through snowfields and rocky moraines, gaining significant altitude with dramatic views of the snow-capped Parvati Valley peaks on all sides. By the time you reach Nagaru, you are in true high-altitude territory — the air is thin, the landscape stark and beautiful. Rest well tonight as tomorrow brings the pass crossing.' },
      { day: 'Day 4', desc: 'The summit day: cross the legendary Sar Pass (4,206 m/13,799 ft) — a dramatic 7-hour journey through snow-covered terrain. The final push to the pass is steep and snowy, but the views from the top are extraordinary — the entire Parvati Valley spreads out behind you, while the Pin Valley of Spiti opens ahead. The descent to Biskeri Thatch includes a thrilling snow slide section where trekkers slide hundreds of metres down the snowfield. Camp at Biskeri for the night.' },
      { day: 'Day 5', desc: 'The final day: trek the 5-hour route from Biskeri Thatch back down through Barshaini to Kasol, following the Parvati River through beautiful forests and meadows. The total 48 km trekking distance complete, celebrate at Kasol with a well-deserved meal at one of the famous riverside cafes before departing homeward, carrying stories of one of Himachal\'s greatest high-altitude crossings.' },
    ],
  },
  {
    slug: 'prashar-lake-trek-camping',
    title: 'Prashar Lake Trek & Camping',
    location: 'Mandi, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 2640,
    originalPriceINR: 2799,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1661318977466-5fbd41d8ed83?w=800&q=80',
    highlights: ['Sacred Prashar Lake at 2,730 m (8,900 ft)', '360° panoramic Himalayan views (Dhauladhars)', 'Sunrise & sunset experiences at the lake', 'Suitable for complete beginners'],
    includes: ['Professional trek guide', 'All meals (breakfast, lunch & dinner)', 'Camping accommodation', 'Night lamps'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive at Panshara (near Mandi) and board shared cabs for the 25 km drive to Jwalapur village — the trailhead for the Prashar Lake trek. Begin the 9 km ascent through dense pine forests and apple orchards, with expanding views of the Mandi Valley and Shivalik Hills below. The trail climbs steadily for approximately 3–4 hours to reach the sacred Prashar Lake (2,730 m/8,900 ft) — a pristine high-altitude lake set at the foot of the Dhauldhar range, with a beautiful three-storied pagoda temple of Rishi Prashar on its banks. Set up camp by the lake, enjoy a stunning sunset over the Himalayas, and spend the night under a vast, star-filled sky.' },
      { day: 'Day 2', desc: 'Wake before dawn for the most magical moment of the trek — sunrise over Prashar Lake. As the first light catches the snow-covered Dhauladhar peaks, their reflections shimmering on the glassy lake surface, the scene is otherworldly. After a leisurely breakfast and morning tea by the lake, begin the 9 km return trek to Jwalapur (approximately 2.5–3 hours downhill through the forest). Board shared cabs back to Panshara and depart for home, carrying the peaceful energy of this sacred Himalayan lake.' },
    ],
  },
  {
    slug: 'har-ki-dun-trek',
    title: 'Har Ki Dun Trek with Camping',
    location: 'Sankri, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '7 Days / 6 Nights',
    nights: 6,
    priceINR: 7999,
    originalPriceINR: 8399,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1720936313387-0e215f329190?w=800&q=80',
    highlights: ['Glacial valley of Jaundhar at 11,800 ft', 'Views of Swargarohini I/II/III, Bandarpooch & Black Peak', 'Mahabharata-era historical villages', 'Accessible in both winter & summer'],
    includes: ['All vegetarian meals', 'Professional trek guide', 'Camping tents & sleeping bags', '1 night guesthouse/homestay in Sankri', 'Transport Dehradun–Sankri return', 'First aid & safety equipment'],
    itinerary: [
      { day: 'Day 1', desc: 'Begin the journey with an 8-hour drive from Dehradun to Sankri village (1,920 m) — a 190 km route through the Uttarkashi district, following the Tons River through dense forests and remote Garhwali villages. Arrive by evening at your guesthouse or homestay in Sankri. Enjoy a traditional Pahadi dinner, attend the trek briefing, and rest overnight in this charming mountain village that serves as base camp for the Har Ki Dun valley.' },
      { day: 'Day 2', desc: 'After breakfast, begin the 10 km trek from Sankri (1,920 m) to Puani Garat (2,440 m), taking 5–6 hours. The trail descends briefly to the Tons River before climbing through magnificent oak and rhododendron forests, passing traditional Garhwali villages with distinctive wooden architecture. The Govind National Park\'s wildlife-rich forests surround the trail. Arrive at Puani Garat campsite for dinner and overnight tenting under the stars.' },
      { day: 'Day 3', desc: 'Continue the 10 km trek from Puani Garat (2,440 m) to Boslo (2,900 m) over 5–6 hours through increasingly dramatic alpine scenery. The trail follows the Supin River upstream through broad, open valley terrain, with views of the Hata Peak and Black Peak ahead. Several ancient Mahabharata-era villages dot the route — legends say these valleys were walked by the Pandavas during their exile. Arrive at Boslo camp for dinner and rest.' },
      { day: 'Day 4', desc: 'The centrepiece day: a 17 km round-trip exploration of Har Ki Dun valley (3,566 m) and Marinda Tal lake, taking 7–8 hours. The glacial valley of Jaundhar opens magnificently as you approach — a vast, snow-ringed amphitheatre of peaks including Swargarohini I (6,252 m), Swargarohini II, Swargarohini III, Black Peak (Kalanag), and Bandarpoonch. The valley floor is carpeted with alpine flowers and the silence is profound. Marinda Tal is a serene glacial lake in the upper valley. Return to Boslo for dinner and overnight.' },
      { day: 'Day 5', desc: 'Begin the return journey with the 10 km trek from Boslo (2,900 m) back down to Puani Garat (2,440 m) over approximately 4 hours. The familiar forest trail looks different on the descent, revealing new views of the peaks and valleys. Arrive at Puani Garat by early afternoon, enjoy lunch, and spend the evening resting at camp.' },
      { day: 'Day 6', desc: 'Complete the 10 km return trek from Puani Garat back to Sankri over 4–5 hours, retracing the beautiful Tons River trail through the oak forests. Arrive at Sankri by early afternoon and freshen up at the guesthouse with a final Pahadi meal and celebration of a successful trek completion.' },
      { day: 'Day 7', desc: 'Board the vehicle in the morning for the 190 km, 8-hour drive back to Dehradun, retracing the scenic Tons Valley route through Uttarkashi and the Shivalik foothills. Arrive by evening — carrying the deep satisfaction of having explored one of Uttarakhand\'s most magnificent and historically resonant Himalayan valleys.' },
    ],
  },
  {
    slug: 'roopkund-trek',
    title: 'Roopkund Trek',
    location: 'Lohajung, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '8 Days / 7 Nights',
    nights: 7,
    priceINR: 11999,
    originalPriceINR: 12599,
    difficulty: 'Difficult',
    image: 'https://images.unsplash.com/photo-1653545710364-2b7275daeade?w=800&q=80',
    highlights: ['Mystery Lake at 16,499 ft in shadow of Mt. Trishul', '~200 preserved skeletal remains from 9th-century', 'Ali Bugyal & Bedni Bugyal alpine meadows', 'One of India\'s most iconic high-altitude treks'],
    includes: ['3 vegetarian meals daily', 'First aid kits & oxygen cylinders', 'Experienced trek leader', 'Tent camping accommodation'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart from Kathgodam (nearest railhead) for the 7–8 hour drive to Lohajung base camp (2,360 m), winding through the Kumaon hills via Almora and Gwaldam. The drive passes through dense oak forests and small villages with views of the Himalayan ranges. Arrive at Lohajung by evening, check into accommodation, attend the trek briefing, and prepare your gear for one of India\'s most iconic high-altitude treks.' },
      { day: 'Day 2', desc: 'Begin the trek from Lohajung to Didna Village (2,680 m) via the historic Lord Curzon trail — a 9 km route that follows the Bedni River through gorgeous forested terrain. The trail passes traditional Garhwali villages where life has changed little over centuries. Didna Village\'s traditional stone architecture and mountain setting make for a memorable first camp. Dinner and overnight at the campsite.' },
      { day: 'Day 3', desc: 'Trek from Didna to Ali Bugyal (3,450 m) — one of the Garhwal Himalayas\' most magnificent high-altitude meadows. The ascent opens up progressively, and the views from Ali Bugyal are extraordinary — a vast green carpet of alpine meadow (covered in snow in winter) with a panoramic sweep of Garhwal Himalayan peaks including Trishul, Nanda Ghunti, and Nanda Devi. Arrive at camp in the afternoon and spend the evening absorbing the stunning mountain vistas.' },
      { day: 'Day 4', desc: 'Cross the high ridge terrain from Ali Bugyal to Ghora Lotani (3,946 m), a 6 km trek over alpine terrain with dramatic views on all sides. The route traverses the top of the Bedni Bugyal — a vast high-altitude meadow system — with continuous panoramic views of the Trishul and Nanda Ghunti massifs. The campsite at Ghora Lotani sits in a dramatic rocky bowl near the base of the final approach to Roopkund.' },
      { day: 'Day 5', desc: 'A challenging 5 km ascent from Ghora Lotani to Bhagwabasa (4,400 m/14,500 ft) through rocky, high-altitude terrain above the treeline. The landscape is stark and elemental — boulders, snow patches, and the occasional high-altitude bird the only companions. Bhagwabasa is a windswept campsite at the base of the Roopkund basin — incredibly exposed and wild. Eat a warm dinner early, sleep with extra layers, and set the alarm for dawn.' },
      { day: 'Day 6', desc: 'The pinnacle of the trek: a 3 km pre-dawn ascent from Bhagwabasa to Roopkund Lake (5,029 m/16,499 ft) — the "Mystery Lake" in the shadow of Mt. Trishul\'s east face. The lake, frozen for most of the year, is famous for its approximately 200 preserved skeletal remains of 9th-century pilgrims — one of archaeology\'s most haunting and fascinating discoveries. The setting — a small glacial lake ringed by sheer rock walls and towering Himalayan peaks — is otherworldly. Return to Bhagwabasa.' },
      { day: 'Day 7', desc: 'Begin the long descent from Bhagwabasa back to Lohajung via the beautiful Bedni Bugyal meadows and Neel Ganga — a dramatic river gorge with crystal-clear blue water. The descent covers approximately 14 km and takes 6–7 hours through the full elevation range of this extraordinary trek, from icy peaks down to the forests of the Kumaon foothills.' },
      { day: 'Day 8', desc: 'Final departure from Lohajung back to Kathgodam by vehicle (7–8 hours), leaving behind the mountains that host one of India\'s most mysterious and magnificent high-altitude lake treks.' },
    ],
  },
  {
    slug: 'chadar-trek-frozen-zanskar',
    title: 'Chadar Trek — Frozen Zanskar River',
    location: 'Leh, Ladakh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '9 Days / 8 Nights',
    nights: 8,
    priceINR: 18699,
    originalPriceINR: 19699,
    badge: 'Bucket List',
    difficulty: 'Difficult',
    image: 'https://images.unsplash.com/photo-1702704944450-0f3a575491a2?w=800&q=80',
    highlights: ['Trek on frozen Zanskar River (11,400 ft)', 'Nerak Waterfall frozen 56 ft mid-air', 'Temperatures as low as −30°C', 'Cold desert landscapes & Zanskari culture'],
    includes: ['All meals during trek (vegetarian & Jain options)', 'Guesthouse in Leh + camping during trek', 'Transport Leh–Chilling return', 'Experienced trek leader & staff', 'Medical check-up at SNM Hospital', 'Wildlife permits'],
    itinerary: [
      { day: 'Days 1–3', desc: 'Arrive in Leh (3,524 m) and begin mandatory acclimatization — absolutely essential before setting foot on the frozen river. Spend three days resting, hydrating, and taking gentle walks around Leh town. Visit Leh Palace, Shanti Stupa, and the local bazaar. Undergo medical check-up at SNM Hospital (mandatory for all Chadar trekkers) and obtain wildlife permits. Your trek leader briefs you on ice-walking technique, safety procedures, and emergency protocols. Guesthouse accommodation in Leh all three nights.' },
      { day: 'Day 4', desc: 'Drive from Leh to Chilling village (2 hours) — the point where the Chadar trek begins. Don your crampons and step onto the frozen Zanskar River for the first time — an extraordinary sensation of walking on a living, creaking sheet of ice. The 1.5-hour trek to Gyalpo campsite follows the frozen river through soaring canyon walls of red and grey rock that tower hundreds of metres overhead. Camp on the ice or river bank with temperatures dropping to −15°C overnight.' },
      { day: 'Day 5', desc: 'Trek from Gyalpo camp to Tibb Cave (3,609 m) over 6–7 hours, covering approximately 12 km on the frozen Zanskar River. The ice changes constantly — some sections are thick and black, others thin and white, others cracked into tilted plates. Suspended frozen waterfalls cling to the canyon walls throughout the route. The Tibb Cave campsite is a massive natural overhang in the canyon wall used by Zanskari villagers for centuries. Temperature drops to −20°C.' },
      { day: 'Day 6', desc: 'The most dramatic day: the 7-hour trek from Tibb Cave to Nerak — the turnaround point of the Chadar Trek. The final section reveals the trek\'s iconic highlight — the Nerak Waterfall, a 56-foot frozen cascade hanging suspended mid-air, transformed by winter into a towering column of sculpted ice in extraordinary shades of blue and white. Camp overnight at Nerak with temperatures that can drop to −30°C — the most extreme night of the journey.' },
      { day: 'Day 7', desc: 'Begin the return journey from Nerak back to Tibb Cave (6–7 hours) — the same river corridor seen from the opposite direction, revealing new details in the ice formations and canyon walls. The ice conditions change daily as the river\'s tides beneath shift the frozen surface. Return to Tibb Cave for the final campsite night on the Zanskar River.' },
      { day: 'Day 8', desc: 'Complete the final section of the Chadar Trek, trekking from Tibb Cave to Shingra Koma before driving back to Leh. Arrive in Leh for a well-deserved celebratory dinner at a local restaurant — sharing stories of the frozen river, the canyon walls, and the extraordinary cold that made every step an act of will. Overnight in Leh guesthouse.' },
      { day: 'Day 9', desc: 'Early morning transfer to Leh Airport for your departure flight, completing one of India\'s most extraordinary and extreme winter adventures — walking a frozen Himalayan river at −30°C through ancient canyon walls that very few humans have ever seen.' },
    ],
  },

  // ── LEH LADAKH ────────────────────────────────────────────────────────────
  {
    slug: 'leh-ladakh-sightseeing-tour',
    title: 'Leh Ladakh Sightseeing Tour',
    location: 'Leh, Ladakh',
    region: 'Himalayan Region',
    category: 'Sightseeing Tour',
    duration: '6 Days / 5 Nights',
    nights: 5,
    priceINR: 29499,
    originalPriceINR: 31000,
    badge: 'Top Rated',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1583602415713-a0319a0188c0?w=800&q=80',
    highlights: ['Pangong Tso Lake (14,270 ft) — 3 Idiots filming location', 'Nubra Valley & Hunder sand dunes — double-humped camels', 'Khardung La Pass (17,582 ft) — world\'s highest motorable road', 'Shanti Stupa, Leh Palace & Magnetic Hill'],
    includes: ['Hotel accommodation (3-star)', 'All meals (breakfast & dinner)', 'Private SUV/Innova with driver', 'Airport/station transfers', 'Inner Line Permits & Environmental fees'],
    itinerary: [
      { day: 'Day 1', desc: 'Upon arrival at Leh Airport, guests experience stunning views of K2, Nanga Parbat, and Nun Kun Massif during the flight descent. After landing, transfer to the Kangsing Hotel provides a warm welcome. Spend the day acclimating to high altitude (3,500 m) — rest, hydrate, and take a gentle evening walk to Shanti Stupa for sweeping views over the Indus Valley. Dinner and overnight at hotel.' },
      { day: 'Day 2', desc: 'Following breakfast, embark on a day trip exploring Sham Valley\'s treasures — the Hall of Fame museum honouring Indian Army soldiers, Spituk Monastery with its fierce Kali shrine, and Gurudwara Pather Sahib (the miraculous Sikh shrine). Experience the famous Magnetic Hill where vehicles appear to roll uphill, then witness Sangam — the confluence of the turquoise Zanskar and grey Indus rivers. Return to Leh for overnight.' },
      { day: 'Day 3', desc: 'The drive to Nubra Valley traverses Khardung La Pass at 18,390 feet — one of the world\'s highest motorable roads — with sweeping views of the Karakoram Range. Descend into the surprisingly warm Nubra Valley. Explore Diskit Monastery with its 32-metre Maitreya Buddha statue and experience the extraordinary double-humped Bactrian camel rides at Hunder\'s white sand dunes — a surreal sight in the middle of the Himalayas. Overnight at Organic Boutique Inn camp.' },
      { day: 'Day 4', desc: 'Early departure toward Pangong Lake via Agham and Shyok Valley, passing through ancient mountain villages and dramatic river gorges. Arrival at Pangong Tso — a 133 km long saltwater lake straddling India and China — reveals the famous colour-changing blues and turquoise hues that made it iconic in "3 Idiots". Spend the afternoon by the lake, watching the colours shift as the sun moves. Overnight stay at Himalayan Wooden Cottage by the lake.' },
      { day: 'Day 5', desc: 'Spend the morning by the tranquil Pangong Lake at sunrise — the most magical time. Return to Leh via Changla Pass (approximately 18,000 feet). En route, visit the school featured in the Bollywood film "The Three Idiots" at Druk Padma Karpo School, the ornate Thiksey Monastery (resembling Tibet\'s Potala Palace), Shey Palace with its museum and giant Buddha, and the famous Magnetic Hill. Final overnight at Kangsing Hotel in Leh.' },
      { day: 'Day 6', desc: 'Early morning transfer to Leh Airport, concluding an unforgettable journey through the land of high passes — Ladakh. Carry home memories of monasteries, mountains, and the vast open skies.' },
    ],
  },
  {
    slug: 'manali-leh-bike-trip',
    title: 'Manali to Leh Ladakh Bike Trip',
    location: 'Manali → Leh, Himachal Pradesh & Ladakh',
    region: 'Himalayan Region',
    category: 'Bike Trip',
    duration: '9 Days / 8 Nights',
    nights: 8,
    priceINR: 26949,
    originalPriceINR: 28499,
    badge: 'Adventure Pick',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1574701427742-acc058398496?w=800&q=80',
    highlights: ['Ride Rohtang Pass (13,054 ft) to Khardung La (17,582 ft)', 'Camp at Sarchu (14,070 ft) under the stars', 'Pangong Tso Lake at sunrise on Royal Enfield', 'Nubra Valley double-hump camel safari'],
    includes: ['Royal Enfield 350/500cc (sharing or solo option)', 'Helmet, riding gear & tool kit', 'Hotel + camping accommodation', 'Breakfast & dinner daily', 'Expert mechanic & support vehicle throughout'],
    itinerary: [
      { day: 'Day 1', desc: 'Assemble in Manali for bike allocation, gear check, and the all-important briefing. Your Royal Enfield is assigned, riding gear fitted, and the support vehicle loaded. Spend the afternoon exploring Manali — Hadimba Temple, Old Manali\'s cafes, Solang Valley sighting — mentally preparing for one of India\'s greatest motorcycle adventures. Dinner and overnight in Manali.' },
      { day: 'Day 2', desc: 'The adventure begins in earnest: ride from Manali over the legendary Rohtang Pass (3,978 m/13,054 ft) — the first high-altitude pass of the journey, often snow-covered even in summer. The 50 km ride crosses into Lahaul Valley, with panoramic views of the Pir Panjal Range on one side and the Rohtang glaciers on the other. Continue down to Keylong (3,094 m), the district headquarters of Lahaul & Spiti. Overnight at hotel in Keylong.' },
      { day: 'Day 3', desc: 'Ride the spectacular Manali-Leh Highway from Keylong through Jispa\'s green valley, then across the barren Bharatpur plains to Sarchu (4,290 m) — a high-altitude camping ground at the border of Himachal Pradesh and Ladakh. The 160 km ride crosses some of India\'s highest terrain, with the Baralacha La Pass (4,890 m) along the way. Camp under an extraordinary sky at Sarchu, where the Milky Way is visible with the naked eye.' },
      { day: 'Day 4', desc: 'Ride from Sarchu through the dramatic Pang plateau and the surreal More Plains — a vast, flat high-altitude desert that feels more like the surface of another planet than India. Cross Tanglang La Pass (5,359 m) — one of the world\'s highest motorable passes — before descending into the Indus Valley and arriving in Leh (3,524 m). The 250 km ride is one of the most spectacular on earth. Check in to hotel and celebrate the arrival with dinner.' },
      { day: 'Day 5', desc: 'Leh rest day — essential for acclimatization after the high-altitude riding of the past two days. Explore Leh at leisure: wander the old town bazaar, climb to Leh Palace overlooking the city, visit Shanti Stupa for its sweeping panoramic views, and browse the Tibetan market. Get the bike serviced and prepare for the mountain circuits ahead. Overnight in Leh.' },
      { day: 'Day 6', desc: 'Ride from Leh over Khardung La Pass (5,359 m/17,582 ft) — one of the world\'s highest motorable roads — with breathtaking views of the Karakoram Range. Descend into the warm, green Nubra Valley — a dramatic contrast to the cold desert of Leh. Visit Diskit Monastery with its giant Maitreya Buddha statue, then ride to Hunder for the unique experience of camel safari on double-humped Bactrian camels against the white sand dunes. Overnight in Nubra Valley.' },
      { day: 'Day 7', desc: 'Ride from Nubra Valley to the legendary Pangong Tso Lake (4,350 m) via the Shyok Valley route — a 150 km ride through some of Ladakh\'s most remote and dramatic terrain. Arrive at Pangong Tso to witness the famous colour-shifting lake stretching 133 km into Tibet — the turquoise, blue, and green hues shifting constantly with the light. Watch the sunset turn the lake to liquid gold. Overnight stay by the lake with the sound of water and wind.' },
      { day: 'Day 8', desc: 'Spend the morning at Pangong Tso — the sunrise over the lake is the most magical moment of the entire trip, the peaks reflected in still water. Ride back to Leh via Chang La Pass (5,360 m), stopping at Thiksey Monastery, Shey Palace, and the "3 Idiots" filming location at Druk Padma Karpo School. Farewell dinner in Leh with the group, celebrating the completion of the Manali-Leh motorcycle odyssey.' },
      { day: 'Day 9', desc: 'Final morning in Leh — early transfer to the airport for your departure flight, completing one of the world\'s greatest motorcycle journeys: 9 days, 1,000+ km, and passes over 5,000 m through the most dramatic mountain landscapes on Earth.' },
    ],
  },

  // ── KASOL ─────────────────────────────────────────────────────────────────
  {
    slug: 'kasol-kheerganga-trek-delhi',
    title: 'Kasol & Kheerganga Trek from Delhi',
    location: 'Kasol, Himachal Pradesh',
    region: 'North India',
    category: 'Adventure Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 7149,
    originalPriceINR: 7699,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1568207447557-45cdc32a3558?w=800&q=80',
    highlights: ['Kheerganga hot springs at 9,711 ft after 12 km trek', 'Parvati Valley — riverside camping under the stars', 'Chalal Village & Kasol Israeli Café culture', 'Manikaran Sahib Gurudwara — holy hot spring'],
    includes: ['Volvo AC bus Delhi–Kasol–Delhi', 'Hotel + camping accommodation', 'Daily breakfast & dinner', 'Trek guide for Kheerganga', 'Bonfire nights'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi by Volvo AC bus in the evening. Overnight journey through the Shivalik Hills and Chandigarh plains toward the Parvati Valley.' },
      { day: 'Day 2', desc: 'Arrive in Kasol around 10:30 AM via the overnight journey. The day focuses on acclimatisation and local exploration — discover Kasol\'s quirky cafes serving Israeli and Himachali cuisine, undertake the Chalal Village trail alongside the Parvati River, and soak in the laid-back hippie atmosphere. Evening features riverside bonfire entertainment, music, and dinner. Overnight in riverside tents within the Parvati Valley.' },
      { day: 'Day 3', desc: 'An early 6:00 AM wake-up for a hot breakfast before departure to Barshaini, where the main Kheerganga trek commences (approximately 5–6 hours, 12 km). The trail passes through the serpent-shaped Rudra Nag waterfall, an ancient Shiva temple, dense rhododendron forests, and apple orchards. Upon reaching Kheerganga at 9,711 ft, soak in the natural hot water springs of Parvati Kund — a sacred healing experience. Evening campfire with music under the stars.' },
      { day: 'Day 4', desc: 'Starting at 6:30 AM, bathe in the natural hot springs one last time while observing the valley vistas bathed in morning light. After breakfast, begin the descent back to Barshaini. Visit Manikaran Sahib Gurudwara — one of the most important pilgrimage sites for Sikhs and Hindus — where hot springs bubble right inside the complex. Enjoy free langar (community meal) at the Gurudwara. Board the evening bus back to Delhi.' },
      { day: 'Day 5', desc: 'Arrive back in Delhi by 6–7 AM, carrying memories of the Parvati Valley\'s magic, the rush of the hot springs, and the warmth of the mountains.' },
    ],
  },
  {
    slug: 'parvati-valley-trek',
    title: 'Parvati Valley Trek & Camping',
    location: 'Kasol, Himachal Pradesh',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '4 Days / 3 Nights',
    nights: 3,
    priceINR: 5499,
    originalPriceINR: 5899,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1603612692333-7bac35e43500?w=800&q=80',
    highlights: ['Trek through dense Parvati Valley forest & waterfalls', 'Camp by Parvati River at 7,500 ft', 'Rasul snow bridge & alpine meadows', 'Visit Tosh village (Himalayan hippie trail)'],
    includes: ['Volvo AC bus Delhi–Kasol–Delhi', '3 nights camping', 'All meals (breakfast, lunch, dinner)', 'Experienced trek guide', 'Camping equipment'],
    itinerary: [
      { day: 'Day 1', desc: 'Board the overnight Volvo AC bus from Delhi in the evening and settle in for the long but beautiful journey through the Shivalik Hills, Chandigarh, and Bhuntar before entering the narrow Parvati Valley road. The winding mountain road as you approach Kasol is dramatic — pine-forested cliffs on one side, the roaring Parvati River far below on the other.' },
      { day: 'Day 2', desc: 'Arrive in Kasol by mid-morning and check into the riverside camp — the sound of the Parvati River a constant backdrop. After freshening up, take a short acclimatization walk to Chalal Village along the river trail — a tranquil 30-minute forest walk to a traditional Himachali village with stunning valley views. Spend the afternoon at Kasol\'s famous Israeli cafes, browse the hippie market, and enjoy a bonfire dinner at the riverside camp under a glittering mountain sky.' },
      { day: 'Day 3', desc: 'A full day exploring the heart of the Parvati Valley on foot: trek up toward Tosh village — a 4-hour hike through thick pine forest, alpine meadows, and past several cascading waterfalls to one of the most remote and beautiful villages in the valley (perched at 2,400 m with extraordinary views). The route passes the dramatic Rasul snow bridge in season — a natural snow arch over the river. Camp at Rasul in the evening with the peaks closing in around you.' },
      { day: 'Day 4', desc: 'Spend the morning in the valley watching the peaks turn golden in the morning light before trekking back to Kasol. Visit Manikaran Sahib Gurudwara — one of the Parvati Valley\'s most important pilgrimage sites — where hot springs bubble up inside the complex and langar (community meal) is served free to all visitors. Depart for Delhi in the evening, arriving in the capital the next morning.' },
    ],
  },

  // ── JIBHI & SHANGARH ──────────────────────────────────────────────────────
  {
    slug: 'shangarh-tour-from-delhi',
    title: 'Shangarh & Serolsar Lake Tour',
    location: 'Shangarh, Himachal Pradesh',
    region: 'North India',
    category: 'Nature Tour',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 8250,
    originalPriceINR: 8799,
    badge: 'Hidden Gem',
    image: 'https://images.unsplash.com/photo-1630481528791-d05a7f403e32?w=800&q=80',
    highlights: ['Shangarh meadow — flat green plateau at 7,800 ft', 'Serolsar Lake trek with 360° Himalayan views', 'Jalori Pass (10,800 ft) — apple orchid valleys', 'Pristine forests, no crowds — the road less travelled'],
    includes: ['Tempo traveller from Delhi & back', 'Guesthouse + homestay accommodation', 'All meals (breakfast & dinner)', 'Local guide for treks', 'Bonfire & village cultural evening'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi at 6 PM from the Vidhan Sabha Metro Station area by tempo traveller or bus, beginning the overnight 550 km drive through Chandigarh, the Shivalik foothills, and the winding roads of the Kullu Valley. The approach to Jibhi and Shangarh in the upper Tirthan Valley is one of Himachal\'s most scenic — narrow roads hemmed by ancient deodar forests and apple orchards.' },
      { day: 'Day 2', desc: 'Arrive in Jibhi in the morning — a village so tucked away in the forests that it feels like stepping back in time. After freshening up at the guesthouse, explore the Jibhi Waterfall — a beautiful cascade accessible via a short forest trail through apple orchards. Head to the famous Thailand Pool on the Tirthan River — a turquoise natural swimming hole where the crystal-clear glacial water creates tropical-looking pools against a Himalayan backdrop. Evening features a bonfire, Himachali folk music, and a traditional dinner.' },
      { day: 'Day 3', desc: 'Drive from Jibhi to Shangarh (7,800 ft) — one of Himachal\'s most beautiful and least-known destinations. Shangarh is a flat green meadow plateau perched dramatically above the Sainj Valley, with a small wooden temple, apple orchards, and sweeping views of the surrounding Himalayan ridges. Spend the afternoon on a leisurely meadow walk, explore the traditional wooden architecture of Shangarh village, and settle in for a spectacular sunset from the plateau edge as the peaks glow orange.' },
      { day: 'Day 4', desc: 'Drive up to Jalori Pass (3,311 m/10,800 ft) — a gentle high-altitude pass accessible by road — for panoramic views of the Great Himalayan National Park and the Serolsar bowl below. Begin the 7 km round-trip trek to Serolsar Lake (3,100 m) — a small but beautiful high-altitude lake surrounded by dense forest and home to the ancient Budhi Nagin Devi temple. En route, visit the ruins of Raghupur Fort — an ancient hilltop fort with commanding valley views. Depart for Delhi in the evening.' },
      { day: 'Day 5', desc: 'Arrive back in Delhi at approximately 7–8 AM, concluding a deeply refreshing journey through some of Himachal Pradesh\'s most unspoiled and least-visited corners — the pristine forests of Tirthan Valley, the dramatic plateau of Shangarh, and the sacred lake of Serolsar.' },
    ],
  },

  // ── CHIKMAGALUR ───────────────────────────────────────────────────────────
  {
    slug: 'chikmagalur-tour-bangalore',
    title: 'Chikmagalur Tour from Bangalore',
    location: 'Chikmagalur, Karnataka',
    region: 'South India',
    category: 'Nature Tour',
    duration: '3 Days / 2 Nights',
    nights: 2,
    priceINR: 4869,
    originalPriceINR: 5199,
    image: 'https://images.unsplash.com/photo-1627661224418-a82bc277c4aa?w=800&q=80',
    badge: 'Weekend Escape',
    highlights: ['Mullayanagiri Peak (6,330 ft) — highest peak in Karnataka', 'Coffee estate walk & plantation tour', 'Baba Budangiri dargah & Manikyadhara Waterfalls', 'Hebbe Falls — twin waterfall through coffee estates'],
    includes: ['AC bus or shared cab Bangalore–Chikmagalur–Bangalore', 'Coffee estate/resort accommodation', 'Daily breakfast & dinner', 'Jeep safari to Mullayanagiri', 'Coffee estate tour with tasting'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Bangalore at 9 PM from the designated pickup point, beginning the 250 km overnight journey to Chikmagalur through the Karnataka foothills. The route passes through Hassan and into the misty Western Ghats coffee belt — the air noticeably cooler and more fragrant as you gain altitude through the night.' },
      { day: 'Day 2', desc: 'Arrive in Chikmagalur in the early morning and check into the coffee estate resort, where the property itself is a working plantation. Begin with a guided coffee estate walk — learn how Arabica coffee is grown, processed, and dried in these fragrant hills that produce some of India\'s finest beans. After breakfast, take a jeep safari up the rugged trail to Mullayanagiri Peak (1,930 m/6,330 ft) — the highest peak in Karnataka — followed by a short trek to the summit cross with sweeping views across the entire Western Ghats range. Return for a campfire dinner and bonfire under the estate\'s vast, star-filled sky.' },
      { day: 'Day 3', desc: 'Begin with a morning visit to Baba Budangiri — the hill shrine named after Sufi saint Baba Budan, one of the first to bring coffee seeds to India in the 17th century — a sacred site revered by both Hindus and Muslims. Continue to the beautiful Manikyadhara Waterfalls cascading through lush forest, then visit Hebbe Falls — a twin waterfall accessible only by jeep through a private coffee estate, set in one of the most scenic locations in Karnataka. Depart for Bangalore by afternoon, arriving late at night.' },
    ],
  },
  {
    slug: 'kudremukh-trek',
    title: 'Kudremukh Trek & Western Ghats',
    location: 'Kudremukh, Chikmagalur, Karnataka',
    region: 'South India',
    category: 'Trek',
    duration: '3 Days / 2 Nights',
    nights: 2,
    priceINR: 1863,
    originalPriceINR: 1999,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1693743458297-5ba52f9f8405?w=800&q=80',
    highlights: ['Kudremukh Peak (6,214 ft) — Western Ghats UNESCO heritage', 'Horse-face shaped mountain; Bhadra river origin', 'Shola forests, grasslands & rare biodiversity', 'Views of Arabian Sea on clear days'],
    includes: ['Transport Chikmagalur–Kudremukh base–return', 'Forest guesthouse/homestay accommodation', 'All meals', 'Certified trek guide (forest permit required)', 'Forest department entry permit'],
    itinerary: [
      { day: 'Day 1', desc: 'Reach Chikmagalur and drive 35 km to Mullodi village — the base camp for the Kudremukh National Park trek. The drive winds through Western Ghats forests and coffee estates, climbing into some of Karnataka\'s most biodiverse terrain. Check into the forest guesthouse or village homestay, enjoy a traditional local dinner, and prepare for an early trek start tomorrow.' },
      { day: 'Day 2', desc: 'Begin the trek at 5 AM — mandatory for completing the 13 km return journey in daylight with the forest department escort. The trail ascends through spectacular shola forests (dense montane forests unique to the Western Ghats), open grasslands carpeted with wildflowers, and rocky ridgelines. Kudremukh Peak (1,894 m/6,214 ft) gets its name from its horse-face shape — "kudure mukha" in Kannada. On clear days, the Arabian Sea is visible from the summit. Return to Mullodi homestay for lunch and rest.' },
      { day: 'Day 3', desc: 'Begin the morning with a visit to the Netravati River origin point — the sacred source of one of Karnataka\'s most important rivers, bubbling up from the Kudremukh massif. Take a final Shola forest walk through the UNESCO-heritage Western Ghats ecosystem, observing the remarkable biodiversity that makes Kudremukh one of India\'s most important conservation areas. Depart for Chikmagalur or Bangalore by late morning.' },
    ],
  },

  // ── DHARAMSHALA ───────────────────────────────────────────────────────────
  {
    slug: 'indrahar-pass-trek',
    title: 'Indrahar Pass Trek from Dharamshala',
    location: 'Dharamshala, Himachal Pradesh',
    region: 'North India',
    category: 'Trek',
    duration: '4 Days / 3 Nights',
    nights: 3,
    priceINR: 6599,
    originalPriceINR: 6999,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1608497582912-bf412dc8963e?w=800&q=80',
    highlights: ['Indrahar Pass (14,248 ft) — panoramic views of Dhauladhar range', 'Triund ridge camp (9,350 ft) — Dharamshala valley far below', 'McLeod Ganj — Dalai Lama\'s home, Tibetan culture', 'Moonlit camp at Lahesh Cave (12,000 ft)'],
    includes: ['Hotel in Dharamshala + 2 nights camping', 'All meals from Day 1 dinner to Day 4 breakfast', 'Experienced certified trek guide', 'Camping equipment (tent, sleeping bag, mattress)', 'Transport Dharamshala–McLeod Ganj'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive in Dharamshala — home of the Dalai Lama and the Tibetan government-in-exile — and check into your hotel. Take a leisurely afternoon walk around McLeod Ganj: visit the Dalai Lama\'s Temple Complex (Tsuglagkhang), browse the Tibetan market for hand-crafted goods and Buddhist artifacts, and settle into one of the town\'s famous Tibetan-run cafes for momos and butter tea. Trek briefing in the evening, reviewing gear and the ambitious itinerary for the days ahead.' },
      { day: 'Day 2', desc: 'Begin the 9 km trek from Galu Devi Temple to Triund Ridge (2,850 m/9,350 ft) — one of Himachal Pradesh\'s most beloved high-altitude campsites. The trail climbs steadily through oak and rhododendron forest, passing the "Magic View Cafe" en route, before emerging dramatically onto the Triund ridge with a sweeping 270-degree panorama of the Dhauladhar peaks above and the Kangra Valley stretching far below. Set up camp and watch the sunset turn the Dhauladhar snowfields a deep crimson-gold.' },
      { day: 'Day 3', desc: 'The most challenging and rewarding day: ascend 3.5 km from Triund to Lahesh Cave (3,600 m/12,000 ft) over 3 hours through increasingly dramatic terrain above the treeline, then tackle the final 4 km to the Indrahar Pass (4,342 m/14,248 ft) — a 4-hour push through snow and rock to one of the Dhauladhar range\'s highest crossings. The panoramic views from the pass encompass both the Kangra Valley and the Lahaul Valley beyond — an extraordinary reward for the effort. Return to Lahesh Cave for an overnight camp under a moonlit Dhauladhar sky.' },
      { day: 'Day 4', desc: 'Descend from Lahesh Cave back to Triund, then continue down the 9 km trail through the forest to Galu Devi and McLeod Ganj. Stop at the Magic View Cafe for a final tea with views. Back in McLeod Ganj, enjoy a celebratory lunch at a Tibetan restaurant before departing, carrying the memory of standing at 14,000 ft above the Kangra Valley — one of the Himalayas\' most dramatic ridgeline crossings.' },
    ],
  },
  {
    slug: 'dharamshala-dalhousie-honeymoon',
    title: 'Dharamshala & Dalhousie Honeymoon',
    location: 'Dharamshala + Dalhousie, Himachal Pradesh',
    region: 'North India',
    category: 'Honeymoon',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 24640,
    originalPriceINR: 25999,
    badge: 'Honeymoon Special',
    image: 'https://images.unsplash.com/photo-1727958913224-3dee17ec8fae?w=800&q=80',
    highlights: ['Triund sunset trek — most romantic Himalayan ridge in HP', 'Dalhousie\'s colonial-era churches & Khajjiar meadow (Mini Switzerland)', 'Dalai Lama Temple Complex & Tibetan monastery visit', 'Couple spa & candlelight dinner in the mountains'],
    includes: ['Boutique hotel accommodation (3-star)', 'Daily breakfast & candlelight dinner', 'AC private cab throughout', 'Airport/station pickup & drop', 'Triund trek with guide; room decoration on arrival'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive in Dharamshala and be welcomed to your beautifully decorated honeymoon room — a thoughtful fruit basket and flower arrangement awaiting you. After freshening up, take a romantic stroll through the lanes of McLeod Ganj as the mountains glow in the late afternoon light. Browse Tibetan handicraft shops for a memento of the trip, then settle in for a candlelight dinner at one of McLeod Ganj\'s finest restaurants, with the Dhauladhar peaks silhouetted in the evening sky.' },
      { day: 'Day 2', desc: 'Begin the morning at the Dalai Lama\'s Temple Complex (Tsuglagkhang) — a deeply serene and spiritually resonant start to the day. Explore the Tibetan Library, the Tibet Museum, and the surrounding monastery gardens. For the adventurous couple, take the optional sunset trek to Triund ridge (9,350 ft) — a 9 km hike with one of Himachal\'s most spectacular sunset views over the Kangra Valley as your reward. Return to town for a romantic mountain dinner.' },
      { day: 'Day 3', desc: 'Drive 3.5 hours through the beautiful Himachal foothills to the charming colonial hill station of Dalhousie (2,036 m). This little-visited town retains a charming Raj-era character with its Victorian churches and winding Mall Road. Explore the peaceful Subhash Baoli — a woodland grove where Netaji Subhash Chandra Bose once lived — and the beautiful St. Francis Church with its Gothic architecture. Evening walk on Dalhousie\'s Mall Road, gazing out over the Ravi Valley.' },
      { day: 'Day 4', desc: 'Drive 24 km to Khajjiar — India\'s own "Mini Switzerland" — a breathtaking circular meadow of vivid green set among tall deodar forests with the Dhauladhar peaks rising behind. Enjoy a romantic picnic on the meadow, ride the traditional horses around the lake, and pose for couple photos in the postcard-perfect setting. Continue to Dainkund Peak (2,745 m) for panoramic views. Return to Dalhousie for your couple\'s spa session — the perfect ending to a mountain honeymoon.' },
      { day: 'Day 5', desc: 'A final morning in the mountains — enjoy a leisurely breakfast on the balcony watching the Himalayan peaks before beginning the journey home, carrying the warmth and the memories of your first shared mountain adventure.' },
    ],
  },
  {
    slug: 'triund-trek-camping',
    title: 'Triund Trek & Camping',
    location: 'Dharamshala, Himachal Pradesh',
    region: 'North India',
    category: 'Trek',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 913,
    originalPriceINR: 999,
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1503265192943-9d7eea6fc77a?w=800&q=80',
    highlights: ['Triund ridge (9,350 ft) — 360° view of Dhauladhar & Kangra Valley', 'Star-gazing camp at 9,000 ft above McLeod Ganj', 'Short easy trek — perfect for first-timers', 'Sunrise over snow-capped Dhauladhar range'],
    includes: ['Camping accommodation (2-person tent)', 'Dinner at camp + breakfast', 'Local trek guide', 'Sleeping bag & mat'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive in McLeod Ganj and meet your local trek guide at Galu Devi Temple by 2 PM. Begin the 9 km ascent through oak and rhododendron forest on the well-marked Triund trail, passing the famous Magic View Cafe perched on the hillside with stunning valley views. After approximately 3 hours of climbing, emerge onto the Triund ridge (2,850 m/9,350 ft) just in time for the sunset — the Dhauladhar peaks above blazing in shades of orange and pink while the Kangra Valley glitters far below. Set up camp, gather around a bonfire, and stargaze into the clear mountain night sky.' },
      { day: 'Day 2', desc: 'Wake at 6 AM for the unforgettable Triund sunrise — watch the Dhauladhar snowfields light up gold as the sun rises over the Kangra Valley, the entire panorama shifting from deep blue to brilliant orange to daylit white. Enjoy breakfast at camp while absorbing the views, then begin the 9 km descent back to Galu Devi Temple (approximately 2.5 hours). Arrive in McLeod Ganj by 11 AM and spend the rest of the day exploring its famous Tibetan cafes, browsing the market for handicrafts, and having momos at one of the town\'s legendary Tibetan restaurants.' },
    ],
  },
  // ── Uttarakhand ────────────────────────────────────────────────────────────
  {
    slug: 'char-dham-yatra-road',
    title: 'Char Dham Yatra By Road',
    location: 'Haridwar → Yamunotri → Gangotri → Kedarnath → Badrinath',
    region: 'North India',
    category: 'Pilgrimage',
    duration: '10 Days / 9 Nights',
    nights: 9,
    priceINR: 20349,
    originalPriceINR: 22499,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1673596337700-00635abee1aa?w=800&q=80',
    highlights: ['All 4 Dhams — Yamunotri, Gangotri, Kedarnath & Badrinath', 'Kedarnath temple darshan (3,583 m) — Lord Shiva\'s abode', 'Badrinath — sacred Vishnu temple in the Himalayas', 'Haridwar Ganga Aarti on arrival day'],
    includes: ['Hotel accommodation (3-star) throughout', 'Daily breakfast & dinner', 'Tempo Traveller / AC coach throughout', 'Experienced driver + religious guide', 'All temple entry & forest fees'],
    itinerary: [
      { day: 'Day 1', desc: 'After breakfast, depart Haridwar toward Barkot via Dehradun and the Mussoorie belt, enjoying views of forested hills and winding mountain roads. Barkot serves as the main base for the Yamunotri pilgrimage. Attend the sacred Ganga Aarti at Har Ki Pauri in Haridwar before departure. Overnight in Barkot.' },
      { day: 'Day 2', desc: 'Travel to Janki Chatti after breakfast and begin the trek to Yamunotri Temple, dedicated to Goddess Yamuna — source of the Yamuna River. Pilgrims may opt for pony or palanquin services. Take a holy dip in the hot water kund and perform darshan at the temple. Trek back to Janki Chatti and return to Barkot for overnight stay.' },
      { day: 'Day 3', desc: 'After breakfast, check out and drive toward Uttarkashi following the Yamuna and Bhagirathi rivers through scenic valleys, pine forests, and charming hill towns. In the evening, visit the revered Kashi Vishwanath Temple and Shakti Temple. Overnight in Uttarkashi.' },
      { day: 'Day 4', desc: 'Early morning departure toward Gangotri. The drive passes through Gangnani hot springs and the picturesque Harsil Valley, surrounded by dense forests and snow-clad peaks. At Gangotri, perform darshan at the sacred temple and take a holy dip in the Bhagirathi River — the origin of the Ganges. After completing rituals, return to Uttarkashi for overnight.' },
      { day: 'Day 5', desc: 'After early breakfast, journey toward Guptkashi via Tehri and New Tehri, driving alongside the Mandakini River. In the evening, visit the ancient Ardhnarishwar Temple in Guptkashi — an important Shiva shrine. Overnight in Guptkashi.' },
      { day: 'Day 6', desc: 'Wake early and drive to Sonprayag, then proceed to Gaurikund — the trailhead for Kedarnath. Begin the 16 km trek to Kedarnath Temple (3,583 m), one of the twelve Jyotirlingas of Lord Shiva. Pony, palki, or helicopter services available at extra cost. Upon arrival, attend the evening aarti at Kedarnath Temple. Overnight in Kedarnath.' },
      { day: 'Day 7', desc: 'Attend the breathtaking morning aarti at Kedarnath Temple at sunrise and seek blessings. After breakfast, begin the descent trek to Gaurikund, then drive to Badrinath via Rudraprayag and Chamoli. Check in and rest. Overnight in Badrinath.' },
      { day: 'Day 8', desc: 'Visit the revered Badrinath Temple dedicated to Lord Vishnu and take a holy dip in the Tapt Kund (natural hot spring). Explore Mana Village — the last Indian village near the Indo-Tibetan border — and visit Bhim Pul, Vyas Gufa, and Saraswati River. Drive back toward Pipalkothi. Overnight.' },
      { day: 'Day 9', desc: 'Drive toward Haridwar following the Alaknanda River through Devprayag — the sacred confluence where the Bhagirathi and Alaknanda rivers merge to become the Ganga. Arrive in Haridwar by evening. Visit Har Ki Pauri for the evening Ganga Aarti. Overnight in Haridwar.' },
      { day: 'Day 10', desc: 'Morning sightseeing in Haridwar — Mansa Devi Temple (ropeway), Chandi Devi Temple, and the sacred ghats. Departure with the blessings of all four Dhams.' },
    ],
  },
  {
    slug: 'char-dham-yatra-helicopter',
    title: 'Char Dham Yatra By Helicopter',
    location: 'Dehradun → Yamunotri → Gangotri → Kedarnath → Badrinath',
    region: 'North India',
    category: 'Pilgrimage',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 261905,
    originalPriceINR: 275000,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1686150040758-95d31b340ef8?w=800&q=80',
    highlights: ['Helicopter darshan at all 4 Dhams — skip the long trek queues', 'Land directly at Kedarnath helipad (200 m from temple)', 'Luxury hotel accommodation throughout', 'VIP darshan at all temples — no long waiting'],
    includes: ['Helicopter tickets (all 4 Dhams)', 'Luxury hotel (4-star) accommodation', 'All meals (breakfast + dinner)', 'Airport transfers & ground transport', 'Dedicated religious escort & guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive in Dehradun and check into your luxury hotel. Board the helicopter in the morning for the first darshan — fly directly to the Yamunotri helipad (close to the source of the Yamuna River) for darshan at Yamunotri Temple, then onward to the Gangotri helipad for darshan at Gangotri Temple on the banks of the Bhagirathi River. Skip the long trek queues and experience both sacred dhams in a single extraordinary day. Return to Dehradun by evening for overnight.' },
      { day: 'Day 2', desc: 'Board the helicopter for Kedarnath — arguably India\'s most sacred Shiva shrine. The chopper lands just 200 metres from the ancient stone temple at 3,583 m. Receive VIP darshan at Kedarnath Temple (one of the 12 Jyotirlingas), offer prayers at the sanctum, and soak in the profound spiritual atmosphere of this Himalayan pilgrimage site surrounded by snow-covered peaks. Overnight stay at the Kedarnath guest house — rare access to the temple town at dawn.' },
      { day: 'Day 3', desc: 'Rise for the magical 4 AM morning aarti at Kedarnath Temple before the crowds arrive — candles flickering in the ancient stone corridors, priests chanting in the pre-dawn silence. After completing all pujas, board the helicopter to Badrinath (3,133 m) — the sacred shrine of Lord Vishnu in the Alaknanda Valley. Receive VIP darshan at Badrinath Temple, take a dip in the Tapt Kund hot spring, and explore Mana Village — the last Indian village before Tibet, with its mythological Bhim Pul and Vyas Cave.' },
      { day: 'Day 4', desc: 'Attend the Badrinath morning aarti before the helicopter returns you to Dehradun. The aerial views of all four dham regions from the air are extraordinary — a final bird\'s-eye perspective on the sacred Himalayan geography. Back in Dehradun, visit Sahastradhara and enjoy leisure time or local sightseeing before the final evening.' },
      { day: 'Day 5', desc: 'Drive to Rishikesh for a final morning visit — attend the Ganga Aarti at Triveni Ghat and walk across Laxman Jhula as a spiritual conclusion to the Char Dham pilgrimage. Depart from Dehradun Airport or Haridwar Railway Station with the blessings of all four Dhams, having completed in 5 days what traditionally takes three weeks.' },
    ],
  },
  {
    slug: 'kedarnath-yatra-haridwar',
    title: 'Kedarnath Yatra from Haridwar',
    location: 'Haridwar → Kedarnath, Uttarakhand',
    region: 'North India',
    category: 'Pilgrimage',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 8799,
    originalPriceINR: 9699,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1764173517657-0e7d94d94a4b?w=800&q=80',
    highlights: ['Kedarnath Temple (3,583 m) — one of 12 Jyotirlingas', 'Gaurikund holy dip before trek', 'Rishikesh Ganga Aarti at Triveni Ghat', 'Haridwar — Har Ki Pauri sacred bathing ghat'],
    includes: ['Hotel accommodation (3-star + guest house at Kedarnath)', 'Daily breakfast & dinner', 'AC vehicle Haridwar to Gaurikund & back', 'Trek guide for Kedarnath (16 km)', 'All permits & forest fees'],
    itinerary: [
      { day: 'Day 1', desc: 'Start your journey from Haridwar. Visit the sacred Har Ki Pauri ghat and witness the evening Ganga Aarti — one of India\'s most moving spiritual experiences with hundreds of lamps floating on the Ganga. Drive toward Guptkashi via Rishikesh and Devprayag, where the Bhagirathi and Alaknanda rivers dramatically merge. Arrive Guptkashi by evening; dinner and overnight stay.' },
      { day: 'Day 2', desc: 'Get up early and drive to Gaurikund — the base point for the Kedarnath trek. Begin the 16 km trek to Kedarnath (3,583 m) through beautiful mountain terrain with views of rivers and snow-covered peaks. Pony, doli (palanquin), or helicopter services are available at your own cost. By late evening, reach Kedarnath. Have dinner and rest overnight at the temple town guest house — falling asleep to the sound of the Mandakini River.' },
      { day: 'Day 3', desc: 'Wake up early for the magical morning aarti at Kedarnath Temple — the ancient stone shrine at 3,583 m glowing in the first light. Offer prayers and seek the blessings of Lord Shiva at this Jyotirlinga. Visit the Rudr Meditation Cave nearby, where PM Modi famously meditated in 2019. Spend the morning in quiet contemplation surrounded by the Kedarnath peaks. Overnight at Kedarnath.' },
      { day: 'Day 4', desc: 'After breakfast, trek back down to Gaurikund (16 km descent, 5–6 hours). Take the vehicle from Gaurikund to Sonprayag and drive back toward Rishikesh. Stop at the Triveni Ghat in Rishikesh for a peaceful riverside moment before continuing to Haridwar. Arrive by evening; overnight in Haridwar.' },
      { day: 'Day 5', desc: 'Morning visit to Har Ki Pauri in Haridwar — take a holy dip in the Ganga at this sacred ghat believed to bear the footprint of Lord Vishnu. Explore the ghats and temple complexes before your departure, carrying the blessings of Kedarnath Dham.' },
    ],
  },
  {
    slug: 'kedarnath-chopta-tungnath-rishikesh',
    title: 'Kedarnath + Chopta + Tungnath',
    location: 'Rishikesh → Kedarnath → Chopta, Uttarakhand',
    region: 'North India',
    category: 'Pilgrimage',
    duration: '6 Days / 5 Nights',
    nights: 5,
    priceINR: 10449,
    originalPriceINR: 11499,
    image: 'https://images.unsplash.com/photo-1705383852256-060aa4936e60?w=800&q=80',
    highlights: ['Kedarnath Jyotirlinga darshan (3,583 m)', 'Tungnath — world\'s highest Shiva temple (3,680 m)', 'Chandrashila Peak (4,000 m) — 360° Himalayan panorama', 'Rishikesh white water rafting & yoga'],
    includes: ['Hotel + camp accommodation', 'Daily meals (breakfast + dinner)', 'AC cab throughout', 'Kedarnath trek guide + Tungnath trek guide', 'Rishikesh rafting session (Grade 3)'],
    itinerary: [
      { day: 'Day 1', desc: 'Assembly at Rithala Metro Station, Delhi at 10:30 PM. Board the overnight bus for Rishikesh. Pickup from Haridwar at 5 AM and from Rishikesh at 7 AM. The day includes a visit to Devprayag — the sacred confluence of Alaknanda, Bhagirathi, and Ganga rivers. Stop at Dhara Devi Temple if time permits. Reach Sitapur/Guptkashi by evening, check in. Dinner included.' },
      { day: 'Day 2', desc: 'Early start driving from Guptkashi to Gaurikund — the trailhead for Kedarnath. Begin trekking the 19 km route to Kedarnath, which can be done on foot or via pony, doli, or helicopter (all at extra cost). The trek features spectacular views of the Mandakini Valley and snow-capped Kedarnath Dome. Reach Kedarnath by evening in time for the famous evening aarti at the temple. Overnight in Kedarnath. Breakfast and dinner included.' },
      { day: 'Day 3', desc: 'Wake up early to offer prayers at Kedarnath Temple during sunrise — the ancient shrine glowing in the first Himalayan light is an experience you will never forget. After seeking blessings, begin the return trek down to Gaurikund and drive to Chopta — the "Mini Switzerland of Uttarakhand". Check into the camp. Breakfast and dinner included.' },
      { day: 'Day 4', desc: 'After breakfast, begin the trek from Chopta to Tungnath Temple — a 5 km ascent to the world\'s highest Shiva temple at 3,680 m, at least 1,000 years old. Continue to Chandrashila peak (4,000 m) for stunning 360-degree views of the Garhwal Himalayas including Nanda Devi, Trishul, and Kedarnath peaks. Descend back to Chopta camp for overnight stay under the stars.' },
      { day: 'Day 5', desc: 'After breakfast and check-out, depart for the beautiful Deoriatal Lake (2,438 m) — a 2.5 km trek offering a perfect mirror reflection of the Chaukhamba massif. Descend to Sari Village and begin the long drive back to Rishikesh through sharp mountain curves and pine forests. For those who opted for the Rishikesh extension, explore the yoga capital; others begin the overnight journey to Delhi.' },
      { day: 'Day 6', desc: 'Arrive back in Delhi at approximately 8 AM, concluding an extraordinary Himalayan pilgrimage combining Lord Shiva\'s highest temple with three of Uttarakhand\'s finest natural wonders.' },
    ],
  },
  {
    slug: 'kedarkantha-trek',
    title: 'Kedarkantha Trek',
    location: 'Sankri, Uttarakhand',
    region: 'North India',
    category: 'Trek',
    duration: '6 Days / 5 Nights',
    nights: 5,
    priceINR: 6049,
    originalPriceINR: 6699,
    badge: 'Best Winter Trek',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1606586965628-2f024caa60af?w=800&q=80',
    highlights: ['Kedarkantha summit (12,500 ft) — 360° view of 13 Himalayan peaks', 'Snow-covered meadows in winter (Dec–Apr)', 'Dense oak & pine forest camps at Juda Ka Talab', 'Sankri village — traditional Garhwali culture'],
    includes: ['Camping accommodation (all nights)', 'All meals from Day 1 dinner to Day 6 breakfast', 'Expert trek guide + porter', 'Camping equipment (tent, sleeping bag, mattress)', 'Dehradun pickup & drop (shared)'],
    itinerary: [
      { day: 'Day 1', desc: 'Pick up from Dehradun railway station and travel 200 km to Sankri village through scenic routes via Mussoorie, Netwar, and Purola, passing through dense forests and beautiful Garhwali villages. Arrive by evening. Your trek instructor briefs you on safety protocols, gear, and trek details over a traditional Pahadi dinner.' },
      { day: 'Day 2', desc: 'After a hearty breakfast, trek 4 km through dense rhododendron and oak forests from Sankri (6,400 ft) to Juda Ka Talab (9,100 ft) over 5–6 hours. In winter, the lake here freezes over creating a stunning landscape. Rest at the campsite, enjoy lunch, and spend the evening around a roaring campfire with fellow trekkers.' },
      { day: 'Day 3', desc: 'The 4 km ascent from Juda Ka Talab (9,100 ft) to Kedarkantha Base Camp (11,250 ft) takes you through increasingly dramatic snow-covered terrain. Pine and oak give way to open snowfields with panoramic views of the surrounding peaks. Arrive at Base Camp in the afternoon, have dinner, and retire early for tomorrow\'s pre-dawn summit push.' },
      { day: 'Day 4', desc: 'The alarm rings at 4 AM for the most exhilarating day of the trek. A steep, snowy 3.5 km climb over 3 hours leads to the Kedarkantha summit (12,500 ft). Arrive at the top just as the sun rises — a spectacular 360-degree panorama of 13 Himalayan peaks including Kalanag, Swargarohini, Bandarpoonch, and the Kedarnath Range. Celebrate at the summit, then descend to Hargaon camp for dinner and overnight.' },
      { day: 'Day 5', desc: 'The 7 km descent from Hargaon back to Sankri takes 2–3 hours through the same beautiful forests, now seen from above. Arrive at Sankri by noon, freshen up at the homestay, and enjoy a final Pahadi meal before loading into the vehicle for Dehradun.' },
      { day: 'Day 6', desc: 'Drive from Sankri back to Dehradun (approximately 8 hours), arriving by late evening. Depart for your home city carrying summit memories and the rewarding feeling of having conquered the Kedarkantha Peak.' },
    ],
  },
  {
    slug: 'valley-of-flowers-trek',
    title: 'Valley of Flowers Trek',
    location: 'Govindghat, Uttarakhand',
    region: 'North India',
    category: 'Trek',
    duration: '6 Days / 5 Nights',
    nights: 5,
    priceINR: 6875,
    originalPriceINR: 7599,
    badge: 'UNESCO World Heritage',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1720163700787-105247acee22?w=800&q=80',
    highlights: ['UNESCO World Heritage Site — 500+ species of wildflowers', 'Hemkund Sahib — sacred Sikh shrine at 15,200 ft', 'Bhyundar Valley confluence — stunning glacial meadows', 'Jul–Aug bloom peak — world\'s most colourful alpine valley'],
    includes: ['Accommodation in hotels + camps', 'All meals (Day 1 dinner to Day 6 lunch)', 'Trek guide + support staff', 'Camping equipment', 'Rishikesh/Haridwar pickup (shared)'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart at 6 AM from Haridwar Railway Station and drive to Govindghat (285 km, ~9–10 hours). The journey follows the scenic Bhagirath highway, crossing Devprayag where the Bhagirathi and Alaknanda rivers converge. Pass through Joshimath — the winter seat of Badrinath. Arrive at Govindghat (1,828 m) in the evening and acclimatise before dinner at your hotel or homestay.' },
      { day: 'Day 2', desc: 'Drive 4 km to Poolna, then begin the 13 km trek to Ghangaria (3,048 m), taking 5–6 hours. The route follows a well-defined rocky trail alongside the rushing Laxman Ganga River through stunning forest scenery. Numerous dhabas operate along the way for chai and snacks. Check into hotel or guest-house accommodation in Ghangaria — the base village for both Valley of Flowers and Hemkund Sahib. Dinner included.' },
      { day: 'Day 3', desc: 'Start early for the 6–7 hour full-day exploration of the Valley of Flowers (11,500 ft, 4 km into the valley). This UNESCO World Heritage Site reveals a breathtaking carpet of 500+ species of alpine wildflowers including the rare Blue Poppy, Brahma Kamal, and Himalayan Rose — best seen July–August. Walk deep into the valley, photograph the extraordinary bloom, and have lunch by the glacier stream before returning to Ghangaria for dinner.' },
      { day: 'Day 4', desc: 'After early breakfast, tackle the most challenging and rewarding day — the 6 km climb to Hemkund Sahib (14,107 ft), the highest Sikh Gurudwara in the world, set beside a glacial lake surrounded by seven snow-clad peaks. The steep trail features declining oxygen levels but the destination is extraordinary. Take a dip in the icy sacred lake, visit the Gurudwara, and spot the rare Brahma Kamal flower on the descent. Return to Ghangaria for dinner.' },
      { day: 'Day 5', desc: 'After sunrise and breakfast, begin the 13 km descent back to Govindghat (4–5 hours). Stop for lunch at Govindghat and explore the Bhyundar Valley area. Drive to Rishikesh or Haridwar for overnight.' },
      { day: 'Day 6', desc: 'Attend the morning Ganga Aarti at Rishikesh or Haridwar — a spiritual closing ceremony for a deeply beautiful Himalayan journey. Then depart for home.' },
    ],
  },
  {
    slug: 'chopta-chandrashila-trek',
    title: 'Chopta Chandrashila Trek',
    location: 'Chopta, Uttarakhand',
    region: 'North India',
    category: 'Trek',
    duration: '4 Days / 3 Nights',
    nights: 3,
    priceINR: 4399,
    originalPriceINR: 4899,
    difficulty: 'Easy–Moderate',
    image: 'https://images.unsplash.com/photo-1547452377-b2ac40e02ed6?w=800&q=80',
    highlights: ['Chandrashila Peak (4,000 m) — views of Nanda Devi, Trishul & Kedarnath peaks', 'Tungnath Temple (3,680 m) — world\'s highest Shiva temple', 'Snow-blanketed meadows of Chopta (Feb–Apr)', 'Deoriatal Lake — mirror reflection of Chaukhamba peak'],
    includes: ['Homestay + camp accommodation', 'All meals during trek', 'Trek guide', 'Haridwar/Rishikesh pickup (shared)'],
    itinerary: [
      { day: 'Day 1', desc: 'Early morning pit-stop at Rishikesh allows boarding from Rishikesh or Haridwar. Drive toward Chopta (2,680 m), passing through Devprayag — halt here to experience the sacred confluence of the Bhagirathi and Alaknanda rivers. Continue through Rudraprayag and Ukhimath. Stop for lunch in Srinagar. Arrive at the Baniya Kund campsite around 5 PM. Evening tea by a campfire beneath a breathtaking canopy of stars over the Garhwal sky.' },
      { day: 'Day 2', desc: 'After a hot breakfast, begin the trek from Chopta to Tungnath Temple — a 5 km ascent through a "heavenly place" of bugyal (high-altitude meadow) and ancient forest. The Tungnath Temple at 3,680 m is at least 1,000 years old and is one of the Panch Kedar shrines of Lord Shiva. Continue to Chandrashila peak (4,000 m) for sweeping views of Himalayan birds, gigantic pine, maple, and oak trees, and the deep silence of the Garhwal Range. Descend back to Chopta camp for overnight.' },
      { day: 'Day 3', desc: 'Begin at 5:30 AM with a hot breakfast. Trek 2.5 km to Deoriatal lake (2,438 m) — a stunning high-altitude lake offering a perfect mirror reflection of the Chaukhamba massif. In winter the temperature drops to -5°C with snow creating magical reflections. Descend to Sari Village by 10 AM. At 10:30 AM, begin the long drive back to Rishikesh through mountain scenery and pine-scented mountain air.' },
      { day: 'Day 4', desc: 'Early morning arrival back in Delhi, concluding a short but deeply rewarding Himalayan weekend. The Tungnath pilgrimage, Chandrashila views, and Deoriatal reflection will stay with you long after the journey ends.' },
    ],
  },
  {
    slug: 'rishikesh-camping-rafting',
    title: 'Rishikesh Camping & River Rafting',
    location: 'Rishikesh, Uttarakhand',
    region: 'North India',
    category: 'Adventure',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 989,
    originalPriceINR: 1199,
    badge: 'Best Seller',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1671506320551-49cba39dfb7b?w=800&q=80',
    highlights: ['Grade 3–4 white water rafting on the Ganga (16 km)', 'Beach camp on Ganga riverside — bonfire & music', 'Cliff jumping into the Ganga rapids', 'Sunrise yoga session at the campsite'],
    includes: ['Beach tent camping', 'Dinner + breakfast at camp', 'River rafting with certified instructor (16 km)', 'Cliff jumping & kayaking session', 'Life jackets & safety gear'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive in Rishikesh and check into your riverside beach camp on the banks of the Ganga — tents pitched right on the white sand beach with the river flowing past just metres away. At 2 PM, gear up for the main event: a 16 km white-water rafting run from Shivpuri to Rishikesh on the Ganga. The run includes several Grade 3–4 rapids — Body Surfing, Return to Sender, Crossfire, Golf Course — with a certified instructor guiding you through every rapid. Arrive at the Laxman Jhula take-out point by 5 PM, then relax at camp for an evening bonfire dinner under the stars with the sound of the Ganga as your soundtrack.' },
      { day: 'Day 2', desc: 'Wake at sunrise for a yoga and meditation session on the Ganga riverbank — a deeply peaceful experience in one of India\'s most spiritual towns. After breakfast, head to Mohan Chatti for cliff jumping into the Ganga — leap from rocky ledges 10–15 metres above the river into the crystal-clear pools below. Explore Laxman Jhula, browse the ashram markets, sample the famous Rishikesh cafes on the Beatles Ashram route, and depart in the afternoon carrying the energy of the Ganga.' },
    ],
  },
];

// ── Domestic Booking Drawer ───────────────────────────────────────────────────
function DomesticBookingDrawer({ trip, onClose, initialTab = 'pay' }: { trip: DomesticTrip; onClose: () => void; initialTab?: 'pay' | 'callback' }) {
  const [tab, setTab] = useState<'pay' | 'callback'>(initialTab);
  const [guests, setGuests] = useState('2');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');
  const [payStep, setPayStep] = useState<'options' | 'form'>('options');
  const [chargeNow, setChargeNow] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<'full' | 'emi' | 'partial'>('full');
  const [paymentMethod, setPaymentMethod] = useState<string>('upi');
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [promoCashback, setPromoCashback] = useState(0);
  const [applyWallet, setApplyWallet] = useState(false);
  const [cbName, setCbName] = useState('');
  const [cbPhone, setCbPhone] = useState('');
  const [cbSent, setCbSent] = useState(false);
  const [cbSending, setCbSending] = useState(false);
  const { balance: walletBalance, addCashback, deductBalance } = useWallet();

  // Lock body scroll on mobile when drawer is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    return () => { document.body.style.overflow = prev; };
  }, []);

  const totalPrice = trip.priceINR * Number(guests || 2);
  const maxWalletUsable = Math.round(totalPrice * 0.10);
  const walletDeduction = applyWallet ? Math.min(walletBalance, maxWalletUsable) : 0;
  const finalPrice = Math.max(0, totalPrice - walletDeduction);

  const handlePaymentSelected = (payload: { mode: 'full' | 'emi' | 'partial'; amountNow: number; paymentMethod?: string }) => {
    setChargeNow(payload.amountNow);
    setPaymentMode(payload.mode);
    setPaymentMethod(payload.paymentMethod ?? 'upi');
    setPayStep('form');
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaying(true);
    setPayError('');
    try {
      const res = await fetch('/api/market/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone, guests,
          packageTitle: trip.title, destination: trip.location,
          sourceUrl: `https://ylootrips.com/destinations/domestic`,
          ourPrice: finalPrice, chargeNow: chargeNow ?? finalPrice,
          paymentMode, paymentMethod, marketPrice: totalPrice, priceDiff: 0,
        }),
      });
      const data = await res.json();
      if (data.paymentUrl) { window.location.href = data.paymentUrl; }
      else { setPayError(data.error || 'Payment failed. Please try again.'); }
    } catch { setPayError('Network error. Please try again.'); }
    finally { setPaying(false); }
  };

  const handleCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    setCbSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cbName, email: 'not-provided@ylootrips.com', phone: cbPhone,
          destination: trip.title,
          message: `Callback request for: ${trip.title} (${trip.duration}, ₹${trip.priceINR.toLocaleString('en-IN')}/person). Guests: ${guests}. Client wants EMI options.`,
        }),
      });
    } catch { /* non-fatal */ }
    setCbSent(true);
    setCbSending(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(92dvh-64px)] sm:max-h-[92dvh] mb-16 sm:mb-0">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{trip.title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{trip.location} · {trip.duration} · ₹{trip.priceINR.toLocaleString('en-IN')}/person</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 shrink-0 ml-3"><X size={18} /></button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-gray-100">
          {(['pay', 'callback'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold transition-colors ${tab === t ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              {t === 'pay' ? <><CreditCard size={15} /> Book & Pay Now</> : <>📞 Free Callback</>}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1">
          {tab === 'pay' && (
            <div className="p-4 space-y-4">
              {/* Guests */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Number of Guests</label>
                <div className="flex gap-2">
                  {['1','2','3','4','5','6'].map(n => (
                    <button key={n} onClick={() => { setGuests(n); setPayStep('options'); setChargeNow(null); }}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border transition-all ${guests === n ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}`}>{n}</button>
                  ))}
                </div>
              </div>
              {/* Promo code */}
              {payStep === 'options' && (
                <PromoCodeInput
                  orderTotal={totalPrice}
                  appliedCode={promoCode}
                  discountAmount={promoCashback}
                  onApply={(code, discount) => {
                    const cb = addCashback(discount, `PROMO-${code}-${Date.now()}`, `Promo code: ${code}`);
                    setPromoCode(code); setPromoCashback(cb);
                  }}
                  onRemove={() => {
                    if (promoCashback > 0) deductBalance(promoCashback, `PROMO-REMOVE-${promoCode}`);
                    setPromoCode(null); setPromoCashback(0);
                  }}
                />
              )}

              {/* WanderLoot wallet */}
              {payStep === 'options' && walletBalance > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">WanderLoot 💸</p>
                      <p className="text-xs text-gray-600">Balance: ₹{walletBalance.toLocaleString('en-IN')} · Use up to ₹{maxWalletUsable.toLocaleString('en-IN')}</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={applyWallet} onChange={e => { setApplyWallet(e.target.checked); setPayStep('options'); setChargeNow(null); }} className="w-4 h-4" />
                      <span className="text-xs font-semibold text-gray-700">Apply</span>
                    </label>
                  </div>
                  {applyWallet && walletDeduction > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between text-xs">
                      <span className="text-gray-700">💰 WanderLoot applied</span>
                      <span className="font-semibold text-green-700">−₹{walletDeduction.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Payment Options */}
              {payStep === 'options' && (
                <PaymentOptions
                  tripPrice={finalPrice}
                  tripTitle={trip.title}
                  onProceed={(payload) => handlePaymentSelected(payload)}
                />
              )}
              {/* Step 2: Customer details */}
              {payStep === 'form' && (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-green-800">
                        {paymentMode === 'partial' ? '20% Advance Selected' : paymentMode === 'emi' ? 'EMI Selected' : 'Full Payment Selected'}
                      </p>
                      <p className="text-[11px] text-green-600 mt-0.5">Paying now: ₹{(chargeNow ?? finalPrice).toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => { setPayStep('options'); setPayError(''); }} className="text-xs text-green-700 underline">Change</button>
                  </div>
                  <form onSubmit={handlePay} className="space-y-2.5">
                    <p className="text-xs font-semibold text-gray-700">Enter your details to continue</p>
                    <input required type="text" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900"/>
                    <input required type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900"/>
                    <input required type="tel" placeholder="Phone number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                      className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900"/>
                    {payError && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{payError}</p>}
                    <button type="submit" disabled={paying}
                      className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold text-sm py-3.5 rounded-xl hover:bg-gray-800 disabled:opacity-60 transition-colors">
                      {paying ? <Loader2 size={14} className="animate-spin"/> : <CreditCard size={14}/>}
                      {paying ? 'Redirecting…' : `Pay ₹${(chargeNow ?? finalPrice).toLocaleString('en-IN')} via Easebuzz`}
                    </button>
                    <p className="text-[10px] text-gray-400 text-center">🔒 Secured by Easebuzz · No hidden charges · Full refund policy</p>
                  </form>
                </div>
              )}
            </div>
          )}

          {tab === 'callback' && (
            <div className="p-5 bg-[#1a2535] min-h-full">
              {cbSent ? (
                <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white/70"/>
                  </div>
                  <p className="font-display text-xl text-white">You&apos;re all set! 🎉</p>
                  <p className="text-white/60 text-sm max-w-xs">Our Yloo travel expert will call you within <span className="text-white font-bold">1 hour</span> with best price & EMI plan for {trip.title}.</p>
                  <p className="text-white/30 text-[11px] mt-2">📱 Expect call from +91 84278 31127</p>
                  <button onClick={onClose} className="mt-3 px-6 py-2.5 bg-white text-gray-900 font-bold rounded-xl text-sm">Done</button>
                </div>
              ) : (
                <form onSubmit={handleCallback} className="space-y-4">
                  <div className="flex items-start gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <span className="text-xl">🏕️</span>
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Yloo Concierge Callback</p>
                      <p className="text-white/60 text-xs mt-0.5">Custom price, availability check & flexible EMI — no advance needed.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['📞','Free call'],['💳','EMI plans'],['🔒','No advance']].map(([icon,label])=>(
                      <div key={label} className="bg-white/8 rounded-xl py-2 text-center">
                        <p className="text-lg">{icon}</p>
                        <p className="text-white/60 text-[10px] font-medium mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                    {[`Custom dates for ${trip.title}`,'Best group price guarantee','Pickup & drop options','Flexible 3/6/12 month EMI'].map(item=>(
                      <p key={item} className="text-white/70 text-xs flex items-center gap-2">
                        <span className="text-white/60 text-[10px]">✓</span> {item}
                      </p>
                    ))}
                  </div>
                  <input required type="text" placeholder="Your name" value={cbName} onChange={e=>setCbName(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40"/>
                  <input required type="tel" placeholder="Phone number (we'll call you)" value={cbPhone} onChange={e=>setCbPhone(e.target.value)}
                    className="w-full px-3 py-3 bg-white/10 border border-white/15 rounded-xl text-sm text-white placeholder:text-white/40 outline-none focus:border-white/40"/>
                  <button type="submit" disabled={cbSending}
                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-bold text-sm py-3.5 rounded-xl hover:bg-gray-100 disabled:opacity-60 transition-colors">
                    {cbSending ? <Loader2 size={14} className="animate-spin"/> : '📞'}
                    {cbSending ? 'Booking callback…' : 'Get Free Callback + EMI Options'}
                  </button>
                  <p className="text-white/30 text-[10px] text-center">Mon–Sun 9am–10pm · Response within 1 hour</p>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ── Trip Card ─────────────────────────────────────────────────────────────────
function TripDetailsModal({ trip, onClose, onBook }: { trip: DomesticTrip; onClose: () => void; onBook: () => void }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh]">
        {/* Image header */}
        <div className="relative h-44 shrink-0">
          <Image src={trip.image} alt={trip.title} fill className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
          <button onClick={onClose} className="absolute top-3 right-3 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-colors">
            <X size={16} />
          </button>
          <div className="absolute bottom-3 left-4">
            <p className="text-white/70 text-xs">{trip.location} · {trip.duration}</p>
            <h2 className="text-white font-display text-xl leading-tight">{trip.title}</h2>
          </div>
          <div className="absolute bottom-3 right-4 text-right">
            <p className="text-white/60 text-xs line-through">₹{trip.originalPriceINR.toLocaleString('en-IN')}</p>
            <p className="text-white font-bold text-lg">₹{trip.priceINR.toLocaleString('en-IN')}<span className="text-xs font-normal">/person</span></p>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5">
            <span className="bg-primary/8 text-primary text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">{trip.category}</span>
            {trip.difficulty && <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">{trip.difficulty}</span>}
            {trip.badge && <span className="bg-green-50 text-green-700 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">{trip.badge}</span>}
            <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">{trip.region}</span>
          </div>

          {/* Highlights */}
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">✨ Highlights</p>
            <ul className="space-y-1.5">
              {trip.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-primary/80">
                  <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Includes */}
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">📦 What's Included</p>
            <ul className="space-y-1.5">
              {trip.includes.map((inc) => (
                <li key={inc} className="flex items-start gap-2 text-sm text-primary/80">
                  <CheckCircle size={13} className="text-blue-500 shrink-0 mt-0.5" />
                  {inc}
                </li>
              ))}
            </ul>
          </div>

          {/* Itinerary */}
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">🗓️ Day-by-Day Itinerary</p>
            <div className="space-y-3">
              {trip.itinerary.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 w-14 text-[10px] font-bold text-primary/50 uppercase pt-0.5">{item.day}</div>
                  <p className="text-sm text-primary/75 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 border-t border-primary/10 p-4 flex gap-2 bg-white">
          <button onClick={onClose} className="flex-1 border border-primary/20 text-primary text-sm font-medium py-3 rounded-xl hover:bg-primary/5 transition-colors">
            Close
          </button>
          <button onClick={() => { onClose(); onBook(); }} className="flex-1 bg-gray-900 text-white text-sm font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5">
            <CreditCard size={14} /> Book Now
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function TripCard({ trip }: { trip: DomesticTrip }) {
  const [showItinerary, setShowItinerary] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'pay' | 'callback'>('pay');
  const [imgSrc, setImgSrc] = useState(trip.image);
  const discount = Math.round(((trip.originalPriceINR - trip.priceINR) / trip.originalPriceINR) * 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-primary/8 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image src={imgSrc} alt={trip.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized onError={() => setImgSrc('https://images.unsplash.com/photo-1741790956655-d4679f77c63d?w=800&q=80')} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {trip.badge && (
            <span className="bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
              {trip.badge}
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full">
            {trip.category}
          </span>
        </div>
        {trip.difficulty && (
          <span className="absolute top-3 right-3 bg-black/50 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            {trip.difficulty}
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-[11px] line-through">₹{trip.originalPriceINR.toLocaleString('en-IN')}</p>
            <p className="text-white font-display text-xl">₹{trip.priceINR.toLocaleString('en-IN')}<span className="text-sm font-normal">/person</span></p>
          </div>
          {discount > 0 && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">{discount}% OFF</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg text-primary leading-snug mb-1">{trip.title}</h3>
        <div className="flex items-center gap-3 text-[11px] text-secondary mb-3">
          <span className="flex items-center gap-1"><MapPin size={11} />{trip.location}</span>
          <span className="flex items-center gap-1"><Calendar size={11} />{trip.duration}</span>
        </div>

        {/* Highlights */}
        <ul className="space-y-1 mb-3">
          {trip.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-1.5 text-xs text-primary/70">
              <Check size={11} className="text-green-600 shrink-0 mt-0.5" />
              {h}
            </li>
          ))}
        </ul>

        {/* Includes pills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {trip.includes.slice(0, 3).map((inc) => (
            <span key={inc} className="bg-cream-light text-secondary text-[10px] px-2 py-0.5 rounded-full border border-sand/50">
              {inc.length > 30 ? inc.slice(0, 28) + '…' : inc}
            </span>
          ))}
          {trip.includes.length > 3 && (
            <span className="text-[10px] text-gray-500 font-medium self-center">+{trip.includes.length - 3} more</span>
          )}
        </div>

        {/* Itinerary accordion */}
        <button
          onClick={() => setShowItinerary((v) => !v)}
          className="flex items-center justify-between w-full text-xs text-secondary border border-sand/50 rounded-lg px-3 py-2 hover:bg-cream-light transition-colors mb-3"
        >
          <span className="flex items-center gap-1.5"><Tag size={11} />View itinerary ({trip.itinerary.length} days)</span>
          {showItinerary ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
        {showItinerary && (
          <div className="bg-cream-light rounded-xl p-3 mb-3 space-y-2">
            {trip.itinerary.map((item) => (
              <div key={item.day} className="flex gap-2 text-xs">
                <span className="font-bold text-gray-600 shrink-0 w-10">{item.day}</span>
                <span className="text-primary/70">{item.desc}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {/* Trust badges strip */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
            💳 EMI from ₹{Math.ceil(trip.priceINR / 3).toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full font-semibold">
            🔒 Secure Easebuzz
          </span>
          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-semibold">
            🎁 10% Cashback in Wallet
          </span>
          <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full font-semibold">
            ⚡ 3% Off on UPI
          </span>
          <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-semibold">
            🏷️ Use YLOO15 — 15% Off
          </span>
        </div>

        {/* CTA */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/8">
          <button
            onClick={() => { setDrawerTab('pay'); setShowDrawer(true); }}
            className="flex items-center justify-center gap-1.5 bg-gray-900 text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <CreditCard size={12} /> Book Now
          </button>
          <Link
            href={`/destinations/domestic/${trip.slug}`}
            className="flex items-center justify-center gap-1.5 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wide py-2.5 rounded-xl hover:bg-primary hover:text-cream transition-all"
          >
            <ArrowUpRight size={12} /> Details
          </Link>
        </div>
      </div>

      {showDrawer && <DomesticBookingDrawer trip={trip} initialTab={drawerTab} onClose={() => setShowDrawer(false)} />}
    </div>
  );
}

// ── Page constants ────────────────────────────────────────────────────────────
const indiaRegions = [
  { label: 'All India', value: 'All India' },
  { label: 'North India', value: 'North India' },
  { label: 'South India', value: 'South India' },
  { label: 'East India', value: 'East India' },
  { label: 'West India', value: 'West India' },
  { label: 'Northeast', value: 'Northeast India' },
  { label: 'Himalayas', value: 'Himalayan Region' },
];

const highlights = [
  { icon: Mountain, label: 'Himalayan Treks', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Castle, label: 'Heritage & Forts', color: 'text-terracotta', bg: 'bg-orange-50' },
  { icon: Waves, label: 'Beaches & Coasts', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: TreePine, label: 'Wildlife Safaris', color: 'text-green-700', bg: 'bg-green-50' },
  { icon: Sailboat, label: 'Kerala Backwaters', color: 'text-teal-600', bg: 'bg-teal-50' },
  { icon: Sun, label: 'Rajasthan Deserts', color: 'text-yellow-700', bg: 'bg-yellow-50' },
];

const trustSignals = [
  { icon: Shield, title: 'Fully Licensed & Insured', desc: 'Registered with India\'s Ministry of Tourism. All guides hold national guide cards.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Users, title: 'English-Speaking Private Guides', desc: 'Dedicated guide throughout your trip. Also available in French, German, Spanish & Japanese.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: Globe, title: 'Trusted by 40+ Countries', desc: 'USA, UK, Australia, Canada, Germany, France — 25,000+ international travelers in 12 years.', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: CreditCard, title: 'Secure International Payment', desc: 'Visa, Mastercard, Amex accepted. Prices in USD. No hidden charges. PCI-DSS compliant gateway.', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Clock, title: '24/7 Support During Your Trip', desc: 'WhatsApp, email, or phone — someone from our team is always available across all timezones.', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: BadgeCheck, title: 'Free Cancellation', desc: 'Full refund up to 7 days before departure. Flexible date changes at no extra cost.', color: 'text-teal-600', bg: 'bg-teal-50' },
];

const privateGuideFeatures = [
  { emoji: '🚗', title: 'Private Air-Conditioned Car', desc: 'Your own vehicle for all transfers and excursions. No shared coaches or public transport.' },
  { emoji: '🗣️', title: 'Dedicated English-Speaking Guide', desc: 'One guide for your group throughout. They know every story, every shortcut, every local secret.' },
  { emoji: '🏨', title: 'Hand-Picked Accommodation', desc: 'Vetted 3★–5★ hotels and heritage havelis. We inspect every property before recommending it.' },
  { emoji: '🎟️', title: 'All Entry Tickets Pre-Booked', desc: 'No queuing at monuments. Priority access to Taj Mahal, Amber Fort, and all major sites.' },
  { emoji: '🍽️', title: 'Curated Local Dining', desc: 'Safe, hygienic restaurants that international travelers trust — from rooftop dinners to street food experiences.' },
  { emoji: '📱', title: 'Local SIM Card Provided', desc: 'Stay connected from day one. We provide a local SIM with data for your entire stay.' },
];

const visaInfo = [
  { q: 'Do I need a visa for India?', a: 'Most nationalities (USA, UK, Australia, Canada, Europe) can get an e-Visa online at indianvisaonline.gov.in. It takes 2–4 business days and costs $25–$80. We send you a step-by-step guide after booking.' },
  { q: 'Is India safe for international travelers?', a: 'India is welcoming to international tourists. The Golden Triangle, Kerala, and Rajasthan are among the most visited circuits in the world. We take additional steps — vetted guides, safe accommodations, 24/7 reachable team — so you can focus on the experience.' },
  { q: 'What is the best time to visit India?', a: 'October to March is ideal for most regions — cool, dry, and clear. North India is best Oct–Mar. Kerala and South India are great year-round. Himalayas are best May–October. We\'ll recommend the best dates for your chosen destinations.' },
  { q: 'What vaccinations do I need?', a: 'Hepatitis A and Typhoid are generally recommended. Some travelers also get Hepatitis B and Rabies. We recommend consulting your doctor or a travel health clinic 4–6 weeks before departure. No mandatory vaccines required for most countries.' },
  { q: 'What currency does India use?', a: 'Indian Rupee (INR). You can withdraw from ATMs in all major cities. Your guide will help you find safe ATMs. For convenience, carry some USD/EUR for exchange. We accept international cards — Visa, Mastercard, Amex — for your booking.' },
];

const countryReviews = [
  { flag: '🇺🇸', country: 'USA', traveler: 'Sarah M.', trip: 'Golden Triangle', text: 'Everything was taken care of. Our guide Arjun was brilliant — knew every detail of every monument. Best vacation of our lives.', rating: 5 },
  { flag: '🇬🇧', country: 'UK', traveler: 'James & Emma H.', trip: 'Kerala & South India', text: 'We were nervous about India — but the team made it completely seamless. The houseboat in Kerala was out of this world.', rating: 5 },
  { flag: '🇦🇺', country: 'Australia', traveler: 'Lachlan B.', trip: 'Rajasthan Heritage', text: 'Worth every dollar. Private jeep ride up to Amber Fort, sunrise at desert dunes, rooftop dinners in Udaipur. Perfection.', rating: 5 },
  { flag: '🇨🇦', country: 'Canada', traveler: 'Marie-Claire D.', trip: 'Kerala & Goa', text: 'Three-week trip planned down to every detail. Guide spoke flawless English and French. India exceeded every expectation.', rating: 5 },
];

function DomesticDestinationsContent() {
  const { visitor } = useVisitor();
  const isInternational = visitor === 'foreigner';
  const [activeRegion, setActiveRegion] = useState('All India');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const tagQuery = searchParams.get('q')?.toLowerCase().trim() ?? '';

  const filtered = useMemo(() => {
    let trips = activeRegion === 'All India'
      ? DOMESTIC_TRIPS
      : DOMESTIC_TRIPS.filter((t) => t.region === activeRegion);
    if (tagQuery) {
      trips = trips.filter((t) =>
        t.title.toLowerCase().includes(tagQuery) ||
        t.location.toLowerCase().includes(tagQuery) ||
        t.category.toLowerCase().includes(tagQuery)
      );
    }
    return trips;
  }, [activeRegion, tagQuery]);

  return (
    <>
      <PageHero
        title={isInternational ? 'Private India Tours for International Travelers' : 'Discover India'}
        subtitle={
          isInternational
            ? 'Handcrafted private tours — Taj Mahal, Kerala, Rajasthan & beyond. English-speaking guides · Licensed operator · Trusted by 25,000+ travelers from USA, UK, Australia & 40+ countries.'
            : 'From the Himalayas to Kerala\'s backwaters — 3+ years crafting India journeys for 25,000+ travelers.'
        }
        breadcrumb={isInternational ? 'India Tours' : 'Domestic'}
        backgroundImage="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80"
        overlayClassName="bg-gradient-to-b from-terracotta/50 via-primary/60 to-primary/90"
      />

      {/* International trust bar */}
      {isInternational && (
        <section className="bg-gray-900 text-white py-3">
          <div className="section-container">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-semibold uppercase tracking-wider">
              {['🇺🇸 Trusted by Americans', '🇬🇧 Loved in the UK', '🇦🇺 Top-rated in Australia', '⭐ 4.9 Google · 2,400+ reviews', '🏛️ Ministry of Tourism Registered', '💳 Visa · Mastercard · Amex'].map((item) => (
                <span key={item} className="whitespace-nowrap">{item}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curated tours for international users */}
      {isInternational && (
        <section className="bg-gray-50 border-b border-gray-200 py-10 md:py-14">
          <div className="section-container">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-3">
                  🌍 International Travelers
                </div>
                <h2 className="font-display text-2xl md:text-display-lg text-primary">Private Guided India Tours</h2>
                <p className="text-primary/55 text-sm mt-2">English-speaking guide · Private AC car · All tickets · Secure USD payment · Free cancellation</p>
              </div>
              <Link href="/tours" className="hidden md:flex items-center gap-1.5 shrink-0 text-xs font-bold text-gray-700 border border-gray-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 px-4 py-2 rounded-full transition-all uppercase tracking-wider">
                All Tours <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {[
                { slug: 'golden-triangle-10-day', title: '10-Day Golden Triangle', subtitle: 'Delhi · Agra · Jaipur', price: '$1,400', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80', href: '/tours/golden-triangle-10-day', checkoutHref: '/checkout/tour?tour=golden-triangle-10-day', tags: ['Taj Mahal', 'Amber Fort', 'Red Fort'], rating: 4.9, reviews: 312, badge: 'Most Popular', badgeBg: 'bg-gray-800' },
                { slug: 'kerala-south-india-14-day', title: '14-Day Kerala & South India', subtitle: 'Kochi · Munnar · Alleppey · Pondicherry', price: '$1,900', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80', href: '/tours/kerala-south-india-14-day', checkoutHref: '/checkout/tour?tour=kerala-south-india-14-day', tags: ['Houseboat', 'Tea Estates', 'French Quarter'], rating: 4.9, reviews: 287, badge: 'Best Value', badgeBg: 'bg-green-600' },
                { slug: 'rajasthan-heritage-7-day', title: '7-Day Rajasthan Heritage', subtitle: 'Jaipur · Jodhpur · Udaipur', price: '$950', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=800&q=80', href: '/tours/rajasthan-heritage-7-day', checkoutHref: '/checkout/tour?tour=rajasthan-heritage-7-day', tags: ['Desert Safari', 'Lake Palace', 'Blue City'], rating: 4.8, reviews: 194, badge: 'Quick Escape', badgeBg: 'bg-blue-600' },
              ].map((tour) => (
                <div key={tour.slug} className="group bg-white rounded-2xl overflow-hidden border border-primary/8 hover:shadow-xl transition-all duration-300 flex flex-col">
                  <Link href={tour.href} className="block relative h-52 overflow-hidden">
                    <Image src={tour.image} alt={tour.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className={`${tour.badgeBg} text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full`}>{tour.badge}</span>
                      <span className="bg-primary/80 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">🔒 Private Tour</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-gray-600 text-gray-600" />
                      <span className="text-xs font-semibold">{tour.rating} ({tour.reviews})</span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className="bg-gray-900 text-white text-xs font-bold px-2.5 py-1 rounded-full">From {tour.price}</span>
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={tour.href}><h3 className="font-display text-lg text-primary mb-1 group-hover:text-secondary transition-colors">{tour.title}</h3></Link>
                    <p className="text-xs text-primary/50 flex items-center gap-1 mb-3"><MapPin className="w-3 h-3" />{tour.subtitle}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tour.tags.map((tag) => <span key={tag} className="bg-gray-100 text-gray-600 text-[10px] font-medium px-2 py-0.5 rounded-full">{tag}</span>)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-700 font-medium mb-4">
                      <Check className="w-3.5 h-3.5" /> English guide · Private car · All tickets
                    </div>
                    <div className="flex-1" />
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-primary/8">
                      <Link href={tour.checkoutHref} className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wide py-2.5 rounded-xl transition-colors">Book Now</Link>
                      <Link href={tour.href} className="flex items-center justify-center gap-1 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wide py-2.5 rounded-xl hover:bg-primary hover:text-cream transition-all">Details <ArrowUpRight className="w-3 h-3" /></Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 py-3 bg-white/70 rounded-xl border border-gray-100">
              {['🔒 256-bit SSL', '💳 Visa · MC · Amex', '🗣️ English Guides', '🆓 Free Cancellation', '🏛️ Govt. Licensed'].map((b) => (
                <span key={b} className="text-xs text-primary/55 font-medium whitespace-nowrap">{b}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights strip */}
      <section className="py-8 md:py-10 bg-cream border-b border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {highlights.map(({ icon: Icon, label, color, bg }) => (
              <div key={label} className={`flex items-center gap-2 ${bg} px-4 py-2.5 rounded-full`}>
                <Icon className={`w-4 h-4 ${color} shrink-0`} />
                <span className="text-xs font-medium text-primary/80 whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* International trust section */}
      {isInternational && (
        <section className="py-16 md:py-24 bg-white">
          <div className="section-container">
            <div className="text-center mb-12">
              <p className="text-caption uppercase tracking-[0.3em] text-gray-400 mb-3">Why International Travelers Choose Us</p>
              <h2 className="font-display text-display-lg text-primary max-w-2xl mx-auto">Everything handled — <span className="italic">from airport to airport</span></h2>
              <p className="text-primary/60 mt-4 max-w-xl mx-auto">No group tours. No shared coaches. Just you, a private guide who speaks your language, and India at its finest.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trustSignals.map(({ icon: Icon, title, desc, color, bg }) => (
                <div key={title} className="flex gap-4 p-5 border border-primary/8 rounded-xl hover:shadow-md transition-shadow bg-cream/30">
                  <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
                  <div><h3 className="font-semibold text-primary text-sm mb-1">{title}</h3><p className="text-xs text-primary/60 leading-relaxed">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Private guide features */}
      {isInternational && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div>
                <p className="text-caption uppercase tracking-[0.3em] text-gray-400 mb-4">Private Guided Tours</p>
                <h2 className="font-display text-display-lg text-primary mb-6">Not a tour group. <span className="italic">Your trip, your pace.</span></h2>
                <p className="text-primary/65 text-body-lg mb-8">Every YlooTrips India tour is fully private. No strangers on your bus, no rushed photo stops. Your own vehicle, your own guide, your own pace — from the moment you land to the moment you leave.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {privateGuideFeatures.map(({ emoji, title, desc }) => (
                    <div key={title} className="flex gap-3 p-4 bg-white rounded-xl border border-primary/8">
                      <span className="text-2xl shrink-0">{emoji}</span>
                      <div><div className="font-semibold text-primary text-sm mb-0.5">{title}</div><div className="text-xs text-primary/55 leading-relaxed">{desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl"><Image src="https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=600&q=80" alt="Taj Mahal private tour" fill className="object-cover" /></div>
                    <div className="relative aspect-square overflow-hidden rounded-xl"><Image src="https://images.unsplash.com/photo-1519307747268-66e3debb7228?w=600&q=80" alt="Private guide India" fill className="object-cover" /></div>
                  </div>
                  <div className="pt-8 space-y-3">
                    <div className="relative aspect-square overflow-hidden rounded-xl"><Image src="https://images.unsplash.com/photo-1603262110263-e5fb6c69ddd9?w=600&q=80" alt="Kerala backwaters" fill className="object-cover" /></div>
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl"><Image src="https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=600&q=80" alt="Rajasthan heritage" fill className="object-cover" /></div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-lg">
                  <div className="font-display text-2xl">25K+</div>
                  <div className="text-xs uppercase tracking-widest opacity-90">Travelers guided</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Country flags / social proof */}
      {isInternational && (
        <section className="py-12 bg-primary text-cream">
          <div className="section-container">
            <p className="text-center text-caption uppercase tracking-[0.3em] text-cream/50 mb-8">Trusted by travelers from</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-10">
              {[{ flag: '🇺🇸', country: 'USA' }, { flag: '🇬🇧', country: 'UK' }, { flag: '🇦🇺', country: 'Australia' }, { flag: '🇨🇦', country: 'Canada' }, { flag: '🇩🇪', country: 'Germany' }, { flag: '🇫🇷', country: 'France' }, { flag: '🇳🇱', country: 'Netherlands' }, { flag: '🇸🇬', country: 'Singapore' }, { flag: '🇯🇵', country: 'Japan' }, { flag: '🇳🇿', country: 'New Zealand' }, { flag: '🇰🇪', country: 'Kenya' }, { flag: '🇧🇷', country: 'Brazil' }].map(({ flag, country }) => (
                <div key={country} className="flex flex-col items-center gap-1">
                  <span className="text-3xl">{flag}</span>
                  <span className="text-[10px] text-cream/50 uppercase tracking-widest">{country}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {countryReviews.map(({ flag, country, traveler, trip, text, rating }) => (
                <div key={country} className="bg-white/8 border border-white/10 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{flag}</span>
                    <div><div className="font-medium text-cream text-sm">{traveler}</div><div className="text-xs text-cream/50">{country} · {trip}</div></div>
                  </div>
                  <div className="flex mb-2">{Array.from({ length: rating }).map((_, i) => <Star key={i} className="w-3 h-3 fill-white/70 text-white/70" />)}</div>
                  <p className="text-xs text-cream/70 leading-relaxed">&ldquo;{text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Visa FAQ */}
      {isInternational && (
        <section className="py-16 md:py-20 bg-white">
          <div className="section-container max-w-3xl">
            <div className="text-center mb-10">
              <p className="text-caption uppercase tracking-[0.3em] text-gray-400 mb-3">Before You Go</p>
              <h2 className="font-display text-display-lg text-primary">Visa, Safety & Practical Info</h2>
            </div>
            <div className="space-y-3">
              {visaInfo.map((item, i) => (
                <div key={i} className="border border-primary/10 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-primary/[0.02] transition-colors">
                    <span className="font-medium text-primary text-sm pr-4">{item.q}</span>
                    {openFaq === i ? <ChevronUp size={18} className="text-gray-600 shrink-0" /> : <ChevronDown size={18} className="text-primary/40 shrink-0" />}
                  </button>
                  {openFaq === i && <div className="px-6 pb-5 text-primary/65 text-sm leading-relaxed border-t border-primary/5"><p className="pt-4">{item.a}</p></div>}
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-gray-50 border border-gray-200 rounded-xl flex gap-4 items-start">
              <span className="text-2xl shrink-0">📋</span>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Free Pre-Trip India Guide</div>
                <p className="text-sm text-gray-600">After booking, we send you our complete India travel guide — visa step-by-step, what to pack, safety tips, etiquette, money, and day-by-day prep.</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active tag filter banner */}
      {tagQuery && (
        <div className="bg-gray-100 border-b border-gray-200 py-2.5">
          <div className="section-container flex items-center justify-between gap-3">
            <p className="text-sm text-gray-800 font-semibold">
              🔍 Showing results for: <span className="capitalize">{tagQuery}</span>
              <span className="ml-2 text-gray-600 font-normal">({filtered.length} trip{filtered.length !== 1 ? 's' : ''})</span>
            </p>
            <a href="/destinations/domestic" className="text-xs font-bold text-gray-700 border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all">
              Clear filter ✕
            </a>
          </div>
        </div>
      )}

      {/* Region filter */}
      <section className="py-4 md:py-5 bg-cream-dark border-b border-primary/8 sticky top-16 z-30">
        <div className="section-container">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
            {indiaRegions.map((r) => (
              <button key={r.value} onClick={() => setActiveRegion(r.value)}
                className={`shrink-0 px-4 py-2 text-xs uppercase tracking-widest font-medium transition-all duration-200 rounded-sm ${activeRegion === r.value ? 'bg-terracotta text-cream shadow-sm' : 'bg-cream text-primary/70 hover:bg-terracotta/10 hover:text-terracotta'}`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trip grid */}
      <section className="py-12 md:py-20 lg:py-28 bg-cream">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10 md:mb-14">
            <div>
              <p className="text-caption uppercase tracking-[0.3em] text-secondary mb-2">
                {activeRegion === 'All India' ? (isInternational ? 'Choose Your India Experience' : 'Across India') : activeRegion}
              </p>
              <h2 className="font-display text-display-lg text-primary">
                {activeRegion === 'All India' ? (isInternational ? 'Where will your India story begin?' : 'Where in India?') : `Explore ${activeRegion}`}
              </h2>
            </div>
            <p className="text-sm text-primary/50">{filtered.length} trip{filtered.length !== 1 ? 's' : ''}</p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {filtered.map((trip) => <TripCard key={trip.slug} trip={trip} />)}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🏔️</p>
              <p className="font-display text-2xl text-primary mb-2">No trips in this region yet</p>
              <p className="text-secondary text-sm mb-6">We're adding more destinations soon. In the meantime, explore all trips.</p>
              <button onClick={() => setActiveRegion('All India')} className="btn-primary">View All Trips</button>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-cream-dark border-y border-primary/8">
        <div className="section-container">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-center">
            {[{ value: '3+', label: 'Years of India expertise' }, { value: '25K+', label: 'Travelers guided' }, { value: '4.9★', label: 'Google rating' }, { value: '40+', label: 'Countries served' }].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl md:text-3xl text-primary">{value}</div>
                <div className="text-caption text-primary/50 uppercase tracking-widest mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-cream">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-caption uppercase tracking-[0.3em] text-cream/50 mb-4">
              {isInternational ? 'Start Planning Your India Trip' : 'India Travel Experts'}
            </p>
            <h2 className="font-display text-display-lg mb-4">
              {isInternational ? 'Tell us your dream. We build the trip.' : 'Not sure where to start?'}
            </h2>
            <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
              {isInternational
                ? 'Share your travel dates, group size, and interests. Our India specialists respond within 1 hour with a personalised itinerary and USD pricing — no obligation.'
                : 'Tell us your interests, budget, and travel dates. Our India specialists respond in under 1 hour — 7 days a week.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={isInternational
                  ? 'https://wa.me/918427831127?text=Hi!%20I\'m%20from%20abroad%20and%20planning%20an%20India%20trip.%20Can%20you%20help%3F'
                  : 'https://wa.me/918427831127?text=Hi%2C+I\'m+interested+in+a+domestic+India+trip'}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-4 font-semibold text-sm uppercase tracking-widest transition-colors rounded-sm"
              >
                <MessageCircle className="w-5 h-5" />
                {isInternational ? 'WhatsApp Our India Experts' : 'Chat on WhatsApp'}
              </a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-cream/25 text-cream hover:border-cream hover:bg-white/5 px-8 py-4 text-sm uppercase tracking-widest transition-all rounded-sm">
                {isInternational ? 'Get Free Custom Itinerary' : 'Plan My India Trip'}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-cream/30 text-xs mt-6 uppercase tracking-widest">
              {isInternational ? 'Free · No obligation · Response in 1 hour · USD pricing' : 'Free · No obligation · Response in under 1 hour'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function DomesticPageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[340px] md:h-[420px] bg-primary/20" />
      <div className="py-12 md:py-20 bg-cream">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-cream-dark rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-primary/10" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-primary/10 rounded w-3/4" />
                  <div className="h-3 bg-primary/8 rounded w-full" />
                  <div className="h-3 bg-primary/8 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DomesticDestinationsPage() {
  return (
    <Suspense fallback={<DomesticPageSkeleton />}>
      <DomesticDestinationsContent />
    </Suspense>
  );
}
