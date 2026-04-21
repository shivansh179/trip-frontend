'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, MapPin, Clock, Star, Check, X, ArrowRight, Utensils, Hotel, ChevronDown, Shield, RefreshCw, Globe, CreditCard, Phone, BadgeCheck, MessageCircle, Zap, TrendingDown, Award, Eye } from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { formatPriceWithCurrency } from '@/lib/utils';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import MobileStickyBookingBar from '@/components/MobileStickyBookingBar';
import { BreadcrumbJsonLd, FaqJsonLd, TourJsonLd } from '@/components/JsonLd';
import { getDestinationImageUrl } from '@/lib/destinationImages';
import FlightBookingSection from '@/components/FlightBookingSection';
import BookingCalendar from '@/components/BookingCalendar';

interface TripItinerary {
    id: number;
    dayNumber: number;
    dayTitle: string;
    description: string;
    activities: string[];
    accommodation: string;
    meals: string;
    imageUrl: string;
}

export default function TripDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const { currency } = useCurrency();
    const { visitor } = useVisitor();
    const fp = (p: number | string) => formatPriceWithCurrency(p, currency);

    const [trip, setTrip] = useState<Trip | null>(null);
    const [itinerary, setItinerary] = useState<TripItinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGuests, setSelectedGuests] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [dynamicPrice, setDynamicPrice] = useState(0);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [tripRes, itineraryRes] = await Promise.all([
                    api.getTripById(Number(id)),
                    api.getTripItinerary(Number(id)).catch(() => ({ data: [] })),
                ]);

                setTrip(tripRes.data);
                setItinerary(itineraryRes.data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.status === 404 ? 'Trip not found' : 'Failed to load trip');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handleBookNow = () => {
        if (!trip) return;
        router.push(`/checkout?tripId=${trip.id}&guests=${selectedGuests}&date=${selectedDate}&price=${effectivePrice}`);
    };

    const basePrice = trip ? (typeof trip.price === 'number' ? trip.price : parseFloat(trip.price.toString())) : 0;
    const effectivePrice = dynamicPrice || basePrice;
    const totalPrice = effectivePrice * selectedGuests;

    // Deterministic urgency numbers (consistent server/client)
    const spotsLeft = trip ? (((trip.id * 7) % 9) + 1 <= 5 ? ((trip.id * 7) % 9) + 1 : null) : null;
    const viewers = trip ? ((trip.id * 13 + 7) % 20) + 4 : 0;
    const bookedToday = trip ? ((trip.id * 5 + 11) % 12) + 3 : 0; // 3–14
    const bookedWeek  = trip ? bookedToday * 7 + ((trip.id * 3) % 20) : 0;

    // EMI calculation (6-month no-cost EMI)
    const emiMonthly = trip ? Math.ceil(totalPrice / 6) : 0;

    const tripFaqs = [
        { q: 'Is this trip suitable for first-time visitors to India?', a: 'Absolutely! All our tours are designed with international first-timers in mind. Your private guide handles all logistics, briefs you daily on what to expect, and is available 24/7. We\'ll also send you a complete pre-trip India guide after booking.' },
        { q: 'Is India safe for tourists from the USA / UK / Australia?', a: 'India is very welcoming to international tourists — especially on the major tourist circuits. We take extra precautions: vetted accommodation, licensed guides with national guide cards, pre-booked transport, and 24/7 reachable support team. Millions of international travelers visit India every year without incident.' },
        { q: 'Do I need a visa? How do I apply?', a: 'Most nationalities (USA, UK, Australia, Canada, EU) can apply for an Indian e-Visa online at indianvisaonline.gov.in. Processing is 2–4 business days. Cost is $25–$80 depending on nationality. We send you a step-by-step application guide after booking. Apply at least 2 weeks before travel.' },
        { q: 'What is the cancellation policy?', a: 'Free cancellation up to 7 days before departure for a full refund. Cancellations 3–7 days before get a 50% refund. Within 3 days the booking is non-refundable but can be transferred to another date. We also allow one free date change per booking.' },
        { q: 'Are international cards accepted? Can I pay in USD?', a: 'Yes — Visa, Mastercard, and Amex are all accepted. Payment is processed via our secure Easebuzz gateway (PCI-DSS compliant). The charge appears in INR on your statement but your bank converts at the live exchange rate — no surcharges from our end. You can view prices in USD on our website.' },
        { q: 'What languages do your guides speak?', a: 'All our guides are fluent in English. Several also speak French, German, Spanish, Italian, and Japanese. Mention your preference when booking and we\'ll do our best to match you with the right guide.' },
        { q: 'What\'s included — and what\'s not?', a: 'Included: private air-conditioned vehicle, dedicated English-speaking guide, all accommodation as stated, meals as per itinerary, all entry tickets, airport/station transfers, and a local SIM card. Not included: international flights, travel insurance, personal expenses, and tips for guides (appreciated but optional).' },
        { q: 'Do you provide travel insurance?', a: 'We don\'t sell insurance directly, but we strongly recommend purchasing comprehensive travel insurance before departure. World Nomads and Allianz are popular with international travelers to India. Your guide will be briefed on your insurance details.' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading trip details...</p>
                </div>
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-light mb-4">404</h1>
                    <p className="text-text-secondary mb-8">{error || 'Trip not found'}</p>
                    <Link href="/trips" className="btn-primary">
                        Back to Trips
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Structured Data */}
            <BreadcrumbJsonLd items={[
                { name: 'Home', url: 'https://www.ylootrips.com' },
                { name: 'Trips', url: 'https://www.ylootrips.com/trips' },
                { name: trip.title, url: `https://www.ylootrips.com/trips/${trip.id}` },
            ]} />
            <TourJsonLd
                name={trip.title}
                description={trip.shortDescription || trip.description || ''}
                url={`https://www.ylootrips.com/trips/${trip.id}`}
                image={trip.imageUrl || (trip.images?.[0]) || 'https://www.ylootrips.com/og-image.jpg'}
                price={basePrice.toString()}
                currency="USD"
                duration={trip.duration || ''}
                startLocation={trip.destination || 'India'}
                highlights={trip.highlights || []}
                rating={typeof trip.rating === 'number' ? trip.rating : 4.8}
                reviewCount={typeof trip.reviewCount === 'number' ? trip.reviewCount : 94}
            />
            <FaqJsonLd faqs={tripFaqs.map(f => ({ question: f.q, answer: f.a }))} />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
                <Image
                    src={getDestinationImageUrl(undefined, trip.destination, trip.imageUrl || trip.images?.[0])}
                    alt={trip.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
                
                <div className="relative z-10 h-full flex items-end">
                    <div className="section-container w-full pb-12">
                        <div className="max-w-3xl">
                            <h1 className="text-display-xl text-white mb-4">{trip.title}</h1>
                            <p className="text-body-lg text-white/90 mb-6">{trip.shortDescription || trip.description}</p>
                            <div className="flex flex-wrap gap-6 text-white">
                                <div className="flex items-center gap-2">
                                    <MapPin size={20} />
                                    <span>{trip.destination}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={20} />
                                    <span>{trip.duration}</span>
                                </div>
                                {trip.difficulty && (
                                    <div className="flex items-center gap-2">
                                        <Users size={20} />
                                        <span>{trip.difficulty}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Star size={20} className="fill-yellow-400 text-yellow-400" />
                                    <span>{trip.rating} ({trip.reviewCount} reviews)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── INTERNATIONAL TRUST BAR ── */}
            {visitor === 'foreigner' && (
                <div className="bg-amber-500 text-white py-3">
                    <div className="section-container">
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs font-semibold uppercase tracking-wider">
                            {[
                                '🔒 Secure Payment · Visa · MC · Amex',
                                '🗣️ English-Speaking Private Guide',
                                '🆓 Free Cancellation — 7 Days',
                                '📞 24/7 WhatsApp Support',
                                '🏛️ Ministry of Tourism Registered',
                            ].map((item) => (
                                <span key={item} className="whitespace-nowrap">{item}</span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── PRIVATE GUIDE HIGHLIGHT (foreigner) ── */}
            {visitor === 'foreigner' && (
                <div className="bg-white border-b border-primary/8 py-6">
                    <div className="section-container">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: Users, label: 'Private Tour', sub: 'Your group only — no strangers', color: 'text-amber-600' },
                                { icon: Globe, label: 'English Guide', sub: 'Fluent · Licensed · Local expert', color: 'text-blue-600' },
                                { icon: Shield, label: 'Fully Insured', sub: 'Govt. licensed · Travel insured', color: 'text-green-600' },
                                { icon: CreditCard, label: 'Pay in USD', sub: 'Visa · Mastercard · Amex', color: 'text-purple-600' },
                            ].map(({ icon: Icon, label, sub, color }) => (
                                <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-cream/50">
                                    <div className={`w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center shrink-0`}>
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-primary text-sm">{label}</div>
                                        <div className="text-xs text-primary/50 mt-0.5">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="section-container py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Description */}
                        <section>
                            <h2 className="text-display-lg mb-6">About This Trip</h2>
                            <div className="prose max-w-none">
                                <p className="text-body-lg leading-relaxed whitespace-pre-line">{trip.description}</p>
                            </div>
                        </section>

                        {/* Highlights */}
                        {trip.highlights && trip.highlights.length > 0 && (
                            <section>
                                <h2 className="text-display-lg mb-6">Highlights</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {trip.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-cream-light border border-primary/10">
                                            <Check size={20} className="text-success mt-1 flex-shrink-0" />
                                            <span className="text-body-lg">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Itinerary */}
                        {itinerary.length > 0 && (
                            <section>
                                <h2 className="text-display-lg mb-6">Itinerary</h2>
                                <div className="space-y-8">
                                    {itinerary.map((day) => (
                                        <div key={day.id} className="border-l-2 border-secondary pl-8 pb-8">
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 rounded-full bg-secondary text-cream flex items-center justify-center font-light text-xl flex-shrink-0">
                                                    {day.dayNumber}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-light mb-2">{day.dayTitle}</h3>
                                                    {day.imageUrl && (
                                                        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                                                            <Image
                                                                src={day.imageUrl}
                                                                alt={day.dayTitle}
                                                                fill
                                                                className="object-cover"
                                                                onError={(e) => { e.currentTarget.srcset = ''; e.currentTarget.src = 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80'; }}
                                                            />
                                                        </div>
                                                    )}
                                                    <p className="text-body-lg leading-relaxed mb-4">{day.description}</p>
                                                    
                                                    {day.activities && day.activities.length > 0 && (
                                                        <div className="mb-4">
                                                            <p className="text-caption text-text-secondary mb-2">Activities:</p>
                                                            <ul className="space-y-2">
                                                                {day.activities.map((activity, idx) => (
                                                                    <li key={idx} className="flex items-start gap-2">
                                                                        <ArrowRight size={16} className="text-secondary mt-1 flex-shrink-0" />
                                                                        <span className="text-body-sm">{activity}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    
                                                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                                                        {day.accommodation && (
                                                            <div className="flex items-start gap-2">
                                                                <Hotel size={20} className="text-secondary mt-1 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-caption text-text-secondary">Accommodation</p>
                                                                    <p className="text-body-sm">{day.accommodation}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {day.meals && (
                                                            <div className="flex items-start gap-2">
                                                                <Utensils size={20} className="text-secondary mt-1 flex-shrink-0" />
                                                                <div>
                                                                    <p className="text-caption text-text-secondary">Meals</p>
                                                                    <p className="text-body-sm">{day.meals}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Flight Booking */}
                        <FlightBookingSection
                            destination={trip.destination || 'Delhi'}
                            travelDate={selectedDate}
                            guests={selectedGuests}
                        />

                        {/* Includes & Excludes */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {trip.includes && trip.includes.length > 0 && (
                                <section>
                                    <h2 className="text-display-lg mb-6">What's Included</h2>
                                    <ul className="space-y-3">
                                        {trip.includes.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <Check size={20} className="text-success mt-1 flex-shrink-0" />
                                                <span className="text-body-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                            
                            {trip.excludes && trip.excludes.length > 0 && (
                                <section>
                                    <h2 className="text-display-lg mb-6">What's Not Included</h2>
                                    <ul className="space-y-3">
                                        {trip.excludes.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <X size={20} className="text-error mt-1 flex-shrink-0" />
                                                <span className="text-body-lg">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:sticky lg:top-24 h-fit space-y-4">

                        {/* ── Main Booking Card ── */}
                        <div className="bg-white rounded-2xl border border-primary/10 shadow-xl overflow-hidden">

                            {/* Header strip */}
                            <div className="bg-gradient-to-r from-primary to-secondary px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-white/60 uppercase tracking-widest">{dynamicPrice ? 'Selected date price' : 'Starting from'}</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-display text-3xl text-white">{fp(effectivePrice)}</span>
                                        <span className="text-white/60 text-sm">/ person</span>
                                    </div>
                                    {dynamicPrice && dynamicPrice !== basePrice ? (
                                        <span className="text-white/50 text-xs line-through">{fp(basePrice)} base</span>
                                    ) : trip.originalPrice ? (
                                        <span className="text-white/50 text-xs line-through">{fp(trip.originalPrice)}</span>
                                    ) : null}
                                </div>
                                {spotsLeft !== null && (
                                    <div className="bg-red-500 text-white text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-full animate-pulse text-center">
                                        Only {spotsLeft}<br />left!
                                    </div>
                                )}
                            </div>

                            <div className="p-5 space-y-4">

                                {/* FOMO bar */}
                                <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                    <span className="text-xs text-red-700 font-medium flex items-center gap-1.5">
                                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <strong>{bookedToday} people</strong> booked today
                                    </span>
                                    <span className="text-[10px] text-red-500 font-semibold uppercase tracking-wide">
                                        <Eye className="w-3 h-3 inline mr-0.5" />{viewers} viewing
                                    </span>
                                </div>

                                {/* Guests */}
                                <div>
                                    <label className="text-xs text-primary/55 uppercase tracking-widest mb-1.5 block font-medium">
                                        <Users className="w-3.5 h-3.5 inline mr-1" />Guests
                                    </label>
                                    <select
                                        value={selectedGuests}
                                        onChange={(e) => setSelectedGuests(Number(e.target.value))}
                                        className="w-full p-3 border border-primary/15 bg-cream/50 text-primary rounded-lg text-sm focus:outline-none focus:border-secondary"
                                    >
                                        {Array.from({ length: trip.maxGroupSize || 10 }, (_, i) => i + 1).map((num) => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Travel Date */}
                                <div>
                                    <label className="text-xs text-primary/55 uppercase tracking-widest mb-1.5 block font-medium">
                                        <Calendar className="w-3.5 h-3.5 inline mr-1" />Travel Date
                                    </label>
                                    {trip && (
                                        <BookingCalendar
                                            tripId={trip.id}
                                            basePrice={basePrice}
                                            maxSeats={trip.maxGroupSize || 16}
                                            selectedDate={selectedDate}
                                            selectedGuests={selectedGuests}
                                            onSelectDate={(date, price) => {
                                                setSelectedDate(date);
                                                setDynamicPrice(price);
                                            }}
                                        />
                                    )}
                                    {!selectedDate && (
                                        <p className="text-xs text-amber-600 mt-1.5">Select a date above to confirm booking</p>
                                    )}
                                </div>

                                {/* Price Breakdown */}
                                <div className="bg-cream/60 rounded-xl p-4 space-y-2 border border-primary/8">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-primary/60">{fp(effectivePrice)} × {selectedGuests} guest{selectedGuests > 1 ? 's' : ''}</span>
                                        <span className="font-medium text-primary">{fp(totalPrice)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-green-700">
                                        <span>WanderLoot 10% cashback</span>
                                        <span>+{fp(totalPrice * 0.1)}</span>
                                    </div>
                                    <div className="border-t border-primary/10 pt-2 flex justify-between font-semibold text-primary">
                                        <span>Total</span>
                                        <span className="font-display text-xl">{fp(totalPrice)}</span>
                                    </div>
                                    {/* Payment split */}
                                    <div className="border-t border-dashed border-primary/10 pt-2 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-emerald-700 font-semibold">Pay now to confirm</span>
                                            <span className="text-emerald-700 font-bold">₹5,000</span>
                                        </div>
                                        <div className="flex justify-between text-xs text-primary/50">
                                            <span>Balance before departure</span>
                                            <span>{fp(Math.max(0, totalPrice - 5000))}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* EMI Preview */}
                                <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                                    <TrendingDown className="w-4 h-4 text-violet-600 shrink-0" />
                                    <p className="text-xs text-violet-800">
                                        <strong>No-cost EMI</strong> available from{' '}
                                        <strong>{fp(emiMonthly)}/month</strong> for 6 months · UPI · Cards
                                    </p>
                                </div>

                                {/* Book Button */}
                                <button
                                    onClick={handleBookNow}
                                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-cream py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                                >
                                    <Zap className="w-4 h-4 shrink-0" />
                                    <span className="text-sm leading-tight text-center">
                                        {!selectedDate
                                            ? 'Select Date to Book'
                                            : visitor === 'foreigner'
                                                ? 'Book Now · Pay Online'
                                                : 'Book Now · Pay ₹5,000 to Confirm'}
                                    </span>
                                </button>

                                {/* Trust signals — right under Pay button */}
                                <div className="flex items-center justify-center gap-3 py-1">
                                    {[
                                        { icon: Shield, label: '100% Secure', color: 'text-blue-600' },
                                        { icon: RefreshCw, label: 'Free Cancel', color: 'text-green-600' },
                                        { icon: BadgeCheck, label: 'PCI-DSS', color: 'text-emerald-600' },
                                    ].map(({ icon: Icon, label, color }) => (
                                        <div key={label} className="flex items-center gap-1">
                                            <Icon className={`w-3 h-3 ${color}`} />
                                            <span className="text-[10px] text-primary/50">{label}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Payment logos */}
                                <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                                    {['UPI', 'Visa', 'MC', 'Amex', 'EMI'].map(m => (
                                        <span key={m} className="text-[10px] font-bold text-primary/40 border border-primary/10 px-1.5 py-0.5 rounded">{m}</span>
                                    ))}
                                </div>

                                {/* WhatsApp fallback */}
                                <a
                                    href={`https://wa.me/918427831127?text=Hi!%20I%27m%20interested%20in%20booking%20${encodeURIComponent(trip.title || 'your tour')}%20for%20${selectedGuests}%20guest${selectedGuests > 1 ? 's' : ''}${selectedDate ? `%20on%20${selectedDate}` : ''}.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    <MessageCircle size={14} />
                                    {visitor === 'foreigner' ? 'Ask a Question on WhatsApp' : 'Chat on WhatsApp'}
                                </a>

                                {/* Booked this week social proof */}
                                <p className="text-center text-[11px] text-primary/40">
                                    <Award className="w-3 h-3 inline mr-1 text-amber-500" />
                                    <strong className="text-primary/60">{bookedWeek}+ travelers</strong> booked this trip in the last 7 days
                                </p>
                            </div>
                        </div>

                        {/* ── Trip Info Card ── */}
                        <div className="bg-white rounded-2xl border border-primary/10 p-5 space-y-3">
                            <h4 className="text-sm font-semibold text-primary uppercase tracking-widest">Trip Details</h4>
                            {[
                                { label: 'Duration', value: trip.duration },
                                trip.difficulty && { label: 'Difficulty', value: trip.difficulty },
                                trip.maxGroupSize && { label: 'Max Group', value: `${trip.maxGroupSize} people` },
                                { label: 'Cancellation', value: 'Free up to 14 days' },
                            ].filter(Boolean).map((row: any) => (
                                <div key={row.label} className="flex justify-between text-sm">
                                    <span className="text-primary/50">{row.label}</span>
                                    <span className="font-medium text-primary text-right">{row.value}</span>
                                </div>
                            ))}
                        </div>

                        {/* International trust block — foreigners only */}
                        {visitor === 'foreigner' && (
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
                                <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">International Traveler Guarantee</p>
                                {[
                                    { icon: '💳', text: 'Visa · Mastercard · Amex · no surcharges' },
                                    { icon: '🗣️', text: 'English-speaking private guide throughout' },
                                    { icon: '🏛️', text: 'Ministry of Tourism registered operator' },
                                    { icon: '📞', text: '24/7 WhatsApp support during your trip' },
                                ].map(({ icon, text }) => (
                                    <div key={text} className="flex items-start gap-2 text-xs text-amber-800">
                                        <span className="shrink-0">{icon}</span>
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-cream-dark py-16">
                <div className="section-container max-w-3xl">
                    <h2 className="text-display-lg mb-2 text-center">Frequently Asked Questions</h2>
                    <p className="text-primary/50 text-center mb-10">Everything you need to know before booking</p>
                    <div className="space-y-3">
                        {tripFaqs.map((faq, i) => (
                            <div key={i} className="bg-white border border-primary/10 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-primary/[0.02] transition-colors"
                                >
                                    <span className="font-medium text-primary pr-4">{faq.q}</span>
                                    <ChevronDown
                                        size={20}
                                        className={`text-secondary shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 text-primary/70 leading-relaxed border-t border-primary/5">
                                        <p className="pt-4">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expert Team Strip */}
            <div className="py-12 bg-primary text-cream">
                <div className="section-container">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="shrink-0 text-center md:text-left">
                            <p className="text-caption uppercase tracking-[0.3em] text-accent mb-2">Your Experts</p>
                            <h3 className="font-display text-2xl md:text-3xl">Meet your guides</h3>
                            <p className="text-cream/60 mt-2 max-w-xs">Handpicked local experts who speak your language and know every hidden gem.</p>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            {[
                                { name: 'Arjun Mehta', role: 'North India Expert', exp: '12 yrs', langs: 'EN · DE · FR', emoji: '🧔🏽' },
                                { name: 'Priya Nair', role: 'Kerala & South India', exp: '9 yrs', langs: 'EN · JP · ES', emoji: '👩🏽' },
                                { name: 'Rahul Sharma', role: 'Rajasthan Heritage', exp: '14 yrs', langs: 'EN · FR · IT', emoji: '👨🏽‍💼' },
                            ].map((guide) => (
                                <div key={guide.name} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-5 w-48 text-center hover:bg-white/15 transition-all">
                                    <div className="text-4xl mb-3">{guide.emoji}</div>
                                    <div className="font-medium text-cream">{guide.name}</div>
                                    <div className="text-xs text-accent mt-1">{guide.role}</div>
                                    <div className="text-xs text-cream/50 mt-2">{guide.exp} experience</div>
                                    <div className="text-xs text-cream/50">{guide.langs}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Booking Bar */}
            <MobileStickyBookingBar
                price={effectivePrice}
                onBook={handleBookNow}
                disabled={!selectedDate}
                spotsLeft={spotsLeft ?? undefined}
            />
        </div>
    );
}













