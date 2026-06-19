'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X, Sparkles, Ticket, ChevronRight, Heart } from 'lucide-react';
import FlashSaleBanner from '@/components/FlashSaleBanner';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const hasHero = pathname === '/';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 60);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Trips 🏕️', href: '/destinations/domestic' },
        { name: 'International 🌍', href: '/destinations/international' },
        { name: 'Holiday Planner 🗓️', href: '/trip-planner' },
        { name: 'Events 🎉', href: '/events' },
        { name: 'Blogs ✍️', href: '/blogs' },
        { name: 'About', href: '/about' },
    ];

    const isActive = (href: string) => pathname === href;

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                isScrolled
                    ? 'bg-white/80 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm'
                    : hasHero
                        ? 'bg-transparent'
                        : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800'
            }`}>

                <div className={`section-container transition-all duration-500 ${
                    isScrolled ? 'py-3' : hasHero ? 'py-6' : 'py-4'
                }`}>
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link href="/" className="relative z-10 group">
                            <img
                                src="/logo.png"
                                alt="YlooTrips"
                                className={`h-9 md:h-11 w-auto object-contain transition-all duration-500 group-hover:scale-105 ${
                                    hasHero && !isScrolled && !isMobileMenuOpen ? 'brightness-0 invert dark:brightness-100 dark:invert-0' : ''
                                }`}
                            />
                        </Link>

                        {/* Desktop Nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link key={link.name} href={link.href}
                                    className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.12em] font-semibold rounded-full transition-all duration-300 ${
                                        isActive(link.href)
                                            ? 'bg-gray-100 text-gray-900'
                                            : hasHero && !isScrolled
                                                ? 'text-white/80 hover:text-white hover:bg-white/10'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}>
                                    {link.name}
                                    {isActive(link.href) && (
                                        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gray-900" />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* CTA + Mobile toggle */}
                        <div className="flex items-center gap-2">
                            {/* Wishlist */}
                            <Link href="/wishlist"
                                aria-label="Wishlist"
                                className={`hidden md:flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300 ${
                                    hasHero && !isScrolled
                                        ? 'text-white/80 bg-white/10 hover:bg-white/20 border border-white/20'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                                }`}>
                                <Heart size={15} />
                            </Link>
                            {/* Track Booking */}
                            <Link href="/my-booking"
                                className={`hidden md:flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                                    hasHero && !isScrolled
                                        ? 'border-white/50 text-white hover:bg-white/10'
                                        : 'border-gray-900 text-gray-900 hover:bg-gray-100 dark:border-gray-300 dark:text-gray-100 dark:hover:bg-gray-800'
                                }`}>
                                <Ticket size={12} />
                                My Booking
                            </Link>
                            {/* Plan Journey */}
                            <Link href="/trip-planner"
                                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-900 text-white hover:bg-gray-700 dark:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-300 hover:scale-105 shadow-md shadow-black/20">
                                <Sparkles size={13} />
                                Plan Journey
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    hasHero && !isScrolled && !isMobileMenuOpen
                                        ? 'text-white bg-black/30 hover:bg-black/40 border border-white/20'
                                        : 'text-gray-800 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}>
                                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu — full-screen white sheet (slides in from right) */}
            <div className={`fixed inset-0 z-[60] lg:hidden transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />

                {/* White panel slides in from right */}
                <div
                    className={`absolute top-0 right-0 h-full w-[88%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
                        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <div className="flex flex-col h-full px-6 pt-5 pb-8"
                         style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)' }}>

                        {/* Top bar — logo + close */}
                        <div className="flex items-center justify-between mb-8">
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                                <img src="/logo.png" alt="YlooTrips" className="h-8 w-auto object-contain" />
                            </Link>
                            <button onClick={() => setIsMobileMenuOpen(false)}
                                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors active:scale-90">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Nav links */}
                        <nav className="flex flex-col flex-1">
                            {navLinks.map((link, i) => (
                                <div key={link.name}>
                                    <Link href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between py-4 transition-all duration-300 active:scale-[0.98] ${
                                            isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                                        } ${isActive(link.href) ? 'text-[#008cff]' : 'text-gray-800 hover:text-gray-900'}`}
                                        style={{ transitionDelay: isMobileMenuOpen ? `${i * 45 + 60}ms` : '0ms' }}>
                                        <span className="font-semibold text-[18px] tracking-tight">{link.name}</span>
                                        <ChevronRight size={18} className={isActive(link.href) ? 'text-[#008cff]' : 'text-gray-300'} />
                                    </Link>
                                    {i < navLinks.length - 1 && (
                                        <div className="h-px bg-gray-100" />
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Trust micro-line */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">4.9★ · 25,000+ trips · MSME certified</span>
                        </div>

                        {/* Bottom CTAs */}
                        <div className="flex flex-col gap-3">
                            <Link href="/my-booking" onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold border border-gray-200 text-gray-700 bg-gray-50 transition-all duration-500 ${
                                    isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                                style={{ transitionDelay: isMobileMenuOpen ? '340ms' : '0ms' }}>
                                <Ticket size={15} />
                                Track My Booking
                            </Link>
                            <Link href="/trip-planner" onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold text-white bg-gray-900 shadow-lg shadow-black/20 transition-all duration-500 ${
                                    isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                                style={{ transitionDelay: isMobileMenuOpen ? '400ms' : '0ms' }}>
                                <Sparkles size={16} />
                                Plan Your Journey
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
