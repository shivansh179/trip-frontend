'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, ChevronDown, Volume2, VolumeX } from 'lucide-react';

interface HeroProps {
    content?: {
        eyebrow?: string;
        title?: string;
        subtitle?: string;
        imageUrl?: string;
        ctaText?: string;
        ctaLink?: string;
        secondaryCtaText?: string;
        secondaryCtaLink?: string;
    };
    stats?: Array<{
        value: string;
        label: string;
    }>;
}

export default function Hero({ content, stats }: HeroProps) {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const heroRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Fallback content if not provided
    const eyebrow = content?.eyebrow || 'Curated Journeys for the Soul';
    const title = content?.title || "Discover the World's Hidden Treasures";
    const subtitle = content?.subtitle || 'We craft transformative travel experiences that connect you with authentic cultures, breathtaking landscapes, and unforgettable moments.';
    const imageUrl = content?.imageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&q=80';
    const ctaText = content?.ctaText || 'Start Your Journey';
    const ctaLink = content?.ctaLink || '/contact';
    const secondaryCtaText = content?.secondaryCtaText || 'Explore Destinations';
    const secondaryCtaLink = content?.secondaryCtaLink || '/destinations';

    // Default stats if not provided
    const displayStats = stats && stats.length > 0 ? stats : [
        { value: '150+', label: 'Curated Destinations' },
        { value: '25K+', label: 'Happy Travelers' },
        { value: '98%', label: 'Satisfaction Rate' },
    ];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                setMousePosition({ x, y });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Simple audio state
    const [isPlaying, setIsPlaying] = useState(false);

    // Simple toggle function
    const toggleAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (audio.paused) {
            audio.volume = 0.2;
            audio.play();
            setIsPlaying(true);
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    };

    return (
        <section ref={heroRef} className="relative h-screen min-h-[800px] overflow-hidden">
            {/* Background Music - Calm Ambient */}
            <audio
                ref={audioRef}
                loop
                preload="auto"
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
            />

            {/* Music Toggle Button */}
            <button
                onClick={toggleAudio}
                className="absolute bottom-24 right-8 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream hover:bg-white/20 transition-all duration-300 group"
                aria-label={isPlaying ? "Pause music" : "Play music"}
                title={isPlaying ? "🔇 Pause calm music" : "🎵 Play calm music"}
            >
                {isPlaying ? (
                    <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform animate-pulse" />
                ) : (
                    <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
                )}
            </button>

            {/* Video Background with Parallax */}
            <div
                className="absolute inset-0 transition-transform duration-300 ease-out"
                style={{
                    transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(1.1)`
                }}
            >
                {/* Video Background */}
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={imageUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    {/* High quality travel/tourism videos from Pexels (royalty-free) */}
                    <source
                        src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
                        type="video/mp4"
                    />
                    {/* Fallback for browsers that don't support video */}
                    Your browser does not support the video tag.
                </video>
                {/* Fallback Image for slow connections */}
                <Image
                    src={imageUrl}
                    alt="Hero background"
                    fill
                    priority
                    className="object-cover -z-10"
                />
                {/* Gradient Overlays for text readability */}
                <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-primary/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center section-container">
                <div className="max-w-3xl space-y-8">
                    {/* Eyebrow */}
                    <p
                        className="text-caption uppercase tracking-[0.3em] text-accent animate-fade-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        {eyebrow}
                    </p>

                    {/* Title */}
                    <h1
                        className="font-display text-display-xl text-cream leading-tight animate-fade-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        {title.split(' ').map((word, index, arr) => (
                            <span key={index}>
                                {index === arr.length - 2 || index === arr.length - 1 ? (
                                    <span className="italic">{word} </span>
                                ) : (
                                    <span>{word} </span>
                                )}
                            </span>
                        ))}
                    </h1>

                    {/* Subtitle */}
                    <p
                        className="text-body-lg text-cream/70 max-w-xl animate-fade-up"
                        style={{ animationDelay: '0.3s' }}
                    >
                        {subtitle}
                    </p>

                    {/* CTAs */}
                    <div
                        className="flex flex-wrap gap-4 pt-4 animate-fade-up"
                        style={{ animationDelay: '0.4s' }}
                    >
                        <Link href={ctaLink} className="btn-primary">
                            <span>{ctaText}</span>
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                        <Link href={secondaryCtaLink} className="btn-outline border-cream/30 text-cream hover:bg-cream/10">
                            <span>{secondaryCtaText}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-primary/90 to-transparent pt-24 pb-8">
                <div className="section-container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {displayStats.slice(0, 4).map((stat, index) => (
                            <div
                                key={index}
                                className="text-center md:text-left animate-fade-up"
                                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                            >
                                <div className="font-display text-3xl md:text-4xl text-cream">{stat.value}</div>
                                <div className="text-caption text-cream/50 uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden md:block">
                <ChevronDown className="w-6 h-6 text-cream/50" />
            </div>
        </section>
    );
}
