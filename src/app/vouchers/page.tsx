'use client';

import { useState } from 'react';
import { Gift, CreditCard, Shield, Clock, CheckCircle, Loader2, ArrowRight, ChevronDown } from 'lucide-react';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000, 25000];

const DESTINATIONS = [
  { key: 'Manali', emoji: '🏔️', label: 'Manali', grad: 'from-blue-800 to-blue-500' },
  { key: 'Kashmir', emoji: '❄️', label: 'Kashmir', grad: 'from-indigo-800 to-purple-600' },
  { key: 'Goa', emoji: '🌊', label: 'Goa', grad: 'from-cyan-700 to-teal-500' },
  { key: 'Kerala', emoji: '🌿', label: 'Kerala', grad: 'from-green-800 to-green-500' },
  { key: 'Rajasthan', emoji: '🏜️', label: 'Rajasthan', grad: 'from-amber-800 to-orange-500' },
  { key: 'Bali', emoji: '🌺', label: 'Bali', grad: 'from-purple-800 to-emerald-600' },
  { key: 'Dubai', emoji: '🌆', label: 'Dubai', grad: 'from-yellow-800 to-amber-500' },
  { key: 'Singapore', emoji: '🦁', label: 'Singapore', grad: 'from-blue-800 to-sky-500' },
  { key: 'Maldives', emoji: '🐬', label: 'Maldives', grad: 'from-cyan-800 to-cyan-400' },
  { key: 'Thailand', emoji: '🐘', label: 'Thailand', grad: 'from-orange-800 to-orange-500' },
  { key: 'Vietnam', emoji: '🛵', label: 'Vietnam', grad: 'from-green-800 to-red-500' },
  { key: 'Europe', emoji: '🏰', label: 'Europe', grad: 'from-blue-900 to-slate-500' },
];

export default function VouchersPage() {
  const [amount, setAmount] = useState<number | ''>('');
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [destination, setDestination] = useState('');
  const [showDestPicker, setShowDestPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedAmount = amount || (customAmount ? Number(customAmount) : 0);
  const selectedDest = DESTINATIONS.find(d => d.key === destination);

  const handlePreset = (val: number) => { setAmount(val); setCustomAmount(''); };
  const handleCustom = (val: string) => { setCustomAmount(val); setAmount(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!selectedAmount || selectedAmount < 500) { setError('Minimum voucher amount is Rs.500.'); return; }
    if (!form.name || !form.email || !form.phone) { setError('All fields are required.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/vouchers/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, amount: selectedAmount, validDays: 365, destination }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Something went wrong.'); setLoading(false); return; }
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        window.location.href = `/vouchers/success?code=${data.code}&txnid=${data.txnid}${destination ? `&dest=${encodeURIComponent(destination)}` : ''}`;
      }
    } catch {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-2xl mb-4">
            <Gift className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-primary mb-2">Gift Vouchers</h1>
          <p className="text-primary/60 text-base">Buy now, travel later. Use your voucher on any YlooTrips booking.</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Clock, label: 'Valid 1 year' },
            { icon: Shield, label: 'Secure payment' },
            { icon: CheckCircle, label: 'Instant code' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center border border-primary/8 shadow-sm">
              <Icon className="w-5 h-5 text-secondary mx-auto mb-1" />
              <p className="text-xs font-medium text-primary/70 dark:text-gray-300">{label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-primary/10 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Amount selection */}
            <div>
              <label className="text-sm font-semibold text-primary dark:text-gray-200 block mb-3">Select Voucher Amount</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {PRESET_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handlePreset(val)}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      amount === val
                        ? 'bg-primary text-white border-primary'
                        : 'border-primary/20 text-primary/70 hover:border-primary/50 dark:border-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Rs.{val.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 font-semibold text-sm">Rs.</span>
                <input
                  type="number"
                  min="500"
                  max="100000"
                  placeholder="Custom amount (min Rs.500)"
                  value={customAmount}
                  onChange={e => handleCustom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-primary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
              {selectedAmount >= 500 && (
                <p className="text-xs text-green-600 mt-1.5 font-medium">
                  Voucher worth Rs.{selectedAmount.toLocaleString('en-IN')} — valid for 1 year
                </p>
              )}
            </div>

            {/* Destination picker */}
            <div>
              <button
                type="button"
                onClick={() => setShowDestPicker(v => !v)}
                className="flex items-center gap-2 text-sm font-semibold text-primary/70 dark:text-gray-300 hover:text-primary transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showDestPicker ? 'rotate-180' : ''}`} />
                {destination ? `Destination: ${selectedDest?.emoji} ${selectedDest?.label}` : 'Personalize with a destination (optional)'}
              </button>

              {showDestPicker && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {DESTINATIONS.map(d => (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => { setDestination(d.key === destination ? '' : d.key); }}
                      className={`relative flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border-2 transition-all text-xs font-semibold bg-gradient-to-br ${d.grad} text-white ${
                        destination === d.key ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <span className="text-xl">{d.emoji}</span>
                      <span>{d.label}</span>
                      {destination === d.key && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-white text-[9px]">✓</span>
                      )}
                    </button>
                  ))}
                  {destination && (
                    <button
                      type="button"
                      onClick={() => setDestination('')}
                      className="flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 text-xs text-primary/50 dark:text-gray-500 hover:border-primary/30 transition-all"
                    >
                      <span className="text-xl">✕</span>
                      <span>None</span>
                    </button>
                  )}
                </div>
              )}

              {/* Destination preview card */}
              {destination && selectedDest && selectedAmount >= 500 && (
                <div className={`mt-4 bg-gradient-to-br ${selectedDest.grad} rounded-2xl p-5 text-white text-center shadow-lg`}>
                  <p className="text-3xl mb-1">{selectedDest.emoji}</p>
                  <p className="text-xs uppercase tracking-widest opacity-70 mb-1">Gift Voucher</p>
                  <p className="font-display text-xl font-bold mb-0.5">YlooTrips — {selectedDest.label}</p>
                  <p className="text-sm opacity-80">Rs.{selectedAmount.toLocaleString('en-IN')} · Valid 1 Year</p>
                  <p className="mt-3 font-mono text-sm tracking-[0.2em] opacity-60">YLVCH-XXXXXX</p>
                </div>
              )}
            </div>

            {/* Recipient / Buyer details */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-primary dark:text-gray-200 block">Your Details</label>
              <input
                required
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 border border-primary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
              <input
                required
                type="email"
                placeholder="Email address (voucher code sent here)"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 border border-primary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
              <input
                required
                type="tel"
                placeholder="Phone number"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-primary/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !selectedAmount || selectedAmount < 500}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 text-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : (
                <><CreditCard className="w-4 h-4" /> Pay Rs.{selectedAmount ? selectedAmount.toLocaleString('en-IN') : '—'} & Get Voucher <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-center text-xs text-primary/40 dark:text-gray-500">
              Secured by Easebuzz · UPI · Cards · Net Banking · EMI
            </p>
          </form>
        </div>

        {/* How to use */}
        <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl border border-primary/10 p-6">
          <h3 className="font-semibold text-primary dark:text-gray-200 mb-4">How to use your voucher</h3>
          <ol className="space-y-3">
            {[
              'Purchase a voucher above and pay securely.',
              'Your unique voucher code is sent to your email instantly.',
              'Go to any trip booking page and enter the code at checkout.',
              'The voucher amount is deducted from your booking total.',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-primary/70 dark:text-gray-400">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

      </div>
    </div>
  );
}
