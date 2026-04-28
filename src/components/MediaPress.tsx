// Social proof strip — verified stats + trusted partners
export default function MediaPress() {
  const stats = [
    { value: '25,000+', label: 'Happy Travelers' },
    { value: '4.9★',    label: '2,400+ Reviews' },
    { value: '150+',    label: 'Destinations' },
    { value: '40+',     label: 'Countries Served' },
    { value: '2022',    label: 'Founded' },
  ];

  const partners = [
    { name: 'IndiGo',     emoji: '✈️', color: 'text-blue-600' },
    { name: 'Air India',  emoji: '🛫', color: 'text-red-600' },
    { name: 'Emirates',   emoji: '✈️', color: 'text-red-800' },
    { name: 'Marriott',   emoji: '🏨', color: 'text-purple-800' },
    { name: 'Taj Hotels', emoji: '🏰', color: 'text-amber-800' },
    { name: 'Easebuzz',   emoji: '🔒', color: 'text-indigo-600' },
  ];

  return (
    <div className="bg-cream-light border-b border-primary/6">

      {/* Stats row */}
      <div className="section-container py-4 border-b border-primary/6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span className="text-sm font-bold text-primary/80 tabular-nums">{s.value}</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-primary/35">{s.label}</span>
              {i < stats.length - 1 && (
                <span className="hidden md:block w-px h-4 bg-primary/10 ml-2.5" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Partners row */}
      <div className="section-container py-3">
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
