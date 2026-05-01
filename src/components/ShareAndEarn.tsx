'use client';

import { useState } from 'react';
import { Camera, Video, Wallet, ArrowRight, Upload } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const TripMemorySheet = dynamic(() => import('./TripMemorySheet'), { ssr: false });

const GOLD = '#C9A96E';

export default function ShareAndEarn() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="py-10 md:py-16" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0c07 100%)' }}>
        <div className="max-w-5xl mx-auto px-4">

          {/* Heading */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Share & Earn</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Turn Your Memories<br />
              <span style={{ color: GOLD }}>Into Cashback</span>
            </h2>
            <p className="text-white/40 text-sm md:text-base mt-3 max-w-md mx-auto">
              Upload trip photos or videos and earn instant wallet cashback to use on your next adventure.
            </p>
          </div>

          {/* Reward cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              { icon: <Camera size={22} style={{ color: GOLD }} />, label: 'Trip Photo', reward: '₹500', desc: 'Per photo uploaded', bg: 'rgba(201,169,110,0.08)', border: 'rgba(201,169,110,0.2)' },
              { icon: <Video size={22} style={{ color: '#818cf8' }} />, label: 'Trip Video', reward: '₹1,000', desc: 'Per video uploaded', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
              { icon: <Upload size={22} style={{ color: '#34d399' }} />, label: 'Instant Credit', reward: '24/7', desc: 'No waiting period', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
              { icon: <Wallet size={22} style={{ color: '#f472b6' }} />, label: 'Use Anytime', reward: '∞', desc: 'No expiry on credits', bg: 'rgba(244,114,182,0.08)', border: 'rgba(244,114,182,0.2)' },
            ].map(({ icon, label, reward, desc, bg, border }) => (
              <div key={label} className="rounded-2xl p-4 text-center" style={{ background: bg, border: `1px solid ${border}` }}>
                <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-2.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {icon}
                </div>
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="font-black text-xl mt-0.5" style={{ color: GOLD }}>{reward}</p>
                <p className="text-white/30 text-[10px] mt-0.5">{desc}</p>
              </div>
            ))}
          </div>

          {/* Main CTA block */}
          <div className="rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-10" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,169,110,0.18)', boxShadow: '0 0 60px rgba(201,169,110,0.06)' }}>

            {/* Sample memory thumbnails */}
            <div className="flex -space-x-3 shrink-0">
              {[
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=80',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=120&q=80',
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120&q=80',
                'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=120&q=80',
              ].map((src, i) => (
                <div key={i} className="w-14 h-14 rounded-2xl overflow-hidden border-2" style={{ borderColor: '#0a0a0f' }}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 text-xs font-bold" style={{ borderColor: '#0a0a0f', background: 'rgba(201,169,110,0.15)', color: GOLD }}>
                +2k
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <p className="text-white font-bold text-lg leading-tight">
                2,000+ travellers already earned<br />
                <span style={{ color: GOLD }}>₹15L+ in cashback rewards</span>
              </p>
              <p className="text-white/30 text-sm mt-1">Share your trip. Get paid. Repeat.</p>
            </div>

            <Link
              href="/share-and-earn"
              className="shrink-0 flex items-center gap-2.5 px-6 py-4 rounded-2xl font-black text-black text-sm transition-all active:scale-95 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #E2C68F)`, boxShadow: '0 6px 24px rgba(201,169,110,0.35)' }}
            >
              <Upload size={18} />
              View Feed & Earn
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Fine print */}
          <p className="text-center text-white/20 text-xs mt-4">
            Cashback credited instantly to WanderLoot wallet · Max 5 uploads/day · Authentic trip content only
          </p>
        </div>
      </section>

      {open && <TripMemorySheet onClose={() => setOpen(false)} />}
    </>
  );
}
