'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, MapPin, Clock, Lightbulb, Star, ChevronDown, ChevronUp, Loader2, Sparkles, Calendar, Wallet, Package } from 'lucide-react';

interface Activity {
  time: string;
  activity: string;
  details: string;
  tip?: string;
}

interface Day {
  day: number;
  title: string;
  theme: string;
  activities: Activity[];
}

interface Itinerary {
  destination: string;
  duration: string;
  travelStyle: string;
  estimatedBudget: string;
  highlights: string[];
  days: Day[];
  packingTips: string[];
  bestTimeToVisit: string;
  localInsights: string;
}

const SUGGESTIONS = [
  "Plan a 5-day trip to Manali for 2 people on a budget of ₹25,000",
  "7-day Kerala backwaters and beaches trip, luxury style",
  "3-day Jaipur heritage tour for a family with kids",
  "Ladakh road trip, 10 days, adventure style, ₹50,000 budget",
  "5-day Coorg coffee trail, couple, mid-range budget",
];

const TIME_COLORS: Record<string, string> = {
  Morning: 'bg-amber-50 text-amber-700 border-amber-200',
  Afternoon: 'bg-orange-50 text-orange-700 border-orange-200',
  Evening: 'bg-purple-50 text-purple-700 border-purple-200',
  Night: 'bg-slate-50 text-slate-700 border-slate-200',
};

