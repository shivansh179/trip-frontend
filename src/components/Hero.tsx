'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search, MapPin, Calendar, Users, Star, Shield, Clock,
    ChevronDown, Plane, Hotel, Compass, ArrowLeftRight,
    ArrowUpDown, Zap, MessageCircle, X, AlertCircle
} from 'lucide-react';
import { useVisitor } from '@/context/VisitorContext';
import { useCurrency } from '@/context/CurrencyContext';
import { api } from '@/lib/api';

interface HeroProps {
    content?: { eyebrow?: string; title?: string; subtitle?: string; imageUrl?: string; };
    stats?: Array<{ value: string; label: string }>;
}

interface Ad {
    id: number; title: string; description: string;
    imageUrl: string; redirectUrl: string; discountText?: string;
}

interface FlightResult {
    id: string; airline: string; airlineCode: string; airlineColor: string;
    flightNumber: string;
    departure: { airport: string; terminal: string; time: string };
    arrival: { airport: string; terminal: string; time: string };
    durationFormatted: string; durationMinutes: number;
    stops: number; stopInfo: string;
    pricePerPerson: number; totalPrice: number; currency: string;
    seatsLeft: number | null; isDemo: boolean;
}

const CITIES_DOMESTIC = [
    { name: 'New Delhi', code: 'DEL' }, { name: 'Mumbai', code: 'BOM' },
    { name: 'Bangalore', code: 'BLR' }, { name: 'Chennai', code: 'MAA' },
    { name: 'Hyderabad', code: 'HYD' }, { name: 'Kolkata', code: 'CCU' },
    { name: 'Jaipur', code: 'JAI' }, { name: 'Goa (Dabolim)', code: 'GOI' },
    { name: 'Kochi', code: 'COK' }, { name: 'Pune', code: 'PNQ' },
    { name: 'Ahmedabad', code: 'AMD' }, { name: 'Varanasi', code: 'VNS' },
    { name: 'Amritsar', code: 'ATQ' }, { name: 'Leh', code: 'IXL' },
    { name: 'Srinagar', code: 'SXR' }, { name: 'Udaipur', code: 'UDR' },
    { name: 'Jodhpur', code: 'JDH' }, { name: 'Chandigarh', code: 'IXC' },
    { name: 'Dehradun', code: 'DED' }, { name: 'Port Blair', code: 'IXZ' },
    { name: 'Bagdogra (Darjeeling)', code: 'IXB' }, { name: 'Indore', code: 'IDR' },
    { name: 'Bhopal', code: 'BHO' }, { name: 'Nagpur', code: 'NAG' },
    { name: 'Patna', code: 'PAT' }, { name: 'Guwahati', code: 'GAU' },
    { name: 'Thiruvananthapuram', code: 'TRV' }, { name: 'Coimbatore', code: 'CJB' },
    { name: 'Mangalore', code: 'IXE' }, { name: 'Bhubaneswar', code: 'BBI' },
];

const CITIES_INTL = [
    { name: 'Dubai (UAE)', code: 'DXB' }, { name: 'Abu Dhabi (UAE)', code: 'AUH' },
    { name: 'Bangkok, Thailand', code: 'BKK' }, { name: 'Phuket, Thailand', code: 'HKT' },
    { name: 'Bali (Denpasar)', code: 'DPS' }, { name: 'Singapore', code: 'SIN' },
    { name: 'Kuala Lumpur', code: 'KUL' }, { name: 'Colombo (Sri Lanka)', code: 'CMB' },
    { name: 'Kathmandu (Nepal)', code: 'KTM' }, { name: 'Male (Maldives)', code: 'MLE' },
    { name: 'Dhaka (Bangladesh)', code: 'DAC' }, { name: 'Hanoi (Vietnam)', code: 'HAN' },
    { name: 'Ho Chi Minh City', code: 'SGN' }, { name: 'Manila (Philippines)', code: 'MNL' },
    { name: 'Jakarta (Indonesia)', code: 'CGK' }, { name: 'Doha (Qatar)', code: 'DOH' },
    { name: 'Muscat (Oman)', code: 'MCT' }, { name: 'Kuwait City', code: 'KWI' },
    { name: 'Riyadh (Saudi Arabia)', code: 'RUH' }, { name: 'Istanbul (Turkey)', code: 'IST' },
    { name: 'London (Heathrow)', code: 'LHR' }, { name: 'Paris (CDG)', code: 'CDG' },
    { name: 'Frankfurt (Germany)', code: 'FRA' }, { name: 'Amsterdam', code: 'AMS' },
    { name: 'Tokyo (Japan)', code: 'NRT' }, { name: 'Seoul (South Korea)', code: 'ICN' },
    { name: 'Hong Kong', code: 'HKG' }, { name: 'Sydney (Australia)', code: 'SYD' },
    { name: 'Toronto (Canada)', code: 'YYZ' }, { name: 'New York (JFK)', code: 'JFK' },
];

const ALL_CITIES = [...CITIES_DOMESTIC, ...CITIES_INTL];

