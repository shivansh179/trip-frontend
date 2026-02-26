'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, Minus, Plus } from 'lucide-react';
import { api } from '@/lib/api';
import { Event as EventType, EventTicketType } from '@/types';
import PaintSplashBg from '@/components/PaintSplashBg';

function formatPrice(amount: number): string {
    return '₹' + amount.toLocaleString('en-IN');
}

export default function EventTicketsPage() {
    const params = useParams();
    const router = useRouter();
    const slugOrId = params?.slugOrId as string;

    const [event, setEvent] = useState<EventType | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    const MAX_TICKETS = 10;

    useEffect(() => {
        if (!slugOrId) return;
        const fetch = async () => {
            try {
                const isNumeric = /^\d+$/.test(slugOrId);
                const res = isNumeric
                    ? await api.getEventById(Number(slugOrId))
                    : await api.getEventBySlug(slugOrId);
                setEvent(res.data);
                const initial: Record<number, number> = {};
                (res.data?.ticketTypes ?? []).forEach((t: EventTicketType) => {
                    initial[t.id] = 0;
                });
                setQuantities(initial);
            } catch {
                router.push('/events');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [slugOrId, router]);

    const ticketTypes: EventTicketType[] = event?.ticketTypes ?? [];
    const totalQty = useMemo(() => Object.values(quantities).reduce((a, b) => a + b, 0), [quantities]);
    const totalPrice = useMemo(() => {
        if (!event) return 0;
        return ticketTypes.reduce((sum, t) => {
            const qty = quantities[t.id] ?? 0;
            const p = typeof t.price === 'number' ? t.price : parseFloat(String(t.price ?? 0));
            return sum + p * qty;
        }, 0);
    }, [quantities, ticketTypes, event]);

    const addOne = (id: number) => {
        if (totalQty >= MAX_TICKETS) return;
        setQuantities(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    };
    const removeOne = (id: number) => {
        setQuantities(prev => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) - 1) }));
    };

    const handleProceed = () => {
        if (!event || totalQty === 0) return;
        const lines = ticketTypes
            .filter(t => (quantities[t.id] ?? 0) > 0)
            .map(t => ({ ticketTypeId: t.id, quantity: quantities[t.id]! }));
        const ticketLinesParam = encodeURIComponent(JSON.stringify(lines));
        router.push(`/events/checkout?eventId=${event.id}&date=${encodeURIComponent(event.eventDate)}&ticketLines=${ticketLinesParam}`);
    };

    // Format date like BMS: "Wed 04 Mar"
    const formatEventDate = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' }).replace(',', '');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-below-nav px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Loading tickets...</p>
                </div>
            </div>
        );
    }

    if (!event) return null;

    const hasTicketTypes = ticketTypes.length > 0;
    const dateStr = typeof event.eventDate === 'string' ? event.eventDate : '';

    return (
        <PaintSplashBg className="min-h-screen flex flex-col pt-below-nav">
            {/* ─── Top Header (sticks below main navbar) ─── */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-20 md:top-24 z-30">
                {/* Title bar */}
                <div className="flex items-center px-4 sm:px-6 py-3 gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                    </button>
                    <h1 className="flex-1 text-center text-[17px] font-semibold text-gray-900 truncate">
                        {event.title}
                    </h1>
                    <div className="w-8" /> {/* spacer to center title */}
                </div>

                {/* Step indicator */}
                <div className="flex items-center px-4 sm:px-6 pb-3 gap-2">
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
                        <span className="text-[13px] font-semibold text-gray-900">Ticket</span>
                    </div>
                    <ChevronLeft className="w-3.5 h-3.5 text-gray-400 rotate-180" />
                    <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-gray-300 text-gray-500 text-[11px] font-bold flex items-center justify-center">2</span>
                        <span className="text-[13px] text-gray-400">Review &amp; Proceed to Pay</span>
                    </div>
                </div>
            </div>

            {/* ─── Venue / Date Banner ─── */}
            {(event.venueName || dateStr) && (
                <div className="bg-white/50 backdrop-blur-sm px-4 sm:px-6 py-2.5 flex items-center gap-2 border-b border-gray-100">
                    <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    <p className="text-[13px] text-gray-700 font-medium">
                        {event.venueName}
                        {event.city ? `: ${event.city}` : ''}
                        {dateStr ? ` | ${formatEventDate(dateStr)}` : ''}
                        {event.eventTime ? ` | ${event.eventTime}` : ''}
                    </p>
                </div>
            )}

            {/* ─── Ticket List ─── */}
            <div className="flex-1 px-4 sm:px-6 py-5 pb-36 md:pb-32 safe-area-bottom">
                {hasTicketTypes ? (
                    <>
                        <div className="mb-4">
                            <h2 className="text-[17px] font-semibold text-gray-900">Select Tickets</h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">
                                You can add up to {MAX_TICKETS} tickets only
                            </p>
                        </div>

                        <div className="space-y-3">
                            {ticketTypes.map((t) => {
                                const qty = quantities[t.id] ?? 0;
                                const p = typeof t.price === 'number' ? t.price : parseFloat(String(t.price ?? 0));
                                const origP = t.originalPrice
                                    ? (typeof t.originalPrice === 'number' ? t.originalPrice : parseFloat(String(t.originalPrice)))
                                    : null;

                                return (
                                    <div
                                        key={t.id}
                                        className="bg-white/85 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-4"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-semibold text-gray-900 uppercase tracking-tight leading-snug">
                                                    {t.name}
                                                </p>
                                                <div className="mt-1 flex items-baseline gap-2">
                                                    <span className="text-[15px] font-semibold text-gray-800">
                                                        {formatPrice(p)}
                                                    </span>
                                                    {origP && (
                                                        <span className="text-[12px] text-gray-400 line-through">
                                                            {formatPrice(origP)}
                                                        </span>
                                                    )}
                                                </div>
                                                {t.description && (
                                                    <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
                                                        {t.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Add / Stepper */}
                                            <div className="shrink-0 flex items-center">
                                                {qty === 0 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => addOne(t.id)}
                                                        disabled={totalQty >= MAX_TICKETS}
                                                        className="border border-red-500 text-red-500 text-[13px] font-semibold px-5 py-1.5 rounded hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-w-[60px]"
                                                    >
                                                        Add
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOne(t.id)}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Minus className="w-3.5 h-3.5" />
                                                        </button>
                                                        <span className="w-7 text-center text-[15px] font-semibold text-gray-900">
                                                            {qty}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => addOne(t.id)}
                                                            disabled={totalQty >= MAX_TICKETS}
                                                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            <Plus className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No ticket types available for this event.</p>
                    </div>
                )}
            </div>

            {/* ─── Bottom Sticky Bar ─── */}
            {totalQty > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] safe-area-bottom">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 md:py-4">
                        <div>
                            <p className="text-[11px] text-gray-500 uppercase tracking-wide font-medium">Subtotal</p>
                            <p className="text-[18px] font-bold text-gray-900">{formatPrice(totalPrice)}</p>
                            <p className="text-[11px] text-gray-400">
                                {totalQty} {totalQty === 1 ? 'ticket' : 'tickets'} selected
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleProceed}
                            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-[15px] font-semibold px-8 py-3 rounded-lg transition-colors"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            )}
        </PaintSplashBg>
    );
}
