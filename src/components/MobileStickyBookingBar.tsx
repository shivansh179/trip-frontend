'use client';

import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import { Shield, Zap } from 'lucide-react';

interface MobileStickyBookingBarProps {
    price: number | string;
    onBook: () => void;
    disabled?: boolean;
    spotsLeft?: number;
}

export default function MobileStickyBookingBar({ price, onBook, disabled, spotsLeft }: MobileStickyBookingBarProps) {
    const { currency } = useCurrency();
    const { visitor } = useVisitor();
    const fp = (p: number | string) => formatPriceWithCurrency(p, currency);

    return (
        <div className="fixed bottom-16 left-0 right-0 z-[60] md:hidden bg-white border-t border-primary/10 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
            {/* Urgency strip */}
            {spotsLeft && (
                <div className="bg-red-500 text-white text-center text-[10px] font-bold uppercase tracking-widest py-1 px-4">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse mr-1" />
                    Only {spotsLeft} spots left for selected date — book now!
                </div>
            )}
            <div className="flex items-center justify-between gap-3 px-4 py-3">
                <div>
                    <div className="text-xl font-bold text-primary">{fp(price)}<span className="text-sm font-normal text-primary/50">/person</span></div>
                    <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Pay just ₹5,000 to confirm
                    </div>
                </div>
                <button
                    onClick={onBook}
                    disabled={disabled}
                    className="flex items-center gap-1.5 bg-primary hover:bg-secondary text-cream text-sm font-bold px-5 py-3 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed shrink-0 transition-all active:scale-[0.97]"
                >
                    <Zap className="w-3.5 h-3.5" />
                    {disabled
                        ? 'Pick a Date'
                        : visitor === 'foreigner'
                            ? 'Book & Pay'
                            : 'Book Now'}
                </button>
            </div>
        </div>
    );
}
