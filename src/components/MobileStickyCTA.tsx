'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, CalendarDays, Ticket, MessageCircle } from 'lucide-react';

const WA_NUMBER = '918427831127';
const WA_MSG = encodeURIComponent('Hi! I want to book a trip. Please share the best package price and available dates.');
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

const TABS = [
    { label: 'Home',     href: '/',           icon: Home },
    { label: 'Trips',    href: '/trips',       icon: Compass },
    { label: 'Events',   href: '/events',      icon: CalendarDays },
    { label: 'My Trips', href: '/my-booking',  icon: Ticket },
] as const;

const HIDDEN_PATHS = ['/checkout', '/payment', '/admin'];

export default function MobileStickyCTA() {
    const pathname = usePathname();

    if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null;

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname?.startsWith(href);

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.10)]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
            <div className="grid grid-cols-5 h-16">
                {TABS.map(({ label, href, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-all duration-150 active:scale-90 select-none ${
                                active ? 'text-amber-600' : 'text-gray-400'
                            }`}
                        >
                            {/* Active indicator dot at top */}
                            {active && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-amber-500" />
                            )}
                            <div className={`p-1.5 rounded-xl transition-all duration-150 ${active ? 'bg-amber-50' : ''}`}>
                                <Icon
                                    size={21}
                                    strokeWidth={active ? 2.4 : 1.8}
                                    className={active ? 'text-amber-600' : 'text-gray-400'}
                                />
                            </div>
                            <span className={active ? 'font-bold' : ''}>{label}</span>
                        </Link>
                    );
                })}

                {/* WhatsApp — Chat tab */}
                <a
                    href={WA_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold text-green-600 transition-all duration-150 active:scale-90 select-none"
                >
                    <div className="p-1.5 rounded-xl bg-green-50">
                        <MessageCircle size={21} strokeWidth={1.8} className="text-green-600" fill="rgba(22,163,74,0.15)" />
                    </div>
                    <span>Chat</span>
                </a>
            </div>
        </nav>
    );
}
