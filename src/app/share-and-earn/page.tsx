'use client';

import { useState, useEffect } from 'react';
import { MapPin, Play, Upload, Camera, Video, Heart, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const TripMemorySheet = dynamic(() => import('@/components/TripMemorySheet'), { ssr: false });

const GOLD  = '#C9A96E';
const GOLD2 = '#E2C68F';
const BG    = '#0a0a0a';

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

interface Post {
  id: string;
  name: string;
  trip: string;
  src: string;
  type: 'photo' | 'video';
  caption: string;
  cashback: number;
  timeAgo: string;
  likes: number;
  tall?: boolean;
  isReal?: boolean;
}

const SAMPLE_POSTS: Post[] = [
  { id:'s1',  name:'Arjun M.',   trip:'Manali, Himachal',    src:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=90', type:'photo',  caption:'4 baje uthke yahan aaya — bilkul worth it tha',              cashback:75,  timeAgo:'7m',  likes:284, tall:true  },
  { id:'s2',  name:'Priya S.',   trip:'Andaman Islands',     src:'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=90', type:'video',  caption:'andaman ka paani dekh ke aankhen khul gayi',                 cashback:150, timeAgo:'23m', likes:512, tall:false },
  { id:'s3',  name:'Rahul K.',   trip:'Bali, Indonesia',     src:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=90', type:'photo',  caption:'Tanah Lot at sunset. No filter. Bali you are unreal',        cashback:75,  timeAgo:'1h',  likes:391, tall:false },
  { id:'s4',  name:'Sneha P.',   trip:'Leh Ladakh',          src:'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=90', type:'video',  caption:'Pangong lake exactly like the movies — drove 5 hours for this', cashback:150, timeAgo:'2h',  likes:673, tall:true  },
  { id:'s5',  name:'Vikram T.',  trip:'Spiti Valley',        src:'https://images.unsplash.com/photo-1558618047-f4cf4d63f7bf?w=800&q=90', type:'photo',  caption:'Key monastery golden hour. Spiti is on another planet',      cashback:75,  timeAgo:'3h',  likes:219, tall:false },
  { id:'s6',  name:'Anjali R.',  trip:'Dubai, UAE',          src:'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=90', type:'photo',  caption:'Burj Khalifa at midnight has a completely different vibe',    cashback:75,  timeAgo:'5h',  likes:448, tall:true  },
  { id:'s7',  name:'Dev C.',     trip:'Kedarnath',           src:'https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=800&q=90', type:'video',  caption:'16km trek. Legs giving up. Eyes full of tears. Life changed', cashback:150, timeAgo:'6h',  likes:891, tall:false },
  { id:'s8',  name:'Meera L.',   trip:'Phi Phi, Thailand',   src:'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=90', type:'photo',  caption:"Phi Phi islands aren't a screensaver — they're reality",    cashback:75,  timeAgo:'9h',  likes:336, tall:false },
  { id:'s9',  name:'Karthik N.', trip:'Goa',                 src:'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=90', type:'photo',  caption:'Sunset + nothing to do. This is life',                       cashback:75,  timeAgo:'11h', likes:257, tall:true  },
  { id:'s10', name:'Divya R.',   trip:'Rishikesh',           src:'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=90', type:'video',  caption:'Class 4 rapids. Zero control. 100% joy',                     cashback:150, timeAgo:'14h', likes:544, tall:false },
  { id:'s11', name:'Aditya B.',  trip:'Kashmir',             src:'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=90', type:'photo',  caption:'Dal lake at 6am on a shikara. Kashmir is paradise',          cashback:75,  timeAgo:'1d',  likes:712, tall:false },
  { id:'s12', name:'Kavita M.',  trip:'Santorini, Greece',   src:'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=90', type:'photo',  caption:'Greece bucket list — ticked. Unforgettable',                 cashback:75,  timeAgo:'1d',  likes:623, tall:true  },
  { id:'s13', name:'Rohan V.',   trip:'Rajasthan',           src:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=90', type:'video',  caption:'Camel safari at sunset. Rajasthan stole my heart',            cashback:150, timeAgo:'2d',  likes:389, tall:false },
  { id:'s14', name:'Nisha G.',   trip:'Paris, France',       src:'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=90', type:'photo',  caption:'Paris golden hour. He proposed here. I said yes',            cashback:75,  timeAgo:'2d',  likes:1204, tall:false },
  { id:'s15', name:'Saurabh J.', trip:'Maldives',            src:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=90', type:'photo',  caption:'5 days here. Did not want to come back. Ever',               cashback:75,  timeAgo:'3d',  likes:983, tall:true  },
  { id:'s16', name:'Tanvi S.',   trip:'Triund, Himachal',    src:'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=90', type:'video',  caption:'Stars above. Valley below. Phone off. Perfect night',         cashback:150, timeAgo:'4d',  likes:467, tall:false },
  { id:'s17', name:'Mohit A.',   trip:'Singapore',           src:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=90', type:'photo',  caption:'Gardens by the Bay at night is absolutely surreal',          cashback:75,  timeAgo:'5d',  likes:318, tall:false },
  { id:'s18', name:'Pooja D.',   trip:'Varanasi',            src:'https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&q=90', type:'photo',  caption:'Ganga aarti at dawn. Some things cannot be described',        cashback:75,  timeAgo:'6d',  likes:742, tall:true  },
];

const FILTER_TABS = [
  { key: 'All',           label: 'All' },
  { key: 'Mountains',     label: 'Mountains' },
  { key: 'Beach',         label: 'Beach' },
  { key: 'International', label: 'International' },
  { key: 'City',          label: 'City' },
];

const BEACH_TRIPS        = ['Goa', 'Andaman', 'Maldives', 'Thailand', 'Phi Phi'];
const MOUNTAIN_TRIPS     = ['Manali', 'Leh', 'Spiti', 'Kashmir', 'Kedarnath', 'Himachal', 'Triund', 'Rishikesh'];
const CITY_TRIPS         = ['Dubai', 'Singapore', 'Paris', 'Varanasi', 'Rajasthan'];
const INTERNATIONAL_TRIPS = ['Bali', 'Thailand', 'Dubai', 'Maldives', 'Singapore', 'Paris', 'Santorini', 'Greece'];

/* ─── Masonry Post Card ──────────────────────────────────────────────────── */
function PostCard({ post, onLike }: { post: Post & { liked?: boolean }; onLike: (id: string) => void }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isRealVideo = post.isReal && post.type === 'video';

  return (
    <div className="relative rounded-2xl overflow-hidden mb-3 group cursor-pointer" style={{ background: '#111' }}>
      {/* Media */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: post.tall ? '3/4' : '4/5' }}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(180deg,#1a1710 0%,#0d0d0d 100%)' }} />
        )}
        {isRealVideo ? (
          <video
            src={post.src}
            className="w-full h-full object-cover"
            playsInline preload="metadata"
            onLoadedMetadata={() => setImgLoaded(true)}
          />
        ) : (
          <img
            src={post.src}
            alt={post.trip}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        )}

        {/* Gradient overlay — bottom */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 100%)' }} />

        {/* Top-right: type badge */}
        <div className="absolute top-2.5 right-2.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)' }}>
            {post.type === 'video'
              ? <><Video size={8} className="text-white/80" /><span className="text-[8px] font-bold text-white/80 tracking-wider">REEL</span></>
              : <><Camera size={8} className="text-white/80" /><span className="text-[8px] font-bold text-white/80 tracking-wider">PHOTO</span></>
            }
          </div>
        </div>

        {/* Play icon overlay for videos */}
        {post.type === 'video' && !isRealVideo && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Play size={16} className="text-white" fill="white" style={{ marginLeft: 2 }} />
            </div>
          </div>
        )}

        {/* Bottom overlay: avatar + name + location */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <div className="flex items-end justify-between">
            <div className="flex items-center gap-2">
              {/* Avatar monogram */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                style={{
                  background: post.isReal
                    ? `linear-gradient(135deg, ${GOLD}, ${GOLD2})`
                    : 'rgba(201,169,110,0.25)',
                  color: post.isReal ? '#000' : GOLD,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                {initials(post.name)}
              </div>
              <div>
                <p className="text-white font-semibold text-xs leading-tight" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.8)' }}>
                  {post.name}
                  {post.isReal && (
                    <span className="ml-1.5 text-[7px] font-black uppercase tracking-widest px-1 py-0.5 rounded-sm"
                      style={{ background: 'rgba(201,169,110,0.2)', color: GOLD }}>✓</span>
                  )}
                </p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <MapPin size={7} style={{ color: 'rgba(201,169,110,0.7)' }} />
                  <span className="text-[9px] font-medium" style={{ color: 'rgba(255,255,255,0.65)', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                    {post.trip}
                  </span>
                </div>
              </div>
            </div>

            {/* Like button */}
            <button
              onClick={() => onLike(post.id)}
              className="flex flex-col items-center gap-0.5 transition-all active:scale-90"
            >
              <Heart
                size={16}
                fill={(post as Post & { liked?: boolean }).liked ? GOLD : 'none'}
                stroke={(post as Post & { liked?: boolean }).liked ? GOLD : 'rgba(255,255,255,0.7)'}
                strokeWidth={1.5}
                style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.8))' }}
              />
              <span className="text-[8px] font-semibold" style={{ color: 'rgba(255,255,255,0.6)', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                {((post.likes || 0) + ((post as Post & { liked?: boolean }).liked ? 1 : 0)).toLocaleString('en-IN')}
              </span>
            </button>
          </div>

          {/* Caption */}
          <p className="text-white/70 text-[11px] leading-snug mt-2 line-clamp-2" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)', fontWeight: 300 }}>
            {post.caption}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function ShareAndEarnPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [posts, setPosts]           = useState<(Post & { liked?: boolean })[]>([]);
  const [filter, setFilter]         = useState('All');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/trip-memories/gallery?limit=50');
        if (!res.ok) throw new Error('');
        const json = await res.json() as {
          data: { ref: string; name: string; tripName: string; mediaType: 'photo' | 'video'; fileUrl: string | null; createdAt: string }[]
        };
        const real: Post[] = (json.data || []).filter(d => d.fileUrl).map((d, i) => ({
          id: String(d.ref),
          name: d.name,
          trip: d.tripName,
          src: d.fileUrl!,
          type: d.mediaType,
          caption: `Just back from ${d.tripName} — completely worth it`,
          cashback: d.mediaType === 'video' ? 150 : 75,
          timeAgo: 'just now',
          likes: Math.floor(Math.random() * 400) + 50,
          tall: i % 3 === 0,
          isReal: true,
        }));
        setPosts([...real, ...SAMPLE_POSTS]);
      } catch {
        setPosts(SAMPLE_POSTS);
      }
    })();
  }, []);

  const handleLike = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked } : p));
  };

  const filtered = posts.filter(p => {
    if (filter === 'All')           return true;
    if (filter === 'Mountains')     return MOUNTAIN_TRIPS.some(t => p.trip.includes(t));
    if (filter === 'Beach')         return BEACH_TRIPS.some(t => p.trip.includes(t));
    if (filter === 'International') return INTERNATIONAL_TRIPS.some(t => p.trip.includes(t));
    if (filter === 'City')          return CITY_TRIPS.some(t => p.trip.includes(t));
    return true;
  });

  // Split into two columns for masonry
  const leftCol  = filtered.filter((_, i) => i % 2 === 0);
  const rightCol = filtered.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-screen pb-32" style={{ background: BG }}>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40" style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between px-4 py-3.5">
          <div>
            <div className="flex items-center gap-2">
              <Camera size={14} style={{ color: GOLD }} />
              <h1 className="font-black text-base tracking-[0.08em] text-white">YLOO REELS</h1>
            </div>
            <p className="text-[9px] mt-0.5 uppercase tracking-[0.15em]" style={{ color: 'rgba(201,169,110,0.5)' }}>
              Share your trips · Earn wallet credits
            </p>
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-black text-xs transition-all active:scale-95"
            style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, boxShadow: `0 4px 16px rgba(201,169,110,0.3)` }}
          >
            <Upload size={12} />
            Post Trip
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex overflow-x-auto px-4 pb-3 gap-2" style={{ scrollbarWidth: 'none' }}>
          {FILTER_TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold transition-all"
              style={filter === key
                ? { background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`, color: '#000' }
                : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Earn Card ── */}
      <div className="px-4 pt-4 pb-3">
        <button
          onClick={() => setUploadOpen(true)}
          className="relative w-full text-left overflow-hidden rounded-2xl transition-all active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg, #111009 0%, #0e0c08 100%)', border: '1px solid rgba(201,169,110,0.25)' }}
        >
          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-10 h-px" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
          <div className="absolute top-0 left-0 w-px h-10" style={{ background: `linear-gradient(180deg, ${GOLD}, transparent)` }} />
          <div className="absolute bottom-0 right-0 w-10 h-px" style={{ background: `linear-gradient(270deg, ${GOLD}, transparent)` }} />
          <div className="absolute bottom-0 right-0 w-px h-10" style={{ background: `linear-gradient(0deg, ${GOLD}, transparent)` }} />

          <div className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] mb-1.5" style={{ color: 'rgba(201,169,110,0.5)' }}>Members Earn</p>
              <p className="text-white font-light text-base leading-snug">
                Share your journey —{' '}
                <span className="font-black" style={{ color: GOLD }}>earn cashback</span>
                {' '}on every post.
              </p>
              <div className="flex items-center gap-4 mt-3">
                {[
                  { label: 'Photo', value: '₹75' },
                  { label: 'Reel', value: '₹150' },
                  { label: 'Per Day', value: '₹750 max' },
                ].map(({ label, value }) => (
                  <div key={label} style={{ borderLeft: '1.5px solid rgba(201,169,110,0.2)', paddingLeft: 10 }}>
                    <p className="text-[9px] uppercase tracking-widest" style={{ color: 'rgba(201,169,110,0.45)' }}>{label}</p>
                    <p className="font-black text-sm" style={{ color: GOLD }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
              <ArrowRight size={16} style={{ color: GOLD }} />
            </div>
          </div>

          {/* Fine print */}
          <div className="px-4 pb-3">
            <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Credited as WanderLoot wallet · Approved posts only · Redeemable on next booking
            </p>
          </div>
        </button>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3 px-4 mb-4">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <p className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.18)' }}>
          Recent trips from our travellers
        </p>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
      </div>

      {/* ── Masonry Grid ── */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-12 h-12 rounded-full animate-pulse flex items-center justify-center"
            style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
            <Camera size={18} style={{ color: 'rgba(201,169,110,0.4)' }} />
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.2)' }}>Loading memories</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <p className="text-sm text-white/30">No posts in this category yet</p>
        </div>
      ) : (
        <div className="px-3 flex gap-3">
          {/* Left column */}
          <div className="flex-1 flex flex-col">
            {leftCol.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
          {/* Right column — offset slightly for masonry feel */}
          <div className="flex-1 flex flex-col pt-8">
            {rightCol.map(post => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))}
          </div>
        </div>
      )}

      {/* ── Fixed Bottom CTA ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 px-4 py-3"
        style={{ background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(201,169,110,0.1)' }}
      >
        <button
          onClick={() => setUploadOpen(true)}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-black text-black text-sm tracking-wide transition-all active:scale-[0.99]"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
            boxShadow: '0 4px 20px rgba(201,169,110,0.3)',
            letterSpacing: '0.06em',
          }}
        >
          <Camera size={17} />
          Share Your Trip · Earn Cashback
        </button>
      </div>

      {uploadOpen && (
        <TripMemorySheet onClose={() => setUploadOpen(false)} />
      )}
    </div>
  );
}
