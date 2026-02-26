'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { XCircle } from 'lucide-react';
import PaintSplashBg from '@/components/PaintSplashBg';

function PaymentFailureContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = searchParams?.get('type');
    const txnid = searchParams?.get('txnid');
    const isEvent = type === 'event' || (txnid && txnid.startsWith('EVT-'));

    return (
        <PaintSplashBg className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-light mb-4">Payment Failed</h1>
                <p className="text-text-secondary mb-6">
                    Your payment could not be processed. Please try again or contact support.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={() => router.push(isEvent ? '/events' : '/trips')}
                        className="btn-secondary"
                    >
                        {isEvent ? 'Back to Events' : 'Back to Trips'}
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="btn-primary"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </PaintSplashBg>
    );
}

export default function PaymentFailurePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="text-center">
                    <p className="text-primary/70">Loading...</p>
                </div>
            </div>
        }>
            <PaymentFailureContent />
        </Suspense>
    );
}









