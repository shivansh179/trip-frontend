'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function ReceiptContent() {
  const searchParams = useSearchParams();
  const txnid = searchParams.get('txnid') || '';
  const name = searchParams.get('name') || 'there';
  const amount = searchParams.get('amount') || '';
  const desc = searchParams.get('desc') || '';
  const pdf = searchParams.get('pdf') || '';
  const isError = searchParams.get('error') === '1';

  if (isError) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="font-display text-2xl text-primary mb-2">Payment Failed</h1>
          <p className="text-primary/60 text-sm mb-2">
            Your payment could not be processed. No amount has been charged.
          </p>
          <p className="text-primary/40 text-xs mb-6">Reference: {txnid}</p>
          <a
            href="https://wa.me/918427831127"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold text-sm"
          >
            Contact on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-lg mx-auto text-center">

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-display text-3xl text-primary mb-2">Payment Received!</h1>
        <p className="text-primary/60 mb-8">
          Thank you, {name}. Your payment has been successfully processed.
        </p>

        {/* Receipt card */}
        <div className="bg-white rounded-2xl border border-primary/10 p-8 mb-6 shadow-sm text-left">
          <p className="text-xs text-primary/50 uppercase tracking-widest mb-4">Payment Receipt</p>

          {desc && (
            <div className="mb-4">
              <p className="text-xs text-primary/40 mb-0.5">Description</p>
              <p className="font-semibold text-primary">{desc}</p>
            </div>
          )}

          {amount && (
            <div className="mb-4">
              <p className="text-xs text-primary/40 mb-0.5">Amount Paid</p>
              <p className="text-2xl font-bold text-primary">
                Rs.{Number(amount).toLocaleString('en-IN')}
              </p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs text-primary/40 mb-0.5">Transaction ID</p>
            <p className="font-mono text-sm text-primary/70">{txnid}</p>
          </div>

          {pdf && (
            <a
              href={pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-2 text-sm text-accent font-medium hover:underline"
            >
              View Itinerary / Document
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="space-y-3">
          <Link
            href="/trips"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            Browse Our Trips <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="block text-sm text-primary/50 hover:text-primary transition-colors py-2">
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-primary/40 mt-6">
          A confirmation has been sent to your email. For any queries, WhatsApp +91 84278 31127.
        </p>
      </div>
    </div>
  );
}

export default function PaymentReceiptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    }>
      <ReceiptContent />
    </Suspense>
  );
}
