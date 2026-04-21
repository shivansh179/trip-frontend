'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Flame, TrendingDown, AlertCircle } from 'lucide-react';
import type { DateAvailability } from '@/app/api/availability/[tripId]/route';

interface BookingCalendarProps {
  tripId: number;
  basePrice: number;
  maxSeats?: number;
  selectedDate: string;
  selectedGuests: number;
  onSelectDate: (date: string, price: number) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function toYM(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`;
}

const TIER_STYLES: Record<DateAvailability['tier'], string> = {
  cheap:    'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100',
  normal:   'bg-white border-primary/10 text-primary hover:bg-cream',
  peak:     'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100',
  sold_out: 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed',
};

export default function BookingCalendar({
  tripId, basePrice, maxSeats = 16,
  selectedDate, selectedGuests, onSelectDate,
}: BookingCalendarProps) {
  const today   = new Date(); today.setHours(0, 0, 0, 0);
  const initYear  = today.getFullYear();
  const initMonth = today.getMonth();

  const [viewYear,  setViewYear]  = useState(initYear);
  const [viewMonth, setViewMonth] = useState(initMonth);
  const [avail, setAvail]         = useState<Record<string, DateAvailability>>({});
  const [loading, setLoading]     = useState(false);

  const fetchMonth = useCallback(async (year: number, month: number) => {
    setLoading(true);
    try {
      const ym  = toYM(year, month);
      const res = await fetch(
        `/api/availability/${tripId}?month=${ym}&basePrice=${basePrice}&maxSeats=${maxSeats}`
      );
      const data = await res.json();
      if (data.dates) {
        setAvail(prev => {
          const next = { ...prev };
          for (const d of data.dates as DateAvailability[]) next[d.date] = d;
          return next;
        });
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [tripId, basePrice, maxSeats]);

  // Pre-fetch current + next month
  useEffect(() => { fetchMonth(viewYear, viewMonth); }, [fetchMonth, viewYear, viewMonth]);
  useEffect(() => {
    const nm = viewMonth === 11 ? 0 : viewMonth + 1;
    const ny = viewMonth === 11 ? viewYear + 1 : viewYear;
    fetchMonth(ny, nm);
  }, [fetchMonth, viewYear, viewMonth]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const canGoPrev = new Date(viewYear, viewMonth, 1) > new Date(today.getFullYear(), today.getMonth(), 1);

  // Build calendar grid
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth     = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  // Find cheapest available price this month for the legend
  const thisMonthPrices = Object.values(avail)
    .filter(d => d.date.startsWith(toYM(viewYear, viewMonth)) && d.tier !== 'sold_out' && d.seatsLeft > 0)
    .map(d => d.price);
  const cheapestPrice = thisMonthPrices.length ? Math.min(...thisMonthPrices) : null;

  return (
    <div className="border border-primary/10 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary text-cream">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="text-center">
          <p className="font-semibold text-sm">{MONTHS[viewMonth]} {viewYear}</p>
          {cheapestPrice && (
            <p className="text-[10px] text-cream/70 flex items-center justify-center gap-1 mt-0.5">
              <TrendingDown className="w-3 h-3" />
              From ₹{cheapestPrice.toLocaleString('en-IN')} this month
            </p>
          )}
        </div>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 border-b border-primary/8">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-primary/40 uppercase tracking-wider py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={`grid grid-cols-7 gap-px bg-primary/5 ${loading ? 'opacity-60' : ''}`}>
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="bg-white min-h-[56px]" />;

          const dateStr = `${toYM(viewYear, viewMonth)}-${String(day).padStart(2, '0')}`;
          const info    = avail[dateStr];
          const isSelected = dateStr === selectedDate;
          const isSoldOut  = !info || info.tier === 'sold_out' || info.seatsLeft === 0;
          const isUrgent   = info && info.seatsLeft > 0 && info.seatsLeft <= 3;

          if (isSelected) {
            return (
              <button key={dateStr} className="bg-primary text-cream min-h-[56px] flex flex-col items-center justify-center p-1 gap-0.5">
                <span className="text-sm font-bold">{day}</span>
                {info && <span className="text-[10px] font-semibold">₹{(info.price / 1000).toFixed(0)}k</span>}
              </button>
            );
          }

          if (isSoldOut) {
            return (
              <div key={dateStr} className="bg-white min-h-[56px] flex flex-col items-center justify-center p-1 gap-0.5 cursor-not-allowed">
                <span className="text-sm text-gray-300 line-through">{day}</span>
                <span className="text-[9px] text-gray-300">Full</span>
              </div>
            );
          }

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr, info.price)}
              className={`min-h-[56px] flex flex-col items-center justify-center p-1 gap-0.5 border transition-all relative ${TIER_STYLES[info?.tier ?? 'normal']}`}
            >
              <span className="text-sm font-semibold">{day}</span>
              <span className="text-[10px] font-medium">
                ₹{(info.price / 1000).toFixed(info.price >= 10000 ? 0 : 1)}k
              </span>
              {isUrgent && (
                <span className="text-[9px] font-bold text-red-600 flex items-center gap-0.5">
                  <Flame className="w-2.5 h-2.5" />{info.seatsLeft} left
                </span>
              )}
              {info?.tier === 'cheap' && info.price === cheapestPrice && (
                <span className="absolute top-0.5 right-0.5 text-[8px] bg-emerald-500 text-white px-1 rounded font-bold">Low</span>
              )}
              {info?.tier === 'peak' && !isUrgent && (
                <span className="absolute top-0.5 right-0.5 text-[8px] bg-orange-500 text-white px-1 rounded font-bold">Peak</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-cream/50 border-t border-primary/8">
        <div className="flex items-center gap-3 text-[10px] text-primary/60">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-200 inline-block" />Cheapest</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-white border border-primary/20 inline-block" />Normal</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-200 inline-block" />Peak</span>
        </div>
        {selectedGuests > 1 && (
          <p className="text-[10px] text-primary/50 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />Price per person
          </p>
        )}
      </div>
    </div>
  );
}
