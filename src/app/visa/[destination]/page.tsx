import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FileText, Check, Clock, DollarSign, MessageCircle, ChevronRight, AlertTriangle, ArrowLeft } from 'lucide-react';

interface VisaInfo {
  name: string;
  flag: string;
  type: string;
  validity: string;
  stayAllowed: string;
  fee: string;
  feeNote: string;
  processingTime: string;
  where: string;
  entryType: string;
  documents: string[];
  tips: string[];
  faqs: { q: string; a: string }[];
  packageHref?: string;
  packageLabel?: string;
}

const VISA_DATA: Record<string, VisaInfo> = {
  bali: {
    name: 'Bali (Indonesia)',
    flag: '🇮🇩',
    type: 'Visa on Arrival (VoA)',
    validity: '30 days, extendable once',
    stayAllowed: '30 days per entry',
    fee: 'Free',
    feeNote: 'Indonesia does NOT charge VoA for Indian nationals as of 2023',
    processingTime: 'Instant at airport',
    where: 'Ngurah Rai International Airport (DPS), Bali',
    entryType: 'Single entry (extendable to 60 days)',
    documents: [
      'Valid Indian passport (6+ months validity)',
      'Return flight ticket',
      'Hotel booking confirmation',
      'Proof of sufficient funds (bank statement or cash)',
      'Passport-size photo (sometimes requested)',
    ],
    tips: [
      'No pre-application needed — simply arrive and join the VoA queue',
      'Queue can be long during peak season (July–August, December) — factor 30–60 minutes',
      'Extension available at local immigration office (Imigrasi) for another 30 days',
      'Indonesia and India have a bilateral visa-free agreement since 2023',
      'Social media/travel influencer activities require a different visa — tourist VoA is fine for regular travelers',
    ],
    faqs: [
      { q: 'Do Indians need a visa for Bali?', a: 'No. Indian nationals receive a free Visa on Arrival (VoA) at Bali airport. The VoA is valid for 30 days and can be extended once for another 30 days.' },
      { q: 'How long can I stay in Bali on VoA?', a: '30 days per visit. You can extend once at an immigration office for another 30 days, giving you up to 60 days total.' },
      { q: 'Is there a Bali visa fee for Indians?', a: 'No. Indonesia has waived the VoA fee for Indian nationals. There is no charge at the airport.' },
      { q: 'Can I work in Bali on a tourist visa?', a: 'No. Tourism VoA is strictly for tourism, leisure, and family visits. Working, business meetings, or earning money in Indonesia requires a different visa category.' },
    ],
    packageHref: '/bali-honeymoon-package',
    packageLabel: 'Bali Honeymoon Package from ₹52,499',
  },
  dubai: {
    name: 'Dubai (UAE)',
    flag: '🇦🇪',
    type: 'E-Visa (Online)',
    validity: '30 days (tourist) or 90 days (long stay)',
    stayAllowed: '30 days per entry',
    fee: '₹3,500 approx (AED 150)',
    feeNote: 'Fee varies by visa type and duration. 30-day single entry ~₹3,500',
    processingTime: '3–5 working days',
    where: 'Apply online via UAE ICA website or through your airline',
    entryType: 'Single or multiple entry options available',
    documents: [
      'Scanned copy of valid Indian passport (6+ months validity)',
      'Recent passport-size photograph (white background)',
      'Return flight ticket',
      'Hotel booking or host invitation letter',
      'Bank statement (last 3 months, min ₹50,000 balance)',
      'Travel insurance (recommended)',
    ],
    tips: [
      'Apply at least 7–10 days before travel to avoid delays',
      'Visa is issued by email — print or save digitally',
      'UAE has separate visas for transit (96h), 30 days tourist, and 90 days long stay',
      'Overstaying is strictly penalised — AED 200/day fine',
      'Emirates, Air Arabia, and flydubai can issue visas when you book with them',
    ],
    faqs: [
      { q: 'How to get Dubai visa for Indians?', a: 'Apply online through the UAE ICA website (ica.gov.ae), through your airline (Emirates/Air Arabia), or through a visa agency. Processing takes 3–5 business days.' },
      { q: 'What is the Dubai visa fee for Indians?', a: 'A 30-day single-entry tourist visa costs approximately ₹3,500–₹4,000 (AED 150). A 90-day multiple-entry visa costs approximately ₹8,000–₹9,000.' },
      { q: 'Can Indians get visa on arrival in Dubai?', a: 'No. Indians must obtain a pre-approved e-visa before travelling to Dubai. There is no visa on arrival for Indian nationals.' },
      { q: 'How long is Dubai visa valid?', a: 'Tourist visas are valid for 30 days from the date of entry. They can be extended or renewed from within Dubai for an additional fee.' },
    ],
    packageHref: '/dubai-tour-package-from-delhi',
    packageLabel: 'Dubai Tour Package from ₹36,499',
  },
  thailand: {
    name: 'Thailand',
    flag: '🇹🇭',
    type: 'Visa on Arrival (VoA)',
    validity: '15 days (as of 2024)',
    stayAllowed: '15 days per entry',
    fee: '₹3,200 approx (THB 2,000)',
    feeNote: 'Thailand VoA fee for Indian nationals is THB 2,000 (~₹3,200). Free visa options also available.',
    processingTime: 'Instant at airport immigration',
    where: 'Suvarnabhumi Airport (BKK) or Phuket Airport (HKT)',
    entryType: 'Single entry',
    documents: [
      'Valid Indian passport (6+ months validity)',
      'Completed VoA application form (available at airport)',
      'Passport photograph (4×6 cm, white background)',
      'Return flight ticket',
      'Hotel booking confirmation',
      'THB 10,000 per person in cash or equivalent (proof of funds)',
    ],
    tips: [
      'Thailand introduced Visa Exemption for Indians from Nov 2023 to Aug 2024 (check current status)',
      'VoA queue at BKK can be 1–2 hours long — arrive early',
      'Thailand VISA scheme (Tourist Visa) is free via Thai embassy and allows 60 days',
      'Border runs (exit and re-enter) are increasingly scrutinised — use proper visas',
      'Pattaya, Phuket, and Bangkok are all within tourist visa coverage',
    ],
    faqs: [
      { q: 'Do Indians need a visa for Thailand?', a: 'Indian nationals can get a Visa on Arrival for 15 days (fee: THB 2,000 / ~₹3,200). Thailand also periodically offers visa exemption — check the latest government notices.' },
      { q: 'How much does Thailand visa cost for Indians?', a: 'VoA costs THB 2,000 (~₹3,200) paid in Thai Baht at the airport. A tourist visa from the Thai embassy is free and valid for 60 days.' },
      { q: 'How long can I stay in Thailand as Indian?', a: 'VoA allows 15 days. Thai Tourist Visa (TV) allows 60 days, extendable by 30 days at immigration.' },
      { q: 'Which airport gives Thailand visa on arrival?', a: 'Major airports including Suvarnabhumi (Bangkok), Don Mueang (Bangkok), and Phuket all have VoA counters.' },
    ],
    packageHref: '/thailand-budget-trip',
    packageLabel: 'Thailand Budget Trip from ₹49,499',
  },
  singapore: {
    name: 'Singapore',
    flag: '🇸🇬',
    type: 'E-Visa (ICA Online)',
    validity: '30 days per entry',
    stayAllowed: '30 days',
    fee: 'Free',
    feeNote: 'Singapore tourist visa is free for Indian nationals. Only service charges apply if using an agent.',
    processingTime: '3–5 working days',
    where: 'Apply online via ICA website (ica.gov.sg) or through a sponsor in Singapore',
    entryType: 'Single or multiple entry (depends on approval)',
    documents: [
      'Scanned Indian passport (valid 6+ months)',
      'Passport-size photograph',
      'Flight itinerary',
      'Hotel booking confirmation',
      'Bank statement (last 3 months)',
      'ITR or salary slips (proof of employment)',
      'No Objection Certificate (NOC) if employed',
    ],
    tips: [
      'Singapore requires a local sponsor or travel agency to submit your application',
      'YlooTrips can submit your Singapore visa as part of your package',
      'Multiple-entry visas are sometimes granted — good for Malaysia-Singapore combo trips',
      'Biometric data collection not required for most Indian applicants',
      'Singapore is extremely strict — provide honest and complete documentation',
    ],
    faqs: [
      { q: 'Is Singapore visa free for Indians?', a: 'The Singapore Tourist Visa itself has no government fee. However, service charges apply through the submission portal or an authorised agency. YlooTrips handles this for free when you book a Singapore package.' },
      { q: 'How long does Singapore visa take for Indians?', a: '3–5 working days on average. During peak seasons (December, June–July) allow 7–10 days.' },
      { q: 'What documents are needed for Singapore visa from India?', a: 'Passport, photograph, flight itinerary, hotel booking, bank statement (3 months), salary slips/ITR, and NOC from employer.' },
    ],
    packageHref: '/singapore-tour-package',
    packageLabel: 'Singapore Tour Package from ₹44,999',
  },
  maldives: {
    name: 'Maldives',
    flag: '🇲🇻',
    type: 'Visa on Arrival',
    validity: '30 days, extendable',
    stayAllowed: '30 days',
    fee: 'Free',
    feeNote: 'Free Visa on Arrival for all nationalities including India',
    processingTime: 'Instant at arrival',
    where: 'Velana International Airport (MLE), Male',
    entryType: 'Multiple entry allowed',
    documents: [
      'Valid Indian passport (6+ months validity)',
      'Return flight ticket',
      'Resort/hotel booking confirmation',
      'Proof of sufficient funds',
    ],
    tips: [
      'No pre-application required — stamp given at airport immigration',
      'Resort bookings are mandatory (you need a confirmed stay)',
      'Most resorts are on private islands — speedboat or seaplane transfers needed',
      'Male and Hulhumale have budget-friendly guesthouses for those not staying at resorts',
      'Alcohol only available at resort islands, not Male (Islamic law)',
    ],
    faqs: [
      { q: 'Do Indians need a visa for Maldives?', a: 'No. All nationalities including Indian passport holders receive a free Visa on Arrival at Maldives airport. No advance application required.' },
      { q: 'How long can Indians stay in Maldives?', a: '30 days per visit, which can be extended to 90 days. Most tourists visit for 5–7 days.' },
    ],
    packageHref: '/maldives-luxury-package',
    packageLabel: 'Maldives Luxury Package from ₹89,999',
  },
  vietnam: {
    name: 'Vietnam',
    flag: '🇻🇳',
    type: 'E-Visa',
    validity: '90 days, multiple entry',
    stayAllowed: '90 days per visit',
    fee: '₹2,100 (USD 25)',
    feeNote: 'Vietnam e-visa costs USD 25 (~₹2,100)',
    processingTime: '3 business days',
    where: 'Apply online at evisa.xuatnhapcanh.gov.vn',
    entryType: 'Single or multiple entry',
    documents: [
      'Valid Indian passport (6+ months validity)',
      'Digital passport photograph',
      'Scanned passport bio-data page',
      'Online payment (credit/debit card)',
      'Entry and exit details (flight info)',
    ],
    tips: [
      'Vietnam e-visa is very straightforward — apply directly on the government website',
      'Processing is 3 business days but apply 7 days early for safety',
      'e-visa covers all entry points — airports, land borders, and seaports',
      'Vietnam also offers Visa on Arrival but requires a pre-approval letter — e-visa is simpler',
      'Ho Chi Minh City, Hanoi, Da Nang, and Ha Long Bay are all covered',
    ],
    faqs: [
      { q: 'How to get Vietnam visa for Indians?', a: 'Apply for Vietnam e-visa online at the official government portal. Fee is USD 25 (~₹2,100). Processing takes 3 business days. The e-visa allows 90 days multiple entry.' },
      { q: 'Is Vietnam visa on arrival available for Indians?', a: 'Yes but it requires a pre-approval letter from a Vietnamese agency. The e-visa is simpler, cheaper, and doesn\'t require a pre-approval letter.' },
    ],
    packageHref: '/vietnam-tour-package',
    packageLabel: 'Vietnam Tour Package from ₹38,999',
  },
  'sri-lanka': {
    name: 'Sri Lanka',
    flag: '🇱🇰',
    type: 'Electronic Travel Authorization (ETA)',
    validity: '6 months from issue date',
    stayAllowed: '30 days (extendable to 6 months)',
    fee: 'Free (waived)',
    feeNote: 'Sri Lanka waived the ETA fee in 2024 to boost tourism. Apply online for free.',
    processingTime: 'Same day (usually within hours)',
    where: 'Apply online at eta.gov.lk',
    entryType: 'Single entry (double entry for transit)',
    documents: [
      'Valid Indian passport (6+ months validity)',
      'Online application form',
      'Return/onward flight ticket',
      'Hotel booking confirmation',
      'Proof of sufficient funds',
    ],
    tips: [
      'ETA is mandatory — do not arrive without it',
      'Processing is typically same-day but apply 48 hours before to be safe',
      'Free visa is valid for 30 days, extendable at immigration department',
      'Sri Lanka and India have excellent connectivity with many daily direct flights',
      'Colombo, Kandy, Galle, Ella, Sigiriya — all major sights are tourist-friendly',
    ],
    faqs: [
      { q: 'Do Indians need a visa for Sri Lanka?', a: 'Yes. Indian nationals must obtain an Electronic Travel Authorization (ETA) before arrival. The ETA is currently free (fee waived in 2024) and can be obtained online in hours.' },
      { q: 'How long can Indians stay in Sri Lanka?', a: '30 days on an ETA. You can extend up to 6 months at the immigration department in Colombo.' },
    ],
    packageHref: '/sri-lanka-tour-package',
    packageLabel: 'Sri Lanka Tour Package from ₹28,999',
  },
  nepal: {
    name: 'Nepal',
    flag: '🇳🇵',
    type: 'Visa on Arrival',
    validity: '15, 30, or 90 days',
    stayAllowed: '15–90 days (choose at entry)',
    fee: '₹950–₹4,750 (USD 15 / 25 / 40)',
    feeNote: '15 days: USD 15 (~₹950) | 30 days: USD 25 (~₹2,100) | 90 days: USD 40 (~₹3,300)',
    processingTime: 'Instant at airport',
    where: 'Tribhuvan International Airport (KTM), Kathmandu, or land border crossing',
    entryType: 'Multiple entry',
    documents: [
      'Valid Indian passport (6+ months validity) — OR valid Indian Voter ID Card (Indians only)',
      'Passport-size photograph',
      'Cash in USD (preferred) or other major currency',
      'Return flight ticket',
    ],
    tips: [
      'Unique: Indian nationals can enter Nepal with just a Voter ID (no passport required for stays under 3 months)',
      'VoA fee is paid in USD at the airport — carry exact change if possible',
      'Trekking in Annapurna, Everest Base Camp, and Langtang requires separate TIMS card and permits',
      'Nepal and India have an open border — Indians do not technically need any visa but carry ID',
      'Kathmandu, Pokhara, Chitwan, and Lumbini are the main tourist destinations',
    ],
    faqs: [
      { q: 'Do Indians need a visa for Nepal?', a: 'Technically no — India and Nepal have an open-border policy. However, a Visa on Arrival (VoA) is recommended for stays involving trekking or specific purposes. Indians can also enter with just a Voter ID card.' },
      { q: 'How much does Nepal visa cost for Indians?', a: 'VoA costs USD 15 (15 days), USD 25 (30 days), or USD 40 (90 days). Indians entering with their Voter ID (not passport) do not need to pay any visa fee.' },
    ],
    packageHref: '/nepal-tour-package',
    packageLabel: 'Nepal Tour Package from ₹18,999',
  },
  europe: {
    name: 'Europe (Schengen)',
    flag: '🇪🇺',
    type: 'Schengen Visa (Embassy)',
    validity: 'Up to 90 days within 180-day period',
    stayAllowed: '90 days max within any 180-day period',
    fee: '₹7,700 (EUR 80)',
    feeNote: 'Official Schengen visa fee is EUR 80 (~₹7,700). Service charges additional.',
    processingTime: '15 days (apply 90 days, min 15 days before travel)',
    where: 'VFS Global centres in India, or direct embassy (depends on main destination country)',
    entryType: 'Single or multiple entry (2 years for frequent travelers)',
    documents: [
      'Valid Indian passport (3+ months validity beyond stay, 2 blank pages)',
      'Schengen visa application form',
      'Recent passport-size photographs (35×45 mm, white background)',
      'Travel itinerary (flight bookings, hotel)',
      'Travel insurance (€30,000 minimum coverage)',
      'Bank statements (last 6 months, min ₹1 Lakh/month)',
      'ITR (last 2 years)',
      'Employment proof (salary slips + appointment letter) or business registration',
      'NOC from employer',
      'Property ownership proof (asset documents)',
    ],
    tips: [
      'Apply at the embassy of your main destination country, or first entry country',
      'Travel insurance is mandatory for Schengen visa — get minimum EUR 30,000 coverage',
      'Strong financial documentation is key — bank statements, ITR, property docs',
      'First-time applicants should apply at VFS with an appointment',
      'Multiple-entry visas for 2–5 years available after travelling twice on single-entry',
      'Paris, Rome, Barcelona, Amsterdam, Prague are all in the Schengen zone',
    ],
    faqs: [
      { q: 'How to get Schengen visa from India?', a: 'Apply at the embassy of your main destination country or through VFS Global. Documents required: passport, itinerary, travel insurance, 6-month bank statements, employment proof. Processing: 15 days.' },
      { q: 'What is the Schengen visa fee for Indians?', a: 'EUR 80 (~₹7,700) is the official government fee. VFS service charges add ₹2,000–₹3,000. Total: approximately ₹10,000–₹11,000.' },
      { q: 'Which countries are in Schengen?', a: '27 countries including France, Germany, Italy, Spain, Netherlands, Switzerland, Austria, Greece, Portugal, Czech Republic, Hungary, and more. UK is NOT in Schengen.' },
    ],
    packageHref: '/europe-tour-package-from-india',
    packageLabel: 'Europe Tour Package from ₹1,24,999',
  },
};