// Premium hero slideshow — luxury destinations
const HERO_SLIDES = [
    {
        src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920&q=85&auto=format&fit=crop',
        destination: 'Taj Mahal, India',
        tagline: 'Eternal wonders await',
        ken: 'animate-ken-burns',
    },
    {
        src: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1920&q=85&auto=format&fit=crop',
        destination: 'Bali, Indonesia',
        tagline: 'Heaven on earth',
        ken: 'animate-ken-burns-alt',
    },
    {
        src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=85&auto=format&fit=crop',
        destination: 'Dubai, UAE',
        tagline: 'Where luxury meets sky',
        ken: 'animate-ken-burns-rev',
    },
    {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85&auto=format&fit=crop',
        destination: 'Kashmir, India',
        tagline: 'Paradise in the Himalayas',
        ken: 'animate-ken-burns',
    },
    {
        src: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=1920&q=85&auto=format&fit=crop',
        destination: 'Maldives',
        tagline: 'Crystal blue infinity',
        ken: 'animate-ken-burns-alt',
    },
    {
        src: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=85&auto=format&fit=crop',
        destination: 'Thailand',
        tagline: 'Land of golden temples',
        ken: 'animate-ken-burns-rev',
    },
];

function HeroCityPicker({ value, onChange }: { value: string; onChange: (code: string) => void }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const selected = ALL_CITIES.find(c => c.code === value);

    useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 80); }, [open]);

    const filter = (list: typeof ALL_CITIES) =>
        query.trim()
            ? list.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase()))
            : list;

    const domestic = filter(CITIES_DOMESTIC);
    const intl = filter(CITIES_INTL);
    const pick = (code: string) => { onChange(code); setOpen(false); setQuery(''); };

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}
                className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl text-sm bg-white text-left flex items-center justify-between focus:outline-none focus:border-gray-400">
                <span className="truncate text-gray-800">{selected ? `${selected.name} (${selected.code})` : 'Select city'}</span>
                <ChevronDown size={13} className="shrink-0 text-gray-400 ml-1" />
            </button>
            {open && (
                <div className="fixed inset-0 z-[9999] flex flex-col justify-end sm:items-center sm:justify-center">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setOpen(false); setQuery(''); }} />
                    <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col" style={{ maxHeight: '85dvh' }}>
                        <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
                            <Search size={15} className="text-gray-400 shrink-0" />
                            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                                placeholder="Search city or airport code…"
                                className="flex-1 text-sm text-gray-900 outline-none placeholder:text-gray-400" />
                            <button onClick={() => { setOpen(false); setQuery(''); }} className="p-1 rounded-full hover:bg-gray-100 text-gray-400"><X size={15} /></button>
                        </div>
                        <div className="overflow-y-auto flex-1 pb-6">
                            {domestic.length > 0 && (
                                <>
                                    <div className="sticky top-0 bg-gray-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600">🇮🇳 India</div>
                                    {domestic.map(c => (
                                        <button key={c.code} type="button" onClick={() => pick(c.code)}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 ${value === c.code ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-800'}`}>
                                            <span>{c.name}</span><span className="text-xs text-gray-400 font-mono">{c.code}</span>
                                        </button>
                                    ))}
                                </>
                            )}
                            {intl.length > 0 && (
                                <>
                                    <div className="sticky top-0 bg-blue-50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-blue-700">✈️ International</div>
                                    {intl.map(c => (
                                        <button key={c.code} type="button" onClick={() => pick(c.code)}
                                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 active:bg-blue-50 ${value === c.code ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-800'}`}>
                                            <span>{c.name}</span><span className="text-xs text-gray-400 font-mono">{c.code}</span>
                                        </button>
                                    ))}
                                </>
                            )}
                            {domestic.length === 0 && intl.length === 0 && (
                                <p className="text-center text-gray-400 text-sm py-10">No cities found</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// All destinations listed on ylootrips.com
const CITY_SUGGESTIONS = [
    'Manali', 'Goa', 'Kashmir', 'Kerala', 'Auli', 'Jibhi', 'Tirthan Valley',
    'Kedarnath', 'Lakshadweep', 'Coorg', 'Spiti Valley', 'Chopta', 'Kedarkantha',
    'Kheerganga', 'Hampta Pass', 'Sar Pass', 'Prashar Lake', 'Har Ki Dun',
    'Roopkund', 'Chadar Trek', 'Ladakh', 'Leh', 'Kasol', 'Solang Valley',
    'Munnar', 'Alleppey', 'Kochi', 'Srinagar', 'Gulmarg', 'Pahalgam',
    'Bali', 'Dubai', 'Thailand', 'Singapore', 'Maldives', 'Sri Lanka',
    'Bangkok', 'Phuket', 'Marina Bay', 'Sentosa',
];

// Only locations actually listed on ylootrips.com
const POPULAR_DESTINATIONS = [
    { label: 'Manali',       icon: '🏔️', href: '/destinations/domestic?q=manali'       },
    { label: 'Kedarnath',    icon: '⛪', href: '/destinations/domestic?q=kedarnath'    },
    { label: 'Spiti',        icon: '🗻', href: '/destinations/domestic?q=spiti'        },
    { label: 'Kasol',        icon: '🌿', href: '/destinations/domestic?q=kasol'        },
    { label: 'Lakshadweep',  icon: '🏝️', href: '/destinations/domestic?q=lakshadweep' },
    { label: 'Coorg',        icon: '☕', href: '/destinations/domestic?q=coorg'        },
    { label: 'Bali',         icon: '🌴', href: '/destinations/international?q=bali'   },
    { label: 'Dubai',        icon: '✈️', href: '/destinations/international?q=dubai'  },
];

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(n); }
function airlineInitials(name: string) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

export default function Hero({ content, stats }: HeroProps) {
    const router = useRouter();
    const { visitor, setVisitor } = useVisitor();
    const { setCurrency } = useCurrency();

    // Tab
    const [activeTab, setActiveTab] = useState('trips');

    // Tours / Hotels fields
    const [fromCity, setFromCity] = useState('');
    const [toCity, setToCity] = useState('');
    const [tourQuery, setTourQuery] = useState('');
    const [tourSuggestions, setTourSuggestions] = useState<string[]>([]);
    const [showTourSug, setShowTourSug] = useState(false);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [showGuestPicker, setShowGuestPicker] = useState(false);
    const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
    const [toSuggestions, setToSuggestions] = useState<string[]>([]);
    const [showFromSug, setShowFromSug] = useState(false);
    const [showToSug, setShowToSug] = useState(false);

    // Holiday Packages extra fields
    const [tourDate, setTourDate] = useState('');
    const [tourNights, setTourNights] = useState('5');
    const [tourTravellers, setTourTravellers] = useState(2);
    const [showTourGuestPicker, setShowTourGuestPicker] = useState(false);
    const tourGuestRef = useRef<HTMLDivElement>(null);

    // Flight fields
    const [flightFrom, setFlightFrom] = useState('DEL');
    const [flightTo, setFlightTo] = useState('GOI');
    const [flightDate, setFlightDate] = useState('');
    const [flightReturn, setFlightReturn] = useState('');
    const [tripType, setTripType] = useState<'oneway' | 'return'>('oneway');
    const [flightPax, setFlightPax] = useState(2);

    // Flight results
    const [flightResults, setFlightResults] = useState<FlightResult[] | null>(null);
    const [flightLoading, setFlightLoading] = useState(false);
    const [flightError, setFlightError] = useState<string | null>(null);
    const [isDemo, setIsDemo] = useState(false);
    const [sortBy, setSortBy] = useState<'price' | 'duration'>('price');

    // Hero slideshow
    const [slideIndex, setSlideIndex] = useState(0);
    const [prevSlide, setPrevSlide] = useState<number | null>(null);

    // Ads
    const [ads, setAds] = useState<Ad[]>([]);
    const [adIndex, setAdIndex] = useState(0);

    const guestRef = useRef<HTMLDivElement>(null);
    const todayStr = new Date().toISOString().split('T')[0];

    const displayStats = stats && stats.length > 0 ? stats : [
        { value: '25K+', label: 'Happy Travelers' },
        { value: '4.9★', label: 'Avg Rating' },
        { value: '150+', label: 'Destinations' },
        { value: '3+', label: 'Years' },
    ];

    useEffect(() => {
        api.getActiveAds().then(r => setAds(r.data || [])).catch(() => {});
    }, []);

    useEffect(() => {
        if (ads.length < 2) return;
        const t = setInterval(() => setAdIndex(i => (i + 1) % ads.length), 4000);
        return () => clearInterval(t);
    }, [ads.length]);

    // Auto-advance hero slides every 6s
    useEffect(() => {
        const t = setInterval(() => {
            setSlideIndex(i => {
                const next = (i + 1) % HERO_SLIDES.length;
                setPrevSlide(i);
                return next;
            });
        }, 6000);
        return () => clearInterval(t);
    }, []);

    const swapFlightCities = useCallback(() => {
        setFlightFrom(flightTo);
        setFlightTo(flightFrom);
        setFlightResults(null);
    }, [flightFrom, flightTo]);
    const swapTourCities = useCallback(() => { setFromCity(toCity); setToCity(fromCity); }, [fromCity, toCity]);
    const filterSuggestions = useCallback((val: string) =>
        val.length > 0 ? CITY_SUGGESTIONS.filter(c => c.toLowerCase().includes(val.toLowerCase())).slice(0, 5) : []
    , []);

    const cityName = useCallback((code: string) => ALL_CITIES.find(c => c.code === code)?.name ?? code, []);

    const handleFlightSearch = useCallback(async () => {
        if (!flightDate) return;
        setFlightLoading(true);
        setFlightError(null);
        setFlightResults(null);
        try {
            const params = new URLSearchParams({
                origin: flightFrom, destination: flightTo,
                date: flightDate, adults: String(flightPax),
            });
            const res = await fetch(`/api/flights/search?${params}`);
            const json = await res.json();
            if (json.error) throw new Error(json.error);
            setFlightResults(json.data ?? []);
            setIsDemo(json.isDemo ?? false);
        } catch {
            setFlightError('Could not load flights. Please try again.');
        } finally {
            setFlightLoading(false);
        }
    }, [flightDate, flightFrom, flightTo, flightPax]);

    const handleTourSearch = useCallback(() => {
        const q = tourQuery.trim();
        if (!q) return;

        const OUR_KEYWORDS = [
            'manali','goa','kashmir','kerala','bali','dubai','thailand','singapore','maldives',
            'auli','jibhi','tirthan','kedarnath','lakshadweep','coorg','spiti','chopta',
            'kedarkantha','kheerganga','hampta','sar pass','prashar','har ki dun','roopkund',
            'chadar','ladakh','leh','kasol','solang','munnar','alleppey','kochi','srinagar',
            'gulmarg','pahalgam','ubud','seminyak','bangkok','phuket','marina bay','sentosa',
            'kullu','lahaul','honeymoon','bike trip','tirthan valley','prashar lake',
        ];

        const isListed = OUR_KEYWORDS.some((k) => q.toLowerCase().includes(k));

        if (isListed) {
            router.push(`/search?to=${encodeURIComponent(q)}`);
        } else {
            router.push(`/trip-planner?q=${encodeURIComponent(q)}`);
        }
    }, [tourQuery, router]);

    const handleHotelSearch = useCallback(() => {
        router.push(`/hotels${toCity ? `?q=${encodeURIComponent(toCity)}` : ''}`);
    }, [toCity, router]);

    const handleSearch = useCallback(() => {
        if (activeTab === 'flights') handleFlightSearch();
        else if (activeTab === 'trips') handleTourSearch();
        else handleHotelSearch();
    }, [activeTab, handleFlightSearch, handleTourSearch, handleHotelSearch]);

    const chooseVisitor = useCallback((type: 'indian' | 'foreigner') => {
        setVisitor(type);
        setCurrency(type === 'indian' ? 'INR' : 'USD');
    }, [setVisitor, setCurrency]);

    const sorted = useMemo(() =>
        flightResults
            ? [...flightResults]
                .filter(f => f.totalPrice > 0 && f.pricePerPerson > 0)
                .sort((a, b) => sortBy === 'price' ? a.totalPrice - b.totalPrice : a.durationMinutes - b.durationMinutes)
            : null
    , [flightResults, sortBy]);

    const buildBookingUrl = useCallback((f: FlightResult) => {
        const p = new URLSearchParams({
            airline: f.airline, code: f.airlineCode, flightNum: f.flightNumber,
            from: f.departure.airport, to: f.arrival.airport,
            dep: f.departure.time, arr: f.arrival.time,
            date: flightDate, dur: f.durationFormatted,
            stops: String(f.stops), pax: String(flightPax), price: String(f.totalPrice),
        });
        return `/flights/book?${p}`;
    }, [flightDate, flightPax]);

    const currentAd = ads[adIndex];
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = true;
        v.play().catch(() => {});
    }, []);

    return (
        <section className="relative min-h-[100svh] flex flex-col overflow-hidden bg-[#0A2752]">
            {/* Hero slideshow background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Fading-out previous slide */}
                {prevSlide !== null && (
                    <div key={`prev-${prevSlide}`} className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-0">
                        <Image
                            src={HERO_SLIDES[prevSlide].src}
                            alt={HERO_SLIDES[prevSlide].destination}
                            fill
                            className="object-cover"
                            sizes="100vw"
                        />
                    </div>
                )}
                {/* Active slide with Ken Burns */}
                {HERO_SLIDES.map((slide, idx) => (
                    <div
                        key={`slide-${idx}`}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === slideIndex ? 'opacity-100' : 'opacity-0'}`}
                        aria-hidden={idx !== slideIndex}
                    >
                        <Image
                            src={slide.src}
                            alt={slide.destination}
                            fill
                            priority={idx === 0}
                            className={`object-cover ${idx === slideIndex ? slide.ken : ''}`}
                            sizes="100vw"
                        />
                    </div>
                ))}

                {/* Video layer — plays on top of image slideshow when loaded */}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover z-[1]"
                >
                    <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4" type="video/mp4" />
                </video>

                {/* MMT-style navy blue gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A2752]/75 via-[#0f3d7a]/35 to-[#0A2752]/80 z-[2]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A2752]/50 via-transparent to-[#0A2752]/25 z-[2]" />


                {/* Slide dots — bottom center */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[3] flex gap-2">
                    {HERO_SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setPrevSlide(slideIndex); setSlideIndex(idx); }}
                            aria-label={`Go to slide ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                idx === slideIndex
                                    ? 'w-8 bg-accent shadow-[0_0_8px_rgba(196,167,125,0.8)]'
                                    : 'w-2 bg-white/40 hover:bg-white/70'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile ad strip */}
            {ads.length > 0 && (
                <div className="lg:hidden absolute top-[72px] left-0 right-0 z-30 bg-gradient-to-r from-primary via-secondary to-primary overflow-hidden">
                    <div className="animate-marquee whitespace-nowrap py-1.5">
                        {[...ads, ...ads].map((ad, idx) => (
                            <span key={idx} className="inline-block text-white text-xs font-bold mx-6">
                                🔥 {ad.discountText ? `${ad.discountText} · ` : ''}{ad.title}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="relative z-10 flex flex-col justify-center flex-1 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 pb-8">
                <div className="max-w-5xl mx-auto w-full">

                    {/* Visitor / Currency toggle — top right (hidden on mobile: ad strip overlaps) */}
                    <div className="hidden sm:flex justify-end mb-4">
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-1">
                            <button onClick={() => chooseVisitor('indian')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${visitor === 'indian' ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'}`}>
                                🇮🇳
                                <span className="sm:hidden font-bold">INR</span>
                                <span className="hidden sm:inline">Indian</span>
                            </button>
                            <button onClick={() => chooseVisitor('foreigner')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${visitor === 'foreigner' ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'}`}>
                                <span className="sm:hidden font-bold">$ USD</span>
                                <span className="hidden sm:inline">🌍 International</span>
                            </button>
                        </div>
                    </div>

                    {/* Headline — centered */}
                    <div className="text-center mb-6">
                        <p className="text-accent text-xs uppercase tracking-[0.35em] font-bold mb-2 drop-shadow">
                            {content?.eyebrow || '⭐ Rated 4.9 on Google · 25,000+ Trips Booked'}
                        </p>
                        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-3 drop-shadow-lg">
                            {content?.title
                                ? <span className="text-white">{content.title}</span>
                                : <>
                                    <span className="text-white">Explore India &amp; Beyond</span>
                                    <br />
                                    <span className="text-gold-shimmer italic">Trips From ₹9,999</span>
                                  </>
                            }
                        </h1>
                        <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto drop-shadow">
                            {content?.subtitle || 'Goa · Kashmir · Dubai · Bali · Singapore · Thailand — Book in 2 minutes, pay ₹5,000 to confirm.'}
                        </p>
                    </div>

                    {/* ── MMT-style Search Widget ── */}
                    <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.35)] overflow-visible max-w-4xl mx-auto" style={{ colorScheme: 'light' }}>
                        {/* Tab bar */}
                        <div className="flex rounded-t-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2744 0%, #1a3c5e 100%)' }}>
                            {[
                                { id: 'trips',   label: 'Holiday Packages', short: 'Holidays', icon: Compass },
                                { id: 'flights', label: 'Flights',           short: 'Flights',  icon: Plane   },
                                { id: 'hotels',  label: 'Hotels',            short: 'Hotels',   icon: Hotel   },
                            ].map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button key={tab.id} onClick={() => { setActiveTab(tab.id); setFlightResults(null); }}
                                        className={`flex items-center gap-2 px-5 py-4 text-sm font-bold transition-all flex-1 justify-center border-b-[3px] ${
                                            isActive
                                                ? 'bg-white text-[#008cff] border-[#008cff]'
                                                : 'text-white/70 border-transparent hover:text-white hover:bg-white/10'
                                        }`}>
                                        <Icon size={17} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">{tab.short}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="p-5 sm:p-6 bg-white text-gray-900">
                                    {/* ── FLIGHTS TAB ── */}
                                    {activeTab === 'flights' && (
                                        <>
                                            {/* Trip type */}
                                            <div className="flex gap-1 mb-3">
                                                {(['oneway', 'return'] as const).map(t => (
                                                    <button key={t} onClick={() => { setTripType(t); setFlightResults(null); }}
                                                        className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${tripType === t ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-300 text-gray-500 hover:border-gray-300'}`}>
                                                        {t === 'oneway' ? 'One Way' : 'Round Trip'}
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-2 flex-wrap">
                                                {/* From city dropdown */}
                                                <div className="relative flex-1 min-w-[140px]">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">From</label>
                                                    <div className="relative">
                                                        <Plane size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rotate-45 z-10 pointer-events-none" />
                                                        <HeroCityPicker value={flightFrom} onChange={v => { setFlightFrom(v); setFlightResults(null); }} />
                                                    </div>
                                                </div>

                                                {/* Swap */}
                                                <button onClick={swapFlightCities}
                                                    className="self-center sm:mt-1 w-8 h-8 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 flex items-center justify-center transition-all hover:rotate-180 duration-300">
                                                    <ArrowUpDown size={13} className="text-gray-600" />
                                                </button>

                                                {/* To city dropdown */}
                                                <div className="relative flex-1 min-w-[140px]">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">To</label>
                                                    <div className="relative">
                                                        <Plane size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none" />
                                                        <HeroCityPicker value={flightTo} onChange={v => { setFlightTo(v); setFlightResults(null); }} />
                                                    </div>
                                                </div>

                                                {/* Depart date */}
                                                <div className="relative sm:w-36">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Depart</label>
                                                    <div className="relative">
                                                        <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input type="date" value={flightDate} min={todayStr}
                                                            onChange={e => { setFlightDate(e.target.value); setFlightResults(null); }}
                                                            className="w-full pl-8 pr-2 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" />
                                                    </div>
                                                </div>

                                                {/* Return date */}
                                                {tripType === 'return' && (
                                                    <div className="relative sm:w-36">
                                                        <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Return</label>
                                                        <div className="relative">
                                                            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input type="date" value={flightReturn} min={flightDate || todayStr}
                                                                onChange={e => setFlightReturn(e.target.value)}
                                                                className="w-full pl-8 pr-2 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Passengers */}
                                                <div className="relative sm:w-32 shrink-0" ref={guestRef}>
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Passengers</label>
                                                    <button onClick={() => setShowGuestPicker(!showGuestPicker)}
                                                        className="w-full flex items-center pl-8 pr-3 py-4 border border-gray-200 rounded-xl text-sm text-left hover:border-gray-300 transition-colors">
                                                        <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <span className="text-gray-700">{flightPax} Pax</span>
                                                        <ChevronDown size={12} className="ml-auto text-gray-400" />
                                                    </button>
                                                    {showGuestPicker && (
                                                        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-40">
                                                            <p className="text-xs text-gray-500 mb-2 font-semibold">Passengers</p>
                                                            <div className="flex items-center justify-between">
                                                                <button onClick={() => setFlightPax(Math.max(1, flightPax - 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">−</button>
                                                                <span className="text-lg font-semibold w-8 text-center">{flightPax}</span>
                                                                <button onClick={() => setFlightPax(Math.min(9, flightPax + 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">+</button>
                                                            </div>
                                                            <button onClick={() => setShowGuestPicker(false)} className="mt-3 w-full py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800">Done</button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Search */}
                                                <button onClick={handleFlightSearch} disabled={!flightDate || flightLoading}
                                                    className="flex items-center justify-center gap-2 px-5 py-4 bg-[#008cff] hover:bg-[#0077dd] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95 shrink-0 whitespace-nowrap">
                                                    {flightLoading
                                                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Searching...</>
                                                        : <><Search size={16} /> Search</>
                                                    }
                                                </button>
                                            </div>

                                            {/* Flight Results inline */}
                                            {flightError && (
                                                <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                                    <AlertCircle size={15} className="shrink-0" /> {flightError}
                                                </div>
                                            )}


                                            {sorted && sorted.length > 0 && (
                                                <div className="mt-4 space-y-2">
                                                    {/* Results header */}
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-semibold text-gray-900">{sorted.length} flights</span> · {cityName(flightFrom)} → {cityName(flightTo)} · {flightDate}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-xs text-gray-400">Sort:</span>
                                                            {(['price', 'duration'] as const).map(s => (
                                                                <button key={s} onClick={() => setSortBy(s)}
                                                                    className={`px-2.5 py-0.5 rounded text-xs font-semibold transition-all ${sortBy === s ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-700'}`}>
                                                                    {s === 'price' ? 'Cheapest' : 'Fastest'}
                                                                </button>
                                                            ))}
                                                            <button onClick={() => setFlightResults(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {sorted.map((f, i) => (
                                                        <div key={f.id}
                                                            className={`border rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 relative bg-white ${i === 0 && sortBy === 'price' ? 'border-green-400 ring-1 ring-green-400' : 'border-gray-200'}`}>
                                                            {i === 0 && sortBy === 'price' && (
                                                                <span className="absolute -top-2.5 left-3 bg-green-500 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold rounded-full flex items-center gap-1">
                                                                    <Zap size={9} /> Best Price
                                                                </span>
                                                            )}

                                                            {/* Airline */}
                                                            <div className="flex items-center gap-2 min-w-[110px]">
                                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                                                                    style={{ backgroundColor: f.airlineColor || '#6B7355' }}>
                                                                    {airlineInitials(f.airline)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-semibold text-gray-800">{f.airline}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase">{f.flightNumber}</p>
                                                                </div>
                                                            </div>

                                                            {/* Route */}
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <div className="text-center">
                                                                    <p className="text-lg font-bold text-gray-900">{f.departure.time}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase">{f.departure.airport}</p>
                                                                </div>
                                                                <div className="flex-1 flex flex-col items-center gap-0.5">
                                                                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                        <Clock size={9} />{f.durationFormatted}
                                                                    </p>
                                                                    <div className="w-full flex items-center gap-1">
                                                                        <div className="w-1.5 h-1.5 rounded-full border border-gray-300" />
                                                                        <div className="flex-1 h-px bg-gray-300" />
                                                                        <Plane size={11} className="text-gray-400" />
                                                                        <div className="flex-1 h-px bg-gray-300" />
                                                                        <div className="w-1.5 h-1.5 rounded-full border border-gray-300" />
                                                                    </div>
                                                                    <p className={`text-[10px] font-semibold ${f.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                                                        {f.stopInfo}
                                                                    </p>
                                                                </div>
                                                                <div className="text-center">
                                                                    <p className="text-lg font-bold text-gray-900">{f.arrival.time}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase">{f.arrival.airport}</p>
                                                                </div>
                                                            </div>

                                                            {/* Price + Book */}
                                                            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
                                                                <div className="text-right">
                                                                    <p className="text-xl font-bold text-gray-900">₹{fmt(f.totalPrice)}</p>
                                                                    <p className="text-[10px] text-gray-400">₹{fmt(f.pricePerPerson)}/person</p>
                                                                    {f.seatsLeft && f.seatsLeft <= 5 && (
                                                                        <p className="text-[10px] text-red-500 font-semibold animate-pulse">{f.seatsLeft} seats left!</p>
                                                                    )}
                                                                </div>
                                                                <Link href={buildBookingUrl(f)}
                                                                    className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap">
                                                                    <Plane size={12} /> Book Now
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <p className="text-center text-gray-400 text-[10px] uppercase tracking-wider pt-1">
                                                        Prices indicative · Final fare confirmed on booking
                                                    </p>
                                                </div>
                                            )}

                                            {sorted && sorted.length === 0 && (
                                                <div className="mt-4 text-center py-6 text-gray-500 text-sm bg-gray-50 rounded-xl">
                                                    No flights found for this route on {flightDate}. Try a different date.
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* ── TOURS TAB ── */}
                                    {activeTab === 'trips' && (
                                        <>
                                            {/* MMT-style: Destination + Date + Nights + Travellers */}
                                            <div className="flex flex-col sm:flex-row gap-2">

                                                {/* Going To — destination with suggestions */}
                                                <div className="relative flex-1 min-w-0">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Going To</label>
                                                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff] pointer-events-none z-10" />
                                                    <input
                                                        type="text"
                                                        placeholder="Destination, city or country"
                                                        value={tourQuery}
                                                        autoComplete="off"
                                                        onChange={e => {
                                                            const v = e.target.value;
                                                            setTourQuery(v);
                                                            setTourSuggestions(
                                                                v.length > 0
                                                                    ? CITY_SUGGESTIONS.filter(c => c.toLowerCase().includes(v.toLowerCase())).slice(0, 6)
                                                                    : []
                                                            );
                                                            setShowTourSug(v.length > 0);
                                                        }}
                                                        onFocus={() => { if (tourQuery.length > 0) setShowTourSug(true); }}
                                                        onBlur={() => setTimeout(() => setShowTourSug(false), 150)}
                                                        onKeyDown={e => { if (e.key === 'Enter') handleTourSearch(); }}
                                                        className="w-full pl-9 pr-3 py-4 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#008cff] focus:ring-2 focus:ring-blue-100 transition-colors"
                                                    />
                                                    {showTourSug && (
                                                        <ul className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                                                            {tourSuggestions.map(s => (
                                                                <li key={s} onMouseDown={() => { setTourQuery(s); setShowTourSug(false); setTimeout(handleTourSearch, 50); }}
                                                                    className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-blue-50 cursor-pointer text-gray-800">
                                                                    <MapPin size={11} className="text-[#008cff] shrink-0" />{s}
                                                                </li>
                                                            ))}
                                                            {tourSuggestions.length === 0 && tourQuery.length > 0 && (
                                                                <li onMouseDown={() => { router.push(`/trip-planner?q=${encodeURIComponent(tourQuery)}`); setShowTourSug(false); }}
                                                                    className="flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer bg-violet-50 hover:bg-violet-100 text-violet-700 font-semibold">
                                                                    ✨ Plan custom trip to &ldquo;{tourQuery}&rdquo; with AI →
                                                                </li>
                                                            )}
                                                            {tourSuggestions.length > 0 && (
                                                                <li onMouseDown={() => { router.push('/trip-planner'); setShowTourSug(false); }}
                                                                    className="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-400 border-t border-gray-100">
                                                                    ✨ Don&apos;t see your destination? Plan a custom trip →
                                                                </li>
                                                            )}
                                                        </ul>
                                                    )}
                                                </div>

                                                {/* Departure Date */}
                                                <div className="relative sm:w-38">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Departure</label>
                                                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff] pointer-events-none" />
                                                    <input type="date" value={tourDate} min={todayStr}
                                                        onChange={e => setTourDate(e.target.value)}
                                                        className="w-full pl-9 pr-2 py-4 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#008cff] focus:ring-2 focus:ring-blue-100 transition-colors" />
                                                </div>

                                                {/* Nights */}
                                                <div className="relative sm:w-32">
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Nights</label>
                                                    <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff] pointer-events-none" />
                                                    <select value={tourNights} onChange={e => setTourNights(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-4 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#008cff] focus:ring-2 focus:ring-blue-100 appearance-none bg-white transition-colors">
                                                        {[2,3,4,5,6,7,8,9,10,12,14].map(n => (
                                                            <option key={n} value={n}>{n} Nights</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>

                                                {/* Travellers */}
                                                <div className="relative sm:w-34 shrink-0" ref={tourGuestRef}>
                                                    <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Travellers</label>
                                                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008cff] pointer-events-none" />
                                                    <button type="button" onClick={() => setShowTourGuestPicker(!showTourGuestPicker)}
                                                        className="w-full flex items-center pl-9 pr-3 py-4 border border-gray-200 rounded-xl text-sm font-medium text-left hover:border-[#008cff] transition-colors">
                                                        <span className="text-gray-800">{tourTravellers} {tourTravellers === 1 ? 'Person' : 'People'}</span>
                                                        <ChevronDown size={12} className="ml-auto text-gray-400 shrink-0" />
                                                    </button>
                                                    {showTourGuestPicker && (
                                                        <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 w-44">
                                                            <p className="text-xs text-gray-500 mb-3 font-semibold uppercase tracking-wide">Travellers</p>
                                                            <div className="flex items-center justify-between gap-3">
                                                                <button onClick={() => setTourTravellers(Math.max(1, tourTravellers - 1))} className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-[#008cff] flex items-center justify-center text-lg font-bold transition-colors">−</button>
                                                                <span className="text-xl font-bold w-8 text-center text-gray-900">{tourTravellers}</span>
                                                                <button onClick={() => setTourTravellers(Math.min(20, tourTravellers + 1))} className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-[#008cff] flex items-center justify-center text-lg font-bold transition-colors">+</button>
                                                            </div>
                                                            <button onClick={() => setShowTourGuestPicker(false)} className="mt-4 w-full py-2 bg-[#008cff] text-white text-xs font-bold rounded-lg hover:bg-[#0077dd] transition-colors">Done</button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Search button */}
                                                <button onClick={handleTourSearch}
                                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-[#008cff] hover:bg-[#0077dd] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95 shrink-0 text-base">
                                                    <Search size={18} /><span className="hidden sm:inline">Search</span><span className="sm:hidden">Search Trips</span>
                                                </button>
                                            </div>

                                            {/* Trending chips */}
                                            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                                <span className="text-xs text-gray-400 font-semibold shrink-0 uppercase tracking-wide">Trending:</span>
                                                {POPULAR_DESTINATIONS.map(dest => (
                                                    <Link key={dest.label} href={dest.href}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-full text-xs text-gray-700 font-medium transition-all">
                                                        <span>{dest.icon}</span><span>{dest.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* ── HOTELS TAB ── */}
                                    {activeTab === 'hotels' && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="relative flex-1">
                                                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Destination</label>
                                                <div className="relative">
                                                    <MapPin size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input type="text" placeholder="City or hotel name" value={toCity}
                                                        onChange={e => setToCity(e.target.value)}
                                                        className="w-full pl-8 pr-3 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100" />
                                                </div>
                                            </div>
                                            <div className="relative sm:w-36">
                                                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Check-in</label>
                                                <div className="relative">
                                                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input type="date" value={checkIn} min={todayStr} onChange={e => setCheckIn(e.target.value)}
                                                        className="w-full pl-8 pr-2 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" />
                                                </div>
                                            </div>
                                            <div className="relative sm:w-36">
                                                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Check-out</label>
                                                <div className="relative">
                                                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input type="date" value={checkOut} min={checkIn || todayStr} onChange={e => setCheckOut(e.target.value)}
                                                        className="w-full pl-8 pr-2 py-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-400" />
                                                </div>
                                            </div>
                                            <div className="relative sm:w-28 shrink-0">
                                                <label className="absolute -top-2 left-3 bg-white px-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide z-10">Guests</label>
                                                <button onClick={() => setShowGuestPicker(!showGuestPicker)}
                                                    className="w-full flex items-center pl-8 pr-3 py-4 border border-gray-200 rounded-xl text-sm text-left hover:border-gray-300">
                                                    <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <span className="text-gray-700">{guests} {guests > 1 ? 'Guests' : 'Guest'}</span>
                                                    <ChevronDown size={12} className="ml-auto text-gray-400" />
                                                </button>
                                                {showGuestPicker && (
                                                    <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-40">
                                                        <div className="flex items-center justify-between">
                                                            <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">−</button>
                                                            <span className="text-lg font-semibold w-8 text-center">{guests}</span>
                                                            <button onClick={() => setGuests(Math.min(20, guests + 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg">+</button>
                                                        </div>
                                                        <button onClick={() => setShowGuestPicker(false)} className="mt-3 w-full py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800">Done</button>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={handleHotelSearch}
                                                className="flex items-center justify-center gap-2 px-5 py-4 bg-[#008cff] hover:bg-[#0077dd] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 active:scale-95 shrink-0">
                                                <Search size={16} /><span>Search</span>
                                            </button>
                                        </div>
                                    )}

                        </div>
                    </div>

                    {/* Trust bar - on dark hero background */}
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-5 sm:gap-8">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Star size={15} className="text-amber-400 fill-amber-400" />
                            <span><strong className="text-white">4.9/5</strong> · 2,400+ reviews</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Shield size={15} className="text-green-400" />
                            <span><strong className="text-white">Secure</strong> · Licensed &amp; insured</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <Clock size={15} className="text-blue-400" />
                            <span><strong className="text-white">1-hour</strong> response guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats bar */}
            <div className="relative z-10 bg-black/50 backdrop-blur-sm border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {displayStats.slice(0, 4).map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs text-white/50 uppercase tracking-wider mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
