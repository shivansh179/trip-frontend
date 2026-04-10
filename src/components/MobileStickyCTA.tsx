'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Ticket, Sparkles, Wallet, Globe, Mountain, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@/context/WalletContext';

const HIDDEN_PATHS = ['/checkout', '/payment', '/admin'];

export default function MobileStickyCTA() {
    const pathname = usePathname();
    const { balance } = useWallet();
    const [tripsOpen, setTripsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    // Close trips popup when clicking outside
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

    // Close on route change
    useEffect(() => { setTripsOpen(false); }, [pathname]);

    if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null;

    const isHome = pathname === '/';
    const isDomestic = pathname?.startsWith('/destinations/domestic');
    const isInternational = pathname?.startsWith('/destinations/international');
    const isTrips = isDomestic || isInternational;
    const isPlannerActive = pathname?.startsWith('/trip-planner');
    const isWallet = pathname?.startsWith('/cashback');
    const isMyTrips = pathname?.startsWith('/my-booking');

    return (
        <>
            {/* Trips popup sheet */}
            {tripsOpen && (
                <div
                    ref={popupRef}
                    className="fixed bottom-[72px] left-4 right-4 z-[80] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
                    style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Choose Trips</span>
                        <button
                            onClick={() => setTripsOpen(false)}
                            className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform"
                        >
                            <X size={12} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-3 p-4">
                        <Link
                            href="/destinations/domestic"
                            onClick={() => setTripsOpen(false)}
                            className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-xl bg-amber-50 border border-amber-100 active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200">
                                <Mountain size={22} className="text-white" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm text-gray-900">Domestic</div>
                                <div className="text-[10px] text-amber-600 font-medium mt-0.5">India Trips</div>
                            </div>
                            {isDomestic && (
                                <span className="text-[9px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Active</span>
                            )}
                        </Link>

                        <Link
                            href="/destinations/international"
                            onClick={() => setTripsOpen(false)}
                            className="flex flex-col items-center gap-2.5 py-5 px-3 rounded-xl bg-blue-50 border border-blue-100 active:scale-95 transition-transform"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-200">
                                <Globe size={22} className="text-white" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-sm text-gray-900">International</div>
                                <div className="text-[10px] text-blue-600 font-medium mt-0.5">World Trips</div>
                            </div>
                            {isInternational && (
                                <span className="text-[9px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Active</span>
                            )}
                        </Link>
                    </div>

                    {/* Quick tags */}
                    <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                        {['Manali 🏔️', 'Kedarnath ⛪', 'Spiti 🗻', 'Bali 🌴', 'Dubai ✈️', 'Thailand 🐘'].map((tag) => {
                            const dest = tag.split(' ')[0].toLowerCase();
                            const isIntl = ['bali', 'dubai', 'thailand'].includes(dest);
                            return (
                                <Link
                                    key={tag}
                                    href={isIntl ? `/destinations/international?q=${dest}` : `/destinations/domestic?q=${dest}`}
                                    onClick={() => setTripsOpen(false)}
                                    className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 active:scale-95 transition-transform"
                                >
                                    {tag}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Bottom Nav */}
            <nav
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.10)]"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <div className="grid grid-cols-5 h-16">

                    {/* Home */}
                    <Link
                        href="/"
                        className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-90 select-none ${isHome ? 'text-amber-600' : 'text-gray-400'}`}
                    >
                        {isHome && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-500" />}
                        <div className={`p-1.5 rounded-xl transition-all duration-150 ${isHome ? 'bg-amber-50' : ''}`}>
                            <Home size={21} strokeWidth={isHome ? 2.4 : 1.8} className={isHome ? 'text-amber-600' : 'text-gray-400'} />
                        </div>
                        <span className={isHome ? 'font-bold' : ''}>Home</span>
                    </Link>

                    {/* Trips — tap to open domestic/international picker */}
                    <button
                        onClick={() => setTripsOpen(!tripsOpen)}
                        className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-90 select-none ${isTrips || tripsOpen ? 'text-amber-600' : 'text-gray-400'}`}
                    >
                        {(isTrips || tripsOpen) && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-500" />}
                        <div className={`p-1.5 rounded-xl transition-all duration-150 ${isTrips || tripsOpen ? 'bg-amber-50' : ''}`}>
                            <Compass size={21} strokeWidth={isTrips || tripsOpen ? 2.4 : 1.8} className={isTrips || tripsOpen ? 'text-amber-600' : 'text-gray-400'} />
                        </div>
                        <span className={isTrips || tripsOpen ? 'font-bold' : ''}>Trips</span>
                        {/* small arrow indicator */}
                        <span className={`absolute bottom-1 text-[7px] transition-transform duration-200 ${tripsOpen ? 'rotate-180 text-amber-500' : 'text-gray-300'}`}>▲</span>
                    </button>

                    {/* AI Planner — centre raised button */}
                    <Link
                        href="/trip-planner"
                        className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold select-none active:scale-90 transition-all duration-150"
                    >
                        {isPlannerActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-500" />}
                        <div className={`flex flex-col items-center justify-center w-14 h-14 -mt-6 rounded-2xl shadow-lg transition-all duration-150 ${isPlannerActive ? 'bg-amber-600 shadow-amber-500/40' : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/30'}`}>
                            <Sparkles size={20} strokeWidth={2} className="text-white" />
                            <span className="text-white text-[9px] font-bold mt-0.5 leading-none">Plan AI</span>
                        </div>
                        <span className={`mt-1 ${isPlannerActive ? 'text-amber-600' : 'text-gray-400'}`}>AI Trip</span>
                    </Link>

                    {/* Wallet — WanderLoot cashback */}
                    <Link
                        href="/cashback"
                        className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-90 select-none ${isWallet ? 'text-green-600' : 'text-gray-400'}`}
                    >
                        {isWallet && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-green-500" />}
                        <div className="relative">
                            <div className={`p-1.5 rounded-xl transition-all duration-150 ${isWallet ? 'bg-green-50' : balance > 0 ? 'bg-green-50' : ''}`}>
                                <Wallet size={21} strokeWidth={isWallet ? 2.4 : 1.8} className={isWallet ? 'text-green-600' : balance > 0 ? 'text-green-500' : 'text-gray-400'} />
                            </div>
                            {/* Balance badge */}
                            {balance > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[14px] px-1 bg-green-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none animate-pulse">
                                    ₹{balance >= 1000 ? `${(balance / 1000).toFixed(1)}k` : balance}
                                </span>
                            )}
                            {/* Pulsing ring when balance > 0 */}
                            {balance > 0 && !isWallet && (
                                <span className="absolute inset-0 rounded-xl ring-2 ring-green-400/40 animate-ping" />
                            )}
                        </div>
                        <span className={isWallet ? 'font-bold text-green-600' : balance > 0 ? 'text-green-500 font-semibold' : ''}>
                            {balance > 0 ? 'Cashback' : 'Wallet'}
                        </span>
                    </Link>

                    {/* My Trips */}
                    <Link
                        href="/my-booking"
                        className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-90 select-none ${isMyTrips ? 'text-amber-600' : 'text-gray-400'}`}
                    >
                        {isMyTrips && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-500" />}
                        <div className={`p-1.5 rounded-xl transition-all duration-150 ${isMyTrips ? 'bg-amber-50' : ''}`}>
                            <Ticket size={21} strokeWidth={isMyTrips ? 2.4 : 1.8} className={isMyTrips ? 'text-amber-600' : 'text-gray-400'} />
                        </div>
                        <span className={isMyTrips ? 'font-bold' : ''}>My Trips</span>
                    </Link>

                </div>
            </nav>
        </>
    );
}
