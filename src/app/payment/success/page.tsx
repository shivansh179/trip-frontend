'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);
    
    useEffect(() => {
        const verifyPayment = async () => {
            const txnid = searchParams.get('txnid');
            const status = searchParams.get('status');
            
            if (!txnid) {
                setError('Invalid payment response. Missing transaction ID.');
                setLoading(false);
                return;
            }
            
            try {
                // Get booking status - API returns booking directly in response.data
                const response = await api.getPaymentStatus(txnid);
                const bookingData = response.data;
                
                if (!bookingData) {
                    setNotFound(true);
                    setLoading(false);
                    return;
                }
                
                setBooking(bookingData);
                
                // Check payment status
                if (bookingData.paymentStatus === 'PAID' || status === 'success') {
                    // Payment successful - show success page
                    setError(null);
                } else {
                    setError('Payment verification failed. Payment status: ' + (bookingData.paymentStatus || 'Unknown'));
                }
            } catch (err: any) {
                console.error('Error verifying payment:', err);
                
                // Check if it's a 404 or not found error
                if (err.response?.status === 404 || err.message?.includes('not found') || err.message?.includes('Not Found')) {
                    setNotFound(true);
                } else {
                    setError('Failed to verify payment: ' + (err.message || 'Unknown error'));
                }
            } finally {
                setLoading(false);
            }
        };
        
        verifyPayment();
    }, [searchParams, router]);
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">Verifying payment...</p>
                </div>
            </div>
        );
    }
    
    if (notFound) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center max-w-md">
                    <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
                    <h1 className="text-3xl font-light mb-4">Booking Not Found</h1>
                    <p className="text-text-secondary mb-6">
                        We couldn't find a booking with reference: <strong>{searchParams.get('txnid')}</strong>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/trips')}
                            className="btn-primary"
                        >
                            Browse Trips
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="btn-outline"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center max-w-md">
                    <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
                    <h1 className="text-3xl font-light mb-4">Payment Verification Failed</h1>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push('/trips')}
                            className="btn-primary"
                        >
                            Back to Trips
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="btn-outline"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream py-16">
            <div className="text-center max-w-2xl mx-auto px-4">
                <CheckCircle className="w-20 h-20 text-success mx-auto mb-6" />
                <h1 className="text-display-xl mb-4">Payment Successful!</h1>
                <p className="text-body-lg text-text-secondary mb-8">
                    Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>
                
                {booking && (
                    <div className="bg-cream-light p-8 border border-primary/10 mb-8 text-left">
                        <h2 className="text-2xl font-light mb-6">Booking Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-text-secondary">Booking Reference</span>
                                <span className="font-medium">{booking.bookingReference}</span>
                            </div>
                            {booking.trip && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Trip</span>
                                        <span className="font-medium">{booking.trip.title}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-secondary">Destination</span>
                                        <span className="font-medium">{booking.trip.destination}</span>
                                    </div>
                                </>
                            )}
                            {booking.travelDate && (
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Travel Date</span>
                                    <span className="font-medium">{new Date(booking.travelDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            {booking.numberOfGuests && (
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Number of Guests</span>
                                    <span className="font-medium">{booking.numberOfGuests}</span>
                                </div>
                            )}
                            <div className="flex justify-between pt-4 border-t border-primary/10">
                                <span className="text-xl font-light">Amount Paid</span>
                                <span className="text-2xl font-light">
                                    {formatPrice(booking.finalAmount || booking.totalAmount)}
                                </span>
                            </div>
                            {booking.paymentStatus && (
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Payment Status</span>
                                    <span className="font-medium text-success">{booking.paymentStatus}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push('/trips')}
                        className="btn-primary"
                    >
                        Browse More Trips
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-outline"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">Loading...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}

