'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, Sparkles, Wallet, Camera } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import dynamic from 'next/dynamic';

const TripMemorySheet = dynamic(() => import('./TripMemorySheet'), { ssr: false });

const HIDDEN_PATHS = ['/checkout', '/payment', '/admin'];

export default function MobileStickyCTA() {
    const pathname = usePathname();
    const { balance } = useWallet();
    const [memoryOpen, setMemoryOpen] = useState(false);

    if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null;

    const isHome = pathname === '/';
    const isDomestic = pathname?.startsWith('/destinations/domestic');
    const isInternational = pathname?.startsWith('/destinations/international');
    const isReelTrip = pathname?.startsWith('/reel-to-trip');
    const isTrips = isDomestic || isInternational || isReelTrip;
    const isPlannerActive = pathname?.startsWith('/trip-planner');
    const isWallet = pathname?.startsWith('/cashback');
    const isMyTrips = pathname?.startsWith('/my-booking');

    return (
        <>

            {/* YLOO Reels floating button — shown on all pages except hidden paths */}
            {!pathname?.startsWith('/share-and-earn') && (
              <Link
                href="/share-and-earn"
                className="fixed right-3 z-[45] flex flex-col items-center active:scale-95 transition-all select-none"
                style={{ bottom: 82 }}
              >
                <div
                  className="relative flex flex-row items-center gap-1.5 px-3 py-2 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #C9A96E, #E2C68F)',
                    boxShadow: '0 4px 16px rgba(201,169,110,0.45), 0 0 0 1px rgba(255,255,255,0.15)',
                  }}
                >
                  <Camera size={14} className="text-black shrink-0" />
                  <div>
                    <div className="text-black font-black text-[9px] leading-tight tracking-tight whitespace-nowrap">YLOO Reels</div>
                    <div className="text-black/60 font-bold text-[8px] leading-none">Earn ₹500/day</div>
                  </div>
                </div>
              </Link>
            )}

            {/* Bottom Nav */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200"
                style={{
                    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                    boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
                }}
            >
                <div className="grid grid-cols-5 h-16 px-1">

                    {/* Home */}
                    <Link href="/" className="relative flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-90 select-none">
                        <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isHome ? 'bg-blue-50' : ''}`}>
                            <Home size={20} strokeWidth={isHome ? 2.5 : 1.8} className={isHome ? 'text-[#008cff]' : 'text-gray-400'} />
                            <span className={`text-[10px] font-medium ${isHome ? 'text-[#008cff]' : 'text-gray-400'}`}>Home</span>
                        </div>
                        {isHome && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#008cff]" />}
                    </Link>

                    {/* Trips */}
                    <Link href="/destinations/domestic" className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none">
                        <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isTrips ? 'bg-blue-50' : ''}`}>
                            <Compass size={20} strokeWidth={isTrips ? 2.5 : 1.8} className={isTrips ? 'text-[#008cff]' : 'text-gray-400'} />
                            <span className={`text-[10px] font-medium ${isTrips ? 'text-[#008cff]' : 'text-gray-400'}`}>Trips</span>
                        </div>
                        {isTrips && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#008cff]" />}
                    </Link>

                    {/* AI Planner — centre raised */}
                    <Link href="/trip-planner" className="relative flex flex-col items-center justify-center select-none active:scale-90 transition-all duration-200">
                        <div
                            className="flex flex-col items-center justify-center w-[54px] h-[54px] -mt-7 rounded-[18px] transition-all duration-200 shadow-lg"
                            style={{
                                background: isPlannerActive
                                    ? 'linear-gradient(135deg, #0070cc, #008cff)'
                                    : 'linear-gradient(135deg, #1a1a1a, #333)',
                                boxShadow: isPlannerActive
                                    ? '0 4px 20px rgba(0,140,255,0.4)'
                                    : '0 4px 20px rgba(0,0,0,0.25)',
                            }}
                        >
                            <Sparkles size={19} strokeWidth={2} className="text-white" />
                            <span className="text-white text-[9px] font-black mt-0.5 leading-none tracking-tight">AI</span>
                        </div>
                        <span className={`text-[10px] font-semibold mt-1 ${isPlannerActive ? 'text-[#008cff]' : 'text-gray-400'}`}>Plan Trip</span>
                    </Link>

                    {/* Wallet */}
                    <Link href="/cashback" className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none">
                        <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 relative ${isWallet ? 'bg-blue-50' : ''}`}>
                            <Wallet size={20} strokeWidth={isWallet ? 2.5 : 1.8} className={isWallet ? 'text-[#008cff]' : balance > 0 ? 'text-green-500' : 'text-gray-400'} />
                            {balance > 0 && (
                                <span className="absolute -top-0.5 right-1 min-w-[18px] h-[14px] px-1 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none bg-[#008cff]">
                                    ₹{balance >= 1000 ? `${(balance / 1000).toFixed(1)}k` : balance}
                                </span>
                            )}
                            <span className={`text-[10px] font-medium ${isWallet ? 'text-[#008cff]' : balance > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                                {balance > 0 ? 'Cash' : 'Wallet'}
                            </span>
                        </div>
                        {isWallet && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#008cff]" />}
                    </Link>

                    {/* My Trips */}
                    <Link href="/my-booking" className="relative flex flex-col items-center justify-center transition-all duration-200 active:scale-90 select-none">
                        <div className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 ${isMyTrips ? 'bg-blue-50' : ''}`}>
                            <Ticket size={20} strokeWidth={isMyTrips ? 2.5 : 1.8} className={isMyTrips ? 'text-[#008cff]' : 'text-gray-400'} />
                            <span className={`text-[10px] font-medium ${isMyTrips ? 'text-[#008cff]' : 'text-gray-400'}`}>My Trips</span>
                        </div>
                        {isMyTrips && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[#008cff]" />}
                    </Link>

                </div>
            </nav>

            {memoryOpen && <TripMemorySheet onClose={() => setMemoryOpen(false)} />}
        </>
    );
}
