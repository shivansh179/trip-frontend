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
    
    useEffect(() => {
        const verifyPayment = async () => {
            const txnid = searchParams.get('txnid');
            const status = searchParams.get('status');
            
            if (!txnid) {
                setError('Invalid payment response');
                setLoading(false);
                return;
            }
            
            try {
                // Get booking status
                const response = await api.getPaymentStatus(txnid);
                setBooking(response.data);
                
                if (response.data.paymentStatus === 'PAID') {
                    // Redirect to success page
                    router.push(`/checkout/success?reference=${txnid}`);
                } else {
                    setError('Payment verification failed');
                }
            } catch (err: any) {
                console.error('Error verifying payment:', err);
                setError('Failed to verify payment');
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
    
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center max-w-md">
                    <XCircle className="w-16 h-16 text-error mx-auto mb-4" />
                    <h1 className="text-3xl font-light mb-4">Payment Failed</h1>
                    <p className="text-text-secondary mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/trips')}
                        className="btn-primary"
                    >
                        Back to Trips
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-cream">
            <div className="text-center max-w-md">
                <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                <h1 className="text-3xl font-light mb-4">Payment Successful!</h1>
                <p className="text-text-secondary mb-6">
                    Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>
                {booking && (
                    <div className="bg-cream-light p-6 border border-primary/10 mb-6 text-left">
                        <p className="text-caption text-text-secondary mb-1">Booking Reference</p>
                        <p className="text-body-lg font-medium mb-4">{booking.bookingReference}</p>
                        <p className="text-caption text-text-secondary mb-1">Amount Paid</p>
                        <p className="text-body-lg font-medium">{formatPrice(booking.finalAmount)}</p>
                    </div>
                )}
                <button
                    onClick={() => router.push('/')}
                    className="btn-primary"
                >
                    Back to Home
                </button>
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

