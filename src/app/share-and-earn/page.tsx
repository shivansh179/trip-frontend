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

// ── Feed Post Card ────────────────────────────────────────────────────────────
function FeedPost({ post }: { post: Post }) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const isRealVideo = post.isReal && post.type === 'video';

  return (
    <article className="border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>

      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-black shrink-0"
            style={{ background: avatarGrad(post.name), boxShadow: post.isReal ? `0 0 0 2px #0a0a0f, 0 0 0 3px ${GOLD}` : '0 0 0 1.5px rgba(255,255,255,0.1)' }}
          >
            {initials(post.name)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-white font-semibold text-sm leading-tight">{post.name}</p>
              {post.isReal && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(201,169,110,0.15)', color: GOLD }}>✓</span>}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={9} style={{ color: 'rgba(255,255,255,0.35)' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{post.trip}</span>
            </div>
          </div>
        </div>

        {/* Subtle cashback — only show for real posts, or as muted text for samples */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Wallet size={10} style={{ color: post.isReal ? GOLD : 'rgba(255,255,255,0.25)' }} />
          <span className="text-[10px] font-bold" style={{ color: post.isReal ? GOLD : 'rgba(255,255,255,0.3)' }}>₹{post.cashback}</span>
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
        <p className="text-white/75 text-sm leading-relaxed whitespace-pre-line">
          <span className="font-semibold text-white">{post.name.split(' ')[0]} </span>
          {post.caption.split('\n').map((line, i) =>
            line.startsWith('#') ? (
              <span key={i} style={{ color: GOLD, opacity: 0.7 }}>{'\n'}{line}</span>
            ) : i === 0 ? line : <span key={i}>{'\n'}{line}</span>
          )}
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
