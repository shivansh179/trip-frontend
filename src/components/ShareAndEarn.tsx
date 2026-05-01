'use client';

import { Camera, Video, Wallet, ArrowRight, Flame, Zap } from 'lucide-react';
import Link from 'next/link';

const GOLD = '#C9A96E';

export default function ShareAndEarn() {
  return (
    <section className="py-10 md:py-16" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #0f0c07 100%)' }}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4" style={{ background: 'rgba(201,169,110,0.12)', border: '1px solid rgba(201,169,110,0.25)' }}>
            <Camera size={12} style={{ color: GOLD }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>YLOO Reels</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Share Pics & Videos —<br />
            <span style={{ color: GOLD }}>Earn Real Cashback Daily</span>
          </h2>
          <p className="text-white/50 text-sm md:text-base mt-3 max-w-sm mx-auto">
            Post your trip photos or videos every day and get instant money in your wallet. No wait. No forms.
          </p>
        </div>

        {/* How it works — 3 step strip */}
        <div className="flex items-start gap-3 mb-7 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {[
            { step: '1', icon: <Camera size={18} style={{ color: GOLD }} />, title: 'Post a Trip Pic', sub: 'Use camera or gallery', reward: '₹500' },
            { step: '2', icon: <Video size={18} style={{ color: '#818cf8' }} />, title: 'Post a Trip Video', sub: 'Short clip = big reward', reward: '₹1,000' },
            { step: '3', icon: <Zap size={18} style={{ color: '#34d399' }} />, title: 'Instant Wallet Credit', sub: 'Money lands in seconds', reward: '⚡ Now' },
          ].map(({ step, icon, title, sub, reward }) => (
            <div key={step} className="flex-1 min-w-[130px] rounded-2xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="w-9 h-9 rounded-xl mx-auto flex items-center justify-center mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {icon}
              </div>
              <p className="text-white font-bold text-xs leading-tight">{title}</p>
              <p className="text-white/30 text-[10px] mt-0.5">{sub}</p>
              <p className="font-black text-base mt-1.5" style={{ color: GOLD }}>{reward}</p>
            </div>
          ))}
        </div>

        {/* Addictive hook card */}
        <div className="rounded-3xl overflow-hidden mb-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(201,169,110,0.2)' }}>
          {/* Top urgency bar */}
          <div className="flex items-center justify-center gap-2 px-4 py-2" style={{ background: 'rgba(201,169,110,0.1)', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
            <Flame size={13} style={{ color: GOLD }} />
            <span className="text-[11px] font-black" style={{ color: GOLD }}>Upload daily → Earn up to ₹5,000/day · Max 5 posts</span>
            <Flame size={13} style={{ color: GOLD }} />
          </div>

          <div className="p-5 md:p-7 flex flex-col md:flex-row items-center gap-5 md:gap-8">
            {/* Stacked avatars */}
            <div className="flex -space-x-3 shrink-0">
              {[
                'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&q=80',
                'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=120&q=80',
                'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=120&q=80',
                'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=120&q=80',
              ].map((src, i) => (
                <div key={i} className="w-12 h-12 rounded-xl overflow-hidden border-2" style={{ borderColor: '#0a0a0f' }}>
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 text-[10px] font-black" style={{ borderColor: '#0a0a0f', background: 'rgba(201,169,110,0.2)', color: GOLD }}>+2k</div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <Wallet size={14} style={{ color: GOLD }} />
                <span className="text-white font-black text-base">₹15,00,000+ paid out</span>
              </div>
              <p className="text-white/40 text-sm">2,000+ travellers earning cashback daily by sharing their trips</p>
              <p className="text-white/25 text-xs mt-2">📸 photo = ₹500 · 🎬 video = ₹1,000 · credited instantly</p>
            </div>

            <Link
              href="/share-and-earn"
              className="shrink-0 flex items-center gap-2 px-6 py-4 rounded-2xl font-black text-black text-sm transition-all active:scale-95 hover:scale-105"
              style={{ background: `linear-gradient(135deg, ${GOLD}, #E2C68F)`, boxShadow: '0 6px 24px rgba(201,169,110,0.4)' }}
            >
              <Camera size={17} />
              Start Earning Now
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Fine print */}
        <p className="text-center text-white/20 text-xs">
          Cashback credited instantly · Max 5 uploads/day · Any trip destination counts
        </p>
      </div>
    </section>
  );
}
