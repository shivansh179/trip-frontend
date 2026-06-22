'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, ArrowRight, Loader2, Download, FileText } from 'lucide-react';
import Link from 'next/link';

const DEST_THEMES: Record<string, { emoji: string; grad: string; text: string }> = {
  Manali:     { emoji: '🏔️', grad: 'from-blue-800 to-blue-500',     text: 'text-blue-100' },
  Kashmir:    { emoji: '❄️', grad: 'from-indigo-800 to-purple-600', text: 'text-indigo-100' },
  Goa:        { emoji: '🌊', grad: 'from-cyan-700 to-teal-500',     text: 'text-cyan-100' },
  Kerala:     { emoji: '🌿', grad: 'from-green-800 to-green-500',   text: 'text-green-100' },
  Rajasthan:  { emoji: '🏜️', grad: 'from-amber-800 to-orange-500', text: 'text-amber-100' },
  Bali:       { emoji: '🌺', grad: 'from-purple-800 to-emerald-600', text: 'text-purple-100' },
  Dubai:      { emoji: '🌆', grad: 'from-yellow-800 to-amber-500',  text: 'text-yellow-100' },
  Singapore:  { emoji: '🦁', grad: 'from-blue-800 to-sky-500',      text: 'text-sky-100' },
  Maldives:   { emoji: '🐬', grad: 'from-cyan-800 to-cyan-400',     text: 'text-cyan-100' },
  Thailand:   { emoji: '🐘', grad: 'from-orange-800 to-orange-500', text: 'text-orange-100' },
  Vietnam:    { emoji: '🛵', grad: 'from-green-800 to-red-500',     text: 'text-green-100' },
  Europe:     { emoji: '🏰', grad: 'from-blue-900 to-slate-500',    text: 'text-blue-100' },
};

const DEFAULT_THEME = { emoji: '🎁', grad: 'from-primary to-secondary', text: 'text-white/90' };

function VoucherSuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const txnid = searchParams.get('txnid') || '';
  const destParam = searchParams.get('dest') || '';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [amount, setAmount] = useState<number | null>(null);
  const [validUntil, setValidUntil] = useState<string | null>(null);
  const [destination, setDestination] = useState(destParam);
  const [pdfUrl, setPdfUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code || !txnid) { setStatus('error'); return; }

    fetch('/api/vouchers/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, txnid }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success || data.already) {
          setAmount(data.amount ?? null);
          setValidUntil(data.validUntil ? new Date(data.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : null);
          if (data.destination) setDestination(data.destination);
          if (data.pdfUrl) setPdfUrl(data.pdfUrl);
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [code, txnid]);

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const printVoucher = () => window.print();

  const theme = (destination && DEST_THEMES[destination]) ? DEST_THEMES[destination] : DEFAULT_THEME;

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary/40 mx-auto mb-3" />
          <p className="text-primary/60 text-sm">Activating your voucher…</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-xl font-semibold text-primary mb-2">Something went wrong</p>
          <p className="text-primary/60 text-sm mb-6">Your payment may have been received. Please contact us with your transaction ID: <strong>{txnid}</strong></p>
          <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-semibold text-sm">
            WhatsApp Support
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-12 px-4 print:py-4 print:bg-white">
      <div className="max-w-lg mx-auto text-center">

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 print:hidden">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-display text-3xl text-primary mb-2 print:hidden">Voucher Activated!</h1>
        <p className="text-primary/60 mb-8 print:hidden">Your gift voucher is ready to use. We&apos;ve also sent it to your email.</p>

        {/* Destination-themed voucher card */}
        <div
          id="voucher-card"
          className={`bg-gradient-to-br ${theme.grad} rounded-2xl p-8 mb-6 shadow-xl text-white relative overflow-hidden`}
        >
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/10 rounded-full" />

          {destination && DEST_THEMES[destination] && (
            <p className="text-4xl mb-2 relative z-10">{theme.emoji}</p>
          )}

          <p className={`text-xs uppercase tracking-[0.2em] mb-2 relative z-10 ${theme.text}`}>
            {destination ? `YlooTrips · ${destination}` : 'YlooTrips Gift Voucher'}
          </p>

          <p className="font-display text-3xl tracking-[0.18em] font-bold mb-3 relative z-10">{code}</p>

          {amount && (
            <p className="text-2xl font-bold mb-1 relative z-10">Rs.{amount.toLocaleString('en-IN')}</p>
          )}
          {validUntil && (
            <p className={`text-xs relative z-10 ${theme.text}`}>Valid until {validUntil}</p>
          )}

          <div className="mt-5 border-t border-white/20 pt-4 relative z-10">
            <p className={`text-[10px] uppercase tracking-widest ${theme.text}`}>
              Use this code at checkout on any YlooTrips booking
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center mb-6 print:hidden">
          <button
            onClick={copy}
            className="flex items-center gap-2 px-5 py-2.5 border border-primary/20 rounded-full text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy code'}
          </button>
          <button
            onClick={printVoucher}
            className="flex items-center gap-2 px-5 py-2.5 border border-primary/20 rounded-full text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>

        {/* PDF attachment */}
        {pdfUrl && (
          <div className="mb-6 print:hidden">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-primary px-5 py-2.5 rounded-full text-sm font-medium hover:bg-accent/20 transition-colors"
            >
              <FileText className="w-4 h-4 text-accent" />
              View Attached Document / Itinerary
            </a>
          </div>
        )}

        <div className="space-y-3 print:hidden">
          <Link
            href="/trips"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-4 rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            Browse Trips to Use Voucher <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="block text-sm text-primary/50 hover:text-primary transition-colors py-2">
            Back to Home
          </Link>
        </div>

        <p className="text-xs text-primary/40 mt-6 print:hidden">
          Keep this code safe. It can only be used once. For help, WhatsApp +91 84278 31127
        </p>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #voucher-card, #voucher-card * { visibility: visible; }
          #voucher-card { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 380px; }
        }
      `}</style>
    </div>
  );
}

export default function VoucherSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
      </div>
    }>
      <VoucherSuccessContent />
    </Suspense>
  );
}
