'use client';

import { useState, useEffect } from 'react';
import { MapPin, Play, Wallet, Upload, Search, Bell, Camera, Video, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const TripMemorySheet = dynamic(() => import('@/components/TripMemorySheet'), { ssr: false });

const GOLD = '#C9A96E';
const GOLD_LIGHT = '#E2C68F';

// ── Avatar colours ───────────────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  'linear-gradient(135deg,#C9A96E,#E2C68F)',
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#ec4899,#f43f5e)',
  'linear-gradient(135deg,#06b6d4,#3b82f6)',
  'linear-gradient(135deg,#10b981,#34d399)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#8b5cf6,#ec4899)',
  'linear-gradient(135deg,#14b8a6,#06b6d4)',
];
function avatarGrad(name: string) {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}
function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

// ── Sample data ──────────────────────────────────────────────────────────────
interface Post {
  id: string;
  name: string;
  trip: string;
  src: string;
  type: 'photo' | 'video';
  caption: string;
  cashback: number;
  timeAgo: string;
  isReal?: boolean;
}

const SAMPLE_POSTS: Post[] = [
  { id: 's1',  name: 'Arjun Mehta',    trip: 'Manali',       src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', type: 'photo',  caption: 'Woke up at 4am just to see this. Worth every shiver. 🏔️❄️', cashback: 500,  timeAgo: '2h' },
  { id: 's2',  name: 'Priya Sharma',   trip: 'Andaman',      src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=85', type: 'video',  caption: 'Crystal clear waters, vibrant coral, total bliss. 🐠🌊', cashback: 1000, timeAgo: '4h' },
  { id: 's3',  name: 'Rahul Kumar',    trip: 'Bali',         src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=85', type: 'photo',  caption: 'Tanah Lot at sunset — no filter needed. 🌅🇮🇩', cashback: 500,  timeAgo: '6h' },
  { id: 's4',  name: 'Sneha Patel',    trip: 'Leh Ladakh',   src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=85', type: 'video',  caption: 'Pangong Lake — the blue you see in movies, in real life. 🚗💙', cashback: 1000, timeAgo: '8h' },
  { id: 's5',  name: 'Vikram Tiwari',  trip: 'Spiti Valley', src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=85', type: 'photo',  caption: 'Key Monastery at golden hour. No words. ⛪✨', cashback: 500,  timeAgo: '12h' },
  { id: 's6',  name: 'Anjali Reddy',   trip: 'Dubai',        src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=85', type: 'photo',  caption: 'From the top of the world. Burj Khalifa at night hits different. 🌃', cashback: 500,  timeAgo: '1d' },
  { id: 's7',  name: 'Dev Chopra',     trip: 'Kedarnath',    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=85', type: 'video',  caption: 'The 16km trek. Hardest. Most rewarding. Har Har Mahadev 🙏', cashback: 1000, timeAgo: '1d' },
  { id: 's8',  name: 'Meera Lal',      trip: 'Thailand',     src: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=85', type: 'photo',  caption: 'Phi Phi islands literally look like a screensaver. 🌴😍', cashback: 500,  timeAgo: '2d' },
  { id: 's9',  name: 'Karthik Nair',   trip: 'Goa',          src: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=85', type: 'photo',  caption: 'Sunset + chai + nowhere to be. Living. ☕🌅', cashback: 500,  timeAgo: '2d' },
  { id: 's10', name: 'Divya Rajan',    trip: 'Rishikesh',    src: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&q=85', type: 'video',  caption: 'Class 4 rapids, zero control, 100% fun. 🚣💦', cashback: 1000, timeAgo: '3d' },
  { id: 's11', name: 'Aditya Bose',    trip: 'Kashmir',      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=85', type: 'photo',  caption: 'Dal Lake shikara at sunrise. Paradise is real. 🛶🌸', cashback: 500,  timeAgo: '3d' },
  { id: 's12', name: 'Kavita Mishra',  trip: 'Santorini',    src: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=85', type: 'photo',  caption: 'Blue domes and white walls — Greece delivered. 🇬🇷🌊', cashback: 500,  timeAgo: '4d' },
  { id: 's13', name: 'Rohan Verma',    trip: 'Rajasthan',    src: 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=85', type: 'video',  caption: 'Camel safari at dusk. This is Rajasthan in one frame. 🐪🔥', cashback: 1000, timeAgo: '4d' },
  { id: 's14', name: 'Nisha Gupta',    trip: 'Paris',        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=85', type: 'photo',  caption: 'Golden hour under the iron lady. Oui, it was magical. 🗼💛', cashback: 500,  timeAgo: '5d' },
  { id: 's15', name: 'Saurabh Jain',   trip: 'Maldives',     src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85', type: 'photo',  caption: 'Woke up to this every morning for 5 days. Still not over it. 🌊🌞', cashback: 500,  timeAgo: '5d' },
  { id: 's16', name: 'Tanvi Singh',    trip: 'Himachal',     src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85', type: 'video',  caption: 'Triund camping. Stars above, valleys below. Life is good. 🏕️⭐', cashback: 1000, timeAgo: '6d' },
  { id: 's17', name: 'Mohit Aggarwal', trip: 'Singapore',    src: 'https://images.unsplash.com/photo-1512036666432-2181c1f26420?w=800&q=85', type: 'photo',  caption: 'Gardens by the Bay — nature meets the future. 🌿🏙️', cashback: 500,  timeAgo: '1w' },
  { id: 's18', name: 'Pooja Dubey',    trip: 'Varanasi',     src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=85', type: 'photo',  caption: 'Ganga Aarti at dawn. Spiritual and surreal. 🪔🕊️', cashback: 500,  timeAgo: '1w' },
];

// Trip Reels data (stories-like circles)
const TRIP_REELS = [
  { name: 'Manali',     src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80', hasNew: true },
  { name: 'Bali',       src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=200&q=80', hasNew: true },
  { name: 'Leh',        src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&q=80', hasNew: true },
  { name: 'Goa',        src: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&q=80', hasNew: false },
  { name: 'Kedarnath',  src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&q=80', hasNew: true },
  { name: 'Dubai',      src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=200&q=80', hasNew: false },
  { name: 'Kashmir',    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80', hasNew: false },
  { name: 'Thailand',   src: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=200&q=80', hasNew: true },
  { name: 'Maldives',   src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80', hasNew: false },
  { name: 'Rishikesh',  src: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=200&q=80', hasNew: false },
];

// ── Feed Post Card ────────────────────────────────────────────────────────────
function FeedPost({ post }: { post: Post }) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const isRealVideo = post.isReal && post.type === 'video';

  return (
    <article className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>

      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-black shrink-0"
            style={{ background: avatarGrad(post.name), boxShadow: `0 0 0 2px #0a0a0f, 0 0 0 3.5px ${GOLD}` }}
          >
            {initials(post.name)}
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">{post.name}</p>
            <div className="flex items-center gap-1">
              <MapPin size={10} style={{ color: GOLD }} />
              <span className="text-[11px] font-medium" style={{ color: GOLD }}>{post.trip}</span>
            </div>
          </div>
        </div>

        {/* Cashback badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}>
          <Wallet size={11} style={{ color: GOLD }} />
          <span className="text-[11px] font-black" style={{ color: GOLD }}>₹{post.cashback} earned</span>
        </div>
      </div>

      {/* Media */}
      <div className="relative w-full bg-black" style={{ aspectRatio: '4/5' }}>
        {!mediaLoaded && (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
        )}

        {/* Real video from GCS → use <video> */}
        {isRealVideo ? (
          <video
            src={post.src}
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
            onLoadedMetadata={() => setMediaLoaded(true)}
          />
        ) : (
          <img
            src={post.src}
            alt={post.caption}
            className="w-full h-full object-cover"
            onLoad={() => setMediaLoaded(true)}
            loading="lazy"
          />
        )}

        {/* Sample video overlay — decorative play button */}
        {post.type === 'video' && !isRealVideo && (
          <>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(0,0,0,0.15)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center pointer-events-none" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '2px solid rgba(255,255,255,0.3)' }}>
              <Play size={24} className="text-white ml-1" />
            </div>
          </>
        )}

        {/* Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full pointer-events-none" style={{ background: post.type === 'video' ? 'rgba(99,102,241,0.85)' : 'rgba(201,169,110,0.85)', backdropFilter: 'blur(8px)' }}>
          {post.type === 'video'
            ? <><Video size={10} className="text-white" /><span className="text-[9px] font-bold text-white">REEL</span></>
            : <><Camera size={10} className="text-black" /><span className="text-[9px] font-bold text-black">SNAP</span></>
          }
        </div>
      </div>

      {/* Post footer */}
      <div className="px-4 pt-3 pb-4">
        {/* Action row */}
        <div className="flex items-center justify-between mb-2">
          {/* Wanderlust (like) — only feedback visible to the person who tapped */}
          <button onClick={() => setSaved(!saved)} className="flex items-center gap-1.5 transition-all active:scale-90">
            <svg width="22" height="22" viewBox="0 0 24 24" fill={saved ? GOLD : 'none'} stroke={saved ? GOLD : 'rgba(255,255,255,0.4)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 3.5a5 5 0 0 1 0 7L12 17l-5.5-6a5 5 0 0 1 7-7l-1.5 1.5 1.5-1.5a5 5 0 0 1 5.5 6z" />
            </svg>
            {saved && <span className="text-xs font-bold" style={{ color: GOLD }}>Loved it!</span>}
          </button>
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>{post.timeAgo} ago</span>
        </div>

        {/* Caption */}
        <p className="text-white/80 text-sm leading-relaxed">
          <span className="font-bold text-white">{post.name.split(' ')[0]} </span>
          {post.caption}
        </p>
      </div>
    </article>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ShareAndEarnPage() {
  const [uploadOpen, setUploadOpen]   = useState(false);
  const [posts, setPosts]             = useState<Post[]>([]);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQ, setSearchQ]         = useState('');

  // Fetch real posts and merge with samples
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/trip-memories/gallery?limit=50');
        if (!res.ok) throw new Error('');
        const json = await res.json() as { data: { ref: string; name: string; tripName: string; mediaType: 'photo' | 'video'; fileUrl: string | null; createdAt: string }[] };
        const real: Post[] = (json.data || []).filter(d => d.fileUrl).map(d => ({
          id: String(d.ref),
          name: d.name,
          trip: String(d.tripName),
          src: d.fileUrl!,
          type: d.mediaType,
          caption: `Just got back from ${d.tripName} — absolutely loved it! 🌟`,
          cashback: d.mediaType === 'video' ? 1000 : 500,
          timeAgo: 'just now',
          isReal: true,
        }));
        setPosts([...real, ...SAMPLE_POSTS]);
      } catch {
        setPosts(SAMPLE_POSTS);
      }
    })();
  }, []);

  const displayed = searchQ
    ? posts.filter(p => p.trip.toLowerCase().includes(searchQ.toLowerCase()) || p.name.toLowerCase().includes(searchQ.toLowerCase()))
    : posts;

  return (
    <div className="min-h-screen pb-28" style={{ background: '#0a0a0f' }}>

      {/* ── Top Bar ── */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(8,8,12,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,169,110,0.12)' }}
      >
        <div>
          <h1 className="font-black text-xl tracking-tight leading-none" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            YLOO Reels
          </h1>
          <p className="text-[9px] font-bold uppercase tracking-[0.15em] mt-0.5" style={{ color: 'rgba(201,169,110,0.4)' }}>Share & Earn Money</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Search size={16} className="text-white/50" />
          </button>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center relative transition-all active:scale-90"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <Bell size={16} className="text-white/50" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: GOLD }} />
          </button>
          <button
            onClick={() => setUploadOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}
          >
            <Upload size={15} className="text-black" />
          </button>
        </div>
      </header>

      {/* ── Search Bar ── */}
      {searchOpen && (
        <div className="px-4 py-2" style={{ background: 'rgba(8,8,12,0.97)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <input
            autoFocus
            type="text"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search destinations or travellers..."
            className="w-full px-4 py-2.5 rounded-xl text-white placeholder-white/20 text-sm focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,169,110,0.2)' }}
          />
        </div>
      )}

      {/* ── Earn Banner ── */}
      <div className="mx-4 mt-3 mb-1 rounded-2xl overflow-hidden">
        <button
          onClick={() => setUploadOpen(true)}
          className="w-full flex items-center justify-between px-4 py-3.5 transition-all active:scale-[0.99]"
          style={{ background: `linear-gradient(135deg, rgba(201,169,110,0.18), rgba(201,169,110,0.08))`, border: '1px solid rgba(201,169,110,0.3)' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.15)' }}>
                <Camera size={15} style={{ color: GOLD }} />
              </div>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.15)' }}>
                <Video size={15} style={{ color: '#818cf8' }} />
              </div>
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xs">Share Your Trip Memory</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(201,169,110,0.7)' }}>
                📸 ₹500 cashback · 🎬 ₹1,000 cashback
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black text-black" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})` }}>
            Earn Now <ChevronRight size={12} />
          </div>
        </button>
      </div>

      {/* Divider */}
      <div className="mt-3" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* ── Feed ── */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center animate-pulse" style={{ background: 'rgba(201,169,110,0.1)' }}>
            <Camera size={24} style={{ color: GOLD }} />
          </div>
          <p className="text-white/30 text-sm">Loading memories...</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-2">
          <p className="text-white/30 text-sm">No results for &quot;{searchQ}&quot;</p>
        </div>
      ) : (
        displayed.map(post => (
          <FeedPost key={post.id} post={post} />
        ))
      )}

      {/* ── Sticky Bottom Upload Bar ── */}
      <div
        className="fixed bottom-[64px] left-0 right-0 px-4 py-3 z-30"
        style={{ background: 'rgba(8,8,12,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(201,169,110,0.12)' }}
      >
        <button
          onClick={() => setUploadOpen(true)}
          className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-black text-black text-sm transition-all active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, boxShadow: `0 4px 20px rgba(201,169,110,0.35)` }}
        >
          <Camera size={18} />
          Share & Earn Money
          <span className="ml-0.5 px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: 'rgba(0,0,0,0.2)' }}>+₹500</span>
        </button>
      </div>

      {/* ── Earned total strip ── */}
      <div className="text-center py-4">
        <p className="text-white/15 text-[11px]">₹15,00,000+ cashback earned by YlooTrips travellers · Join the community</p>
      </div>

      {uploadOpen && (
        <TripMemorySheet onClose={() => setUploadOpen(false)} />
      )}
    </div>
  );
}
