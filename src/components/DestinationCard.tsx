'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Destination } from '@/types';

interface DestinationCardProps {
    destination: Destination;
    index?: number;
    variant?: 'default' | 'featured' | 'compact';
    theme?: 'default' | 'domestic' | 'international';
}

const themeAccent = {
    default: 'bg-accent',
    domestic: 'bg-terracotta',
    international: 'bg-secondary',
};

const themeExplore = {
    default: 'text-accent',
    domestic: 'text-terracotta',
    international: 'text-secondary',
};

export default function DestinationCard({ destination, index = 0, variant = 'default', theme = 'default' }: DestinationCardProps) {
    const heights = {
        default: 'h-[360px] sm:h-[400px] md:h-[500px]',
        featured: 'h-[420px] sm:h-[500px] md:h-[650px]',
        compact: 'h-[280px] sm:h-[320px] md:h-[400px]',
    };

    return (
        <Link
            href={`/destinations/${destination.slug}`}
            className={`group block relative ${heights[variant]} overflow-hidden card-elegant`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Image */}
            <div className="absolute inset-0 transition-transform duration-700 ease-smooth group-hover:scale-105">
                <Image
                    src={destination.imageUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'}
                    alt={destination.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-8">
                {/* Trip Count Badge */}
                {destination.tripCount && (
                    <div className="absolute top-6 right-6 bg-cream/10 blur-overlay px-4 py-2 rounded-none">
                        <span className="text-caption uppercase tracking-widest text-cream">
                            {destination.tripCount} Experiences
                        </span>
                    </div>
                )}

                <div className="space-y-3 transform transition-transform duration-500 group-hover:translate-y-[-8px]">
                    <h3 className="font-display text-2xl sm:text-3xl md:text-4xl text-cream">
                        {destination.name}
                    </h3>

                    {destination.description && (
                        <p className="text-cream/60 text-sm leading-relaxed max-w-xs line-clamp-2">
                            {destination.description}
                        </p>
                    )}

                    {/* Explore Link */}
                    <div className={`flex items-center gap-2 pt-2 ${themeExplore[theme]} transition-all duration-500 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0`}>
                        <span className="text-caption uppercase tracking-[0.2em]">Explore</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </div>
                </div>

                {/* Animated Line */}
                <div className={`absolute bottom-0 left-0 w-full h-1 ${themeAccent[theme]} origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-smooth`} />
            </div>
        </Link>
    );
}
