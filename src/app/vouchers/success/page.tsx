'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function VoucherSuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code') || '';
  const txnid = searchParams.get('txnid') || '';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [amount, setAmount] = useState<number | null>(null);
  const [validUntil, setValidUntil] = useState<string | null>(null);
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
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-lg mx-auto text-center">

        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="font-display text-3xl text-primary mb-2">Voucher Activated!</h1>
        <p className="text-primary/60 mb-8">Your gift voucher is ready to use. We&apos;ve also sent it to your email.</p>

        {/* Voucher card */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-accent/60 p-8 mb-6 shadow-sm">
          <p className="text-xs text-primary/50 uppercase tracking-widest mb-2">Your Voucher Code</p>
          <p className="font-display text-3xl tracking-[0.2em] text-primary mb-3">{code}</p>
          {amount && <p className="text-lg font-semibold text-secondary mb-1">Worth ₹{amount.toLocaleString('en-IN')}</p>}
          {validUntil && <p className="text-xs text-primary/50">Valid until {validUntil}</p>}

          <button
            onClick={copy}
            className="mt-4 flex items-center gap-2 mx-auto px-5 py-2.5 border border-primary/20 rounded-full text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            {copied ? 'Copied!' : 'Copy code'}
          </button>
        </div>

        <div className="space-y-3">
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

        <p className="text-xs text-primary/40 mt-6">
          Keep this code safe. It can only be used once. For help, WhatsApp +91 84278 31127
        </p>
      </div>
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