export async function generateStaticParams() {
  return Object.keys(VISA_DATA).map((destination) => ({ destination }));
}

export async function generateMetadata({ params }: { params: Promise<{ destination: string }> }): Promise<Metadata> {
  const { destination } = await params;
  const info = VISA_DATA[destination];
  if (!info) return {};
  return {
    title: `${info.name} Visa for Indians 2026 — Requirements & Process | YlooTrips`,
    description: `${info.name} visa guide for Indian passport holders. Type: ${info.type}. Fee: ${info.fee}. Processing: ${info.processingTime}. Documents required and tips from experts.`,
    alternates: { canonical: `https://www.ylootrips.com/visa/${destination}` },
    openGraph: {
      title: `${info.name} Visa for Indians — ${info.type}`,
      description: `Fee: ${info.fee} · Processing: ${info.processingTime} · Stay: ${info.stayAllowed}`,
      url: `https://www.ylootrips.com/visa/${destination}`,
    },
  };
}

export default async function VisaDestinationPage({ params }: { params: Promise<{ destination: string }> }) {
  const { destination } = await params;
  const info = VISA_DATA[destination];
  if (!info) notFound();

  const isEasy = info.type.toLowerCase().includes('arrival') || info.type.toLowerCase().includes('e-visa') || info.type.toLowerCase().includes('eta') || info.fee === 'Free';

  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="max-w-3xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="pt-8 pb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/visa" className="hover:text-gray-700 flex items-center gap-1"><ArrowLeft size={12} /> All Destinations</Link>
          <span>/</span>
          <span className="text-gray-600">{info.name}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">{info.flag}</span>
            <div>
              <h1 className="font-serif text-3xl font-bold text-gray-900">{info.name} Visa</h1>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-1 ${isEasy ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {info.type}
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: DollarSign, label: 'Visa Fee', val: info.fee },
            { icon: Clock, label: 'Processing', val: info.processingTime },
            { icon: FileText, label: 'Stay Allowed', val: info.stayAllowed },
            { icon: Check, label: 'Validity', val: info.validity },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
              <s.icon size={16} className="text-gray-400 mx-auto mb-1" />
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{s.label}</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{s.val}</p>
            </div>
          ))}
        </div>

        {/* Fee note */}
        {info.feeNote && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex gap-3">
            <AlertTriangle size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">{info.feeNote}</p>
          </div>
        )}

        {/* Where to apply */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-2">Where to Apply</h2>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4">{info.where}</p>
        </div>

        {/* Documents */}
        <div className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Required Documents</h2>
          <ul className="space-y-2">
            {info.documents.map((doc) => (
              <li key={doc} className="flex items-start gap-2.5 text-sm text-gray-700">
                <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                {doc}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8">
          <h2 className="font-semibold text-gray-900 mb-3">Expert Tips</h2>
          <ul className="space-y-2">
            {info.tips.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm text-gray-700">
                <ChevronRight size={14} className="text-gray-400 shrink-0 mt-0.5" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* FAQs */}
        <div className="mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {info.faqs.map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-4">
                <h3 className="font-medium text-gray-900 text-sm mb-1.5">{faq.q}</h3>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Book package CTA */}
        {info.packageHref && (
          <div className="bg-gray-900 rounded-3xl p-8 text-center text-white">
            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Ready to Travel?</p>
            <h2 className="font-serif text-2xl font-bold mb-4">{info.packageLabel}</h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={info.packageHref}
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-7 py-3 rounded-full hover:bg-gray-100 transition-colors text-sm">
                View Package
              </Link>
              <Link href={`https://wa.me/918427831127?text=Hi%20I%20need%20visa%20help%20for%20${encodeURIComponent(info.name)}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors text-sm">
                <MessageCircle size={14} /> Visa Help
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
