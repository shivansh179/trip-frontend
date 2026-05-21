import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check, Package, ArrowLeft, AlertTriangle, MessageCircle } from 'lucide-react';

interface ChecklistItem { item: string; essential?: boolean; note?: string }
interface ChecklistSection { title: string; emoji: string; items: ChecklistItem[] }

interface DestinationChecklist {
  name: string;
  heroNote: string;
  climate: string;
  bestMonths: string;
  sections: ChecklistSection[];
  doNotBring: string[];
  tips: string[];
  packageHref?: string;
  packageLabel?: string;
}

const CHECKLISTS: Record<string, DestinationChecklist> = {
  manali: {
    name: 'Manali / Himachal Pradesh',
    heroNote: 'Cold mountain destination. Layers are essential. Temperatures can drop to -5°C at night even in summer.',
    climate: '-5°C to 25°C depending on season',
    bestMonths: 'October–June (snow: Dec–Mar, peaks: Apr–Jun)',
    packageHref: '/manali-tour-package',
    packageLabel: 'Manali Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Thermal base layers (top + bottom)', essential: true },
        { item: 'Heavy fleece or down jacket', essential: true },
        { item: 'Waterproof windcheater / rain jacket', essential: true },
        { item: 'Jeans or trekking pants (2–3 pairs)', essential: true },
        { item: 'Warm sweaters / hoodies (2–3)', essential: true },
        { item: 'Gloves (waterproof, warm)', essential: true },
        { item: 'Woollen socks (4–5 pairs)', essential: true },
        { item: 'Balaclava / woollen cap / beanie', essential: true },
        { item: 'Scarf or neck warmer', essential: true },
        { item: 'Snow boots or waterproof ankle boots' },
        { item: 'Light indoor slippers / flip flops for hotel' },
        { item: 'Sunglasses (UV protection)', essential: true },
      ]},
      { title: 'Toiletries & Health', emoji: '🧴', items: [
        { item: 'Sunscreen SPF 50+ (mountain sun is intense)', essential: true },
        { item: 'Lip balm with SPF', essential: true },
        { item: 'Moisturiser (air is very dry)', essential: true },
        { item: 'Altitude sickness tablets (Diamox — consult doctor)', essential: true, note: 'For Rohtang/Spiti passes above 3,500m' },
        { item: 'Basic first aid kit (bandage, antiseptic, paracetamol)', essential: true },
        { item: 'ORS sachets (stay hydrated at altitude)' },
        { item: 'Hand sanitiser' },
        { item: 'Toothbrush & toothpaste' },
        { item: 'Personal medications (carry extra)' },
      ]},
      { title: 'Documents & Money', emoji: '📄', items: [
        { item: 'Government photo ID (Aadhaar / passport)', essential: true },
        { item: 'Hotel booking printouts', essential: true },
        { item: 'Cash (many places are cash-only)', essential: true, note: 'ATMs available in Manali town but unreliable at higher altitudes' },
        { item: 'UPI apps as backup' },
        { item: 'Emergency contacts saved offline' },
      ]},
      { title: 'Gear & Tech', emoji: '🎒', items: [
        { item: 'Day backpack (20–30L)', essential: true },
        { item: 'Trekking poles (for snow/Rohtang)' },
        { item: 'Headlamp / torch with extra batteries' },
        { item: 'Power bank (10,000+ mAh)', essential: true },
        { item: 'Universal travel adaptor' },
        { item: 'Camera or phone with extra SD card' },
        { item: 'Ziplock bags (keeps things dry)' },
        { item: 'Thermos / insulated water bottle' },
      ]},
      { title: 'Snacks & Food', emoji: '🍫', items: [
        { item: 'Energy bars / chocolate / dry fruits', essential: true, note: 'Higher altitude = less appetite' },
        { item: 'Instant noodles / ready-to-eat meals' },
        { item: 'Water purification tablets' },
      ]},
    ],
    doNotBring: [
      'Too many shoes — 2 pairs max (boots + hotel slippers)',
      'Formal/office clothes — not needed',
      'Lots of cotton clothes (takes ages to dry in cold/damp)',
      'Fragile electronics without cushioned cases',
    ],
    tips: [
      'Layer up — you can always remove layers, but can\'t add what you don\'t have',
      'Rohtang Pass requires a permit (book online at rohtangpermits.nic.in)',
      'Don\'t rush uphill — acclimatise for 1 day before high-altitude activities',
      'Pack light — you can rent winter gear in Manali at low cost',
    ],
  },
  goa: {
    name: 'Goa',
    heroNote: 'Hot beach destination year-round. Pack light, breathable clothing. Beach and casual wear dominates.',
    climate: '25–35°C, humid, tropical',
    bestMonths: 'November–February (peak), October & March (shoulder)',
    packageHref: '/goa-tour-package',
    packageLabel: 'Goa Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Swimwear / swimsuits (2–3 pieces)', essential: true },
        { item: 'Shorts (4–5 pairs)', essential: true },
        { item: 'Lightweight cotton t-shirts (5–6)', essential: true },
        { item: 'Sundress / summer dress (for women)', essential: true },
        { item: 'Cover-up / kaftan for beach walks' },
        { item: 'One smart-casual outfit for restaurant/bar' },
        { item: 'Flip flops / sandals', essential: true },
        { item: 'Comfortable walking shoes (for Old Goa churches)' },
        { item: 'Sunhat / wide-brim hat', essential: true },
        { item: 'Sunglasses (good UV protection)', essential: true },
        { item: 'Scarf/dupatta (required for church entry — women)' },
      ]},
      { title: 'Toiletries & Health', emoji: '🧴', items: [
        { item: 'Sunscreen SPF 50+ (lots of it)', essential: true },
        { item: 'After-sun lotion / aloe vera gel' },
        { item: 'Insect repellent (especially evenings)', essential: true },
        { item: 'Lip balm with SPF' },
        { item: 'Antidiarrhoeal tablets (seafood precaution)' },
        { item: 'Basic first aid (plasters, antiseptic)' },
        { item: 'Hand sanitiser' },
        { item: 'Personal medications' },
      ]},
      { title: 'Documents & Money', emoji: '📄', items: [
        { item: 'Government photo ID', essential: true },
        { item: 'Hotel confirmation', essential: true },
        { item: 'Cash (beach shacks prefer cash)', essential: true },
        { item: 'UPI/card as backup' },
        { item: 'Waterproof phone pouch (for water sports)', essential: true },
      ]},
      { title: 'Gear & Tech', emoji: '🎒', items: [
        { item: 'Small daypack / tote bag for beach' },
        { item: 'Waterproof phone case', essential: true },
        { item: 'Power bank' },
        { item: 'Action camera (GoPro) if water sports planned' },
        { item: 'Reusable water bottle' },
        { item: 'Beach towel (most hotels provide, but handy to have)' },
      ]},
    ],
    doNotBring: [
      'Heavy clothes or jackets — completely unnecessary',
      'Too many shoes — 2 pairs max (flip flops + one pair for walking)',
      'Valuables to the beach — leave in hotel safe',
    ],
    tips: [
      'North Goa is livelier; South Goa is quieter — pick based on your vibe',
      'Dudhsagar waterfall is a full day — wear clothes you don\'t mind getting wet',
      'Carry cash for beach shacks — many don\'t accept cards',
      'Rent a scooter for freedom — keep driving license and helmet',
    ],
  },
  ladakh: {
    name: 'Ladakh',
    heroNote: 'Extreme high-altitude desert (3,500–5,600m). Severe altitude sickness risk. The most demanding packing of any Indian destination.',
    climate: '-20°C to 25°C (Leh town: 15–25°C in summer)',
    bestMonths: 'June–September (road open), July–August (safest)',
    packageHref: '/ladakh-tour-package',
    packageLabel: 'Ladakh Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Heavy down jacket (-20°C rated)', essential: true },
        { item: 'Thermal base layers (thick, wool-blend)', essential: true },
        { item: 'Waterproof shell jacket (windproof)', essential: true },
        { item: 'Trekking pants (2–3 pairs)', essential: true },
        { item: 'Fleece mid-layer (2)', essential: true },
        { item: 'Heavyweight gloves', essential: true },
        { item: 'Balaclava / woollen face mask', essential: true },
        { item: 'Woollen socks (6–8 pairs)', essential: true },
        { item: 'Insulated trekking boots', essential: true },
        { item: 'Gaiters (for snow crossings)' },
        { item: 'UV-blocking glacier glasses (not just sunglasses)', essential: true, note: 'High altitude UV is extremely intense — eye damage risk' },
      ]},
      { title: 'Health & Altitude', emoji: '💊', items: [
        { item: 'Diamox (acetazolamide) — consult doctor', essential: true, note: 'Start 24h before arrival, taper off after 48h in Leh' },
        { item: 'Pulse oximeter (monitor blood oxygen)', essential: true },
        { item: 'Paracetamol & ibuprofen', essential: true },
        { item: 'ORS packets (minimum 20)', essential: true },
        { item: 'Dexamethasone (emergency AMS — carry but only with guidance)' },
        { item: 'Antidiarrhoeal & antacid tablets' },
        { item: 'Full first aid kit' },
        { item: 'Sunscreen SPF 60+', essential: true },
        { item: 'Lip balm SPF 30+', essential: true },
        { item: 'Moisturiser (extreme dryness)' },
      ]},
      { title: 'Documents & Money', emoji: '📄', items: [
        { item: 'Original government ID (Aadhaar / passport)', essential: true },
        { item: 'Inner Line Permit (ILP) for Nubra, Pangong, etc.', essential: true, note: 'Obtained in Leh on arrival — carry passport/Aadhaar' },
        { item: 'Hotel confirmations (offline copy)', essential: true },
        { item: 'Cash (Leh has ATMs but no ATMs beyond)', essential: true },
        { item: 'Emergency contacts + travel insurance docs' },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Sturdy 50L backpack or duffel', essential: true },
        { item: 'Trekking poles', essential: true },
        { item: 'Headlamp + spare batteries', essential: true },
        { item: 'Power bank (20,000 mAh)', essential: true },
        { item: 'Portable charger with solar panel (useful for camping)' },
        { item: 'Sleeping bag rated -10°C (if camping/homestay)' },
        { item: 'Waterproof duffel bag liner' },
        { item: 'Thermos (1L)', essential: true },
      ]},
    ],
    doNotBring: [
      'Alcohol (worsens altitude sickness — avoid for first 48h)',
      'Heavy non-essential items (weight matters on treks)',
      'Perfumes / strong scents (attracts insects)',
    ],
    tips: [
      'Acclimatise in Leh for 2 full days before going to higher altitudes',
      'Never go from Delhi to Pangong in one day — altitude sickness is dangerous',
      'Drink 3–4 litres of water daily — dehydration accelerates AMS',
      'Leh has everything — buy/rent gear there rather than carrying from home',
      'Download offline maps (Google Maps, OsmAnd) — internet is unreliable',
    ],
  },
  kashmir: {
    name: 'Kashmir',
    heroNote: 'Beautiful mountain valley. Summers are mild; winters are harsh. Pack for both sun and snow.',
    climate: '-8°C (winter) to 28°C (summer)',
    bestMonths: 'April–October (summer), Dec–Feb (snow)',
    packageHref: '/kashmir-tour-package',
    packageLabel: 'Kashmir Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Warm jacket (medium-heavy)', essential: true },
        { item: 'Fleece or sweaters (3–4)', essential: true },
        { item: 'Thermal inner wear', essential: true },
        { item: 'Full-length trousers / jeans (3–4)', essential: true },
        { item: 'Light cotton tops (summer visits)' },
        { item: 'Waterproof windcheater', essential: true },
        { item: 'Woollen cap and gloves (even summer nights)' },
        { item: 'Comfortable walking shoes', essential: true },
        { item: 'Warm socks (4–5 pairs)', essential: true },
        { item: 'Modest clothing (conservative area — shoulders and knees covered)', essential: true },
        { item: 'Scarf/dupatta for women', essential: true },
        { item: 'Sunglasses' },
      ]},
      { title: 'Health & Toiletries', emoji: '🧴', items: [
        { item: 'Sunscreen (mountain UV)', essential: true },
        { item: 'Lip balm', essential: true },
        { item: 'Moisturiser', essential: true },
        { item: 'Warm gloves (winter)', essential: true },
        { item: 'Basic first aid kit' },
        { item: 'Personal medications (pharmacies limited in villages)' },
      ]},
      { title: 'Documents', emoji: '📄', items: [
        { item: 'Government photo ID', essential: true },
        { item: 'Hotel/houseboat booking confirmation', essential: true },
        { item: 'Cash (preferred in many places)', essential: true },
        { item: 'Emergency contact list' },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Day backpack', essential: true },
        { item: 'Power bank', essential: true },
        { item: 'Camera (landscapes are incredible)' },
        { item: 'Thermos/water bottle' },
      ]},
    ],
    doNotBring: [
      'Revealing or sleeveless clothing (respectful dress is important)',
      'Too many heavy items — Kashmir is a relaxed destination',
    ],
    tips: [
      'Dal Lake houseboats are magical — book well in advance for peak season',
      'Gulmarg Gondola (world\'s 2nd highest gondola) — go early morning to avoid crowds',
      'Pahalgam and Sonamarg require a full day each — plan accordingly',
      'Internet connectivity can be limited — download offline maps',
    ],
  },
  kerala: {
    name: 'Kerala',
    heroNote: 'Tropical backwaters, beaches, and rainforests. Hot and humid year-round with a monsoon season.',
    climate: '22–32°C, humid; heavy rain June–September',
    bestMonths: 'October–February (best), March–May (hot)',
    packageHref: '/kerala-tour-package',
    packageLabel: 'Kerala Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Lightweight cotton clothes (6–7 tops)', essential: true },
        { item: 'Comfortable pants / salwar / kurta', essential: true },
        { item: 'Modest clothes for temple visits', essential: true },
        { item: 'Swimwear (beaches + houseboat)', essential: true },
        { item: 'Light rain jacket / poncho (monsoon)', essential: true },
        { item: 'Sandals / flip flops', essential: true },
        { item: 'Walking shoes for hilly areas (Munnar)' },
        { item: 'Sunhat' },
        { item: 'Scarf (for temples and AC boats)' },
      ]},
      { title: 'Health', emoji: '🧴', items: [
        { item: 'Insect repellent (mosquitoes, especially in backwaters)', essential: true },
        { item: 'Sunscreen SPF 50+', essential: true },
        { item: 'Antidiarrhoeal tablets' },
        { item: 'Motion sickness pills (for boat rides)' },
        { item: 'Personal medications' },
      ]},
      { title: 'Documents', emoji: '📄', items: [
        { item: 'Government ID', essential: true },
        { item: 'Houseboat / hotel confirmation', essential: true },
        { item: 'Cash + cards', essential: true },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Small waterproof backpack', essential: true },
        { item: 'Power bank' },
        { item: 'Waterproof phone bag' },
        { item: 'Camera for backwaters and wildlife' },
        { item: 'Reusable water bottle' },
      ]},
    ],
    doNotBring: [
      'Heavy winter clothes — completely unnecessary',
      'Too many shoes — 2 pairs (sandals + walking shoes)',
    ],
    tips: [
      'Remove shoes before entering temples — carry a small bag for them',
      'Alappuzha (Alleppey) houseboat cruise is best overnight — book in advance',
      'Munnar tea estates are stunning in morning mist — stay overnight',
      'Try a traditional Kerala Ayurvedic massage — authentically therapeutic',
    ],
  },
  rajasthan: {
    name: 'Rajasthan',
    heroNote: 'Desert state with extreme temperature range. Scorching in summer, cool in winter. Cultural dress norms apply.',
    climate: '10–48°C (winter: 10–25°C, summer: 35–48°C)',
    bestMonths: 'October–March (ideal), April–June (very hot)',
    packageHref: '/rajasthan-tour-package',
    packageLabel: 'Rajasthan Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Cotton kurtas / shirts (breathable)', essential: true },
        { item: 'Loose cotton pants', essential: true },
        { item: 'Light jacket / cardigan (winter nights)', essential: true },
        { item: 'Comfortable walking shoes', essential: true },
        { item: 'Sandals/footwear easy to remove (temples)', essential: true },
        { item: 'Sunhat / pagri (local turban for photos)', essential: true },
        { item: 'Scarf / dupatta (temple etiquette, dust)', essential: true },
        { item: 'Modest clothing (conservative region)', essential: true },
        { item: 'Sunglasses', essential: true },
      ]},
      { title: 'Health', emoji: '🧴', items: [
        { item: 'Sunscreen SPF 50+ (desert sun is brutal)', essential: true },
        { item: 'Lip balm', essential: true },
        { item: 'ORS sachets (prevent dehydration)', essential: true },
        { item: 'Antidiarrhoeal tablets (street food risk)' },
        { item: 'Insect repellent (evenings)' },
        { item: 'Moisturiser (very dry air)' },
      ]},
      { title: 'Documents', emoji: '📄', items: [
        { item: 'Government ID', essential: true },
        { item: 'Hotel/haveli bookings', essential: true },
        { item: 'Cash (markets, camel rides)', essential: true },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Day backpack' },
        { item: 'Power bank', essential: true },
        { item: 'Camera (forts, palaces, sunsets)' },
        { item: 'Reusable insulated water bottle', essential: true },
      ]},
    ],
    doNotBring: [
      'Revealing clothing (skimpy dresses, sleeveless tops) — culturally inappropriate in most areas',
      'Expensive jewellery — not needed',
    ],
    tips: [
      'Book fort entry tickets online to skip queues (especially Amber Fort, Mehrangarh)',
      'Sunrise/sunset at Thar Desert is unmissable — book a desert camp',
      'Negotiate in bazaars — it\'s expected and part of the culture',
      'Jodhpur, Jaipur, and Udaipur each deserve a full day minimum',
    ],
  },
  bali: {
    name: 'Bali, Indonesia',
    heroNote: 'Tropical beach and culture destination. Hot and humid. Conservative dress required at temples.',
    climate: '26–32°C year-round, wet season Nov–March',
    bestMonths: 'April–October (dry season)',
    packageHref: '/bali-honeymoon-package',
    packageLabel: 'Bali Honeymoon Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Swimwear (2–3 pieces)', essential: true },
        { item: 'Lightweight clothes (5–6 outfits)', essential: true },
        { item: 'Sarong / scarf (MANDATORY for temple entry)', essential: true, note: 'Many temples provide these, but better to bring one' },
        { item: 'Sandals / flip flops', essential: true },
        { item: 'Comfortable walking shoes' },
        { item: 'Light rain jacket (wet season)' },
        { item: 'Modest shoulder-covering top (temples)' },
        { item: 'Sunhat', essential: true },
      ]},
      { title: 'Health', emoji: '🧴', items: [
        { item: 'Sunscreen SPF 50+', essential: true },
        { item: 'Insect repellent (dengue mosquitoes)', essential: true },
        { item: 'Antidiarrhoeal tablets (Bali belly is real)', essential: true },
        { item: 'Probiotic supplements (helpful for digestion)' },
        { item: 'Basic first aid kit' },
      ]},
      { title: 'Documents & Money', emoji: '📄', items: [
        { item: 'Indian passport (6+ months validity)', essential: true },
        { item: 'Return flight ticket (shown at immigration)', essential: true },
        { item: 'Hotel booking confirmation' },
        { item: 'Indonesian Rupiah (IDR) cash', essential: true, note: 'Exchange at airport or use ATM in Kuta/Seminyak' },
        { item: 'Credit/debit card (Visa/Mastercard)' },
        { item: 'Travel insurance documents' },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Waterproof daypack' },
        { item: 'Power bank' },
        { item: 'Universal travel adaptor (Type C/G)', essential: true },
        { item: 'GoPro / waterproof camera' },
        { item: 'Dry bag (for boat/snorkelling)' },
      ]},
    ],
    doNotBring: [
      'Drug of any kind — Indonesia has the death penalty for drug trafficking',
      'Drone without permit (restricted near temples and airports)',
    ],
    tips: [
      'Get vaccinated for Hepatitis A and Typhoid before travelling',
      'Only drink bottled water — never tap water in Bali',
      'Respect temple dress code — cover shoulders and wear a sarong',
      'Kuta = party; Seminyak = upscale; Ubud = culture; Uluwatu = surf',
    ],
  },
  dubai: {
    name: 'Dubai, UAE',
    heroNote: 'Modern desert city. Strict dress code in public and traditional areas. Indoor malls are air-conditioned and cold.',
    climate: '20–45°C (summer: 40–45°C; winter: 18–25°C)',
    bestMonths: 'November–March (winter)',
    packageHref: '/dubai-tour-package-from-delhi',
    packageLabel: 'Dubai Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Modest clothing (shoulders + knees covered in malls/old city)', essential: true },
        { item: 'Swimwear (for pools/beach, not public areas)', essential: true },
        { item: 'Smart-casual outfits (restaurants, malls)' },
        { item: 'Light jacket / cardigan (malls + restaurants are very cold AC)' },
        { item: 'Comfortable walking shoes', essential: true },
        { item: 'Formal outfit (if dining at Burj Al Arab level restaurants)' },
        { item: 'Abaya / scarf (women, for mosque visits)', essential: true, note: 'Provided at Dubai Frame and mosques but better to bring' },
        { item: 'Sandals / comfortable flats' },
        { item: 'Sunglasses', essential: true },
      ]},
      { title: 'Health', emoji: '🧴', items: [
        { item: 'Sunscreen SPF 50+ (intense desert sun)', essential: true },
        { item: 'Lip balm', essential: true },
        { item: 'Moisturiser (very dry air in AC)' },
        { item: 'ORS sachets (summer heat dehydration)' },
        { item: 'Personal medications (declare at customs if controlled)' },
      ]},
      { title: 'Documents & Money', emoji: '📄', items: [
        { item: 'Indian passport + printed Dubai e-visa', essential: true },
        { item: 'Return flight tickets' },
        { item: 'Hotel booking confirmation' },
        { item: 'AED cash (for markets, tips)', essential: true },
        { item: 'Credit/debit card (accepted almost everywhere)' },
        { item: 'Travel insurance' },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Power bank', essential: true },
        { item: 'Universal adaptor (Type G)', essential: true },
        { item: 'Camera' },
        { item: 'Comfortable bag (not too flashy for Deira/souks)' },
      ]},
    ],
    doNotBring: [
      'Pork products (technically illegal to import)',
      'Medications containing codeine without prescription documentation',
      'Revealing beachwear outside beach areas',
    ],
    tips: [
      'Dubai Metro is cheap, fast, and air-conditioned — use it',
      'Friday is the weekend — malls open late, Friday prayers midday',
      'Ramadan: eating/drinking in public during daylight is prohibited',
      'Tipping is appreciated but not mandatory (10–15% at restaurants)',
    ],
  },
  thailand: {
    name: 'Thailand',
    heroNote: 'Hot tropical country — beaches, cities, temples. Dress modestly for temple visits.',
    climate: '25–38°C, humid; monsoon May–October in south',
    bestMonths: 'November–April (dry season)',
    packageHref: '/thailand-budget-trip',
    packageLabel: 'Thailand Budget Trip',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Lightweight clothes (6–7 outfits)', essential: true },
        { item: 'Swimwear (2–3 pieces)', essential: true },
        { item: 'Cover-up for temples (shoulder/knee)', essential: true },
        { item: 'Comfortable walking shoes', essential: true },
        { item: 'Flip flops / sandals', essential: true },
        { item: 'Light rain jacket (monsoon)', essential: true },
        { item: 'Sunhat', essential: true },
        { item: 'Scarf (temples, cold AC buses)' },
        { item: 'Sunglasses', essential: true },
      ]},
      { title: 'Health', emoji: '🧴', items: [
        { item: 'Sunscreen SPF 50+', essential: true },
        { item: 'Insect repellent (dengue)', essential: true },
        { item: 'Antidiarrhoeal tablets', essential: true },
        { item: 'Probiotic or digestive pills' },
        { item: 'Basic first aid' },
      ]},
      { title: 'Documents & Money', emoji: '📄', items: [
        { item: 'Indian passport (6+ months validity)', essential: true },
        { item: 'Return flight / onward ticket', essential: true },
        { item: 'Thai Baht cash (THB)', essential: true },
        { item: 'Hotel confirmation' },
        { item: 'VoA fee cash: THB 2,000' },
        { item: 'Travel insurance' },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Power bank', essential: true },
        { item: 'Universal adaptor (Type A/B/C)', essential: true },
        { item: 'Waterproof dry bag' },
        { item: 'GoPro / waterproof camera' },
      ]},
    ],
    doNotBring: [
      'Drugs of any kind — extremely severe penalties',
      'Vaping devices (illegal in Thailand, heavy fines)',
    ],
    tips: [
      'Never disrespect the King or royal family — it\'s a criminal offence',
      'Remove shoes before entering temples',
      'Night markets are the best street food — Thai food is generally safe',
      'Tuk-tuks are fun but negotiate the price before getting in',
    ],
  },
  europe: {
    name: 'Europe',
    heroNote: 'Varied climates across 27 countries. Walking-intensive. Security checks at airports.',
    climate: '0–28°C depending on country and season',
    bestMonths: 'April–June (spring), September–October (autumn)',
    packageHref: '/europe-tour-package-from-india',
    packageLabel: 'Europe Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Layerable clothing (avoid single heavy items)', essential: true },
        { item: 'Good walking shoes (you\'ll walk 15,000+ steps/day)', essential: true },
        { item: 'Comfortable jeans / trousers (3)', essential: true },
        { item: 'T-shirts / shirts (4–5)', essential: true },
        { item: 'Light-medium jacket', essential: true },
        { item: 'Sweater / cardigan (2)', essential: true },
        { item: 'Compact rain jacket / umbrella', essential: true },
        { item: 'Smart outfit for nice restaurants' },
        { item: 'Comfortable flat shoes for cobblestones' },
        { item: 'Sunglasses', essential: true },
        { item: 'Scarf (churches require covered shoulders)' },
      ]},
      { title: 'Health', emoji: '🧴', items: [
        { item: 'Travel insurance with health cover (Schengen requirement)', essential: true },
        { item: 'Sunscreen SPF 30+' },
        { item: 'Personal medications (carry original prescription)' },
        { item: 'Basic OTC medicines (paracetamol, antacid)' },
        { item: 'Blister plasters (for walking)', essential: true },
      ]},
      { title: 'Documents', emoji: '📄', items: [
        { item: 'Indian passport + Schengen visa sticker', essential: true },
        { item: 'Printed travel insurance policy', essential: true, note: 'Required for Schengen visa' },
        { item: 'Hotel and flight confirmations (printed or offline)' },
        { item: 'Euro (EUR) cash — some places don\'t accept cards', essential: true },
        { item: 'International credit/debit card (Visa/Mastercard)' },
        { item: 'Emergency contact list' },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Carry-on bag (45×36×20 cm for budget airlines)', essential: true, note: 'Ryanair/easyJet are strict on sizes' },
        { item: 'Small daypack for city exploring', essential: true },
        { item: 'Power bank (must be in hand luggage, not checked)', essential: true },
        { item: 'Universal adaptor (Type C for most of Europe)', essential: true },
        { item: 'Padlock for hostel lockers' },
        { item: 'Camera + extra battery' },
        { item: 'Google Maps downloaded offline', essential: true },
      ]},
    ],
    doNotBring: [
      'Too many clothes — Europe has excellent laundries and dry cleaners',
      'Full-size toiletries in carry-on (100ml liquids rule)',
      'Passport wallet that looks expensive — pickpocket risk in tourist areas',
    ],
    tips: [
      'Buy a European SIM (Vodafone/Orange) at the airport for data',
      'Book museum tickets online — skip the queues (Louvre, Uffizi, etc.)',
      'Budget airlines (Ryanair, easyJet) are cheap but strict on bag sizes',
      'Get a multi-city rail pass (Eurail) if visiting 4+ countries',
    ],
  },
  andaman: {
    name: 'Andaman Islands',
    heroNote: 'Remote island destination with pristine beaches and world-class scuba diving. Minimal ATM access.',
    climate: '23–32°C, high humidity; monsoon May–October',
    bestMonths: 'November–May (peak: Dec–Feb)',
    packageHref: '/andaman-tour-package',
    packageLabel: 'Andaman Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Swimwear (3–4 pieces)', essential: true },
        { item: 'Light cotton clothes (6–7 outfits)', essential: true },
        { item: 'Water shoes (coral and rocky beaches)', essential: true },
        { item: 'Flip flops + one pair walking shoes', essential: true },
        { item: 'Sunhat / cap', essential: true },
        { item: 'Light rain jacket (unpredictable showers)' },
        { item: 'Modest clothes for Cellular Jail visit' },
      ]},
      { title: 'Health', emoji: '🧴', items: [
        { item: 'Sunscreen SPF 50+ (reef-safe if possible)', essential: true },
        { item: 'Insect repellent (malaria risk in some areas)', essential: true },
        { item: 'Seasickness tablets (ferry rides)', essential: true },
        { item: 'Antidiarrhoeal tablets' },
        { item: 'Basic first aid kit' },
        { item: 'Antihistamine (jellyfish stings)' },
      ]},
      { title: 'Documents & Money', emoji: '📄', items: [
        { item: 'Government ID / passport (mandatory)', essential: true },
        { item: 'Plenty of CASH — ATMs unreliable outside Port Blair', essential: true },
        { item: 'Hotel/guesthouse confirmation' },
        { item: 'Permit for tribal areas (Jarawa Reserve — do NOT photograph)' },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Waterproof drybag / backpack', essential: true },
        { item: 'Power bank (electricity cuts frequent)', essential: true },
        { item: 'Underwater camera / GoPro', essential: true, note: 'Scuba and snorkelling photography is incredible' },
        { item: 'Snorkelling mask and fins (better to bring your own)' },
        { item: 'Reusable water bottle' },
      ]},
    ],
    doNotBring: [
      'Single-use plastics (plastic bags banned in Andaman)',
      'Chemical sunscreen (damages coral reefs — use reef-safe)',
      'Drone without permit (special permission needed)',
    ],
    tips: [
      'Book ferry tickets between islands in advance — they fill up fast',
      'Havelock (Swaraj Dweep) and Neil Island (Shaheed Dweep) are the most beautiful',
      'Carry plenty of cash — ATMs on smaller islands are unreliable',
      'Scuba diving at Havelock is world-class — book in advance',
    ],
  },
  uttarakhand: {
    name: 'Uttarakhand / Rishikesh',
    heroNote: 'Mountains, rivers, temples, and adventure sports. Packing depends on whether you\'re doing trekking, rafting, or temple circuits.',
    climate: '0–35°C (highly variable by altitude)',
    bestMonths: 'March–June, September–November',
    packageHref: '/uttarakhand-tour-package',
    packageLabel: 'Uttarakhand Tour Package',
    sections: [
      { title: 'Clothing', emoji: '👕', items: [
        { item: 'Layered clothing (temperature swings significantly)', essential: true },
        { item: 'Light to medium jacket', essential: true },
        { item: 'Comfortable trekking pants (2–3)', essential: true },
        { item: 'T-shirts / quick-dry tops', essential: true },
        { item: 'Quick-dry clothes for rafting and water activities', essential: true },
        { item: 'Trekking shoes / hiking boots', essential: true },
        { item: 'Sandals (for Rishikesh ashrams and ghats)', essential: true },
        { item: 'Modest clothing (temples / ashrams)', essential: true },
        { item: 'Woollen cap + gloves (Kedarnath/higher altitude)' },
        { item: 'Raincoat / poncho (Kedarnath gets rain)' },
      ]},
      { title: 'Health', emoji: '🧴', items: [
        { item: 'Sunscreen SPF 50+', essential: true },
        { item: 'Insect repellent', essential: true },
        { item: 'Altitude medicine (for Kedarnath, Tungnath 3,500m+)', note: 'Consult doctor' },
        { item: 'Basic first aid kit', essential: true },
        { item: 'Personal medications' },
      ]},
      { title: 'Documents', emoji: '📄', items: [
        { item: 'Government ID', essential: true },
        { item: 'Registration for Char Dham yatra (online)', essential: true, note: 'Mandatory at chardhamregistration.uk.gov.in' },
        { item: 'Hotel / ashram booking confirmation', essential: true },
        { item: 'Cash + cards' },
      ]},
      { title: 'Gear', emoji: '🎒', items: [
        { item: 'Day backpack (20–30L)', essential: true },
        { item: 'Trekking poles (for Kedarnath/Tungnath)' },
        { item: 'Power bank', essential: true },
        { item: 'Headlamp (temple treks start at 3–4am)' },
        { item: 'Water bottle / thermos' },
      ]},
    ],
    doNotBring: [
      'Non-vegetarian food near temple towns (offensive to locals)',
      'Alcohol near holy towns (Rishikesh, Haridwar are dry)',
      'Leather items inside some temples',
    ],
    tips: [
      'Rishikesh is the yoga / rafting capital — try both',
      'Char Dham yatra requires online registration — do it months in advance',
      'Kedarnath helicopter bookings open in April — book immediately',
      'Carry cash beyond Rishikesh — ATMs sparse in villages',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(CHECKLISTS).map((destination) => ({ destination }));
}

export async function generateMetadata({ params }: { params: Promise<{ destination: string }> }): Promise<Metadata> {
  const { destination } = await params;
  const checklist = CHECKLISTS[destination];
  if (!checklist) return {};
  return {
    title: `${checklist.name} Packing List 2026 — Complete Checklist | YlooTrips`,
    description: `Complete packing checklist for ${checklist.name}. Climate: ${checklist.climate}. Best months: ${checklist.bestMonths}. Everything you need to pack for a perfect trip.`,
    alternates: { canonical: `https://www.ylootrips.com/packing-checklist/${destination}` },
  };
}

export default async function PackingChecklistPage({ params }: { params: Promise<{ destination: string }> }) {
  const { destination } = await params;
  const checklist = CHECKLISTS[destination];
  if (!checklist) notFound();

  const totalItems = checklist.sections.reduce((s, sec) => s + sec.items.length, 0);
  const essentialCount = checklist.sections.reduce((s, sec) => s + sec.items.filter((i) => i.essential).length, 0);

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">

        <div className="pt-8 pb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/packing-checklist" className="hover:text-gray-700 flex items-center gap-1"><ArrowLeft size={12} /> All Checklists</Link>
          <span>/</span>
          <span className="text-gray-600">{checklist.name}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-gray-400" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Packing Checklist</p>
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">{checklist.name}</h1>
          <p className="text-gray-500 text-sm">{checklist.heroNote}</p>
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Items', val: String(totalItems) },
            { label: 'Essentials', val: String(essentialCount) },
            { label: 'Climate', val: checklist.climate },
            { label: 'Best Season', val: checklist.bestMonths },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{s.label}</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-8">
          {checklist.sections.map((section) => (
            <div key={section.title} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>{section.emoji}</span>
                  {section.title}
                  <span className="ml-auto text-[10px] text-gray-400 font-normal">{section.items.length} items</span>
                </h2>
              </div>
              <div className="divide-y divide-gray-50">
                {section.items.map((item) => (
                  <div key={item.item} className="px-5 py-3 flex items-start gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 ${item.essential ? 'border-gray-900 bg-gray-900' : 'border-gray-200'}`}>
                      {item.essential && <Check size={12} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${item.essential ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {item.item}
                        {item.essential && <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">Essential</span>}
                      </p>
                      {item.note && (
                        <p className="text-[11px] text-gray-400 mt-0.5 flex items-start gap-1">
                          <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Do not bring */}
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={16} /> Do NOT Bring
          </h2>
          <ul className="space-y-1.5">
            {checklist.doNotBring.map((item) => (
              <li key={item} className="text-sm text-red-700 flex items-start gap-2">
                <span className="text-red-400 mt-0.5">✕</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Local Tips</h2>
          <ul className="space-y-2">
            {checklist.tips.map((tip) => (
              <li key={tip} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">→</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        {checklist.packageHref && (
          <div className="bg-gray-900 rounded-3xl p-8 text-center text-white">
            <Package className="w-9 h-9 mx-auto mb-3 text-gray-400" />
            <h2 className="font-serif text-xl font-bold mb-2">Ready to Book?</h2>
            <p className="text-white/60 text-sm mb-5">{checklist.packageLabel}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={checklist.packageHref}
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm">
                View Package
              </Link>
              <Link href={`https://wa.me/918427831127?text=Hi%20I%20want%20to%20book%20a%20trip%20to%20${encodeURIComponent(checklist.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors text-sm">
                <MessageCircle size={14} /> WhatsApp Us
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
