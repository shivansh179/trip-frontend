'use client';

import { useState, useEffect } from 'react';
import { MapPin, Play, Upload, Search, Camera, Video } from 'lucide-react';
import dynamic from 'next/dynamic';

const TripMemorySheet = dynamic(() => import('@/components/TripMemorySheet'), { ssr: false });

const GOLD  = '#C9A96E';
const GOLD2 = '#E2C68F';
const BG    = '#07070b';

// ── Avatar — monogram on dark gold ───────────────────────────────────────────
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
  { id: 's1',  name: 'Arjun M.',   trip: 'Manali',       src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85', type: 'photo',  caption: 'bhai 4 baje uthke yahan aaya tha 😭 bilkul worth it tha\n#manali #mountains #ylootrips', cashback: 500,  timeAgo: '7m' },
  { id: 's2',  name: 'Priya S.',   trip: 'Andaman',      src: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=85', type: 'video',  caption: 'andaman ka pani dekh ke aankhe khul gayi 😍🐠 ek baar zaroor aao\n#andaman #scuba #travel', cashback: 1000, timeAgo: '23m' },
  { id: 's3',  name: 'Rahul K.',   trip: 'Bali',         src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=85', type: 'photo',  caption: 'Tanah Lot 🌅 no filter, no edits. bali you are unreal\n#bali #Indonesia', cashback: 500,  timeAgo: '1h' },
  { id: 's4',  name: 'Sneha P.',   trip: 'Leh Ladakh',   src: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=85', type: 'video',  caption: 'Pangong lake is EXACTLY like the movies omg 💙🚗 drove 5 hours to see this', cashback: 1000, timeAgo: '2h' },
  { id: 's5',  name: 'Vikram T.',  trip: 'Spiti Valley', src: 'https://images.unsplash.com/photo-1558618047-f4cf4d63f7bf?w=800&q=85', type: 'photo',  caption: 'Key monastery golden hour ⛪ spiti is literally on another planet\n#spiti #himachal', cashback: 500,  timeAgo: '3h' },
  { id: 's6',  name: 'Anjali R.',  trip: 'Dubai',        src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=85', type: 'photo',  caption: 'burj khalifa raat ko alag hi vibe deta hai ngl 🌃✨', cashback: 500,  timeAgo: '5h' },
  { id: 's7',  name: 'Dev C.',     trip: 'Kedarnath',    src: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=85', type: 'video',  caption: '16km trek. pair dard kar rahe the. aankhon mein paani tha. puri life badal gayi 🙏\nHar Har Mahadev', cashback: 1000, timeAgo: '6h' },
  { id: 's8',  name: 'Meera L.',   trip: 'Thailand',     src: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=85', type: 'photo',  caption: 'phi phi islands ko screensaver mat samjho yaar, yahan sach mein aao 🌴\n#thailand #phiphi', cashback: 500,  timeAgo: '9h' },
  { id: 's9',  name: 'Karthik N.', trip: 'Goa',          src: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=85', type: 'photo',  caption: 'sunset + chai + kuch kaam nahi ☕🌅 yahi toh zindagi hai\n#goa #beachlife', cashback: 500,  timeAgo: '11h' },
  { id: 's10', name: 'Divya R.',   trip: 'Rishikesh',    src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=85', type: 'video',  caption: 'class 4 rapids mein ghus gayi 🚣 zero control 100% maza\n#rishikesh #rafting #adventure', cashback: 1000, timeAgo: '14h' },
  { id: 's11', name: 'Aditya B.',  trip: 'Kashmir',      src: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=85', type: 'photo',  caption: 'dal lake shikara at 6am 🛶🌸 kashmir is heaven and thats not debatable', cashback: 500,  timeAgo: '1d' },
  { id: 's12', name: 'Kavita M.',  trip: 'Santorini',    src: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=85', type: 'photo',  caption: 'greece ticked ✅ bucket list 5 items baki hai 😂🇬🇷\n#santorini #greece #europe', cashback: 500,  timeAgo: '1d' },
  { id: 's13', name: 'Rohan V.',   trip: 'Rajasthan',    src: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=85', type: 'video',  caption: 'camel safari at sunset 🐪🔥 rajasthan mein dil laga gaya yaar', cashback: 1000, timeAgo: '2d' },
  { id: 's14', name: 'Nisha G.',   trip: 'Paris',        src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=85', type: 'photo',  caption: 'paris golden hour 🗼💛 uss ladke ne propose kiya yahaan. maine haan bol diya 😭💍', cashback: 500,  timeAgo: '2d' },
  { id: 's15', name: 'Saurabh J.', trip: 'Maldives',     src: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=85', type: 'photo',  caption: '5 din yahan raha 🌊🌞 ghar wapas aana nahi tha honestly\n#maldives #overwater', cashback: 500,  timeAgo: '3d' },
  { id: 's16', name: 'Tanvi S.',   trip: 'Himachal',     src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85', type: 'video',  caption: 'triund camping ⛺ upar tare the neeche ghati thi aur phone off tha. perfect.\n#triund #camping', cashback: 1000, timeAgo: '4d' },
  { id: 's17', name: 'Mohit A.',   trip: 'Singapore',    src: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=85', type: 'photo',  caption: 'gardens by the bay 🌿🏙️ singapore ne impress kar diya yaar\n#singapore #travel', cashback: 500,  timeAgo: '5d' },
  { id: 's18', name: 'Pooja D.',   trip: 'Varanasi',     src: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=85', type: 'photo',  caption: 'ganga aarti at dawn 🪔 kuch cheezein describe nahi hoti, bas anubhav karo\n#varanasi #banaras', cashback: 500,  timeAgo: '6d' },
];

const FILTERS = ['All', 'Trending', 'Beach', 'Mountains', 'City', 'International'];

// ── Feed Post Card ────────────────────────────────────────────────────────────
function FeedPost({ post }: { post: Post }) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const isRealVideo = post.isReal && post.type === 'video';

  return (
    <article style={{ background: BG, borderBottom: '1px solid rgba(201,169,110,0.07)' }}>
      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-3">
          {/* Monogram avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 tracking-wide"
            style={{
              background: post.isReal
                ? `linear-gradient(135deg, ${GOLD}, ${GOLD2})`
                : 'rgba(201,169,110,0.12)',
              color: post.isReal ? '#000' : GOLD,
              border: `1px solid ${post.isReal ? 'transparent' : 'rgba(201,169,110,0.2)'}`,
            }}
          >
            {initials(post.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-semibold text-sm leading-tight tracking-wide">{post.name}</p>
              {post.isReal && (
                <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm" style={{ background: 'rgba(201,169,110,0.15)', color: GOLD, letterSpacing: '0.1em' }}>
                  VERIFIED
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={8} style={{ color: 'rgba(201,169,110,0.4)' }} />
              <span className="text-[10px] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{post.trip}</span>
            </div>
          </div>
        </div>
        {/* Cashback pill — understated */}
        <div className="text-right">
          <p className="text-[11px] font-black" style={{ color: GOLD }}>₹{post.cashback.toLocaleString('en-IN')}</p>
          <p className="text-[8px] uppercase tracking-widest" style={{ color: 'rgba(201,169,110,0.4)' }}>cashback</p>
        </div>
      </div>

      {/* Media */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/5', background: '#0a0a0e' }}>
        {!mediaLoaded && (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(180deg, rgba(201,169,110,0.04) 0%, rgba(0,0,0,0) 100%)' }} />
        )}
        {isRealVideo ? (
          <video src={post.src} className="w-full h-full object-cover" controls playsInline preload="metadata" onLoadedMetadata={() => setMediaLoaded(true)} />
        ) : (
          <img src={post.src} alt={post.caption} className="w-full h-full object-cover" onLoad={() => setMediaLoaded(true)} loading="lazy" />
        )}

        {/* Elegant vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(7,7,11,0.5) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: `linear-gradient(to top, ${BG} 0%, transparent 100%)` }} />

        {/* Type badge — top left, minimal */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-1 rounded-sm" style={{ background: 'rgba(7,7,11,0.75)', backdropFilter: 'blur(12px)', border: '1px solid rgba(201,169,110,0.2)' }}>
            {post.type === 'video'
              ? <><Video size={9} style={{ color: GOLD }} /><span className="text-[8px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Reel</span></>
              : <><Camera size={9} style={{ color: GOLD }} /><span className="text-[8px] font-black uppercase tracking-widest" style={{ color: GOLD }}>Photo</span></>
            }
          </div>
        </div>

        {/* Video play */}
        {post.type === 'video' && !isRealVideo && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(7,7,11,0.65)', backdropFilter: 'blur(16px)', border: `1px solid rgba(201,169,110,0.35)` }}>
              <Play size={20} style={{ color: GOLD, marginLeft: 2 }} fill={GOLD} />
            </div>
          </div>
        )}
      </div>

      {/* Post footer */}
      <div className="px-4 pt-3 pb-5">
        <div className="flex items-center justify-between mb-2.5">
          <button onClick={() => setLiked(l => !l)} className="flex items-center gap-2 transition-all active:scale-90">
            <svg width="20" height="20" viewBox="0 0 24 24" fill={liked ? GOLD : 'none'} stroke={liked ? GOLD : 'rgba(201,169,110,0.3)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.25s' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {liked && <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: GOLD }}>Loved</span>}
          </button>
          <span className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.15)' }}>{post.timeAgo} ago</span>
        </div>
        <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line" style={{ fontWeight: 300 }}>
          <span className="font-semibold text-white/90">{post.name.split(' ')[0]} </span>
          {post.caption.split('\n').map((line, i) =>
            line.startsWith('#') ? (
              <span key={i} style={{ color: 'rgba(201,169,110,0.55)', fontWeight: 400 }}>{'\n'}{line}</span>
            ) : i === 0 ? line : <span key={i}>{'\n'}{line}</span>
          )}
        </p>
      </div>
    </article>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ShareAndEarnPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [posts, setPosts]           = useState<Post[]>([]);
  const [searchQ, setSearchQ]       = useState('');
  const [filter, setFilter]         = useState('✨ All');
  const [liveCount, setLiveCount]   = useState(2847);

  // Animate live earners count
  useEffect(() => {
    const t = setInterval(() => setLiveCount(n => n + Math.floor(Math.random() * 3)), 4000);
    return () => clearInterval(t);
  }, []);

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

  const BEACH_TRIPS = ['Goa', 'Andaman', 'Maldives', 'Thailand'];
  const MOUNTAIN_TRIPS = ['Manali', 'Leh Ladakh', 'Spiti Valley', 'Kashmir', 'Kedarnath', 'Himachal', 'Rishikesh'];
  const CITY_TRIPS = ['Dubai', 'Singapore', 'Paris', 'Varanasi', 'Rajasthan'];

  const displayed = posts.filter(p => {
    const matchesSearch = !searchQ || p.trip.toLowerCase().includes(searchQ.toLowerCase()) || p.name.toLowerCase().includes(searchQ.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === '✨ All') return true;
    if (filter === '🔥 Trending') return posts.indexOf(p) < 5;
    if (filter === '🌊 Beach') return BEACH_TRIPS.some(t => p.trip.includes(t));
    if (filter === '⛰️ Mountains') return MOUNTAIN_TRIPS.some(t => p.trip.includes(t));
    if (filter === '🏙️ City') return CITY_TRIPS.some(t => p.trip.includes(t));
    if (filter === '🌴 International') return ['Bali', 'Thailand', 'Dubai', 'Maldives', 'Singapore', 'Paris', 'Santorini'].some(t => p.trip.includes(t));
    return true;
  });

  return (
    <div className="min-h-screen pb-32" style={{ background: BG }}>

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40" style={{ background: `rgba(7,7,11,0.96)`, backdropFilter: 'blur(30px)', borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h1 className="font-black text-xl tracking-[0.04em] leading-none" style={{ color: GOLD, letterSpacing: '0.06em' }}>
              YLOO REELS
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1 h-1 rounded-full" style={{ background: GOLD, opacity: 0.6 }} />
              <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(201,169,110,0.4)' }}>
                {liveCount.toLocaleString('en-IN')} earning today
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="search..."
                className="w-24 pl-7 pr-3 py-2 text-white placeholder-white/20 text-xs focus:outline-none"
                style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)', borderRadius: 2 }}
              />
              <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: 'rgba(201,169,110,0.4)' }} />
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 font-bold text-black text-xs transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, borderRadius: 2, letterSpacing: '0.08em' }}
            >
              <Upload size={11} />POST
            </button>
          </div>
        </div>

        {/* Filter pills — minimal horizontal line style */}
        <div className="flex gap-0 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none', borderTop: '1px solid rgba(201,169,110,0.07)' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="shrink-0 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all"
              style={filter === f
                ? { color: GOLD, borderBottom: `1px solid ${GOLD}` }
                : { color: 'rgba(255,255,255,0.25)', borderBottom: '1px solid transparent' }
              }
            >{f}</button>
          ))}
        </div>
      </header>

      {/* ── Luxury Earn Card ── */}
      <div className="mx-4 mt-4 mb-3">
        <button
          onClick={() => setUploadOpen(true)}
          className="relative w-full text-left active:scale-[0.995] transition-all overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0e0c09 0%, #111008 100%)', border: `1px solid rgba(201,169,110,0.3)`, borderRadius: 4 }}
        >
          {/* Corner accent lines */}
          <div className="absolute top-0 left-0 w-8 h-px" style={{ background: GOLD }} />
          <div className="absolute top-0 left-0 w-px h-8" style={{ background: GOLD }} />
          <div className="absolute bottom-0 right-0 w-8 h-px" style={{ background: GOLD }} />
          <div className="absolute bottom-0 right-0 w-px h-8" style={{ background: GOLD }} />

          <div className="p-5">
            <p className="text-[8px] font-black uppercase tracking-[0.3em] mb-3" style={{ color: 'rgba(201,169,110,0.5)' }}>Members Earn Daily</p>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-white text-lg font-light leading-tight" style={{ letterSpacing: '0.02em' }}>
                  Share your journey.<br />
                  <span className="font-black" style={{ color: GOLD }}>Earn up to ₹1,000</span>
                  <span className="font-light text-white"> instantly.</span>
                </p>
              </div>
              <div className="shrink-0 w-12 h-12 flex items-center justify-center" style={{ border: `1px solid rgba(201,169,110,0.4)`, borderRadius: 2 }}>
                <Camera size={20} style={{ color: GOLD }} />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div style={{ borderLeft: `2px solid rgba(201,169,110,0.3)`, paddingLeft: 10 }}>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(201,169,110,0.5)' }}>Photo</p>
                <p className="font-black text-sm" style={{ color: GOLD }}>₹500</p>
              </div>
              <div style={{ borderLeft: `2px solid rgba(201,169,110,0.3)`, paddingLeft: 10 }}>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(201,169,110,0.5)' }}>Reel</p>
                <p className="font-black text-sm" style={{ color: GOLD }}>₹1,000</p>
              </div>
              <div style={{ borderLeft: `2px solid rgba(201,169,110,0.3)`, paddingLeft: 10 }}>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(201,169,110,0.5)' }}>Daily Max</p>
                <p className="font-black text-sm" style={{ color: GOLD }}>₹5,000</p>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* ── Social proof — one liner ── */}
      <div className="flex items-center justify-center gap-3 mb-4 px-5">
        <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.1)' }} />
        <p className="text-[9px] uppercase tracking-[0.2em] shrink-0" style={{ color: 'rgba(201,169,110,0.35)' }}>₹1.5 Cr+ paid · 2,000+ travellers</p>
        <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.1)' }} />
      </div>

      {/* ── Feed ── */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 flex items-center justify-center animate-pulse" style={{ border: `1px solid rgba(201,169,110,0.2)` }}>
            <Camera size={20} style={{ color: 'rgba(201,169,110,0.4)' }} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.2)' }}>Loading memories</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-2">
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>No results for &quot;{searchQ}&quot;</p>
        </div>
      ) : (
        displayed.map(post => <FeedPost key={post.id} post={post} />)
      )}

      {/* ── Bottom CTA — luxury bar ── */}
      <div className="fixed bottom-[64px] left-0 right-0 z-30" style={{ background: `rgba(7,7,11,0.97)`, backdropFilter: 'blur(30px)', borderTop: '1px solid rgba(201,169,110,0.12)' }}>
        <div className="px-4 py-3">
          <button
            onClick={() => setUploadOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3.5 font-black text-black text-xs tracking-[0.12em] transition-all active:scale-[0.99]"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, borderRadius: 2, boxShadow: `0 4px 24px rgba(201,169,110,0.25)`, letterSpacing: '0.1em' }}
          >
            <Camera size={16} />
            POST YOUR TRIP · EARN CASHBACK
          </button>
        </div>
      </div>

      {uploadOpen && (
        <TripMemorySheet onClose={() => setUploadOpen(false)} />
      )}
    </div>
  );
}
