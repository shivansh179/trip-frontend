'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, Sparkles, Wallet, Globe, Mountain, X, Camera } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/context/WalletContext';
import dynamic from 'next/dynamic';

const TripMemorySheet = dynamic(() => import('./TripMemorySheet'), { ssr: false });

const HIDDEN_PATHS = ['/checkout', '/payment', '/admin'];

export default function MobileStickyCTA() {
    const pathname = usePathname();
    const { balance } = useWallet();
    const [tripsOpen, setTripsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!tripsOpen) return;
        const handleClick = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setTripsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [tripsOpen]);

    useEffect(() => { setTripsOpen(false); }, [pathname]);

    if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null;

    const isHome = pathname === '/';
    const isDomestic = pathname?.startsWith('/destinations/domestic');
    const isInternational = pathname?.startsWith('/destinations/international');
    const isReelTrip = pathname?.startsWith('/reel-to-trip');
    const isTrips = isDomestic || isInternational || isReelTrip;
    const isPlannerActive = pathname?.startsWith('/trip-planner');
    const isWallet = pathname?.startsWith('/cashback');
    const isMyTrips = pathname?.startsWith('/my-booking');
    const [memoryOpen, setMemoryOpen] = useState(false);

    return (
        <>
            {/* Trips popup sheet */}
            {tripsOpen && (
                <div
                    ref={popupRef}
                    className="fixed bottom-[76px] left-3 right-3 z-[80] rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-250"
                    style={{
                        background: 'rgba(12,12,12,0.97)',
                        backdropFilter: 'blur(24px)',
                        border: '1px solid rgba(201,169,110,0.2)',
                        boxShadow: '0 -8px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.08)',
                    }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#C9A96E' }}>Explore</span>
                            <p className="text-sm font-semibold text-white mt-0.5">Where to next?</p>
                        </div>
                        <button onClick={() => setTripsOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <X size={14} className="text-white/60" />
                        </button>
                    </div>

                    {/* 4-option grid */}
                    <div className="grid grid-cols-2 gap-2.5 p-4">
                        <Link href="/destinations/domestic" onClick={() => setTripsOpen(false)}
                            className="flex flex-col items-center gap-2.5 py-4 px-3 rounded-2xl active:scale-95 transition-all duration-150"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,169,110,0.15)' }}>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}>
                                <Mountain size={20} style={{ color: '#C9A96E' }} />
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-sm text-white">Domestic</div>
                                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>150+ India trips</div>
                            </div>
                        </Link>

                        <Link href="/destinations/international" onClick={() => setTripsOpen(false)}
                            className="flex flex-col items-center gap-2.5 py-4 px-3 rounded-2xl active:scale-95 transition-all duration-150"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,169,110,0.15)' }}>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}>
                                <Globe size={20} style={{ color: '#C9A96E' }} />
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-sm text-white">International</div>
                                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>50+ countries</div>
                            </div>
                        </Link>

                        <Link href="/reel-to-trip" onClick={() => setTripsOpen(false)}
                            className="flex flex-col items-center gap-2.5 py-4 px-3 rounded-2xl active:scale-95 transition-all duration-150"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,169,110,0.15)' }}>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)' }}>
                                {/* Instagram brand icon */}
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="white" strokeWidth="2"/>
                                    <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2"/>
                                    <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                                </svg>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-sm text-white">Reel to Trip</div>
                                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Paste Insta URL</div>
                            </div>
                        </Link>

                        <Link href="/trip-planner" onClick={() => setTripsOpen(false)}
                            className="flex flex-col items-center gap-2.5 py-4 px-3 rounded-2xl active:scale-95 transition-all duration-150"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,169,110,0.15)' }}>
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}>
                                <Sparkles size={20} style={{ color: '#C9A96E' }} />
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-sm text-white">AI Planner</div>
                                <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Plan with AI</div>
                            </div>
                        </Link>
                    </div>

                    {/* Quick tags */}
                    <div className="px-4 pb-5 flex flex-wrap gap-2">
                        {['Manali 🏔️', 'Kedarnath ⛪', 'Spiti 🗻', 'Bali 🌴', 'Dubai ✈️', 'Thailand 🐘'].map((tag) => {
                            const dest = tag.split(' ')[0].toLowerCase();
                            const isIntl = ['bali', 'dubai', 'thailand'].includes(dest);
                            return (
                                <Link key={tag}
                                    href={isIntl ? `/destinations/international?q=${dest}` : `/destinations/domestic?q=${dest}`}
                                    onClick={() => setTripsOpen(false)}
                                    className="text-[11px] font-medium px-3 py-1.5 rounded-full active:scale-95 transition-transform"
                                    style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)', color: 'rgba(226,198,143,0.9)' }}>
                                    {tag}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* YLOO Reels floating button — shown on all pages except hidden paths */}
            {!pathname?.startsWith('/share-and-earn') && (
              <Link
                href="/share-and-earn"
                className="fixed right-3 z-[45] flex flex-col items-center active:scale-95 transition-all select-none"
                style={{ bottom: 90 }}
              >
                {/* Pulsing ring */}
                <span
                  className="absolute inset-0 rounded-2xl animate-ping opacity-30 pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, #C9A96E, #E2C68F)', animationDuration: '2s' }}
                />
                <div
                  className="relative flex flex-col items-center gap-0.5 px-3 pt-2.5 pb-2 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #C9A96E, #E2C68F)',
                    boxShadow: '0 6px 24px rgba(201,169,110,0.55), 0 0 0 1.5px rgba(255,255,255,0.2)',
                    minWidth: 66,
                  }}
                >
                  <Camera size={18} className="text-black" />
                  <span className="text-black font-black text-[10px] leading-tight tracking-tight">YLOO Reels</span>
                  <span className="text-black/60 font-bold text-[8px] leading-none text-center">📸 Earn ₹500/day</span>
                </div>
              </Link>
            )}

            {/* Bottom Nav */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <div
                    className="mx-0 border-t"
                    style={{
                        background: 'rgba(10,10,10,0.97)',
                        backdropFilter: 'blur(24px)',
                        borderColor: 'rgba(201,169,110,0.15)',
                        boxShadow: '0 -1px 0 rgba(201,169,110,0.08), 0 -12px 40px rgba(0,0,0,0.5)',
                    }}
                >
                    <div className="grid grid-cols-5 h-16 px-1">

                        {/* Home */}
                        <Link href="/" className="relative flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 select-none">
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isHome ? 'bg-white/8' : ''}`}>
                                <Home size={20} strokeWidth={isHome ? 2.5 : 1.8} style={{ color: isHome ? '#C9A96E' : 'rgba(255,255,255,0.35)' }} />
                                <span className="text-[10px] font-medium" style={{ color: isHome ? '#C9A96E' : 'rgba(255,255,255,0.35)' }}>Home</span>
                            </div>
                            {isHome && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full" style={{ background: '#C9A96E' }} />}
                        </Link>

                        {/* Trips */}
                        <button onClick={() => setTripsOpen(!tripsOpen)} className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none">
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isTrips || tripsOpen ? 'bg-white/8' : ''}`}>
                                <Compass size={20} strokeWidth={isTrips || tripsOpen ? 2.5 : 1.8} style={{ color: isTrips || tripsOpen ? '#C9A96E' : 'rgba(255,255,255,0.35)' }} />
                                <span className="text-[10px] font-medium" style={{ color: isTrips || tripsOpen ? '#C9A96E' : 'rgba(255,255,255,0.35)' }}>Trips</span>
                            </div>
                            {(isTrips || tripsOpen) && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full" style={{ background: '#C9A96E' }} />}
                        </button>

                        {/* AI Planner — centre raised */}
                        <Link href="/trip-planner" className="relative flex flex-col items-center justify-center select-none active:scale-90 transition-all duration-200">
                            <div
                                className="flex flex-col items-center justify-center w-[54px] h-[54px] -mt-7 rounded-[18px] transition-all duration-200"
                                style={{
                                    background: isPlannerActive
                                        ? 'linear-gradient(135deg, #A07840, #C9A96E)'
                                        : 'linear-gradient(135deg, #C9A96E, #E2C68F)',
                                    boxShadow: '0 4px 20px rgba(201,169,110,0.45)',
                                }}
                            >
                                <Sparkles size={19} strokeWidth={2} className="text-black" />
                                <span className="text-black text-[9px] font-black mt-0.5 leading-none tracking-tight">AI</span>
                            </div>
                            <span className="text-[10px] font-semibold mt-1" style={{ color: isPlannerActive ? '#C9A96E' : 'rgba(255,255,255,0.4)' }}>Plan Trip</span>
                        </Link>

                        {/* Wallet */}
                        <Link href="/cashback" className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none">
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 relative ${isWallet ? 'bg-white/8' : ''}`}>
                                <Wallet size={20} strokeWidth={isWallet ? 2.5 : 1.8} style={{ color: isWallet ? '#C9A96E' : balance > 0 ? '#6ee7b7' : 'rgba(255,255,255,0.35)' }} />
                                {balance > 0 && (
                                    <span className="absolute -top-0.5 right-1 min-w-[18px] h-[14px] px-1 text-black text-[8px] font-bold rounded-full flex items-center justify-center leading-none" style={{ background: '#C9A96E' }}>
                                        ₹{balance >= 1000 ? `${(balance / 1000).toFixed(1)}k` : balance}
                                    </span>
                                )}
                                <span className="text-[10px] font-medium" style={{ color: isWallet ? '#C9A96E' : balance > 0 ? '#6ee7b7' : 'rgba(255,255,255,0.35)' }}>
                                    {balance > 0 ? 'Cash' : 'Wallet'}
                                </span>
                            </div>
                            {isWallet && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full" style={{ background: '#C9A96E' }} />}
                        </Link>

                        {/* My Trips */}
                        <Link href="/my-booking" className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none">
                            <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isMyTrips ? 'bg-white/8' : ''}`}>
                                <Ticket size={20} strokeWidth={isMyTrips ? 2.5 : 1.8} style={{ color: isMyTrips ? '#C9A96E' : 'rgba(255,255,255,0.35)' }} />
                                <span className="text-[10px] font-medium" style={{ color: isMyTrips ? '#C9A96E' : 'rgba(255,255,255,0.35)' }}>My Trips</span>
                            </div>
                            {isMyTrips && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full" style={{ background: '#C9A96E' }} />}
                        </Link>

                    </div>
                </div>
            </nav>

            {memoryOpen && <TripMemorySheet onClose={() => setMemoryOpen(false)} />}
        </>
    );
}
