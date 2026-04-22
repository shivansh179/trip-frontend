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
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    badge: 'Winter Favourite',
    highlights: ["Asia's longest cable car / ropeway", 'Views of Nanda Devi (India\'s 2nd highest peak)', 'Gorson Bugyal trek with a professional guide', 'Optional snow skiing'],
    includes: ['Hotel accommodation', 'All meals (dinner D1; breakfast+dinner D2–D3; breakfast D4)', 'Professional guide', 'Transport', 'Bonfire & local sightseeing'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi (9 PM overnight journey)' },
      { day: 'Day 2', desc: 'Devprayag pit-stop → Srinagar breakfast → Joshimath; bonfire' },
      { day: 'Day 3', desc: 'Auli via cable car → snow activities → Gorson Bugyal trek' },
      { day: 'Day 4', desc: 'Depart → Rishikesh / Laxman Jhula → dinner → Delhi journey' },
      { day: 'Day 5', desc: 'Delhi arrival (6–7 AM)' },
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
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    badge: 'Hidden Gem',
    highlights: ['Jalori Pass at 10,800 ft', 'Sarolsar Lake trek with 360° Himalayan views', 'Jibhi Waterfall & Thailand Pool', '"Yeh Jawaani Hai Deewani" filming location'],
    includes: ['Resort/camp accommodation', 'All meals (breakfast, lunch & dinner)', 'Local guide', 'Private vehicle with driver', 'Trek activities & bonfire'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi (6:30 PM from Vidhan Sabha Metro)' },
      { day: 'Day 2', desc: 'Arrive Jibhi → Jibhi Waterfall & Thailand Pool → bonfire' },
      { day: 'Day 3', desc: 'Sarolsar Lake trek via Jalori Pass → Bollywood location visit' },
      { day: 'Day 4', desc: 'Sunrise → checkout → Choi Waterfall → Tirthan River → depart' },
      { day: 'Day 5', desc: 'Delhi arrival (8 AM)' },
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
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    badge: 'Best Seller',
    highlights: ['Solang Valley — zip-lining, ATV rides & snow activities', 'Atal Tunnel (world\'s longest highway tunnel) & Sissu', 'Hidimba Temple, Club House & Old Manali bazaar', 'Kasol, Chalal Village, Manikaran Sahib & DJ nights'],
    includes: ['Hotel accommodation (3-star)', 'Daily breakfast & dinner', 'Volvo AC bus Delhi–Manali–Delhi', 'Bonfire, DJ nights & music evenings', 'Sightseeing by private cab'],
    itinerary: [
      { day: 'Day 1', desc: 'Board Volvo bus from Delhi (6–8 PM, Majnu Ka Tilla pickup)' },
      { day: 'Day 2', desc: 'Arrive Manali → Club House, Hidimba Devi Temple, Old Manali bazaar; bonfire night' },
      { day: 'Day 3', desc: 'Solang Valley (ATV, zip-line, skiing) → Atal Tunnel → Sissu village; Vashisht Temple & hot springs; DJ night' },
      { day: 'Day 4', desc: 'Bhuntar → Kasol → Chalal Village trek → Parvati River → Manikaran Sahib Gurudwara; overnight return bus' },
      { day: 'Day 5', desc: 'Early morning Delhi arrival (6–7 AM)' },
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
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    badge: 'Best Seller',
    highlights: ['Explore Lahaul Valley — beyond the tourist trail', 'Atal Tunnel (world\'s longest highway tunnel at 10,000 ft)', 'Sissu waterfall & Tandi confluence of Chandra & Bhaga rivers', 'Hadimba Temple, Solang Valley & Rohtang views'],
    includes: ['Hotel accommodation (3-star)', 'Daily breakfast & dinner', 'Volvo AC bus Delhi–Manali–Delhi', 'Private cab for all sightseeing', 'Experienced local guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Evening Volvo bus departure from Delhi (Majnu Ka Tilla, 6–8 PM)' },
      { day: 'Day 2', desc: 'Arrive Manali → Hotel check-in → Hadimba Temple, Mall Road, Old Manali; bonfire' },
      { day: 'Day 3', desc: 'Drive through Atal Tunnel → Sissu (waterfall & meadow) → Lahaul Valley exploration; night stay Manali' },
      { day: 'Day 4', desc: 'Solang Valley activities → Rohtang Pass viewpoint → Vashisht hot springs; evening departure' },
      { day: 'Day 5', desc: 'Delhi arrival (6–8 AM)' },
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
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80',
    badge: 'Honeymoon Special',
    highlights: ['Candlelight dinner with snow-capped mountain views', 'Couple spa & wellness session at Vashisht hot springs', 'Private sightseeing — Solang Valley, Hadimba, Old Manali', 'Cozy riverside cottage stay with mountain views'],
    includes: ['Boutique hotel/cottage accommodation', 'Daily breakfast & candlelight dinner', 'Volvo AC bus Delhi–Manali–Delhi', 'Private cab for couple sightseeing', 'Welcome fruit basket & room decoration'],
    itinerary: [
      { day: 'Day 1', desc: 'Board Volvo bus from Delhi; overnight journey through the Himalayas' },
      { day: 'Day 2', desc: 'Arrive Manali → Check-in to riverside cottage → Mall Road stroll → candlelight dinner' },
      { day: 'Day 3', desc: 'Solang Valley (snow activities, ropeway) → Atal Tunnel → Sissu meadows → bonfire night' },
      { day: 'Day 4', desc: 'Hadimba Devi Temple → Vashisht hot springs & couple spa → Old Manali cafes → departure bus' },
      { day: 'Day 5', desc: 'Delhi arrival; farewell to the mountains' },
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
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80',
    badge: 'Likely to Sell Out',
    highlights: ['Rohtang Pass (13,054 ft) — gateway to Spiti', 'Key Monastery — 1,000-year-old Buddhist monastery at 13,668 ft', 'Chandratal Lake (Moon Lake) at 14,100 ft', 'Kaza town — the capital of Spiti Valley'],
    includes: ['Hotel + guesthouse accommodation', 'All meals (breakfast & dinner)', 'Private SUV/Innova for all transfers', 'Experienced Spiti guide', 'Inner line permits & oxygen support'],
    itinerary: [
      { day: 'Day 1', desc: 'Manali → Rohtang Pass → Gramphu → Losar village (8 hrs, 163 km)' },
      { day: 'Day 2', desc: 'Losar → Kaza → Key Monastery → Kibber (highest motorable village, 14,200 ft)' },
      { day: 'Day 3', desc: 'Kaza → Langza (fossil village) → Hikkim (world\'s highest post office) → Pin Valley' },
      { day: 'Day 4', desc: 'Kaza → Chandratal Lake → Batal → Rohtang → Manali (night arrival)' },
      { day: 'Day 5', desc: 'Manali depart / extension available' },
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
    image: 'https://images.unsplash.com/photo-1587547131421-7cc4b0e49d38?w=800&q=80',
    badge: 'Best Value',
    highlights: ['Kullu — river rafting on the Beas & Great Himalayan National Park', 'Rohtang Pass views & Solang Valley snow activities', 'Hadimba Devi Temple & Van Vihar Nature Walk', 'Naggar Castle — ancient fort overlooking Kullu valley'],
    includes: ['Hotel accommodation (3-star)', 'Daily breakfast & dinner', 'Volvo AC bus Delhi–Manali–Delhi', 'Private cab for sightseeing', 'River rafting (Kullu)'],
    itinerary: [
      { day: 'Day 1', desc: 'Evening Volvo from Delhi → overnight journey' },
      { day: 'Day 2', desc: 'Arrive Manali → Hadimba Temple, Van Vihar, Old Manali bazaar' },
      { day: 'Day 3', desc: 'Solang Valley (snow activities, ATV, zip-line) → Atal Tunnel → Sissu' },
      { day: 'Day 4', desc: 'Naggar Castle → Kullu Valley drive → Beas River rafting (Grade 3)' },
      { day: 'Day 5', desc: 'Kullu Dussehra Ground, Shawl factories, local market → evening bus' },
      { day: 'Day 6', desc: 'Delhi arrival (6–8 AM)' },
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
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    highlights: ['One of 12 Jyotirlingas — sacred to Lord Shiva', '16 km trek Gaurikund → Kedarnath Temple (11,755 ft)', 'Devprayag confluence of Bhagirathi & Alaknanda', 'Route via Haridwar, Rishikesh, Guptkashi'],
    includes: ['AC bus Delhi–Haridwar', 'Hotel accommodation', 'All meals per itinerary', 'Professional tour guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Delhi → Haridwar (AC bus)' },
      { day: 'Day 2', desc: 'Haridwar → Guptkashi (~225 km, 8–9 hrs); Devprayag stop' },
      { day: 'Day 3', desc: 'Guptkashi → Kedarnath (16 km trek via Gaurikund); temple visit' },
      { day: 'Day 4', desc: 'Morning prayers → trek back to Guptkashi' },
      { day: 'Day 5', desc: 'Return journey to Delhi' },
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
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
    badge: 'Luxury Pick',
    highlights: ['Snorkeling, scuba, kayaking & windsurfing', 'Bangaram Island — dolphins & turtles', 'Glass boat rides & island hopping', 'Thinnakara Island sandbank'],
    includes: ['AC rooms with beach views', 'Agatti Island entry permit', 'All meals (breakfast, lunch & dinner)', 'Airport transfers', 'Expert guide & water activity access'],
    itinerary: [
      { day: 'Day 1', desc: 'Kochi arrival → Agatti Island → glass boat tour → sunset' },
      { day: 'Day 2', desc: 'Bangaram Island (dolphins/turtles); Thinnakara Island; snorkeling' },
      { day: 'Day 3', desc: 'Water sports day; Lagoon Beach & Andhan Beach leisure' },
      { day: 'Day 4', desc: 'More snorkeling activities; beach relaxation' },
      { day: 'Day 5', desc: 'Breakfast → Agatti Airport (10 AM flight to Kochi)' },
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
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    highlights: ['Mandalpatti Viewpoint', 'Abbey Falls', "Raja's Seat sunset", 'Elephant interaction at Harangi Camp', 'Namdroling Monastery (Golden Temple)'],
    includes: ['1 night accommodation', 'Breakfast (D2–D3) & dinner (D2)', 'Non-AC bus transport', 'Professional driver & tour guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Evening departure Bangalore (multiple pickup points); overnight journey' },
      { day: 'Day 2', desc: 'Morning Coorg: Mandalpatti, Abbey Falls, Raja\'s Seat sunset; campfire dinner' },
      { day: 'Day 3', desc: 'Elephant camp → Namdroling Monastery → evening return to Bangalore' },
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
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
    badge: 'Epic Journey',
    highlights: ['Chicham Bridge — world\'s highest suspension bridge', 'Hikkim — world\'s highest post office (14,567 ft)', 'Key Monastery & Tabo Monastery', 'Chitkul — India\'s last village before Tibet'],
    includes: ['Homestay accommodation', 'All meals (breakfast, lunch & dinner)', 'Transportation throughout', 'Professional guide'],
    itinerary: [
      { day: 'D1', desc: 'Overnight Delhi → Shimla (Volvo)' },
      { day: 'D2', desc: 'Shimla → Chitkul via Sutlej & Baspa rivers; overnight Rakcham' },
      { day: 'D3', desc: 'Chitkul → Tabo; village exploration' },
      { day: 'D4', desc: 'Tabo Monastery visit → Kaza' },
      { day: 'D5', desc: 'Kaza: Hikkim post office, Komic & Langza villages' },
      { day: 'D6', desc: 'Key Monastery; Chicham Bridge; overnight Kaza' },
      { day: 'D7', desc: 'Kaza → Kalpa via Nako village' },
      { day: 'D8', desc: 'Suicide Point → return Delhi via Shimla' },
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
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    highlights: ['Tungnath Temple — 1,000+ yrs old, highest Shiva temple', 'Chandrashila Peak at 13,000 ft', 'Deoriatal Lake with panoramic Himalayan views', 'Beginner-friendly weekend trek'],
    includes: ['AC group transport from Delhi/Rishikesh', 'Swiss tent accommodation & sleeping bags', 'All meals (breakfast, lunch & dinner)', 'Professional trek guide', 'Campfire'],
    itinerary: [
      { day: 'Day 1', desc: 'Overnight departure Delhi → breakfast Rishikesh → drive to Baniya Kund campsite; campfire' },
      { day: 'Day 2', desc: 'Chopta → Tungnath Temple (5 km) → Chandrashila Peak (12,000+ ft) → return camp' },
      { day: 'Day 3', desc: 'Deoriatal Lake trek (2.5 km) → Sari Village → drive back to Delhi' },
    ],
  },
  {
    slug: 'kedarkantha-trek',
    title: 'Kedarkantha Trek',
    location: 'Sankri, Uttarkashi, Uttarakhand',
    region: 'Himalayan Region',
    category: 'Trek',
    duration: '5 Days / 4 Nights',
    nights: 4,
    priceINR: 4499,
    originalPriceINR: 4799,
    difficulty: 'Easy to Moderate',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
    highlights: ['360° panoramic views at 12,500 ft', 'Juda Ka Talab — frozen lake camping', 'Views of Kalanag, Swargarohini & Bandarpoonch peaks', 'Dense rhododendron & oak forests'],
    includes: ['4 nights campsite accommodation', 'All meals (breakfast, lunch & dinner)', 'Professional trek guides & camping gear', 'Transport Dehradun–Sankri return', 'Forest permits'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive Sankri (200 km from Dehradun); orientation' },
      { day: 'Day 2', desc: 'Sankri → Juda Ka Talab (4 km, 9,186 ft) through rhododendron forests' },
      { day: 'Day 3', desc: 'Juda Ka Talab → Kedarkantha Base Camp (4 km, 10,334 ft)' },
      { day: 'Day 4', desc: 'Summit attempt 4 AM (12,500 ft); sunrise views; descend to Juda Ka Talab' },
      { day: 'Day 5', desc: 'Descent to Sankri (6 km); drive back to Dehradun' },
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
    image: 'https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&q=80',
    highlights: ['Natural hot water springs at Kheerganga', 'Ideal first-timer trek (18 km round trip)', 'Apple orchards & pine forest trail', 'Bonfire & music sessions at camp'],
    includes: ['Professional guide (Barshaini to Barshaini)', 'Tea & dinner D1, breakfast D2', 'Twin/triple sharing tent', 'Music session & bonfire'],
    itinerary: [
      { day: 'Day 1', desc: 'Meet Barshaini (10:45 AM); 9 km trek through apple orchards (5–6 hrs); hot spring dip; overnight camp' },
      { day: 'Day 2', desc: 'Breakfast; return 9 km trek to Barshaini; optional Parvati Valley sightseeing' },
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
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&q=80',
    highlights: ['28 sq km meadow at 12,000 ft — one of India\'s finest', 'Best winter trek in Himalayas', 'Panoramic Himalayan views', 'Beginner-friendly; accessible year-round'],
    includes: ['All permits & professional trek leader', '3 nights accommodation (tent/guesthouse)', 'All vegetarian meals D1 dinner to D4 breakfast', 'Transport Dehradun–Raithal return'],
    itinerary: [
      { day: 'Day 1', desc: '7:30 AM pickup Dehradun → drive to Raithal (185 km); evening briefing' },
      { day: 'Day 2', desc: 'Raithal → Gui Campsite (5 km trek through oak forests); acclimatization walk' },
      { day: 'Day 3', desc: 'Gui → Dayara Bugyal summit and return (7 km round trip); packed lunch at viewpoint' },
      { day: 'Day 4', desc: 'Gui → Raithal descent (5 km); 235 km drive back to Dehradun' },
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
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
    highlights: ['Summit at 9,915 ft — closest high-altitude trek from Delhi', 'Views of Kedarnath, Chaukamba & Gangotri peaks', 'Rhododendron & deodar forest trails', 'Ideal weekend getaway'],
    includes: ['Tea & dinner D1, breakfast D2', 'Professional trek guide', 'Shared dome tent & campfire', 'Transport (varies by variant) & permits'],
    itinerary: [
      { day: 'Day 1', desc: 'Drive through Doon Valley → Pantwari village; trek to base camp (4–5 km); campfire dinner' },
      { day: 'Day 2', desc: '4:30 AM wake-up → Nag Tibba Top (9,910 ft, arrive 10 AM); panoramic views; descend; drive back' },
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
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    highlights: ['Cross Hampta Pass at 14,039 ft (Manali to Spiti)', 'Chandratal Lake at 14,100 ft — Himalayan reflections', '4 nights camping through meadows & alpine forests', 'Oxygen cylinders & first aid included'],
    includes: ['Professional trek leader & support team', '4 nights camping', 'All vegetarian meals D1 lunch to D5 breakfast', 'Round-trip transport from Manali', 'Permits, first aid & oxygen cylinders'],
    itinerary: [
      { day: 'Day 1', desc: 'Drive Manali → Jobra (1 hr); trek to Chika (2 hrs, 10,100 ft)' },
      { day: 'Day 2', desc: 'Chika → Balu Ka Ghera (5.8 km, 5 hrs, 12,000 ft) through rhododendron forests' },
      { day: 'Day 3', desc: 'Balu Ka Ghera → Hampta Pass → Siagoru (7 km, 8 hrs, 14,100 ft pass crossing)' },
      { day: 'Day 4', desc: 'Siagoru → Chatru (6 km); drive to Chandratal Lake (3 hrs)' },
      { day: 'Day 5', desc: 'Drive Chatru/Chandratal → Manali (4–5 hrs)' },
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
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    highlights: ['Cross Sar Pass at 13,799 ft through snow terrain', 'Frozen lakes & snow-capped Parvati Valley', '48 km total trekking distance', 'Trekking shoes & safety coverage included'],
    includes: ['Dome tent accommodation (shared)', 'Experienced guide & permits', 'All meals (breakfast, lunch, snacks & dinner)', 'Camping gear & safety coverage', 'Free trekking gear'],
    itinerary: [
      { day: 'Day 1', desc: 'Kasol → Grahan Village (9 km, 5 hrs) through pine & rhododendron forests' },
      { day: 'Day 2', desc: 'Grahan → Min Thach (4–5 hrs); steep forest terrain; bonfire' },
      { day: 'Day 3', desc: 'Min Thach → Nagaru (6 hrs, 3,795 m); steep snow climb; Parvati Valley views' },
      { day: 'Day 4', desc: 'Nagaru → Biskeri Thatch via Sar Pass (7 hrs); snow descent/slide; summit' },
      { day: 'Day 5', desc: 'Biskeri → Barshaini → Kasol return (5 hrs)' },
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
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
    highlights: ['Sacred Prashar Lake at 2,730 m (8,900 ft)', '360° panoramic Himalayan views (Dhauladhars)', 'Sunrise & sunset experiences at the lake', 'Suitable for complete beginners'],
    includes: ['Professional trek guide', 'All meals (breakfast, lunch & dinner)', 'Camping accommodation', 'Night lamps'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive Panshara; shared cabs to Jwalapur (25 km); 9 km trek to Prashar Lake; overnight camp' },
      { day: 'Day 2', desc: 'Sunrise viewing; breakfast; 9 km return trek to Jwalapur; drive to Panshara; depart' },
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
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
    highlights: ['Glacial valley of Jaundhar at 11,800 ft', 'Views of Swargarohini I/II/III, Bandarpooch & Black Peak', 'Mahabharata-era historical villages', 'Accessible in both winter & summer'],
    includes: ['All vegetarian meals', 'Professional trek guide', 'Camping tents & sleeping bags', '1 night guesthouse/homestay in Sankri', 'Transport Dehradun–Sankri return', 'First aid & safety equipment'],
    itinerary: [
      { day: 'D1', desc: 'Dehradun → Sankri (190 km, 8-hr drive)' },
      { day: 'D2', desc: 'Sankri → Puani Garat (10 km, 5–6 hrs)' },
      { day: 'D3', desc: 'Puani Garat → Boslo (10 km, 5–6 hrs)' },
      { day: 'D4', desc: 'Boslo → Har Ki Dun → Marinda Tal → return Boslo (17 km, 7–8 hrs)' },
      { day: 'D5', desc: 'Boslo → Puani Garat (10 km, 4 hrs)' },
      { day: 'D6', desc: 'Puani Garat → Sankri (10 km, 4–5 hrs)' },
      { day: 'D7', desc: 'Sankri → Dehradun (190 km, 8-hr drive)' },
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
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    highlights: ['Mystery Lake at 16,499 ft in shadow of Mt. Trishul', '~200 preserved skeletal remains from 9th-century', 'Ali Bugyal & Bedni Bugyal alpine meadows', 'One of India\'s most iconic high-altitude treks'],
    includes: ['3 vegetarian meals daily', 'First aid kits & oxygen cylinders', 'Experienced trek leader', 'Tent camping accommodation'],
    itinerary: [
      { day: 'D1', desc: 'Kathgodam → Lohajung base camp (7–8 hrs)' },
      { day: 'D2', desc: 'Lohajung → Didna Village via Lord Curzon trail & Bedni River' },
      { day: 'D3', desc: 'Hike to Ali Bugyal (panoramic Garhwal Himalaya views)' },
      { day: 'D4', desc: 'Ali Bugyal → Ghora Lotani across ridge terrain' },
      { day: 'D5', desc: 'Challenging ascent → Bhagwabasa (14,500 ft)' },
      { day: 'D6', desc: 'Bhagwabasa → Roopkund Lake (trek highlight) → return Bhagwabasa' },
      { day: 'D7', desc: 'Descent → Lohajung via Bedni Bugyal & Neel Ganga' },
      { day: 'D8', desc: 'Departure from Lohajung' },
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
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=800&q=80',
    highlights: ['Trek on frozen Zanskar River (11,400 ft)', 'Nerak Waterfall frozen 56 ft mid-air', 'Temperatures as low as −30°C', 'Cold desert landscapes & Zanskari culture'],
    includes: ['All meals during trek (vegetarian & Jain options)', 'Guesthouse in Leh + camping during trek', 'Transport Leh–Chilling return', 'Experienced trek leader & staff', 'Medical check-up at SNM Hospital', 'Wildlife permits'],
    itinerary: [
      { day: 'D1–D3', desc: 'Arrive Leh; acclimatize; medical clearance; permits' },
      { day: 'D4', desc: 'Drive to Chilling; trek to Gyalpo campsite (1.5 hrs on ice)' },
      { day: 'D5', desc: 'Gyalpo → Tibb Cave (6–7 hrs, 11,800 ft); frozen waterfalls' },
      { day: 'D6', desc: 'Tibb Cave → Nerak (7 hrs); 56-ft frozen waterfall; −30°C overnight' },
      { day: 'D7', desc: 'Nerak → Tibb Cave return (6–7 hrs)' },
      { day: 'D8', desc: 'Final trek → Shingra Koma; drive back to Leh; celebratory dinner' },
      { day: 'D9', desc: 'Departure from Leh' },
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
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    highlights: ['Pangong Tso Lake (14,270 ft) — 3 Idiots filming location', 'Nubra Valley & Hunder sand dunes — double-humped camels', 'Khardung La Pass (17,582 ft) — world\'s highest motorable road', 'Shanti Stupa, Leh Palace & Magnetic Hill'],
    includes: ['Hotel accommodation (3-star)', 'All meals (breakfast & dinner)', 'Private SUV/Innova with driver', 'Airport/station transfers', 'Inner Line Permits & Environmental fees'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive Leh (3,500 m) → Rest for acclimatization; Shanti Stupa & Leh Market walk' },
      { day: 'Day 2', desc: 'Local sightseeing: Leh Palace, Namgyal Tsemo Monastery, Hemis Gompa, Thiksey Monastery' },
      { day: 'Day 3', desc: 'Nubra Valley via Khardung La Pass → Hunder sand dunes; double-humped camel safari; night stay Nubra' },
      { day: 'Day 4', desc: 'Nubra → Pangong Tso Lake (5 hrs drive) → sunset at lake; overnight Pangong camps' },
      { day: 'Day 5', desc: 'Pangong → Leh via Chang La Pass (17,585 ft) → Rancho School (3 Idiots) → Magnetic Hill' },
      { day: 'Day 6', desc: 'Morning departure from Leh airport' },
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
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    highlights: ['Ride Rohtang Pass (13,054 ft) to Khardung La (17,582 ft)', 'Camp at Sarchu (14,070 ft) under the stars', 'Pangong Tso Lake at sunrise on Royal Enfield', 'Nubra Valley double-hump camel safari'],
    includes: ['Royal Enfield 350/500cc (sharing or solo option)', 'Helmet, riding gear & tool kit', 'Hotel + camping accommodation', 'Breakfast & dinner daily', 'Expert mechanic & support vehicle throughout'],
    itinerary: [
      { day: 'Day 1', desc: 'Assemble Manali → bike briefing & gear check; Manali sightseeing' },
      { day: 'Day 2', desc: 'Manali → Rohtang Pass → Keylong (3,094 m)' },
      { day: 'Day 3', desc: 'Keylong → Jispa → Bharatpur → Sarchu (4,290 m); high-altitude camping' },
      { day: 'Day 4', desc: 'Sarchu → Pang → Tso Kar → Leh via More Plains' },
      { day: 'Day 5', desc: 'Leh rest day; acclimatization; Leh Palace & bazaar' },
      { day: 'Day 6', desc: 'Leh → Khardung La → Nubra Valley → Hunder (camel safari)' },
      { day: 'Day 7', desc: 'Nubra → Pangong Tso Lake; sunset at 4,350 m' },
      { day: 'Day 8', desc: 'Pangong → Leh via Chang La; farewell dinner' },
      { day: 'Day 9', desc: 'Departure from Leh' },
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
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    highlights: ['Kheerganga hot springs at 9,711 ft after 12 km trek', 'Parvati Valley — riverside camping under the stars', 'Chalal Village & Kasol Israeli Café culture', 'Manikaran Sahib Gurudwara — holy hot spring'],
    includes: ['Volvo AC bus Delhi–Kasol–Delhi', 'Hotel + camping accommodation', 'Daily breakfast & dinner', 'Trek guide for Kheerganga', 'Bonfire nights'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi by Volvo bus (6–8 PM)' },
      { day: 'Day 2', desc: 'Arrive Kasol → Chalal Village walk → riverside bonfire & camp' },
      { day: 'Day 3', desc: 'Trek Barshaini → Kheerganga (12 km, 6 hrs) → hot spring soak; overnight camp at Kheerganga' },
      { day: 'Day 4', desc: 'Descend → Kasol → Manikaran Sahib Gurudwara → departure bus' },
      { day: 'Day 5', desc: 'Delhi arrival (6–7 AM)' },
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
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    highlights: ['Trek through dense Parvati Valley forest & waterfalls', 'Camp by Parvati River at 7,500 ft', 'Rasul snow bridge & alpine meadows', 'Visit Tosh village (Himalayan hippie trail)'],
    includes: ['Volvo AC bus Delhi–Kasol–Delhi', '3 nights camping', 'All meals (breakfast, lunch, dinner)', 'Experienced trek guide', 'Camping equipment'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi → overnight journey' },
      { day: 'Day 2', desc: 'Arrive Kasol → short acclimatization walk → Chalal village; riverside camp' },
      { day: 'Day 3', desc: 'Full day Parvati Valley trek → Tosh village → waterfall stops; camp at Rasul' },
      { day: 'Day 4', desc: 'Morning in valley → return Kasol → depart Delhi; arrival next morning' },
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
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=800&q=80',
    highlights: ['Shangarh meadow — flat green plateau at 7,800 ft', 'Serolsar Lake trek with 360° Himalayan views', 'Jalori Pass (10,800 ft) — apple orchid valleys', 'Pristine forests, no crowds — the road less travelled'],
    includes: ['Tempo traveller from Delhi & back', 'Guesthouse + homestay accommodation', 'All meals (breakfast & dinner)', 'Local guide for treks', 'Bonfire & village cultural evening'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Delhi (6 PM); overnight drive' },
      { day: 'Day 2', desc: 'Arrive Jibhi → Jibhi Waterfall → Thailand Pool; bonfire' },
      { day: 'Day 3', desc: 'Drive to Shangarh → meadow walk → village exploration; sunset at plateau' },
      { day: 'Day 4', desc: 'Jalori Pass → Serolsar Lake trek (7 km) → Raghupur Fort ruins; depart evening' },
      { day: 'Day 5', desc: 'Delhi arrival (7–8 AM)' },
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
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    badge: 'Weekend Escape',
    highlights: ['Mullayanagiri Peak (6,330 ft) — highest peak in Karnataka', 'Coffee estate walk & plantation tour', 'Baba Budangiri dargah & Manikyadhara Waterfalls', 'Hebbe Falls — twin waterfall through coffee estates'],
    includes: ['AC bus or shared cab Bangalore–Chikmagalur–Bangalore', 'Coffee estate/resort accommodation', 'Daily breakfast & dinner', 'Jeep safari to Mullayanagiri', 'Coffee estate tour with tasting'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Bangalore (9 PM); overnight journey (250 km)' },
      { day: 'Day 2', desc: 'Arrive Chikmagalur → Coffee estate walk → Mullayanagiri Peak (jeep + trek); sunset; bonfire' },
      { day: 'Day 3', desc: 'Baba Budangiri → Manikyadhara Falls → Hebbe Falls → depart Bangalore (arrive midnight)' },
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
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
    highlights: ['Kudremukh Peak (6,214 ft) — Western Ghats UNESCO heritage', 'Horse-face shaped mountain; Bhadra river origin', 'Shola forests, grasslands & rare biodiversity', 'Views of Arabian Sea on clear days'],
    includes: ['Transport Chikmagalur–Kudremukh base–return', 'Forest guesthouse/homestay accommodation', 'All meals', 'Certified trek guide (forest permit required)', 'Forest department entry permit'],
    itinerary: [
      { day: 'Day 1', desc: 'Reach Chikmagalur / drive to Kudremukh base village (Mullodi); overnight homestay' },
      { day: 'Day 2', desc: 'Early morning 5 AM trek start → Kudremukh Peak (13 km return, 6–7 hrs); back to homestay' },
      { day: 'Day 3', desc: 'Netravati river origin point → Shola forest walk → departure' },
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
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&q=80',
    highlights: ['Indrahar Pass (14,248 ft) — panoramic views of Dhauladhar range', 'Triund ridge camp (9,350 ft) — Dharamshala valley far below', 'McLeod Ganj — Dalai Lama\'s home, Tibetan culture', 'Moonlit camp at Lahesh Cave (12,000 ft)'],
    includes: ['Hotel in Dharamshala + 2 nights camping', 'All meals from Day 1 dinner to Day 4 breakfast', 'Experienced certified trek guide', 'Camping equipment (tent, sleeping bag, mattress)', 'Transport Dharamshala–McLeod Ganj'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive Dharamshala → McLeod Ganj walk → Tibetan market; briefing' },
      { day: 'Day 2', desc: 'Trek Galu Devi → Triund (9 km, 5–6 hrs); camp at Triund ridge; stunning sunset' },
      { day: 'Day 3', desc: 'Triund → Lahesh Cave (3.5 km, 3 hrs) → Indrahar Pass (4 km, 4 hrs, 14,248 ft); return Lahesh; overnight camp' },
      { day: 'Day 4', desc: 'Lahesh → Triund → Galu Devi → McLeod Ganj descent; departure' },
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
    image: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80',
    highlights: ['Triund sunset trek — most romantic Himalayan ridge in HP', 'Dalhousie\'s colonial-era churches & Khajjiar meadow (Mini Switzerland)', 'Dalai Lama Temple Complex & Tibetan monastery visit', 'Couple spa & candlelight dinner in the mountains'],
    includes: ['Boutique hotel accommodation (3-star)', 'Daily breakfast & candlelight dinner', 'AC private cab throughout', 'Airport/station pickup & drop', 'Triund trek with guide; room decoration on arrival'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive Dharamshala → Hotel check-in → McLeod Ganj stroll → candlelight dinner' },
      { day: 'Day 2', desc: 'Dalai Lama Temple → Tibetan market → Triund sunset trek (optional); mountain views' },
      { day: 'Day 3', desc: 'Drive to Dalhousie (3.5 hrs) → Subhash Baoli → St. Francis Church → evening walk on Mall Road' },
      { day: 'Day 4', desc: 'Khajjiar (Mini Switzerland) → picnic in meadow → Dainkund Peak → couple spa' },
      { day: 'Day 5', desc: 'Depart for home; farewell to the mountains' },
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
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    highlights: ['Triund ridge (9,350 ft) — 360° view of Dhauladhar & Kangra Valley', 'Star-gazing camp at 9,000 ft above McLeod Ganj', 'Short easy trek — perfect for first-timers', 'Sunrise over snow-capped Dhauladhar range'],
    includes: ['Camping accommodation (2-person tent)', 'Dinner at camp + breakfast', 'Local trek guide', 'Sleeping bag & mat'],
    itinerary: [
      { day: 'Day 1', desc: 'Reach McLeod Ganj → trek begins Galu Devi Temple (2 PM) → Triund (5 PM, 9 km); sunset & bonfire' },
      { day: 'Day 2', desc: 'Sunrise at ridge (6 AM) → breakfast → descend to McLeod Ganj (11 AM); explore café culture' },
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
    image: 'https://images.unsplash.com/photo-1609766857851-59cc79c46798?w=800&q=80',
    highlights: ['All 4 Dhams — Yamunotri, Gangotri, Kedarnath & Badrinath', 'Kedarnath temple darshan (3,583 m) — Lord Shiva\'s abode', 'Badrinath — sacred Vishnu temple in the Himalayas', 'Haridwar Ganga Aarti on arrival day'],
    includes: ['Hotel accommodation (3-star) throughout', 'Daily breakfast & dinner', 'Tempo Traveller / AC coach throughout', 'Experienced driver + religious guide', 'All temple entry & forest fees'],
    itinerary: [
      { day: 'Day 1–2', desc: 'Haridwar → Barkot (Yamunotri base); Ganga Aarti evening' },
      { day: 'Day 3', desc: 'Yamunotri Dham darshan → drive to Uttarkashi' },
      { day: 'Day 4', desc: 'Gangotri Dham darshan → Bhojbasa walk; overnight Uttarkashi' },
      { day: 'Day 5–6', desc: 'Drive Guptkashi → Gaurikund → Kedarnath trek (16 km) or pony; darshan' },
      { day: 'Day 7', desc: 'Kedarnath sunrise puja → descend → drive to Badrinath' },
      { day: 'Day 8–9', desc: 'Badrinath Dham darshan → Mana Village (last Indian village) → return to Haridwar' },
      { day: 'Day 10', desc: 'Haridwar local sightseeing → departure' },
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
    image: 'https://images.unsplash.com/photo-1609766857851-59cc79c46798?w=800&q=80',
    highlights: ['Helicopter darshan at all 4 Dhams — skip the long trek queues', 'Land directly at Kedarnath helipad (200 m from temple)', 'Luxury hotel accommodation throughout', 'VIP darshan at all temples — no long waiting'],
    includes: ['Helicopter tickets (all 4 Dhams)', 'Luxury hotel (4-star) accommodation', 'All meals (breakfast + dinner)', 'Airport transfers & ground transport', 'Dedicated religious escort & guide'],
    itinerary: [
      { day: 'Day 1', desc: 'Dehradun → helicopter to Yamunotri → Gangotri darshan → return; overnight Dehradun' },
      { day: 'Day 2', desc: 'Helicopter to Kedarnath → VIP darshan → overnight at Kedarnath guest house' },
      { day: 'Day 3', desc: 'Morning puja → helicopter to Badrinath → darshan → Mana Village' },
      { day: 'Day 4', desc: 'Badrinath Aarti → helicopter return to Dehradun; sightseeing' },
      { day: 'Day 5', desc: 'Rishikesh visit → departure from Dehradun/Haridwar' },
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
    image: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab3?w=800&q=80',
    highlights: ['Kedarnath Temple (3,583 m) — one of 12 Jyotirlingas', 'Gaurikund holy dip before trek', 'Rishikesh Ganga Aarti at Triveni Ghat', 'Haridwar — Har Ki Pauri sacred bathing ghat'],
    includes: ['Hotel accommodation (3-star + guest house at Kedarnath)', 'Daily breakfast & dinner', 'AC vehicle Haridwar to Gaurikund & back', 'Trek guide for Kedarnath (16 km)', 'All permits & forest fees'],
    itinerary: [
      { day: 'Day 1', desc: 'Pickup Haridwar → Rishikesh Ganga Aarti → drive to Guptkashi; overnight' },
      { day: 'Day 2', desc: 'Guptkashi → Gaurikund → start Kedarnath trek (16 km, 6–7 hrs); overnight Kedarnath' },
      { day: 'Day 3', desc: 'Early morning Kedarnath darshan → puja → Rudr Meditation Cave visit; overnight' },
      { day: 'Day 4', desc: 'Descend to Gaurikund → drive to Haridwar via Rishikesh' },
      { day: 'Day 5', desc: 'Haridwar Har Ki Pauri → departure' },
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
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    highlights: ['Kedarnath Jyotirlinga darshan (3,583 m)', 'Tungnath — world\'s highest Shiva temple (3,680 m)', 'Chandrashila Peak (4,000 m) — 360° Himalayan panorama', 'Rishikesh white water rafting & yoga'],
    includes: ['Hotel + camp accommodation', 'Daily meals (breakfast + dinner)', 'AC cab throughout', 'Kedarnath trek guide + Tungnath trek guide', 'Rishikesh rafting session (Grade 3)'],
    itinerary: [
      { day: 'Day 1', desc: 'Rishikesh arrival → rafting & bungee → overnight Rishikesh' },
      { day: 'Day 2', desc: 'Drive to Guptkashi → Gaurikund → Kedarnath trek (16 km); overnight Kedarnath' },
      { day: 'Day 3', desc: 'Kedarnath morning darshan → descend → drive to Chopta' },
      { day: 'Day 4', desc: 'Tungnath trek (3.5 km) → Chandrashila summit (4,000 m); overnight camp at Chopta' },
      { day: 'Day 5', desc: 'Deoriatal Lake sunrise trek → descend to Ukhimath' },
      { day: 'Day 6', desc: 'Drive back to Rishikesh → departure' },
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
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    highlights: ['Kedarkantha summit (12,500 ft) — 360° view of 13 Himalayan peaks', 'Snow-covered meadows in winter (Dec–Apr)', 'Dense oak & pine forest camps at Juda Ka Talab', 'Sankri village — traditional Garhwali culture'],
    includes: ['Camping accommodation (all nights)', 'All meals from Day 1 dinner to Day 6 breakfast', 'Expert trek guide + porter', 'Camping equipment (tent, sleeping bag, mattress)', 'Dehradun pickup & drop (shared)'],
    itinerary: [
      { day: 'Day 1', desc: 'Dehradun → Sankri (200 km, 8 hrs); acclimatisation walk; overnight homestay' },
      { day: 'Day 2', desc: 'Sankri → Juda Ka Talab (9,100 ft, 4 km); pine forest trail; overnight camp' },
      { day: 'Day 3', desc: 'Juda Ka Talab → Kedarkantha Base (11,250 ft, 4 km); snowfields; overnight camp' },
      { day: 'Day 4', desc: 'Summit day — Kedarkantha Peak (12,500 ft, 3.5 km, 3 hrs) → descend to Hargaon; camp' },
      { day: 'Day 5', desc: 'Hargaon → Sankri descent (7 km); overnight Sankri homestay' },
      { day: 'Day 6', desc: 'Drive back to Dehradun; departure' },
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
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    highlights: ['UNESCO World Heritage Site — 500+ species of wildflowers', 'Hemkund Sahib — sacred Sikh shrine at 15,200 ft', 'Bhyundar Valley confluence — stunning glacial meadows', 'Jul–Aug bloom peak — world\'s most colourful alpine valley'],
    includes: ['Accommodation in hotels + camps', 'All meals (Day 1 dinner to Day 6 lunch)', 'Trek guide + support staff', 'Camping equipment', 'Rishikesh/Haridwar pickup (shared)'],
    itinerary: [
      { day: 'Day 1', desc: 'Haridwar → Govindghat (280 km); overnight hotel' },
      { day: 'Day 2', desc: 'Govindghat → Ghangaria (13 km trek or pony, 3,048 m); overnight camp' },
      { day: 'Day 3', desc: 'Valley of Flowers full day exploration (6 km inside valley); wildflower photography' },
      { day: 'Day 4', desc: 'Hemkund Sahib darshan (15,200 ft, 6 km climb); sacred glacial lake; return Ghangaria' },
      { day: 'Day 5', desc: 'Ghangaria → Govindghat descent; drive to Haridwar' },
      { day: 'Day 6', desc: 'Rishikesh Ganga Aarti → departure' },
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
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    highlights: ['Chandrashila Peak (4,000 m) — views of Nanda Devi, Trishul & Kedarnath peaks', 'Tungnath Temple (3,680 m) — world\'s highest Shiva temple', 'Snow-blanketed meadows of Chopta (Feb–Apr)', 'Deoriatal Lake — mirror reflection of Chaukhamba peak'],
    includes: ['Homestay + camp accommodation', 'All meals during trek', 'Trek guide', 'Haridwar/Rishikesh pickup (shared)'],
    itinerary: [
      { day: 'Day 1', desc: 'Haridwar/Rishikesh → Ukhimath → Deoriatal Lake; overnight camp (2,438 m)' },
      { day: 'Day 2', desc: 'Deoriatal → Chopta meadows (4 km); overnight at Chopta (2,680 m)' },
      { day: 'Day 3', desc: 'Trek Chopta → Tungnath (3.5 km) → Chandrashila Summit (4,000 m, 1.5 km further); return Chopta; overnight' },
      { day: 'Day 4', desc: 'Morning meadow walk → drive back to Haridwar; departure' },
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
    image: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80',
    highlights: ['Grade 3–4 white water rafting on the Ganga (16 km)', 'Beach camp on Ganga riverside — bonfire & music', 'Cliff jumping into the Ganga rapids', 'Sunrise yoga session at the campsite'],
    includes: ['Beach tent camping', 'Dinner + breakfast at camp', 'River rafting with certified instructor (16 km)', 'Cliff jumping & kayaking session', 'Life jackets & safety gear'],
    itinerary: [
      { day: 'Day 1', desc: 'Arrive Rishikesh → check in riverside camp → rafting (2 PM, Shivpuri to Rishikesh) → bonfire; dinner under stars' },
      { day: 'Day 2', desc: 'Sunrise yoga → breakfast → cliff jumping at Mohan Chatti → explore Laxman Jhula; depart' },
    ],
  },
  // ── Bangalore ──────────────────────────────────────────────────────────────
  {
    slug: 'gokarna-beach-trek-bangalore',
    title: 'Gokarna Beach Trek & Camping',
    location: 'Gokarna, Karnataka',
    region: 'South India',
    category: 'Beach',
    duration: '3 Days / 2 Nights',
    nights: 2,
    priceINR: 1803,
    originalPriceINR: 1999,
    badge: 'Best Seller',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    highlights: ['Trek across 4 pristine beaches — Om, Kudle, Half Moon & Paradise', 'Overnight beach camping under the stars', 'Arabian Sea sunset from cliff tops', 'Mahabaleshwar Temple visit — ancient Shiva shrine'],
    includes: ['Beach camping (tent + mat)', 'All meals during trek', 'Local trek guide', 'Transport Bangalore → Gokarna (shared)'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Bangalore overnight bus → arrive Gokarna morning → Mahabaleshwar Temple → start beach trek; camp at Paradise Beach' },
      { day: 'Day 2', desc: 'Trek Half Moon → Om Beach → Kudle Beach; swim, sunbathe; bonfire & camp at Om Beach' },
      { day: 'Day 3', desc: 'Morning beach walk → explore Gokarna town → depart for Bangalore; arrive late evening' },
    ],
  },
  {
    slug: 'mullayanagiri-trek-bangalore',
    title: 'Mullayanagiri Trekking & Adventure',
    location: 'Chikmagalur, Karnataka',
    region: 'South India',
    category: 'Trek',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 2639,
    originalPriceINR: 2899,
    badge: 'Best Seller',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    highlights: ['Mullayanagiri Peak (6,330 ft) — highest point in Karnataka', 'Panoramic views of Baba Budangiri & Western Ghats', 'Cloud forests and shola grasslands', 'Sunrise trek to summit — breathtaking golden hour'],
    includes: ['Accommodation in homestay or camp', 'Dinner + breakfast', 'Professional trek guide', 'Transport from Bangalore (shared vehicle)'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Bangalore → arrive Chikmagalur → evening trek to base; overnight at homestay/camp' },
      { day: 'Day 2', desc: 'Early morning summit trek to Mullayanagiri (4 hrs) → sunrise views → descend; return to Bangalore by evening' },
    ],
  },
  {
    slug: 'dudhsagar-trek-bangalore',
    title: 'Dudhsagar Trek from Bangalore',
    location: 'Goa–Karnataka Border',
    region: 'South India',
    category: 'Trek',
    duration: '3 Days / 2 Nights',
    nights: 2,
    priceINR: 1399,
    originalPriceINR: 1549,
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    highlights: ['Dudhsagar Falls (310 m) — one of India\'s tallest waterfalls', 'Trek through dense Bhagwan Mahavir Wildlife Sanctuary', 'Natural pools at base of falls — swim in milky white water', 'Jungle camping deep in the Goa forest'],
    includes: ['Jungle camping (tent + mat)', 'Meals during trek', 'Certified trek guide + forest permit', 'Shared transport from Bangalore'],
    itinerary: [
      { day: 'Day 1', desc: 'Overnight bus from Bangalore → reach Castle Rock by morning → begin jungle trek (14 km)' },
      { day: 'Day 2', desc: 'Reach Dudhsagar Falls → swim in natural pool → explore waterfall base; camp in jungle' },
      { day: 'Day 3', desc: 'Morning trek back → reach Castle Rock station → return train/bus to Bangalore' },
    ],
  },
  {
    slug: 'nandi-hills-camping-bangalore',
    title: 'Nandi Hills Camping & Sunrise',
    location: 'Nandi Hills, Karnataka',
    region: 'South India',
    category: 'Weekend Getaway',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 1863,
    originalPriceINR: 2049,
    badge: 'Best Seller',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1455156218388-5e61b526818b?w=800&q=80',
    highlights: ['Nandi Hills (4,851 ft) — famous sunrise above clouds', 'Tipu Sultan\'s Summer Palace historic visit', 'Campfire evening with valley views', 'Bird watching & nature walk at sunrise'],
    includes: ['Camping accommodation (tent + sleeping bag)', 'Dinner + breakfast', 'Bonfire & activities', 'Transportation from Bangalore (60 km)'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Bangalore afternoon → reach Nandi Hills → Tipu\'s Palace visit → set up camp; bonfire, stargazing' },
      { day: 'Day 2', desc: 'Pre-dawn wake up → sunrise above clouds → nature walk → breakfast → return to Bangalore by noon' },
    ],
  },
  {
    slug: 'ramanagara-camping-adventure',
    title: 'Ramanagara Camping with Adventure',
    location: 'Ramanagara, Karnataka',
    region: 'South India',
    category: 'Adventure',
    duration: '2 Days / 1 Night',
    nights: 1,
    priceINR: 1704,
    originalPriceINR: 1899,
    badge: 'Best Seller',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    highlights: ['Ramanagara granite hills — filming location for Sholay (1975)', 'Rock climbing & rappelling on ancient granite boulders', 'Silk City Ramanagara — silk cocoon market visit', 'Campfire under open skies with valley views'],
    includes: ['Camping accommodation', 'All meals (dinner + breakfast)', 'Rock climbing & rappelling sessions', 'Transport from Bangalore (55 km)'],
    itinerary: [
      { day: 'Day 1', desc: 'Depart Bangalore → arrive Ramanagara → rock climbing & rappelling sessions → camp setup; bonfire & cultural evening' },
      { day: 'Day 2', desc: 'Morning hike on Sholay hills → silk market visit (optional) → return to Bangalore by afternoon' },
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
function TripCard({ trip }: { trip: DomesticTrip }) {
  const [showItinerary, setShowItinerary] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'pay' | 'callback'>('pay');
  const discount = Math.round(((trip.originalPriceINR - trip.priceINR) / trip.originalPriceINR) * 100);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-primary/8 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image src={trip.image} alt={trip.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
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
          <button
            onClick={() => { setDrawerTab('callback'); setShowDrawer(true); }}
            className="flex items-center justify-center gap-1.5 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wide py-2.5 rounded-xl hover:bg-primary hover:text-cream transition-all"
          >
            📋 Enquiry
          </button>
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

export default function DomesticDestinationsPage() {
  return (
    <Suspense fallback={null}>
      <DomesticDestinationsContent />
    </Suspense>
  );
}