function DayCard({ day, index }: { day: Day; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <div className="border border-cream-dark rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cream-light transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-warm flex items-center justify-center text-white text-sm font-bold">
            {day.day}
          </span>
          <div>
            <p className="font-semibold text-primary text-sm sm:text-base">{day.title}</p>
            <p className="text-xs text-secondary mt-0.5">{day.theme}</p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-secondary flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-secondary flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-cream-dark">
          {day.activities.map((act, i) => (
            <div key={i} className="pt-4">
              <span
                className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border mb-2 ${
                  TIME_COLORS[act.time] || 'bg-cream text-secondary border-cream-dark'
                }`}
              >
                {act.time}
              </span>
              <p className="font-medium text-primary text-sm mb-1">{act.activity}</p>
              <p className="text-sm text-secondary leading-relaxed">{act.details}</p>
              {act.tip && (
                <div className="flex items-start gap-2 mt-2 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">{act.tip}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ItineraryDisplay({ itinerary, onBookNow }: { itinerary: Itinerary; onBookNow: () => void }) {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Trip Overview */}
      <div className="bg-primary rounded-2xl p-5 sm:p-6 text-cream">
        <div className="flex items-start gap-3 mb-4">
          <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-semibold leading-tight">{itinerary.destination}</h2>
            <p className="text-cream-dark text-sm mt-0.5">{itinerary.travelStyle} Travel</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-primary-light rounded-xl px-4 py-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-cream-dark">Duration</p>
              <p className="text-sm font-medium text-cream">{itinerary.duration}</p>
            </div>
          </div>
          <div className="bg-primary-light rounded-xl px-4 py-3 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-cream-dark">Budget</p>
              <p className="text-sm font-medium text-cream">{itinerary.estimatedBudget}</p>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-primary-light rounded-xl px-4 py-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent flex-shrink-0" />
            <div>
              <p className="text-xs text-cream-dark">Best Time</p>
              <p className="text-sm font-medium text-cream">{itinerary.bestTimeToVisit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {itinerary.highlights?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-primary text-sm">Trip Highlights</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {itinerary.highlights.map((h, i) => (
              <span key={i} className="bg-cream border border-cream-dark text-secondary text-xs px-3 py-1.5 rounded-full">
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Day-by-Day */}
      <div>
        <h3 className="font-semibold text-primary mb-3 text-sm">Day-by-Day Itinerary</h3>
        <div className="space-y-3">
          {itinerary.days.map((day, i) => (
            <DayCard key={i} day={day} index={i} />
          ))}
        </div>
      </div>

      {/* Local Insight */}
      {itinerary.localInsights && (
        <div className="bg-sage/10 border border-sage/20 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-sage-dark flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-sage-dark mb-1">Local Insight from Yloo</p>
              <p className="text-sm text-primary/80 leading-relaxed">{itinerary.localInsights}</p>
            </div>
          </div>
        </div>
      )}

      {/* Packing Tips */}
      {itinerary.packingTips?.length > 0 && (
        <div className="bg-cream rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Package className="w-4 h-4 text-secondary" />
            <h3 className="font-semibold text-primary text-sm">What to Pack</h3>
          </div>
          <ul className="space-y-1.5">
            {itinerary.packingTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-secondary">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Book CTA */}
      <div className="bg-gradient-warm rounded-2xl p-5 sm:p-6 text-center">
        <h3 className="font-display text-lg sm:text-xl font-semibold text-white mb-1">Love this itinerary?</h3>
        <p className="text-white/80 text-sm mb-4">Our experts will personalise it further and handle all bookings for you.</p>
        <button
          onClick={onBookNow}
          className="w-full sm:w-auto bg-white text-primary font-semibold text-sm px-8 py-3 rounded-xl hover:bg-cream transition-colors shadow-sm"
        >
          Book This Trip →
        </button>
        <p className="text-white/60 text-xs mt-3">Free consultation · No hidden charges</p>
      </div>
    </div>
  );
}

export default function TripPlannerChat() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    }
  };

  useEffect(() => {
    if (itinerary && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [itinerary]);

  // Auto-submit if ?q= param is passed from homepage
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setInput(q);
      handleSubmit(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (query?: string) => {
    const message = (query || input).trim();
    if (!message || loading) return;

    setInput('');
    setLoading(true);
    setError(null);
    setItinerary(null);
    setHasSearched(true);

    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const res = await fetch('/api/trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setItinerary(data.itinerary);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    window.open('https://wa.me/918427831127?text=Hi!%20I%20got%20an%20itinerary%20from%20your%20AI%20planner%20and%20would%20like%20to%20book%20this%20trip.', '_blank');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Hero Header */}
      <div className="bg-primary pt-16 pb-10 px-4 text-center">
        <div className="inline-flex items-center gap-1.5 bg-accent/20 border border-accent/30 text-accent text-xs font-medium px-3 py-1.5 rounded-full mb-4">
          <Sparkles className="w-3 h-3" />
          AI-Powered Planner
        </div>
        <h1 className="font-display text-display-lg text-cream mb-3">Plan Your Perfect Indian Trip</h1>
        <p className="text-cream-dark text-sm sm:text-base max-w-md mx-auto">
          Tell Yloo where you want to go, your budget, and travel style — get a personalised day-by-day itinerary in seconds.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-5">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-cream-dark p-4 sm:p-5">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => { setInput(e.target.value); autoResize(); }}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Plan a 5-day trip to Goa for 2 people, beach lover, budget ₹30,000..."
            rows={2}
            className="w-full resize-none text-sm md:text-sm text-primary placeholder-secondary/50 bg-transparent outline-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-dark">
            <p className="text-xs text-secondary/60 hidden sm:block">Press Enter to generate · Shift+Enter for new line</p>
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || loading}
              className="ml-auto flex items-center gap-2 bg-primary text-cream text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-primary-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Planning...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Plan My Trip
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestions */}
        {!hasSearched && (
          <div className="mt-5">
            <p className="text-xs text-secondary font-medium mb-2.5 px-1">Try a quick example:</p>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(s)}
                  className="text-left text-sm text-primary bg-white border border-cream-dark rounded-xl px-4 py-3 hover:border-accent hover:bg-cream transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="mt-8 text-center py-12">
            <div className="inline-flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-warm flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white animate-pulse" />
              </div>
              <p className="text-primary font-medium text-sm">Yloo is crafting your itinerary…</p>
              <p className="text-secondary text-xs">This usually takes 10–15 seconds</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-500 mt-2 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Itinerary Result */}
        {itinerary && (
          <div ref={resultRef} className="mt-6 pb-12">
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-xs text-secondary">Your personalised itinerary is ready</p>
              <button
                onClick={() => { setItinerary(null); setHasSearched(false); }}
                className="text-xs text-accent hover:underline"
              >
                Plan another trip
              </button>
            </div>
            <ItineraryDisplay itinerary={itinerary} onBookNow={handleBookNow} />
          </div>
        )}
      </div>
    </div>
  );
}
