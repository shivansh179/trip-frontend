import type { Metadata } from 'next';
import Link from 'next/link';
import { Package, ChevronRight, Mountain, Waves, TreePine, Building2, Snowflake, Sun } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel Packing Checklist 2026 — What to Pack for Every Destination | YlooTrips',
  description: 'Free travel packing checklists for every destination — Manali, Goa, Kashmir, Bali, Dubai, Europe, and more. Never forget essentials again. Updated for 2026.',
  keywords: 'travel packing checklist India, what to pack for Manali, Goa packing list, Kashmir packing checklist, Bali packing list, Europe travel packing, international trip packing India',
  openGraph: {
    title: 'Travel Packing Checklist — Every Destination | YlooTrips',
    description: 'Destination-specific packing lists for mountains, beaches, deserts, cities, and international trips.',
    url: 'https://www.ylootrips.com/packing-checklist',
  },
  alternates: { canonical: 'https://www.ylootrips.com/packing-checklist' },
};

const DESTINATIONS = [
  { slug: 'manali', name: 'Manali / Himachal', icon: Mountain, tag: 'Mountains', color: 'bg-blue-50 text-blue-600', temp: '-5°C to 20°C' },
  { slug: 'goa', name: 'Goa', icon: Waves, tag: 'Beach', color: 'bg-teal-50 text-teal-600', temp: '28–35°C' },
  { slug: 'kashmir', name: 'Kashmir', icon: Snowflake, tag: 'Cold / Snow', color: 'bg-indigo-50 text-indigo-600', temp: '-10°C to 25°C' },
  { slug: 'kerala', name: 'Kerala', icon: TreePine, tag: 'Backwaters', color: 'bg-green-50 text-green-600', temp: '22–32°C' },
  { slug: 'rajasthan', name: 'Rajasthan', icon: Sun, tag: 'Desert', color: 'bg-orange-50 text-orange-600', temp: '10–48°C' },
  { slug: 'ladakh', name: 'Ladakh', icon: Mountain, tag: 'High Altitude', color: 'bg-purple-50 text-purple-600', temp: '-20°C to 25°C' },
  { slug: 'bali', name: 'Bali', icon: Waves, tag: 'Beach + Culture', color: 'bg-teal-50 text-teal-600', temp: '26–30°C' },
  { slug: 'dubai', name: 'Dubai', icon: Building2, tag: 'City / Desert', color: 'bg-yellow-50 text-yellow-600', temp: '20–45°C' },
  { slug: 'thailand', name: 'Thailand', icon: Waves, tag: 'Beach + City', color: 'bg-teal-50 text-teal-600', temp: '24–38°C' },
  { slug: 'europe', name: 'Europe', icon: Building2, tag: 'City + Culture', color: 'bg-gray-50 text-gray-600', temp: '0–25°C' },
  { slug: 'andaman', name: 'Andaman Islands', icon: Waves, tag: 'Beach + Diving', color: 'bg-cyan-50 text-cyan-600', temp: '24–30°C' },
  { slug: 'uttarakhand', name: 'Uttarakhand / Rishikesh', icon: TreePine, tag: 'Adventure + Temples', color: 'bg-green-50 text-green-600', temp: '5–35°C' },
];

export default function PackingChecklistHubPage() {
  return (
    <main className="min-h-screen bg-white pt-20 pb-16">
      <div className="section-container max-w-5xl">

        {/* Header */}
        <div className="py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600 mb-5">
            <Package size={13} /> Free Packing Lists
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Travel Packing Checklists
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Destination-specific packing lists so you never forget essentials. Tailored to climate, culture, and activities.
          </p>
        </div>

        {/* Destination grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DESTINATIONS.map((d) => (
            <Link key={d.slug} href={`/packing-checklist/${d.slug}`}
              className="flex items-center gap-4 border border-gray-100 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group bg-white">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${d.color}`}>
                <d.icon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{d.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{d.tag}</span>
                  <span className="text-[10px] text-gray-400">{d.temp}</span>
                </div>
              </div>
              <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-600 shrink-0" />
            </Link>
          ))}
        </div>

        {/* Pro tip */}
        <div className="mt-10 bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
          <p className="text-sm text-gray-600">
            <strong className="text-gray-900">Pro tip:</strong> Book your trip first, then come back for the packing list.{' '}
            <Link href="/trips" className="text-gray-900 font-semibold underline underline-offset-2">Browse all trips →</Link>
          </p>
        </div>

      </div>
    </main>
  );
}
