'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, MapPin, Ticket } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { api } from '@/lib/api';
import { Event as EventType } from '@/types';
import { formatPrice } from '@/lib/utils';
import PaintSplashBg from '@/components/PaintSplashBg';

export default function EventsPage() {
    const [events, setEvents] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await api.getEvents();
                const data = response.data;
                const list = Array.isArray(data) ? data : (data && Array.isArray(data.content) ? data.content : []);
                setEvents(list);
                setError(null);
            } catch (err) {
                console.error('Error fetching events:', err);
                setError('Unable to load events.');
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <>
            <PageHero
                title="Events & Experiences"
                subtitle="Pool parties, workshops, and curated experiences. Book your spot and join the fun."
                breadcrumb="Events"
                backgroundImage="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80"
            />

            <PaintSplashBg className="py-8 sm:py-10 md:py-16">
                <div className="section-container">
                    {loading && (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                            <p className="text-primary/70">Loading events...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <p className="text-primary/80 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="btn-outline"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!loading && !error && events.length === 0 && (
                        <div className="text-center py-16 max-w-md mx-auto">
                            <Ticket className="w-16 h-16 text-primary/40 mx-auto mb-4" />
                            <h2 className="font-display text-2xl text-primary mb-2">No events right now</h2>
                            <p className="text-primary/70 mb-6">Check back soon for new experiences and parties.</p>
                            <Link href="/destinations" className="btn-primary">
                                Explore destinations
                            </Link>
                        </div>
                    )}

                    {!loading && !error && Array.isArray(events) && events.length > 0 && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {events.map((event) => {
                                const price = typeof event.price === 'number' ? event.price : parseFloat(String(event.price ?? 0));
                                const dateStr = typeof event.eventDate === 'string' ? event.eventDate : '';
                                return (
                                    <article
                                        key={event.id}
                                        className="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <Link href={`/events/${event.slug || event.id}`} className="block">
                                            <div className="aspect-[4/3] bg-primary/5 relative overflow-hidden">
                                                {event.imageUrl ? (
                                                    <img
                                                        src={event.imageUrl}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                                                        <Ticket className="w-16 h-16" />
                                                    </div>
                                                )}
                                                {event.isFeatured && (
                                                    <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-primary text-cream rounded">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-5 md:p-6">
                                                {event.category && (
                                                    <span className="text-xs uppercase tracking-wider text-primary/60">
                                                        {event.category}
                                                    </span>
                                                )}
                                                <h2 className="font-display text-xl md:text-2xl text-primary mt-1 mb-2 line-clamp-2">
                                                    {event.title}
                                                </h2>
                                                {event.shortDescription && (
                                                    <p className="text-primary/70 text-sm line-clamp-2 mb-4">
                                                        {event.shortDescription}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-3 text-sm text-primary/70">
                                                    {dateStr && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(dateStr).toLocaleDateString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                    )}
                                                    {event.city && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {event.city}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="text-lg font-medium text-primary">
                                                        {formatPrice(price)}
                                                        {event.originalPrice && (
                                                            <span className="text-sm text-primary/60 line-through ml-2">
                                                                {formatPrice(typeof event.originalPrice === 'number' ? event.originalPrice : parseFloat(String(event.originalPrice)))}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 text-secondary font-medium text-sm">
                                                        Book now
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    )}

                    {!loading && !error && events.length > 0 && (
                        <div className="mt-16 text-center">
                            <p className="text-primary/70 mb-4">Can&apos;t find what you&apos;re looking for?</p>
                            <Link href="/contact" className="btn-outline">
                                Get in touch
                            </Link>
                        </div>
                    )}
                </div>
            </PaintSplashBg>
        </>
    );
}
