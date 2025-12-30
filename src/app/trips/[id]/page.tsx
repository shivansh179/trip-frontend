'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Users, MapPin, Clock, Star, Check, X, ArrowRight, Utensils, Hotel } from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { formatPrice } from '@/lib/utils';

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
    
    const [trip, setTrip] = useState<Trip | null>(null);
    const [itinerary, setItinerary] = useState<TripItinerary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedGuests, setSelectedGuests] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');

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
                console.error('Error fetching trip:', err);
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
        const bookingData = {
            tripId: trip.id,
            numberOfGuests: selectedGuests,
            travelDate: selectedDate || new Date().toISOString().split('T')[0],
        };
        router.push(`/checkout?tripId=${trip.id}&guests=${selectedGuests}&date=${selectedDate}`);
    };

    const totalPrice = trip ? (typeof trip.price === 'number' ? trip.price : parseFloat(trip.price.toString())) * selectedGuests : 0;

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
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
                <Image
                    src={trip.imageUrl || trip.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80'}
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
                    <div className="lg:sticky lg:top-24 h-fit">
                        <div className="bg-cream-light p-8 border border-primary/10">
                            <h3 className="text-2xl font-light mb-6">Book This Trip</h3>
                            
                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-4xl font-light">{formatPrice(trip.price)}</span>
                                    <span className="text-body-sm text-text-secondary">per person</span>
                                </div>
                                {trip.originalPrice && (
                                    <p className="text-body-sm text-text-secondary line-through">
                                        {formatPrice(trip.originalPrice)}
                                    </p>
                                )}
                            </div>

                            {/* Number of Guests */}
                            <div className="mb-6">
                                <label className="text-caption text-text-secondary mb-2 block">Number of Guests</label>
                                <select
                                    value={selectedGuests}
                                    onChange={(e) => setSelectedGuests(Number(e.target.value))}
                                    className="w-full p-3 border border-primary/20 bg-white text-primary"
                                >
                                    {Array.from({ length: trip.maxGroupSize || 10 }, (_, i) => i + 1).map((num) => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Travel Date */}
                            <div className="mb-6">
                                <label className="text-caption text-text-secondary mb-2 block">Travel Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-3 border border-primary/20 bg-white text-primary"
                                />
                            </div>

                            {/* Total */}
                            <div className="mb-6 pt-6 border-t border-primary/10">
                                <div className="flex justify-between items-center">
                                    <span className="text-body-lg">Total</span>
                                    <span className="text-2xl font-light">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button
                                onClick={handleBookNow}
                                disabled={!selectedDate}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Proceed to Checkout
                            </button>

                            {/* Trip Info */}
                            <div className="mt-6 pt-6 border-t border-primary/10 space-y-3">
                                <div className="flex justify-between text-body-sm">
                                    <span className="text-text-secondary">Duration</span>
                                    <span>{trip.duration}</span>
                                </div>
                                {trip.difficulty && (
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-text-secondary">Difficulty</span>
                                        <span>{trip.difficulty}</span>
                                    </div>
                                )}
                                {trip.maxGroupSize && (
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-text-secondary">Max Group Size</span>
                                        <span>{trip.maxGroupSize}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}












