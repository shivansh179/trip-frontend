import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, Clock, Check, MessageCircle, ChevronRight, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visa Guide for Indian Travelers 2026 — Requirements, Fees & Processing | YlooTrips',
  description: 'Complete visa guide for Indian passport holders. Visa on arrival, e-visa, and embassy visa requirements for Bali, Dubai, Thailand, Singapore, Europe, USA, and 50+ countries. Updated for 2026.',
  keywords: 'visa guide India, visa requirements Indian passport, Bali visa Indian, Dubai visa India, Thailand visa India, Singapore visa India, Europe Schengen visa India, visa on arrival India',
  openGraph: {
    title: 'Visa Guide for Indian Travelers 2026 | YlooTrips',
    description: 'Visa requirements, fees, and processing times for 50+ countries. Updated for 2026.',
    url: 'https://www.ylootrips.com/visa',
    type: 'website',
  },
  alternates: { canonical: 'https://www.ylootrips.com/visa' },
};

const DESTINATIONS = [
  // Easy access — visa on arrival / e-visa / visa-free
  { slug: 'bali',       name: 'Bali (Indonesia)',   flag: '🇮🇩', type: 'Visa Free',       fee: 'Free',     feeNote: 'No fee',         time: 'Instant',    easy: true  },
  { slug: 'thailand',   name: 'Thailand',            flag: '🇹🇭', type: 'Visa Exemption',  fee: 'Free',     feeNote: 'No fee',         time: 'Instant',    easy: true  },
  { slug: 'maldives',   name: 'Maldives',            flag: '🇲🇻', type: 'Visa on Arrival', fee: 'Free',     feeNote: 'No fee',         time: 'Instant',    easy: true  },
  { slug: 'malaysia',   name: 'Malaysia',            flag: '🇲🇾', type: 'Visa Free',       fee: 'Free',     feeNote: 'No fee',         time: 'Instant',    easy: true  },
  { slug: 'nepal',      name: 'Nepal',               flag: '🇳🇵', type: 'Visa Free',       fee: 'Free',     feeNote: 'No visa needed', time: 'Instant',    easy: true  },
  { slug: 'sri-lanka',  name: 'Sri Lanka',           flag: '🇱🇰', type: 'E-Visa (ETA)',    fee: 'Free',     feeNote: 'Free for Indians', time: 'Same day', easy: true  },
  { slug: 'singapore',  name: 'Singapore',           flag: '🇸🇬', type: 'E-Visa (IVP)',    fee: 'Free',     feeNote: 'No fee',         time: '3–5 days',   easy: true  },
  { slug: 'vietnam',    name: 'Vietnam',             flag: '🇻🇳', type: 'E-Visa',          fee: '₹2,100',   feeNote: '~$25',           time: '3 days',     easy: true  },
  { slug: 'dubai',      name: 'Dubai (UAE)',         flag: '🇦🇪', type: 'E-Visa',          fee: '₹8,000',   feeNote: 'AED 350',        time: '3–5 days',   easy: true  },
  { slug: 'turkey',     name: 'Turkey',              flag: '🇹🇷', type: 'E-Visa',          fee: '₹4,500',   feeNote: '~$54',           time: 'Same day',   easy: true  },
  { slug: 'kenya',      name: 'Kenya',               flag: '🇰🇪', type: 'E-Visa (eTA)',    fee: '₹4,300',   feeNote: '~$51.80',        time: '3 days',     easy: true  },
  { slug: 'egypt',      name: 'Egypt',               flag: '🇪🇬', type: 'Visa on Arrival', fee: '₹2,100',   feeNote: '~$25',           time: 'Instant',    easy: true  },
  // Embassy / online application
  { slug: 'europe',     name: 'Europe (Schengen)',   flag: '🇪🇺', type: 'Embassy Visa',    fee: '₹8,200',   feeNote: '€90',            time: '15 days',    easy: false },
  { slug: 'uk',         name: 'United Kingdom',      flag: '🇬🇧', type: 'Online Visa',     fee: '₹12,500',  feeNote: '£115',           time: '15 days',    easy: false },
  { slug: 'usa',        name: 'USA',                 flag: '🇺🇸', type: 'Embassy Visa',    fee: '₹15,400',  feeNote: '$185',           time: '30–90 days', easy: false },
  { slug: 'canada',     name: 'Canada',              flag: '🇨🇦', type: 'Online Visa',     fee: '₹6,200',   feeNote: 'CAD $100',       time: '8–12 weeks', easy: false },
  { slug: 'australia',  name: 'Australia',           flag: '🇦🇺', type: 'Tourist Visa',    fee: '₹11,000',  feeNote: 'AUD $195',       time: '1–7 days',   easy: false },
  { slug: 'japan',      name: 'Japan',               flag: '🇯🇵', type: 'Embassy Visa',    fee: '₹1,700',   feeNote: 'JPY 3,000',      time: '5 days',     easy: false },
];

const easyDests = DESTINATIONS.filter((d) => d.easy);
const hardDests = DESTINATIONS.filter((d) => !d.easy);

export default function VisaHubPage() {
  return (
    <main className="min-h-screen bg-white pt-20">

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6">
            <Globe size={13} /> Visa Guide 2026
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5">
            Visa Guide for<br className="hidden sm:block" /> Indian Travelers
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Everything you need to know about visa requirements, fees, and processing times for 50+ countries. Updated for 2026.
          </p>
        </div>
      </section>

      {/* Easy visa destinations */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Easy Access</p>
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Visa on Arrival & E-Visa Countries</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {easyDests.map((d) => (
              <Link key={d.slug} href={`/visa/${d.slug}`}
                className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 hover:shadow-sm transition-all border border-gray-100 group">
                <div className="text-3xl shrink-0">{d.flag}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                  <p className="text-xs text-green-600 font-medium">{d.type}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[11px] font-semibold ${d.fee === 'Free' ? 'text-green-600' : 'text-gray-700'}`}>
                      {d.fee}
                    </span>
                    {d.fee !== 'Free' && (
                      <span className="text-[10px] text-gray-400">{d.feeNote}</span>
                    )}
                    <span className="text-[10px] text-gray-400">· {d.time}</span>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Embassy visa destinations */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Embassy / Online Application</p>
          </div>
          <h2 className="font-serif text-3xl font-bold text-gray-900 mb-8">Countries Requiring Embassy Visa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hardDests.map((d) => (
              <Link key={d.slug} href={`/visa/${d.slug}`}
                className="flex items-center gap-4 bg-white rounded-2xl p-4 hover:border-gray-300 hover:shadow-sm transition-all border border-gray-100 group">
                <div className="text-3xl shrink-0">{d.flag}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                  <p className="text-xs text-orange-600 font-medium">{d.type}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] font-semibold text-gray-700">{d.fee}</span>
                    <span className="text-[10px] text-gray-400">{d.feeNote}</span>
                    <span className="text-[10px] text-gray-400">· {d.time}</span>
                  </div>
                </div>
                <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-600 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto bg-gray-900 rounded-3xl p-10 text-center text-white">
          <FileText className="w-10 h-10 mx-auto mb-4 text-blue-400" />
          <h2 className="font-serif text-2xl font-bold mb-3">Need Visa Assistance?</h2>
          <p className="text-white/70 text-sm mb-6">We help with document preparation and visa applications for 50+ countries. WhatsApp us for guidance.</p>
          <Link href="https://wa.me/918427831127?text=Hi%20I%20need%20visa%20assistance" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors text-sm">
            <MessageCircle size={15} /> Get Visa Help
          </Link>
        </div>
      </section>

    </main>
  );
}
