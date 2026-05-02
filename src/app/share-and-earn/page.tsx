'use client';

import { useState, useEffect } from 'react';
import { MapPin, Play, Wallet, Upload, Search, Camera, Video, Flame, Zap, Star } from 'lucide-react';
import dynamic from 'next/dynamic';

const TripMemorySheet = dynamic(() => import('@/components/TripMemorySheet'), { ssr: false });

const GOLD = '#C9A96E';
const GOLD_LIGHT = '#E2C68F';
const PURPLE = '#8b5cf6';
const PINK = '#ec4899';

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

const FILTERS = ['✨ All', '🔥 Trending', '🌊 Beach', '⛰️ Mountains', '🏙️ City', '🌴 International'];

// ── Feed Post Card ────────────────────────────────────────────────────────────
function FeedPost({ post, index }: { post: Post; index: number }) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const isRealVideo = post.isReal && post.type === 'video';
  const isTrending = index < 3;

  const handleLike = () => {
    setLiked(l => !l);
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
  };

  return (
    <article className="mb-1" style={{ background: '#0d0d14' }}>
      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
            style={{ background: avatarGrad(post.name), boxShadow: post.isReal ? `0 0 0 2px #0d0d14, 0 0 0 3.5px ${GOLD}` : `0 0 0 2px #0d0d14, 0 0 0 3px rgba(255,255,255,0.1)` }}
          >
            {initials(post.name)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-white font-bold text-sm leading-tight">{post.name}</p>
              {post.isReal && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(201,169,110,0.2)', color: GOLD }}>✓ verified</span>}
              {isTrending && !post.isReal && (
                <span className="flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                  <Flame size={8} />trending
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={9} style={{ color: 'rgba(201,169,110,0.5)' }} />
              <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{post.trip}</span>
            </div>
          </div>
        </div>
        {/* Cashback earned badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: post.type === 'video' ? 'rgba(139,92,246,0.15)' : 'rgba(201,169,110,0.12)', border: `1px solid ${post.type === 'video' ? 'rgba(139,92,246,0.3)' : 'rgba(201,169,110,0.25)'}` }}>
          <Zap size={10} style={{ color: post.type === 'video' ? PURPLE : GOLD }} />
          <span className="text-[10px] font-black" style={{ color: post.type === 'video' ? PURPLE : GOLD }}>₹{post.cashback} earned</span>
        </div>
      </div>

      {/* Media — full bleed with gradient overlay */}
      <div className="relative w-full bg-black overflow-hidden" style={{ aspectRatio: '4/5' }}>
        {!mediaLoaded && (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.05), rgba(139,92,246,0.05))' }}>
            <div className="absolute inset-0 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
          </div>
        )}

        {isRealVideo ? (
          <video src={post.src} className="w-full h-full object-cover" controls playsInline preload="metadata" onLoadedMetadata={() => setMediaLoaded(true)} />
        ) : (
          <img src={post.src} alt={post.caption} className="w-full h-full object-cover" onLoad={() => setMediaLoaded(true)} loading="lazy" />
        )}

        {/* Gradient overlay bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(13,13,20,0.9) 0%, transparent 100%)' }} />

        {/* Top-right badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: post.type === 'video' ? 'rgba(139,92,246,0.9)' : 'rgba(201,169,110,0.9)', backdropFilter: 'blur(8px)' }}>
            {post.type === 'video'
              ? <><Video size={10} className="text-white" /><span className="text-[9px] font-black text-white">REEL</span></>
              : <><Camera size={10} className="text-black" /><span className="text-[9px] font-black text-black">SNAP</span></>
            }
          </div>
        </div>

        {/* Sample video play overlay */}
        {post.type === 'video' && !isRealVideo && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', border: '2px solid rgba(255,255,255,0.25)' }}>
              <Play size={24} className="text-white ml-1" fill="white" />
            </div>
          </div>
        )}

        {/* Like animation overlay */}
        {likeAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 5 }}>
            <div className="animate-ping">
              <svg width="80" height="80" viewBox="0 0 24 24" fill={GOLD} style={{ opacity: 0.8 }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Post footer */}
      <div className="px-4 pt-2.5 pb-4">
        <div className="flex items-center justify-between mb-2">
          <button onDoubleClick={handleLike} onClick={handleLike} className="flex items-center gap-2 transition-all active:scale-90">
            <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? '#f43f5e' : 'none'} stroke={liked ? '#f43f5e' : 'rgba(255,255,255,0.35)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'all 0.2s', transform: liked ? 'scale(1.2)' : 'scale(1)' }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {liked && <span className="text-xs font-bold" style={{ color: '#f43f5e' }}>❤️</span>}
          </button>
          <span className="text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.2)' }}>{post.timeAgo} ago</span>
        </div>

        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
          <span className="font-bold text-white">{post.name.split(' ')[0]} </span>
          {post.caption.split('\n').map((line, i) =>
            line.startsWith('#') ? (
              <span key={i} className="font-semibold" style={{ color: PURPLE, opacity: 0.85 }}>{'\n'}{line}</span>
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
    <div className="min-h-screen pb-32" style={{ background: '#08080e' }}>

      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40" style={{ background: 'rgba(8,8,14,0.97)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="font-black text-2xl tracking-tight leading-none" style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${PINK} 60%, ${PURPLE} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              YLOO Reels
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
              <span className="text-[9px] font-bold" style={{ color: 'rgba(255,255,255,0.35)' }}>{liveCount.toLocaleString('en-IN')} earning right now</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="search..."
                className="w-28 pl-8 pr-3 py-2 rounded-full text-white placeholder-white/20 text-xs focus:outline-none focus:w-36 transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full font-black text-black text-xs transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, boxShadow: `0 4px 14px rgba(201,169,110,0.4)` }}
            >
              <Upload size={12} />Post
            </button>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
              style={filter === f
                ? { background: `linear-gradient(135deg, ${PURPLE}, ${PINK})`, color: '#fff', boxShadow: `0 3px 12px rgba(139,92,246,0.4)` }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >{f}</button>
          ))}
        </div>
      </header>

      {/* ── Hero Earn Banner ── */}
      <div className="mx-3 mt-3 mb-2 rounded-3xl overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #0d1a2e 50%, #0a1a0d 100%)', border: '1px solid rgba(139,92,246,0.3)' }}>
        {/* Decorative glow blobs */}
        <div className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${PURPLE}33 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${GOLD}22 0%, transparent 70%)` }} />

        <button onClick={() => setUploadOpen(true)} className="relative w-full p-4 text-left active:scale-[0.99] transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Flame size={14} style={{ color: '#f87171' }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#f87171' }}>Daily Earning Challenge</span>
              </div>
              <p className="text-white font-black text-lg leading-tight mb-1">Post a trip pic or reel<br /><span style={{ background: `linear-gradient(135deg, ${GOLD}, ${PINK})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>earn ₹500–₹1,000 instantly</span></p>
              <p className="text-white/40 text-xs">Max 5 posts/day · Credited in seconds</p>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, boxShadow: `0 6px 20px rgba(201,169,110,0.5)` }}>
                <Camera size={24} className="text-black" />
              </div>
              <span className="text-[10px] font-black text-white/60">tap to post</span>
            </div>
          </div>

          {/* Reward chips */}
          <div className="flex gap-2 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}>
              <Camera size={11} style={{ color: GOLD }} />
              <span className="text-xs font-black" style={{ color: GOLD }}>Photo = ₹500</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
              <Video size={11} style={{ color: PURPLE }} />
              <span className="text-xs font-black" style={{ color: PURPLE }}>Reel = ₹1,000</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <Zap size={11} style={{ color: '#4ade80' }} />
              <span className="text-xs font-black" style={{ color: '#4ade80' }}>Instant</span>
            </div>
          </div>
        </button>
      </div>

      {/* ── Social proof strip ── */}
      <div className="mx-3 mb-3 flex items-center justify-between px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex -space-x-2">
          {AVATAR_GRADIENTS.slice(0, 5).map((g, i) => (
            <div key={i} className="w-6 h-6 rounded-full border" style={{ background: g, borderColor: '#08080e' }} />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={10} fill={GOLD} style={{ color: GOLD }} />
          <span className="text-white/50 text-[10px] font-medium">₹1.5 Cr+ paid out to 2,000+ travellers</span>
        </div>
      </div>

      {/* ── Feed ── */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse" style={{ background: `linear-gradient(135deg, rgba(139,92,246,0.2), rgba(201,169,110,0.1))` }}>
            <Camera size={28} style={{ color: GOLD }} />
          </div>
          <p className="text-white/30 text-sm font-medium">Loading memories...</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-2">
          <p className="text-white/30 text-sm">No results for &quot;{searchQ}&quot;</p>
        </div>
      ) : (
        <div style={{ gap: 2, display: 'flex', flexDirection: 'column' }}>
          {displayed.map((post, i) => (
            <FeedPost key={post.id} post={post} index={i} />
          ))}
        </div>
      )}

      {/* ── Bottom CTA ── */}
      <div className="fixed bottom-[64px] left-0 right-0 px-4 py-3 z-30" style={{ background: 'rgba(8,8,14,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(139,92,246,0.15)' }}>
        <button
          onClick={() => setUploadOpen(true)}
          className="relative w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-black text-sm transition-all active:scale-[0.98] overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 40%, ${PINK} 100%)`, boxShadow: `0 6px 30px rgba(236,72,153,0.35), 0 2px 12px rgba(201,169,110,0.3)` }}
        >
          <Camera size={19} />
          <span>Post Your Trip · Earn Cashback</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black" style={{ background: 'rgba(0,0,0,0.2)' }}>up to ₹1,000</span>
        </button>
      </div>

      {uploadOpen && (
        <TripMemorySheet onClose={() => setUploadOpen(false)} />
      )}
    </div>
  );
}
