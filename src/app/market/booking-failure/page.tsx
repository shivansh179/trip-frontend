'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCw, Phone, MessageCircle, Mail } from 'lucide-react';

function BookingFailureContent() {
  const params = useSearchParams();
  const ticket = params.get('ticket') || '';
  const txnid = params.get('txnid') || '';
  const ref = ticket || txnid;

  return (
    <div className="min-h-screen bg-cream-light flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="font-display text-2xl text-primary mb-2">Payment Not Completed</h1>
          <p className="text-secondary text-sm leading-relaxed">
            Your payment was cancelled or could not be processed. No amount has been charged.
            You can try again anytime — your booking details are saved.
          </p>
        </div>

        {/* Booking ref */}
        {ref && (
          <div className="bg-white border border-primary/10 rounded-2xl p-5 text-left space-y-1">
            <p className="text-xs text-secondary uppercase tracking-widest font-medium">Booking Reference</p>
            <p className="font-mono text-lg font-bold text-primary">{ref}</p>
            <p className="text-xs text-secondary">Share this with us if you need help.</p>
          </div>
        )}

        {/* Retry actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-cream font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={16} /> Try Again
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 border border-primary/20 text-primary font-semibold py-3 px-6 rounded-xl hover:bg-primary/5 transition-colors"
          >
            Back to Home
          </Link>
        </div>

        {/* Contact */}
        <div className="bg-primary rounded-2xl p-5 space-y-3">
          <p className="text-cream text-sm font-medium">Facing issues? We&apos;ll sort it out:</p>
          <div className="flex gap-3">
            <a
              href={`https://wa.me/918427831127?text=Hi!%20My%20payment%20failed.%20Booking%20ref%3A%20${encodeURIComponent(ref)}%20Please%20help.`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a href="tel:+918427831127"
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-cream text-xs font-medium py-2.5 rounded-xl hover:bg-white/20 transition-colors">
              <Phone size={14} /> Call Us
            </a>
            <a href="mailto:hello@ylootrips.com"
              className="flex-1 flex items-center justify-center gap-2 bg-white/10 text-cream text-xs font-medium py-2.5 rounded-xl hover:bg-white/20 transition-colors">
              <Mail size={14} /> Email
            </a>
          </div>
        </div>

        <Link href="/trips" className="inline-block text-sm text-accent hover:underline">
          Browse other trips →
        </Link>
      </div>
    </div>
  );
}

export default function MarketBookingFailurePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream-light" />}>
      <BookingFailureContent />
    </Suspense>
  );
}
