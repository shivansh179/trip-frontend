'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    breadcrumb?: string;
    backgroundImage?: string;
}

// Default background images for different pages
const defaultBackgrounds: Record<string, string> = {
    'Destinations': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'Experiences': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
    'Curated Experiences': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&q=80',
    'Stays': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    'Boutique Stays': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
    'Journal': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&q=80',
    'The Journal': 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=1920&q=80',
    'About': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1920&q=80',
    'Our Story': 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1920&q=80',
    'Contact': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
    'Plan Your Journey': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80',
};

export default function PageHero({ title, subtitle, breadcrumb, backgroundImage }: PageHeroProps) {
    // Try to find a default background if none provided
    const imageUrl = backgroundImage || defaultBackgrounds[breadcrumb || ''] || defaultBackgrounds[title] ||
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80';

    return (
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-primary/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 section-container">
                {/* Breadcrumb */}
                {breadcrumb && (
                    <div className="flex items-center gap-3 mb-6">
                        <Link
                            href="/"
                            className="text-caption uppercase tracking-[0.2em] text-cream/60 hover:text-cream transition-colors"
                        >
                            Home
                        </Link>
                        <span className="text-cream/40">→</span>
                        <span className="text-caption uppercase tracking-[0.2em] text-accent">
                            {breadcrumb}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h1 className="font-display text-display-xl max-w-4xl text-cream">
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-body-lg max-w-2xl mt-6 text-cream/70">
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
