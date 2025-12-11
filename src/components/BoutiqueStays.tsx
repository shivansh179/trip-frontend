'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Hotel {
    id: number;
    name: string;
    description?: string;
    imageUrl: string;
    location: string;
    city?: string;
    country?: string;
    rating: number;
    reviewCount: number;
    pricePerNight?: number | string | any;
    isBoutique?: boolean;
    isFeatured?: boolean;
}

interface BoutiqueStaysProps {
    hotels: Hotel[];
}

export default function BoutiqueStays({ hotels }: BoutiqueStaysProps) {
    return (
        <section className="section-padding bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-light text-foreground mb-4">
                        Our Boutique Stays
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto font-light">
                        Experience boutique stays that blend curated design, personalized comfort, and timeless hospitality in every detail.
                    </p>
                </div>

                {hotels.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-text-secondary">No boutique stays available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {hotels.slice(0, 8).map((hotel, index) => (
                            <Link
                                key={hotel.id}
                                href={`/hotels/${hotel.id}`}
                                className="group block relative h-[400px] overflow-hidden card-hover"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <Image
                                    src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'}
                                    alt={hotel.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                                
                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Star size={16} className="fill-yellow-400 text-yellow-400" />
                                            <span className="text-sm font-medium">{hotel.rating.toFixed(1)}</span>
                                        </div>
                                        <span className="text-sm text-gray-300">({hotel.reviewCount})</span>
                                    </div>
                                    
                                    <h3 className="text-xl md:text-2xl font-light mb-2 group-hover:text-yellow-400 transition-colors">
                                        {hotel.name}
                                    </h3>
                                    
                                    <div className="flex items-center gap-1 text-sm text-gray-300 mb-3">
                                        <MapPin size={14} />
                                        <span>{hotel.location}</span>
                                    </div>
                                    
                                    {hotel.pricePerNight && (
                                        <div className="text-lg font-light">
                                            From {formatPrice(hotel.pricePerNight)}/night
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Link
                        href="/hotels"
                        className="inline-block px-8 py-4 border-2 border-foreground text-foreground rounded-none font-light text-sm tracking-widest uppercase hover:bg-foreground hover:text-white transition-all duration-300"
                    >
                        Explore More
                    </Link>
                </div>
            </div>
        </section>
    );
}

