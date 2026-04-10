'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Search, PenLine, TrendingUp, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import TravelStoryCard, { type StoryMeta } from './TravelStoryCard';

const SORT_OPTIONS = [
  { label: 'Latest', value: 'latest', icon: Clock },
  { label: 'Most Liked', value: 'likes', icon: TrendingUp },
];

const DESTINATIONS = [
  'All', 'Manali', 'Goa', 'Kerala', 'Rajasthan', 'Ladakh', 'Himachal',
  'Uttarakhand', 'Meghalaya', 'Spiti', 'Andaman',
];

export default function StoryFeed() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<StoryMeta[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sort, setSort] = useState('latest');
  const [destination, setDestination] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchStories = useCallback(
    async (pg: number, append = false) => {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const dest = destination === 'All' ? '' : destination;
      const params = new URLSearchParams({ sort, page: String(pg), limit: '9' });
      if (dest) params.set('destination', dest);

      const res = await fetch(`/api/stories?${params}`);
      if (res.ok) {
        const data = await res.json();
        setStories((prev) => (append ? [...prev, ...data.stories] : data.stories));
        setTotal(data.total);
        setPages(data.pages);
        setPage(pg);
      }

      setLoading(false);
      setLoadingMore(false);
    },
    [sort, destination]
  );

  useEffect(() => {
    fetchStories(1);
  }, [fetchStories]);

  const filtered = search
    ? stories.filter(
        (s) =>
          s.title.toLowerCase().includes(search.toLowerCase()) ||
          s.destination.toLowerCase().includes(search.toLowerCase())
      )
    : stories;

  return (
    <div className="min-h-screen bg-cream-light">
      {/* Hero */}
      <section className="relative bg-primary text-white py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #d4a853 0%, transparent 60%), radial-gradient(circle at 70% 20%, #8fbc8f 0%, transparent 50%)' }}
        />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-3">Community</p>
          <h1 className="font-display text-4xl md:text-5xl mb-4 leading-tight">
            Travel Stories by Real Travellers
          </h1>
          <p className="text-white/70 text-base mb-8 max-w-xl mx-auto">
            Authentic travelogues from people who've been there. Read, get inspired, and share your own.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {session ? (
              <Link
                href="/stories/write"
                className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
              >
                <PenLine size={16} />
                Write Your Story
              </Link>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
              >
                <PenLine size={16} />
                Sign in to Write
              </button>
            )}
            <span className="inline-flex items-center text-white/60 text-sm">
              {total} stories shared
            </span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-sand/50 py-3 px-4" style={{ paddingTop: 'max(12px, env(safe-area-inset-top))' }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex items-center gap-2 bg-cream-light rounded-full px-4 py-2 flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="text-secondary/60" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories..."
              className="bg-transparent text-sm text-primary placeholder:text-secondary/50 outline-none flex-1"
            />
          </div>

          {/* Sort */}
          <div className="flex gap-1.5">
            {SORT_OPTIONS.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSort(value)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2.5 rounded-full transition-colors ${
                  sort === value
                    ? 'bg-primary text-white'
                    : 'bg-cream-light text-secondary hover:bg-sand/60'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Destination filter */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {DESTINATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setDestination(d === 'All' ? '' : d)}
                className={`flex items-center gap-1 text-xs whitespace-nowrap font-medium px-3 py-2.5 rounded-full transition-colors ${
                  (d === 'All' && !destination) || destination === d
                    ? 'bg-accent text-primary'
                    : 'bg-cream-light text-secondary hover:bg-sand/60'
                }`}
              >
                {d !== 'All' && <MapPin size={10} />}
                {d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-sand/60" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-sand/60 rounded w-1/3" />
                  <div className="h-5 bg-sand/60 rounded w-5/6" />
                  <div className="h-3 bg-sand/60 rounded w-full" />
                  <div className="h-3 bg-sand/60 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">✍️</p>
            <p className="font-display text-2xl text-primary mb-2">No stories yet</p>
            <p className="text-secondary text-sm mb-6">Be the first to share your adventure!</p>
            {session ? (
              <Link
                href="/stories/write"
                className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
              >
                <PenLine size={16} />
                Write First Story
              </Link>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
              >
                Sign in &amp; Write
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((story) => (
                <TravelStoryCard key={story._id} story={story} />
              ))}
            </div>

            {/* Load more */}
            {page < pages && (
              <div className="text-center mt-10">
                <button
                  onClick={() => fetchStories(page + 1, true)}
                  disabled={loadingMore}
                  className="bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {loadingMore ? 'Loading…' : 'Load more stories'}
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
