'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Trip {
    id: number;
    title: string;
    description?: string;
    shortDescription?: string;
    destination: string;
    imageUrl: string;
    price: number | string | any;
    originalPrice?: number | string | any;
    duration: string;
    category?: string;
    isFeatured?: boolean;
    isPopular?: boolean;
}

interface CuratedJourneysProps {
    trips: Trip[];
}

export default function CuratedJourneys({ trips }: CuratedJourneysProps) {
    return (
        <section className="section-padding bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
                        Curated Journeys
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto font-light">
                        Discover curated experiences tailored to your sense of adventure. Whether you seek nature, culture, or luxury, explore journeys designed to inspire and transform.
                    </p>
                </div>

                {trips.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-text-secondary">No journeys available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {trips.map((trip, index) => (
                            <Link
                                key={trip.id}
                                href={`/trips/${trip.id}`}
                                className="group block bg-white overflow-hidden card-hover"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src={trip.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
                                        alt={trip.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    
                                    {/* Badge */}
                                    {trip.isFeatured && (
                                        <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-foreground text-xs font-light tracking-widest uppercase">
                                            Featured
                                        </div>
                                    )}
                                </div>
                                
                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{trip.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin size={14} />
                                            <span>{trip.destination}</span>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-2xl font-light text-foreground mb-3 group-hover:text-accent transition-colors">
                                        {trip.title}
                                    </h3>
                                    
                                    {trip.shortDescription && (
                                        <p className="text-text-secondary text-sm mb-4 line-clamp-2 font-light">
                                            {trip.shortDescription}
                                        </p>
                                    )}
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div>
                                            <div className="text-2xl font-light text-foreground">
                                                {formatPrice(trip.price)}
                                            </div>
                                            {trip.originalPrice && (
                                                <div className="text-sm text-text-secondary line-through">
                                                    {formatPrice(trip.originalPrice)}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm text-foreground font-light tracking-widest uppercase group-hover:text-accent transition-colors">
                                            View →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        href="/trips"
                        className="inline-block px-8 py-4 border-2 border-foreground text-foreground rounded-none font-light text-sm tracking-widest uppercase hover:bg-foreground hover:text-white transition-all duration-300"
                    >
                        Explore More
                    </Link>
                </div>
            </div>
        </section>
    );
}

