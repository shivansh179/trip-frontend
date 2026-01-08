'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Ad {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    redirectUrl: string;
    discountText?: string;
}

export default function AdCarousel() {
    const [ads, setAds] = useState<Ad[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await api.getActiveAds();
                setAds(response.data || []);
            } catch (error) {
                console.error('Failed to fetch ads:', error);
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        if (ads.length === 0) return;

        const interval = setInterval(() => {
            // Start slide out animation
            setSlideDirection('out');
            setIsAnimating(true);

            // After slide out, change index and slide in
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % ads.length);
                setSlideDirection('in');

                // Reset animation state after slide in
                setTimeout(() => {
                    setIsAnimating(false);
                }, 500);
            }, 500);
        }, 4000);

        return () => clearInterval(interval);
    }, [ads.length]);

    if (ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    return (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden lg:block">
            <Link
                href={currentAd.redirectUrl}
                className={`block relative w-72 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer
                    ${isAnimating ? (slideDirection === 'out' ? 'animate-slide-out-right' : 'animate-slide-in-right') : ''}`}
            >
                {/* Discount Badge - Eye-catching */}
                {currentAd.discountText && (
                    <div className="absolute top-3 right-3 z-10 animate-pulse">
                        <div className="bg-linear-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-3">
                            🔥 {currentAd.discountText}
                        </div>
                    </div>
                )}

                {/* Ad Image */}
                <div className="relative h-40 overflow-hidden">
                    <Image
                        src={currentAd.imageUrl}
                        alt={currentAd.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                </div>

                {/* Ad Content */}
                <div className="p-4">
                    <h3 className="font-display text-lg text-cream font-semibold mb-1">
                        {currentAd.title}
                    </h3>
                    <p className="text-sm text-cream/70 line-clamp-2">
                        {currentAd.description}
                    </p>

                    {/* CTA */}
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-accent uppercase tracking-wider font-semibold">Book Now →</span>
                        <div className="flex gap-1">
                            {ads.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-accent' : 'bg-cream/30'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-2xl border border-accent/20 pointer-events-none" />
            </Link>
        </div>
    );
}

