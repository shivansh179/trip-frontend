'use client';

import { useState, useEffect, useCallback } from 'react';
import { Camera, Video, MapPin, RefreshCw, Upload, Play } from 'lucide-react';
import dynamic from 'next/dynamic';

const TripMemorySheet = dynamic(() => import('./TripMemorySheet'), { ssr: false });

const GOLD = '#C9A96E';

interface Memory {
  ref: string;
  name: string;
  tripName: string;
  mediaType: 'photo' | 'video';
  fileUrl: string | null;
  createdAt: string;
}

// Placeholder cards shown when no fileUrl (Cloudinary not configured yet)
const PLACEHOLDER_PHOTOS = [
  { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80', name: 'Arjun M.', trip: 'Manali', type: 'photo' },
  { src: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80', name: 'Priya S.', trip: 'Dubai', type: 'photo' },
  { src: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80', name: 'Rahul K.', trip: 'Spiti Valley', type: 'photo' },
  { src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', name: 'Sneha P.', trip: 'Bali', type: 'photo' },
  { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80', name: 'Vikram T.', trip: 'Andaman', type: 'photo' },
  { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80', name: 'Anjali R.', trip: 'Kedarnath', type: 'photo' },
  { src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80', name: 'Dev C.', trip: 'Leh Ladakh', type: 'photo' },
  { src: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80', name: 'Meera L.', trip: 'Thailand', type: 'photo' },
  { src: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80', name: 'Karthik N.', trip: 'Goa', type: 'photo' },
];

// Gradient backgrounds for text-only cards (when no photo uploaded)
const TEXT_CARD_GRADIENTS = [
  'linear-gradient(135deg, #1a0f00, #3d2200)',
  'linear-gradient(135deg, #0a0f1a, #0d2240)',
  'linear-gradient(135deg, #0f0a1a, #220d40)',
  'linear-gradient(135deg, #001a0f, #0d3320)',
  'linear-gradient(135deg, #1a0a0a, #3d1010)',
];

function MemoryCard({ src, name, trip, type, isNew = false }: {
  src: string | null; name: string; trip: string; type: string; isNew?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const gradientIndex = Math.abs(name.charCodeAt(0) + trip.charCodeAt(0)) % TEXT_CARD_GRADIENTS.length;

  if (!src) {
    // Text-only card — no photo yet
    return (
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: '3/4', background: TEXT_CARD_GRADIENTS[gradientIndex], border: '1px solid rgba(201,169,110,0.15)' }}
      >
        {isNew && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black text-black" style={{ background: GOLD }}>
            NEW
          </div>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}>
            {type === 'video' ? <Video size={20} style={{ color: '#818cf8' }} /> : <Camera size={20} style={{ color: GOLD }} />}
          </div>
          <div>
            <p className="text-white font-black text-sm leading-tight">"{trip}"</p>
            <p className="text-white/40 text-xs mt-1">shared by</p>
            <p className="font-bold text-sm mt-0.5" style={{ color: GOLD }}>{name}</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <div className="flex items-center gap-1">
            <MapPin size={9} style={{ color: GOLD }} />
            <span className="text-[10px] font-medium" style={{ color: 'rgba(201,169,110,0.7)' }}>{trip}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer group"
        style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.04)' }}
        onClick={() => setLightbox(true)}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <RefreshCw size={18} className="animate-spin text-white/20" />
          </div>
        )}
        <img
          src={src}
          alt={`${name}'s trip to ${trip}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />

        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
          {type === 'video' ? <Video size={10} style={{ color: '#818cf8' }} /> : <Camera size={10} style={{ color: GOLD }} />}
          <span className="text-[9px] font-bold" style={{ color: type === 'video' ? '#818cf8' : GOLD }}>
            {type === 'video' ? 'VIDEO' : 'PHOTO'}
          </span>
        </div>

        {isNew && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-black text-black" style={{ background: GOLD }}>
            NEW
          </div>
        )}

        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
              <Play size={16} className="text-white ml-0.5" />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
          <p className="text-white font-bold text-xs leading-tight">{name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={9} style={{ color: GOLD }} />
            <span className="text-[10px] font-medium" style={{ color: 'rgba(201,169,110,0.8)' }}>{trip}</span>
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(16px)' }}
          onClick={() => setLightbox(false)}
        >
          <div className="max-w-lg w-full rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <img src={src} alt="" className="w-full object-contain max-h-[70vh]" />
            <div className="p-4" style={{ background: 'rgba(12,12,12,0.97)', border: '1px solid rgba(201,169,110,0.15)', borderTop: 'none' }}>
              <p className="text-white font-bold text-sm">{name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={11} style={{ color: GOLD }} />
                <span className="text-xs" style={{ color: 'rgba(201,169,110,0.8)' }}>{trip}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function TripGallery() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch('/api/trip-memories/gallery?limit=50');
      if (!res.ok) return;
      const json = await res.json() as { data: Memory[] };
      setMemories(json.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchGallery(); }, [fetchGallery]);

  // Show ALL memories; fill with placeholders only if fewer than 6 total
  const needPlaceholders = memories.length < 6;
  const displayItems = needPlaceholders
    ? [...memories, ...PLACEHOLDER_PHOTOS.slice(memories.length)]
    : memories;

  return (
    <>
      <section className="py-10 md:py-16" style={{ background: '#0a0a0f' }}>
        <div className="max-w-5xl mx-auto px-4">

          {/* Header */}
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3" style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Traveller Stories</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                See Where<br className="md:hidden" /> They Went
              </h2>
              <p className="text-white/30 text-sm mt-1">Real trips. Real memories. Real people.</p>
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-black text-xs transition-all active:scale-95 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #E2C68F)`, boxShadow: '0 4px 16px rgba(201,169,110,0.3)' }}
            >
              <Upload size={14} />
              Add Yours
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl animate-pulse" style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.05)' }} />
              ))}
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {displayItems.slice(0, 9).map((item, i) => {
                const isMemory = i < memories.length;
                const m = isMemory ? (item as Memory) : null;
                const p = !isMemory ? (item as typeof PLACEHOLDER_PHOTOS[0]) : null;
                return (
                  <div key={isMemory ? m!.ref : p!.src + i} className="break-inside-avoid mb-3">
                    <MemoryCard
                      src={isMemory ? (m!.fileUrl ?? null) : p!.src}
                      name={isMemory ? m!.name : p!.name}
                      trip={isMemory ? String(m!.tripName) : p!.trip}
                      type={isMemory ? m!.mediaType : p!.type}
                      isNew={isMemory && i < 3}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-8 rounded-2xl p-5 flex items-center justify-between gap-4" style={{ background: 'rgba(201,169,110,0.07)', border: '1px solid rgba(201,169,110,0.18)' }}>
            <div>
              <p className="text-white font-bold text-sm">Share your trip & earn cashback</p>
              <p className="text-white/30 text-xs mt-0.5">₹500 per photo · ₹1,000 per video · Instant wallet credit</p>
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-black text-black text-sm transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #E2C68F)` }}
            >
              <Camera size={15} />
              Upload
            </button>
          </div>
        </div>
      </section>

      {uploadOpen && (
        <TripMemorySheet
          onClose={() => { setUploadOpen(false); fetchGallery(); }}
        />
      )}
    </>
  );
}
