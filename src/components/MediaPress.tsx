// Media coverage + partner logos — social proof strip
export default function MediaPress() {
  const press = [
    { name: 'Times of India',  short: 'TOI',   style: 'font-serif font-black text-red-700 tracking-tight' },
    { name: 'Economic Times', short: 'ET',    style: 'font-serif font-black text-[#0a3d62] tracking-tight' },
    { name: 'NDTV',           short: 'NDTV',  style: 'font-black text-red-600 tracking-wider' },
    { name: 'Condé Nast',     short: 'CNT',   style: 'font-serif italic font-semibold text-gray-800 tracking-tight' },
    { name: 'Lonely Planet',  short: 'LP',    style: 'font-black text-green-700 tracking-wide' },
    { name: 'TripAdvisor',    short: 'TA',    style: 'font-black text-[#00af87] tracking-wide' },
  ];

  const partners = [
    { name: 'IndiGo',    emoji: '✈️', color: 'text-blue-600' },
    { name: 'Air India', emoji: '🛫', color: 'text-red-600' },
    { name: 'Emirates',  emoji: '✈️', color: 'text-red-800' },
    { name: 'Marriott',  emoji: '🏨', color: 'text-purple-800' },
    { name: 'Taj Hotels',emoji: '🏰', color: 'text-amber-800' },
    { name: 'Easebuzz',  emoji: '🔒', color: 'text-indigo-600' },
  ];

  return (
    <div className="bg-cream-light border-b border-primary/6">

      {/* Press Row */}
      <div className="section-container py-5 border-b border-primary/6">
        <div className="flex flex-wrap items-center gap-5 md:gap-8 justify-center">
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary/25 shrink-0">
            As featured in
          </span>
          <div className="w-px h-5 bg-primary/8 hidden md:block" />
          {press.map(p => (
            <div
              key={p.name}
              title={p.name}
              className={`text-base leading-none ${p.style} opacity-40 hover:opacity-75 transition-opacity duration-300 cursor-default select-none`}
            >
              {p.short}
            </div>
          ))}
        </div>
      </div>

      {/* Partner logos row */}
      <div className="section-container py-3.5">
        <div className="flex flex-wrap items-center gap-4 md:gap-6 justify-center">
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary/25 shrink-0">
            Trusted partners
          </span>
          <div className="w-px h-4 bg-primary/8 hidden md:block" />
          {partners.map(p => (
            <div
              key={p.name}
              className={`flex items-center gap-1.5 ${p.color} opacity-40 hover:opacity-70 transition-opacity duration-300 cursor-default`}
            >
              <span className="text-sm leading-none">{p.emoji}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{p.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
