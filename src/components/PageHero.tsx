'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PageHeroProps {
    title: string;
    subtitle?: string;
    breadcrumb?: string;
    backgroundImage?: string;
    overlayClassName?: string;
}

// Default background images for different pages
const defaultBackgrounds: Record<string, string> = {
    'Domestic': 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=80',
    'International': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&q=80',
    'Destinations': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80',
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

export default function PageHero({ title, subtitle, breadcrumb, backgroundImage, overlayClassName }: PageHeroProps) {
    const imageUrl = backgroundImage || defaultBackgrounds[breadcrumb || ''] || defaultBackgrounds[title] ||
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1920&q=80';

    return (
        <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 lg:pt-48 lg:pb-36 overflow-hidden bg-gray-900">
            {/* Background Image with Ken Burns */}
            <div className="absolute inset-0 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover animate-ken-burns"
                    priority
                />
                {/* Rich multi-layer overlay */}
                <div className={`absolute inset-0 ${overlayClassName || 'bg-gradient-to-b from-black/60 via-black/50 to-black/85'}`} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
                {/* Gold warm tint at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Decorative top gold line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 section-container">
                {/* Breadcrumb */}
                {breadcrumb && (
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-5 md:mb-7 animate-fade-in">
                        <Link
                            href="/"
                            className="text-caption uppercase tracking-[0.25em] text-white/50 hover:text-white/80 transition-colors"
                        >
                            Home
                        </Link>
                        <span className="text-accent/50">—</span>
                        <span className="text-caption uppercase tracking-[0.25em] text-accent font-semibold">
                            {breadcrumb}
                        </span>
                    </div>
                )}

                {/* Gold accent line */}
                <div className="w-12 h-0.5 bg-gradient-to-r from-accent to-accent/30 mb-5 md:mb-7" />

                {/* Title */}
                <h1 className="font-display text-display-xl max-w-4xl text-white text-balance leading-tight drop-shadow-lg animate-fade-up">
                    {title}
                </h1>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-base md:text-body-lg max-w-2xl mt-5 md:mt-7 text-white/65 leading-relaxed animate-fade-up" style={{ animationDelay: '0.15s' }}>
                        {subtitle}
                    </p>
                )}
            </div>
        </section>
    );
}
