'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Calendar, Users, MapPin, Lock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '@/lib/api';
import { Trip } from '@/types';
import { formatPriceWithCurrency } from '@/lib/utils';
import { getDestinationImageUrl } from '@/lib/destinationImages';
import PaymentOptions from '@/components/PaymentOptions';
import TrustBadges from '@/components/TrustBadges';
import CheckoutStepper from '@/components/CheckoutStepper';
import { useCurrency } from '@/context/CurrencyContext';
import { useVisitor } from '@/context/VisitorContext';
import { useWallet } from '@/context/WalletContext';
import PromoCodeInput from '@/components/PromoCodeInput';

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { currency } = useCurrency();
    const { visitor } = useVisitor();
    const { balance: walletBalance, addCashback, deductBalance } = useWallet();
    const fp = (p: number) => formatPriceWithCurrency(p, currency);

    const tripId = searchParams.get('tripId');
    const guests = Number(searchParams.get('guests')) || 1;
    const date = searchParams.get('date') || '';
    const priceParam = Number(searchParams.get('price')) || 0;
    // Auto-fill params from admin custom-trip link
    const paramName = searchParams.get('name') || '';
    const paramPhone = searchParams.get('phone') || '';
    const paramEmail = searchParams.get('email') || '';

    const [trip, setTrip] = useState<Trip | null>(null);
    const [itinerary, setItinerary] = useState<{ id?: number; dayNumber?: number; dayTitle?: string; description?: string; activities?: string[] }[]>([]);
    const [openItinDay, setOpenItinDay] = useState<number | null>(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [bookingReference, setBookingReference] = useState<string | undefined>(undefined);
    const [halfPaymentCardType, setHalfPaymentCardType] = useState<'credit' | 'debit'>('credit');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [applyWallet, setApplyWallet] = useState(false);
    const [promoCode, setPromoCode] = useState<string | null>(null);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [advanceAmountNow, setAdvanceAmountNow] = useState<number | null>(null); // null = full payment
    const [selectedEmi, setSelectedEmi] = useState<{
        tenure: number;
        monthlyAmount: number;
        totalAmount: number;
        interestRate: number;
        interestAmount: number;
        noCost: boolean;
        label: string;
        description: string;
    } | null>(null);

    const [upiExplicitlySelected, setUpiExplicitlySelected] = useState(false);
    const [formData, setFormData] = useState({
        customerName: paramName,
        customerEmail: paramEmail,
        customerPhone: paramPhone,
        numberOfGuests: guests,
        travelDate: date,
        specialRequests: '',
        paymentMethod: 'upi',
    });

    // Auto-fill from URL params (handles hydration delay where searchParams arrives after useState init)
    useEffect(() => {
        if (paramName || paramPhone || paramEmail) {
            setFormData(prev => ({
                ...prev,
                customerName: paramName || prev.customerName,
                customerPhone: paramPhone || prev.customerPhone,
                customerEmail: paramEmail || prev.customerEmail,
                numberOfGuests: guests || prev.numberOfGuests,
                travelDate: date || prev.travelDate,
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramName, paramPhone, paramEmail]);

    useEffect(() => {
        const fetchTrip = async () => {
            if (!tripId) {
                router.push('/trips');
                return;
            }
            try {
                const [tripRes, itiRes] = await Promise.all([
                    api.getTripById(Number(tripId)),
                    api.getTripItinerary(Number(tripId)).catch(() => ({ data: [] })),
                ]);
                setTrip(tripRes.data);
                setItinerary(Array.isArray(itiRes.data) ? itiRes.data : []);
                setFormData(prev => ({
                    ...prev,
                    numberOfGuests: guests,
                    travelDate: date || prev.travelDate,
                    customerName: paramName || prev.customerName,
                    customerPhone: paramPhone || prev.customerPhone,
                    customerEmail: paramEmail || prev.customerEmail,
                }));
            } catch {
                router.push('/trips');
            } finally {
                setLoading(false);
            }
        };
        fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tripId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!trip) return;

        setErrorMessage(null);
        setSubmitting(true);

        try {
            // Determine payment type
            let paymentType = 'FULL';
            if (selectedEmi !== null) {
                paymentType = 'EMI';
            } else if (formData.paymentMethod === 'half_payment') {
                paymentType = 'HALF_PAYMENT';
            }

            // paymentMethod sent to backend — empty string signals "show all Easebuzz modes"
            const effectiveMethod = formData.paymentMethod === 'half_payment'
                ? (halfPaymentCardType === 'credit' ? 'credit_card' : 'debit_card')
                : formData.paymentMethod || 'upi';

            // Amount to charge NOW
            // For EMI: Easebuzz receives FULL amount — the bank converts it to EMI on the customer's card.
            // We receive full payment immediately. Do NOT split into instalments on our side.
            let chargeNow: number;
            if (selectedEmi !== null) {
                // EMI via Easebuzz: send full amount, bank handles monthly split
                chargeNow = totalPrice;
            } else if (formData.paymentMethod === 'half_payment') {
                // 20% advance of NET price after wallet/promo
                chargeNow = Math.ceil(totalPrice * 0.2);
            } else {
                // Full payment — net price after all deductions
                chargeNow = totalPrice;
            }

            const bookingData = {
                trip: { id: trip.id },
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                numberOfGuests: formData.numberOfGuests,
                travelDate: formData.travelDate,
                specialRequests: formData.specialRequests,
                paymentMethod: effectiveMethod,
                pg: '',           // tell backend: empty pg → Easebuzz shows all payment modes
                paymentType: paymentType,
                totalAmount: totalPrice,      // full trip cost
                chargeNow,                    // amount to collect right now
                // EMI details
                emiEnabled: selectedEmi !== null,
                emiTenure: selectedEmi?.tenure || null,
                emiMonthlyAmount: selectedEmi?.monthlyAmount || null,
                emiTotalAmount: selectedEmi?.totalAmount || null,
                emiInterestRate: selectedEmi?.interestRate || null,
            };

            const bookingResponse = await api.createBooking(bookingData);
            const booking = bookingResponse.data;
            setBookingReference(booking.bookingReference);

            // Always use our direct Easebuzz route — gives exact amount control + shows all payment methods
            // (UPI, Cards, EMI, Net Banking, Wallets). Java backend event proxy only shows UPI.
            const payRes = await fetch('/api/payment/initiate-partial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingReference: booking.bookingReference,
                    chargeNow,
                    totalAmount: totalPrice,
                    customerName: formData.customerName,
                    customerEmail: formData.customerEmail,
                    customerPhone: formData.customerPhone,
                    tripTitle: trip.title,
                    // Pass EMI tenure so Easebuzz can pre-select EMI payment flow
                    emiTenure: selectedEmi?.tenure || null,
                }),
            });
            const paymentData = await payRes.json();
            if (!payRes.ok) throw new Error(paymentData.error || 'Payment initiation failed');

            if (paymentData.paymentUrl) {
                // Store pending wallet/cashback info — credited only after payment confirmed
                sessionStorage.setItem(`ylootrips-pending-${booking.bookingReference}`, JSON.stringify({
                    walletDeduction,
                    totalPrice,
                    tripName: trip.title,
                    promoCashback,
                }));
                window.location.href = paymentData.paymentUrl;
            } else {
                throw new Error(paymentData.error || 'Failed to get payment URL from Easebuzz. Please check your payment gateway configuration.');
            }
        } catch (error: any) {
            let msg = 'Failed to create booking. Please try again.';

            if (error.response) {
                const errorData = error.response.data;
                if (errorData?.error) {
                    msg = errorData.error;
                } else if (errorData?.message) {
                    msg = errorData.message;
                } else if (typeof errorData === 'string') {
                    msg = errorData;
                }
            } else if (error.message) {
                msg = error.message;
            }

            setErrorMessage(msg);
            setSubmitting(false);
        }
    };

    const tripBasePrice = trip ? (typeof trip.price === 'number' ? trip.price : parseFloat(trip.price.toString())) : 0;
    const pricePerPerson = priceParam || tripBasePrice;
    const basePrice = pricePerPerson * formData.numberOfGuests;
    // 3% discount only when user explicitly selects UPI (not the default), and not for EMI
    const discountPercent = (upiExplicitlySelected && formData.paymentMethod === 'upi' && selectedEmi === null) ? 3 : 0;
    const discountAmount = (basePrice * discountPercent) / 100;
    // Promo discount is credited to WanderLoot wallet after payment, not deducted from price
    const promoCashback = promoDiscount; // credited to wallet post-payment
    const priceAfterDiscount = basePrice - discountAmount;
    const maxWalletUsable = Math.round(Math.max(0, priceAfterDiscount) * 0.10); // cap at 10% of order
    const walletDeduction = applyWallet ? Math.min(walletBalance, maxWalletUsable) : 0;
    const totalPrice = Math.max(0, priceAfterDiscount - walletDeduction);
    const cashbackAmount = Math.round(totalPrice * 0.10);

    // Find the best cover image: try destination keywords before falling back to trip.imageUrl
    const getCoverImage = () => {
        if (!trip) return '';
        const dest = trip.destination || trip.title || '';
        // Try full destination name first
        const byFull = getDestinationImageUrl(undefined, dest);
        const INDIA_FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4';
        if (byFull !== INDIA_FALLBACK) return byFull;
        // Try each word/token in the destination (split by - · , space)
        const tokens = dest.split(/[\s\-·,\/]+/).filter(t => t.length > 2);
        for (const token of tokens) {
            const byToken = getDestinationImageUrl(undefined, token);
            if (byToken !== INDIA_FALLBACK) return byToken;
        }
        // Fall back to backend imageUrl (even if it might be wrong)
        return trip.imageUrl || '';
    };
    const coverImage = trip ? getCoverImage() : '';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading checkout...</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-light mb-4">Trip Not Found</h1>
                    <button onClick={() => router.push('/trips')} className="btn-primary">
                        Back to Trips
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream py-8 md:py-16">
            <div className="section-container">
                <div className="max-w-5xl mx-auto">
                    <h1 className="font-display text-2xl sm:text-3xl md:text-display-xl mb-2 pt-6 md:pt-8">Complete Your Booking</h1>
                    {visitor === 'foreigner' && (
                        <p className="text-secondary mb-4 flex items-center gap-2">
                            <span>💳</span>
                            <span>International cards accepted · Prices shown in {currency}</span>
                        </p>
                    )}

                    {/* Progress stepper */}
                    <CheckoutStepper currentStep={2} />

                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* ── COVER IMAGE + TRIP SUMMARY ── */}
                                <section className="border border-primary/10 overflow-hidden">
                                    {coverImage && (
                                        <div className="relative h-48 md:h-64 w-full">
                                            <img
                                                src={coverImage}
                                                alt={trip.destination}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
                                            <div className="absolute bottom-0 left-0 p-5">
                                                <p className="text-cream/80 text-xs uppercase tracking-widest font-medium mb-1">Your Trip</p>
                                                <h2 className="text-cream text-xl md:text-2xl font-display font-semibold leading-tight">{trip.title}</h2>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="flex items-center gap-1 text-cream/80 text-xs"><MapPin size={12} /> {trip.destination}</span>
                                                    <span className="text-cream/40">·</span>
                                                    <span className="flex items-center gap-1 text-cream/80 text-xs"><Calendar size={12} /> {trip.duration}</span>
                                                    <span className="text-cream/40">·</span>
                                                    <span className="flex items-center gap-1 text-cream/80 text-xs"><Users size={12} /> {formData.numberOfGuests} guests</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {!coverImage && (
                                        <div className="bg-cream-light p-5 md:p-6">
                                            <h2 className="text-xl md:text-2xl font-light mb-4">Trip Summary</h2>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <MapPin size={20} className="text-secondary mt-1" />
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Destination</p>
                                                        <p className="text-body-lg">{trip.destination}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Calendar size={20} className="text-secondary mt-1" />
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Duration</p>
                                                        <p className="text-body-lg">{trip.duration}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Users size={20} className="text-secondary mt-1" />
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Guests</p>
                                                        <p className="text-body-lg">{formData.numberOfGuests}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {coverImage && trip.shortDescription && (
                                        <div className="bg-cream-light px-5 py-3 border-t border-primary/10">
                                            <p className="text-sm text-primary/70 leading-relaxed">{trip.shortDescription}</p>
                                        </div>
                                    )}
                                </section>

                                {/* ── ITINERARY ── */}
                                <section className="border border-primary/10 overflow-hidden">
                                    <div className="bg-primary px-5 py-4 flex items-center gap-2">
                                        <Calendar size={16} className="text-secondary" />
                                        <h2 className="text-base font-semibold text-cream tracking-wide uppercase">Day-by-Day Itinerary</h2>
                                        {itinerary.length > 0 && <span className="ml-auto text-xs text-secondary font-medium">{itinerary.length} Days</span>}
                                    </div>
                                    {itinerary.length > 0 ? (
                                        <div className="divide-y divide-primary/8">
                                            {itinerary.map((day, idx) => {
                                                const isOpen = openItinDay === idx;
                                                const dayColors = ['bg-amber-500','bg-emerald-600','bg-blue-600','bg-purple-600','bg-rose-600','bg-orange-500','bg-teal-600'];
                                                const dotColor = dayColors[idx % dayColors.length];
                                                return (
                                                    <div key={idx} className="bg-white">
                                                        <button
                                                            type="button"
                                                            onClick={() => setOpenItinDay(isOpen ? null : idx)}
                                                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-cream transition-colors"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`${dotColor} text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm`}>
                                                                    {day.dayNumber ?? idx + 1}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-primary/40 font-medium uppercase tracking-wider">Day {day.dayNumber ?? idx + 1}</p>
                                                                    <p className="text-sm font-semibold text-primary leading-snug">{day.dayTitle || `Day ${idx + 1}`}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 shrink-0">
                                                                {day.activities && day.activities.length > 0 && (
                                                                    <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded-full font-medium hidden sm:block">{day.activities.length} activities</span>
                                                                )}
                                                                {isOpen ? <ChevronUp size={16} className="text-primary/40" /> : <ChevronDown size={16} className="text-primary/40" />}
                                                            </div>
                                                        </button>
                                                        {isOpen && (
                                                            <div className="px-5 pb-5 bg-cream-light border-t border-primary/5">
                                                                {day.description && (
                                                                    <p className="text-sm text-primary/70 mt-4 leading-relaxed">{day.description}</p>
                                                                )}
                                                                {day.activities && day.activities.length > 0 && (
                                                                    <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                                                        {day.activities.map((a, i) => (
                                                                            <li key={i} className="text-xs text-primary/70 flex items-start gap-2 bg-white px-3 py-2 border border-primary/8">
                                                                                <span className="text-secondary font-bold mt-0.5 shrink-0">✦</span> {a}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="bg-white p-6 flex items-start gap-4">
                                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                                <span className="text-lg">📋</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-primary">Detailed itinerary will be shared on WhatsApp</p>
                                                <p className="text-xs text-primary/60 mt-1 leading-relaxed">Our team will send you a complete day-by-day plan within 1 hour of booking. You can also{' '}
                                                    <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer" className="text-green-600 underline font-medium">WhatsApp us</a>
                                                    {' '}to get it right now.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* ── INCLUDES / EXCLUDES ── */}
                                {((trip.includes && trip.includes.length > 0) || (trip.excludes && trip.excludes.length > 0)) && (
                                    <section className="grid md:grid-cols-2 gap-4">
                                        {trip.includes && trip.includes.length > 0 && (
                                            <div className="bg-green-50 border border-green-100 p-4">
                                                <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-3">✓ What&apos;s Included</p>
                                                <ul className="space-y-1.5">
                                                    {trip.includes.map((item: string, i: number) => (
                                                        <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                                                            <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" /> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {trip.excludes && trip.excludes.length > 0 && (
                                            <div className="bg-red-50 border border-red-100 p-4">
                                                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3">✗ Not Included</p>
                                                <ul className="space-y-1.5">
                                                    {trip.excludes.map((item: string, i: number) => (
                                                        <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                                                            <span className="mt-0.5 shrink-0">✗</span> {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </section>
                                )}

                                {/* ── PERSONAL INFORMATION ── */}
                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Personal Information</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-caption text-text-secondary mb-2 block">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.customerName}
                                                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                                className="w-full p-4 border border-primary/20 bg-white text-primary"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="text-caption text-text-secondary mb-2 block">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.customerEmail}
                                                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                                    className="w-full p-4 border border-primary/20 bg-white text-primary"
                                                    placeholder="john@example.com"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-caption text-text-secondary mb-2 block">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.customerPhone}
                                                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                                    className="w-full p-4 border border-primary/20 bg-white text-primary"
                                                    placeholder="912345678900"
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Travel Details</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-caption text-text-secondary mb-2 block">
                                                Travel Date *
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.travelDate}
                                                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full p-4 border border-primary/20 bg-white text-primary"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-caption text-text-secondary mb-2 block">
                                                Number of Guests *
                                            </label>
                                            <select
                                                required
                                                value={formData.numberOfGuests}
                                                onChange={(e) => setFormData({ ...formData, numberOfGuests: Number(e.target.value) })}
                                                className="w-full p-4 border border-primary/20 bg-white text-primary"
                                            >
                                                {Array.from({ length: trip.maxGroupSize || 10 }, (_, i) => i + 1).map((num) => (
                                                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Special Requests</h2>
                                    <textarea
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        rows={4}
                                        className="w-full p-4 border border-primary/20 bg-white text-primary"
                                        placeholder="Any special requests or dietary requirements..."
                                    />
                                </section>

                                <section>
                                    {visitor === 'foreigner' && (
                                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-sm text-blue-800 rounded">
                                            <p className="font-medium mb-1">💳 International Payment Info</p>
                                            <p className="text-blue-700">Payment is processed securely in INR via our payment gateway. Your bank will automatically convert to your local currency at the current exchange rate. No surcharges from our side — Visa, Mastercard, and Amex accepted.</p>
                                        </div>
                                    )}

                                    {/* EMI + Flexible Payment Options */}
                                    <PaymentOptions
                                        tripPrice={totalPrice}
                                        tripTitle={trip.title}
                                        onProceed={(payload) => {
                                            // Map PaymentOptions selection → existing checkout state
                                            if (payload.mode === 'emi' && payload.emiPlan) {
                                                setSelectedEmi({
                                                    tenure: payload.emiPlan.months,
                                                    monthlyAmount: payload.emiPlan.monthlyAmount,
                                                    totalAmount: payload.emiPlan.totalAmount,
                                                    interestRate: 0,
                                                    interestAmount: 0,
                                                    noCost: true,
                                                    label: `${payload.emiPlan.months} Months`,
                                                    description: `No-cost EMI · ${payload.emiPlan.months} months`,
                                                });
                                                setFormData(f => ({ ...f, paymentMethod: 'credit_card' }));
                                                setUpiExplicitlySelected(false);
                                            } else if (payload.mode === 'partial') {
                                                setFormData(f => ({ ...f, paymentMethod: 'half_payment' }));
                                                setSelectedEmi(null);
                                                setAdvanceAmountNow(payload.amountNow); // 20% advance
                                                setUpiExplicitlySelected(false);
                                            } else {
                                                setSelectedEmi(null);
                                                setAdvanceAmountNow(null); // full payment
                                                const method = payload.paymentMethod || 'upi';
                                                setFormData(f => ({ ...f, paymentMethod: method }));
                                                setUpiExplicitlySelected(method === 'upi');
                                            }
                                        }}
                                    />

                                    <TrustBadges isInternational={visitor === 'foreigner'} />
                                </section>

                                {/* Promo code section */}
                                <section>
                                    <h2 className="text-xl md:text-2xl font-light mb-1">Promo Code</h2>
                                    <p className="text-xs text-amber-700 mb-3">🎁 Promo discount is credited to your WanderLoot wallet after payment — not deducted from the trip price</p>
                                    <PromoCodeInput
                                        orderTotal={basePrice - discountAmount}
                                        appliedCode={promoCode}
                                        discountAmount={promoDiscount}
                                        onApply={(code, discount) => { setPromoCode(code); setPromoDiscount(discount); }}
                                        onRemove={() => { setPromoCode(null); setPromoDiscount(0); }}
                                    />
                                </section>

                                {/* WanderLoot wallet section */}
                                {walletBalance > 0 && (
                                    <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center shrink-0">
                                                    <span className="text-white text-sm">₹</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-amber-900">WanderLoot 💸</p>
                                                    <p className="text-xs text-amber-700">Balance: {fp(walletBalance)} · Use up to {fp(maxWalletUsable)} on this booking</p>
                                                </div>
                                            </div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={applyWallet}
                                                    onChange={(e) => setApplyWallet(e.target.checked)}
                                                    className="w-4 h-4 accent-amber-500"
                                                />
                                                <span className="text-xs font-semibold text-amber-800">Apply</span>
                                            </label>
                                        </div>
                                        {applyWallet && walletDeduction > 0 && (
                                            <div className="mt-3 pt-3 border-t border-amber-200 flex items-center justify-between text-sm">
                                                <span className="text-amber-800">💰 WanderLoot cashback applied</span>
                                                <span className="font-semibold text-green-700">−{fp(walletDeduction)}</span>
                                            </div>
                                        )}
                                    </section>
                                )}

                                {errorMessage && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex flex-col gap-4 pt-6">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-amber-500" />
                                        <span className="text-xs text-gray-600">
                                            I agree to the <a href="/terms" target="_blank" className="text-amber-600 underline">Terms &amp; Conditions</a> and{' '}
                                            <a href="/privacy" target="_blank" className="text-amber-600 underline">Privacy Policy</a>.
                                        </span>
                                    </label>
                                    <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:gap-4">
                                    <button
                                        type="submit"
                                        disabled={submitting || !agreed}
                                        className="btn-primary flex-1 w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Processing...' : 'Complete Booking'}
                                    </button>
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-body-sm text-text-secondary">
                                        <Lock size={16} />
                                        <span>Secure Payment</span>
                                    </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="lg:sticky lg:top-24 h-fit order-first lg:order-none">
                            <div className="bg-cream-light p-6 md:p-8 border border-primary/10">
                                <h2 className="text-xl md:text-2xl font-light mb-4 md:mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {/* Original Price (if exists) - shown first with strikethrough */}
                                    {trip.originalPrice && trip.originalPrice > trip.price && (
                                        <div className="flex justify-between text-body-lg text-text-secondary">
                                            <span className="line-through">Original Price</span>
                                            <span className="line-through">{fp(trip.originalPrice)} × {formData.numberOfGuests}</span>
                                        </div>
                                    )}

                                    {/* Current Trip Price */}
                                    <div className="flex justify-between text-body-lg">
                                        <span>Trip Price</span>
                                        <span className="font-medium">{fp(trip.price)} × {formData.numberOfGuests}</span>
                                    </div>

                                    {/* Show savings if original price was higher */}
                                    {trip.originalPrice && trip.originalPrice > trip.price && (
                                        <div className="flex justify-between text-body-sm text-success">
                                            <span>You Save</span>
                                            <span>-{fp((trip.originalPrice - trip.price) * formData.numberOfGuests)}</span>
                                        </div>
                                    )}

                                    {/* Payment Method Discount */}
                                    {discountPercent > 0 && (
                                        <div className="flex justify-between text-body-lg text-success">
                                            <span>Payment Discount ({discountPercent}%)</span>
                                            <span>-{fp(discountAmount)}</span>
                                        </div>
                                    )}

                                    {/* Promo — credited to WanderLoot wallet after payment */}
                                    {promoDiscount > 0 && (
                                        <div className="flex justify-between text-body-sm text-amber-700 bg-amber-50 px-2 py-1.5 rounded">
                                            <span>🎁 Promo ({promoCode}) → Wallet</span>
                                            <span className="font-semibold">+{fp(promoDiscount)}</span>
                                        </div>
                                    )}

                                    {/* Wallet deduction */}
                                    {walletDeduction > 0 && (
                                        <div className="flex justify-between text-body-lg text-amber-600">
                                            <span>💰 WanderLoot</span>
                                            <span>-{fp(walletDeduction)}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-primary/10 mb-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg md:text-xl font-light">
                                            {advanceAmountNow !== null ? 'Pay Now (Advance)' : 'Total Payable'}
                                        </span>
                                        <span className="text-2xl md:text-3xl font-light">
                                            {fp(advanceAmountNow !== null ? advanceAmountNow : totalPrice)}
                                        </span>
                                    </div>
                                    {advanceAmountNow !== null && (
                                        <p className="text-xs text-amber-700 font-medium mt-1">
                                            Remaining {fp(totalPrice - advanceAmountNow)} payable before travel
                                        </p>
                                    )}
                                    <p className="text-xs text-green-700 font-medium mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                                        No hidden fees · all taxes included
                                    </p>
                                </div>

                                {/* Cashback preview */}
                                {cashbackAmount > 0 && (
                                    <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-800">
                                        <span>🎉</span>
                                        <span>You'll earn <strong>{fp(cashbackAmount + promoCashback)}</strong> in WanderLoot wallet after payment!{promoCashback > 0 ? ` (${fp(cashbackAmount)} cashback + ${fp(promoCashback)} promo)` : ' (10% cashback)'}</span>
                                    </div>
                                )}

                                <div className="space-y-2 text-body-sm text-text-secondary mb-3">
                                    {[
                                        'Instant confirmation',
                                        'Free cancellation up to 7 days before departure',
                                        '24/7 customer support — WhatsApp & call',
                                        'No hidden fees · all taxes included',
                                        'Secure payment via Easebuzz (PCI-DSS)',
                                    ].map(t => (
                                        <div key={t} className="flex items-start gap-2">
                                            <CheckCircle size={16} className="text-success mt-0.5 shrink-0" />
                                            <span>{t}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* ── CANCELLATION POLICY ── */}
                                <div className="mt-4 pt-4 border-t border-primary/10">
                                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Cancellation Policy</p>
                                    <div className="space-y-1.5 text-xs text-primary/60">
                                        <p>✓ <strong>7+ days before</strong> — Full refund</p>
                                        <p>⚠ <strong>3–7 days before</strong> — 50% refund</p>
                                        <p>✗ <strong>Within 3 days</strong> — Non-refundable (date change allowed)</p>
                                        <p className="text-primary/40 mt-1">One free date change per booking · <a href="/terms" className="underline text-secondary" target="_blank">Full T&amp;C</a></p>
                                    </div>
                                </div>

                                {/* ── 24/7 SUPPORT ── */}
                                <div className="mt-4 pt-4 border-t border-primary/10">
                                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Need Help?</p>
                                    <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors mb-2">
                                        <span>💬</span> WhatsApp Us — Reply in &lt;1 hour
                                    </a>
                                    <p className="text-xs text-primary/50">📞 +91 84278 31127 · Available 24/7</p>
                                </div>

                                {/* ── TESTIMONIALS ── */}
                                <div className="mt-4 pt-4 border-t border-primary/10">
                                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">What Travellers Say</p>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Priya S.', loc: 'Mumbai', text: 'Seamless booking, incredible trip. YlooTrips handled everything perfectly!', stars: 5 },
                                            { name: 'Rahul M.', loc: 'Delhi', text: 'Amazing support team. They were available at 2AM when we needed help.', stars: 5 },
                                            { name: 'Anita K.', loc: 'Bangalore', text: 'Best honeymoon of our lives. Every detail was taken care of.', stars: 5 },
                                        ].map(({ name, loc, text, stars }) => (
                                            <div key={name} className="bg-cream p-3 border border-primary/8">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="text-xs font-semibold text-primary">{name} <span className="text-primary/40 font-normal">· {loc}</span></p>
                                                    <span className="text-amber-400 text-xs">{'★'.repeat(stars)}</span>
                                                </div>
                                                <p className="text-xs text-primary/60 leading-relaxed italic">&ldquo;{text}&rdquo;</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* ── WHY YLOO ── */}
                                <div className="mt-4 pt-4 border-t border-primary/10">
                                    <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Why YlooTrips?</p>
                                    <div className="space-y-1.5 text-xs text-primary/60">
                                        {[
                                            '10,000+ happy travellers',
                                            'Personally curated itineraries',
                                            'Dedicated coordinator from day 1',
                                            'Live tracking & 24/7 emergency support',
                                            'Flexible EMI & part-payment options',
                                        ].map(r => (
                                            <p key={r} className="flex items-start gap-1.5"><span className="text-secondary">✦</span> {r}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">Loading checkout...</p>
                </div>
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
