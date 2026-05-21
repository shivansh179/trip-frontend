import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, ChevronRight, Sun, Snowflake, Cloud } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Time to Travel in India — Month-by-Month Travel Guide 2026 | YlooTrips',
  description: 'Complete month-by-month travel guide for India and international destinations. Where to go in January, February, March, and every month of the year. Best weather, festivals, and deals.',
  keywords: 'best time to travel India, where to go in January India, February travel India, best places to visit every month India, month wise travel guide India, when to visit India',
  openGraph: {
    title: 'Best Time to Travel — Month-by-Month Guide | YlooTrips',
    description: 'Where to go every month of the year — weather, festivals, and deals for India and beyond.',
    url: 'https://www.ylootrips.com/best-time-to-travel',
  },
  alternates: { canonical: 'https://www.ylootrips.com/best-time-to-travel' },
};

const MONTHS = [
  { slug: 'january', name: 'January', season: 'Winter', emoji: '❄️', icon: Snowflake, picks: ['Goa', 'Rajasthan', 'Kerala', 'Andaman'], color: 'bg-blue-50 text-blue-600', weather: 'Cool & dry across India' },
  { slug: 'february', name: 'February', season: 'Winter end', emoji: '🌸', icon: Sun, picks: ['Goa', 'Rajasthan', 'Kerala', 'Hampi'], color: 'bg-pink-50 text-pink-600', weather: 'Perfect weather, crowds reducing' },
  { slug: 'march', name: 'March', season: 'Pre-summer', emoji: '🌺', icon: Sun, picks: ['Himachal', 'Uttarakhand', 'Holi destinations', 'Havelock'], color: 'bg-orange-50 text-orange-600', weather: 'Holi festival, warming up' },
  { slug: 'april', name: 'April', season: 'Summer begins', emoji: '☀️', icon: Sun, picks: ['Manali', 'Shimla', 'Darjeeling', 'Northeast'], color: 'bg-yellow-50 text-yellow-600', weather: 'Hills perfect, plains hot' },
  { slug: 'may', name: 'May', season: 'Peak summer', emoji: '🌞', icon: Sun, picks: ['Ladakh (road opens)', 'Spiti', 'Sikkim', 'Kashmir Valley'], color: 'bg-red-50 text-red-600', weather: 'Mountains ideal, plains 40°C+' },
  { slug: 'june', name: 'June', season: 'Monsoon begins', emoji: '🌧️', icon: Cloud, picks: ['Ladakh', 'Coorg', 'Valley of Flowers (opens)', 'Meghalaya'], color: 'bg-teal-50 text-teal-600', weather: 'Monsoon south/west, Ladakh clear' },
  { slug: 'july', name: 'July', season: 'Monsoon peak', emoji: '⛈️', icon: Cloud, picks: ['Ladakh', 'Spiti Valley', 'Kerala backwaters', 'Valley of Flowers'], color: 'bg-indigo-50 text-indigo-600', weather: 'Heavy rain everywhere except Ladakh' },
  { slug: 'august', name: 'August', season: 'Monsoon', emoji: '🌿', icon: Cloud, picks: ['Ladakh', 'Spiti', 'Valley of Flowers', 'Northeast India'], color: 'bg-green-50 text-green-600', weather: 'Lush green everywhere, waterfalls full' },
  { slug: 'september', name: 'September', season: 'Monsoon end', emoji: '🌤️', icon: Sun, picks: ['Rajasthan', 'Goa (opens)', 'Manali', 'Nainital'], color: 'bg-amber-50 text-amber-600', weather: 'Rain tapering, crowds low, deals best' },
  { slug: 'october', name: 'October', season: 'Post-monsoon', emoji: '🍂', icon: Sun, picks: ['Goa', 'Rajasthan', 'Kashmir (apple harvest)', 'Hampi', 'Pushkar'], color: 'bg-orange-50 text-orange-600', weather: 'Best shoulder month — clear skies, low prices' },
  { slug: 'november', name: 'November', season: 'Winter begins', emoji: '🍁', icon: Snowflake, picks: ['Goa', 'Rajasthan', 'Kerala', 'Andaman', 'Bali', 'Thailand'], color: 'bg-purple-50 text-purple-600', weather: 'Peak season starts, ideal temperatures' },
  { slug: 'december', name: 'December', season: 'Peak winter', emoji: '🎄', icon: Snowflake, picks: ['Goa', 'Rajasthan', 'Kerala', 'Andaman', 'Manali (snow)'], color: 'bg-blue-50 text-blue-600', weather: 'Best weather in south India, festive season' },
];

export default function BestTimeToTravelPage() {
  return (
    <main className="min-h-screen bg-white pt-20 pb-16">

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6">
            <Calendar size={13} /> Travel Calendar 2026
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5">
            Best Time to Travel<br className="hidden sm:block" /> in India
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto">
            Where to go every single month. Weather, festivals, crowds, and deals — all in one place.
          </p>
        </div>
      </section>

      {/* Month grid */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTHS.map((m) => (
              <Link key={m.slug} href={`/best-time-to-travel/${m.slug}`}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{m.emoji}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.season}</p>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-gray-300 group-hover:text-gray-600 mt-1 shrink-0" />
                </div>
                <p className="text-xs text-gray-500 mb-3">{m.weather}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.picks.slice(0, 3).map((p) => (
                    <span key={p} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${m.color}`}>{p}</span>
                  ))}
                  {m.picks.length > 3 && (
                    <span className="text-[10px] text-gray-400 px-2 py-0.5">+{m.picks.length - 3} more</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick reference table */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto overflow-x-auto">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 text-center">Quick Reference: India Travel Seasons</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Season</th>
                <th className="text-left py-2 pr-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Months</th>
                <th className="text-left py-2 pr-4 text-gray-500 font-medium text-xs uppercase tracking-wider">Best For</th>
                <th className="text-left py-2 text-gray-500 font-medium text-xs uppercase tracking-wider">Avoid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-3 pr-4 font-semibold text-blue-600">Winter ❄️</td>
                <td className="py-3 pr-4 text-gray-700">Nov – Feb</td>
                <td className="py-3 pr-4 text-gray-700">Goa, Rajasthan, Kerala, Andaman</td>
                <td className="py-3 text-gray-400">Ladakh (closed), high Himalayas</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-red-500">Summer ☀️</td>
                <td className="py-3 pr-4 text-gray-700">Mar – May</td>
                <td className="py-3 pr-4 text-gray-700">Hill stations, Ladakh (May onwards), North East</td>
                <td className="py-3 text-gray-400">Rajasthan, plains cities (45°C+)</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-teal-600">Monsoon 🌧️</td>
                <td className="py-3 pr-4 text-gray-700">Jun – Sep</td>
                <td className="py-3 pr-4 text-gray-700">Ladakh, Spiti, Valley of Flowers, Coorg</td>
                <td className="py-3 text-gray-400">Goa, Rajasthan, beach destinations</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-orange-500">Post-Monsoon 🍂</td>
                <td className="py-3 pr-4 text-gray-700">Oct</td>
                <td className="py-3 pr-4 text-gray-700">Everywhere — best deals, lowest crowds</td>
                <td className="py-3 text-gray-400">Nothing major — October is the hidden gem</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>
  );
}
