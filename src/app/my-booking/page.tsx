'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, CheckCircle, Clock, Plane, Calendar, Users,
  MapPin, Ticket, Copy, MessageCircle, ArrowLeft, AlertCircle,
  RefreshCw, Receipt, Shield, Download, Star, Zap, Home
} from 'lucide-react';
import Link from 'next/link';

function fmt(n: number) { return new Intl.NumberFormat('en-IN').format(Math.round(n)); }

/* ─── Booking Reference Hero Card ─── */
function RefCard({ ref: bookingRef, label, gradient }: { ref: string; label: string; gradient: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(bookingRef).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className={`relative rounded-3xl p-7 text-white shadow-2xl overflow-hidden ${gradient}`}>
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="relative z-10">
        <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em] mb-2">{label}</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl sm:text-4xl font-black tracking-widest font-mono">{bookingRef}</span>
          <button
            onClick={copy}
            className="shrink-0 w-10 h-10 bg-white/20 hover:bg-white/35 backdrop-blur rounded-xl flex items-center justify-center transition-all active:scale-95"
            title="Copy reference"
          >
            <Copy size={16} />
          </button>
        </div>
        {copied
          ? <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Copied! 🎉</span>
          : <span className="text-xs text-white/60">Tap to copy your booking reference</span>
        }
      </div>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const s = (status || '').toUpperCase();
  const isGreen = ['PAID', 'CONFIRMED', 'SUCCESS', 'TICKET_ISSUED'].includes(s);
  const isRed = ['CANCELLED', 'FAILED', 'REFUNDED'].includes(s);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider
      ${isGreen ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : ''}
      ${isRed ? 'bg-red-500/20 text-red-400 border border-red-500/30' : ''}
      ${!isGreen && !isRed ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : ''}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse
        ${isGreen ? 'bg-emerald-400' : isRed ? 'bg-red-400' : 'bg-amber-400'}`} />
      {status}
    </span>
  );
}

/* ─── Glass Card wrapper ─── */
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

/* ─── Payment Receipt ─── */
function PaymentReceipt({ lines, total, paymentMethod, paymentStatus, paidAt, receiptId }: {
  lines: { label: string; amount: number; sub?: boolean }[];
  total: number;
  paymentMethod?: string;
  paymentStatus?: string;
  paidAt?: string;
  receiptId: string;
}) {
  const [copied, setCopied] = useState(false);
  const isPaid = ['PAID', 'SUCCESS', 'CONFIRMED'].includes((paymentStatus || '').toUpperCase());

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Receipt size={15} className="text-amber-400" />
          <span className="text-white font-bold text-sm">Payment Receipt</span>
        </div>
        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${isPaid ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-gray-900'}`}>
          {isPaid ? '✓ PAID' : 'PENDING'}
        </span>
      </div>

      <div className="px-5 py-5 space-y-4">
        <div className="flex justify-between text-xs">
          <div>
            <p className="text-white/40 mb-1">Receipt No.</p>
            <div className="flex items-center gap-1.5">
              <p className="font-mono font-bold text-white/80">{receiptId}</p>
              <button onClick={() => { navigator.clipboard.writeText(receiptId); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="text-white/30 hover:text-amber-400 transition-colors"><Copy size={11} /></button>
            </div>
            {copied && <p className="text-emerald-400 text-[10px] mt-0.5">Copied!</p>}
          </div>
          <div className="text-right">
            <p className="text-white/40 mb-1">Issued</p>
            <p className="font-medium text-white/80">
              {paidAt ? new Date(paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <div className="space-y-2">
          {lines.map((line) => (
            <div key={line.label} className={`flex justify-between ${line.sub ? 'text-xs text-white/40 pl-3' : 'text-sm text-white/70'}`}>
              <span>{line.label}</span>
              <span className={line.sub ? '' : 'font-semibold text-white/90'}>₹{fmt(line.amount)}</span>
            </div>
          ))}
        </div>

        <div className="h-px bg-white/10" />

        <div className="flex justify-between items-center">
          <span className="font-bold text-white">Total Paid</span>
          <span className="text-2xl font-black text-amber-400">₹{fmt(total)}</span>
        </div>

        {paymentMethod && (
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3">
            <Shield size={13} className="text-emerald-400 shrink-0" />
            <p className="text-xs text-white/50">
              Paid via <span className="font-semibold text-white/80 capitalize">{paymentMethod.replace('_', ' ')}</span>
              <span className="text-white/30"> · Secured by Easebuzz</span>
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-white/30">YlooTrips Official Receipt</span>
          </div>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-amber-400 transition-colors">
            <Download size={11} />Print
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Timeline ─── */
function Timeline({ steps }: { steps: { label: string; done: boolean }[] }) {
  const firstPending = steps.findIndex(s => !s.done);
  return (
    <GlassCard>
      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4">Journey Status</p>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all
              ${step.done ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : i === firstPending ? 'bg-amber-500/20 border-2 border-amber-400' : 'bg-white/5 border border-white/10'}`}>
              {step.done
                ? <CheckCircle size={15} className="text-white" />
                : <Clock size={13} className={i === firstPending ? 'text-amber-400' : 'text-white/20'} />
              }
            </div>
            <span className={`text-sm font-semibold
              ${step.done ? 'text-emerald-400' : i === firstPending ? 'text-amber-400' : 'text-white/20'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

/* ─── Trip Booking Card ─── */
function TripBookingCard({ data }: { data: Record<string, unknown> }) {
  const ref = (data.bookingReference as string) || '';
  const total = Number(data.finalAmount || data.totalAmount || 0);
  const steps = [
    { label: 'Booking Confirmed ✅', done: true },
    { label: 'Payment Received', done: (data.paymentStatus as string)?.toUpperCase() === 'PAID' },
    { label: 'Trip Preparation 🗺️', done: false },
    { label: 'Your Journey ✈️', done: false },
  ];

  return (
    <div className="space-y-5">
      <RefCard ref={ref} label="Trip Booking Reference" gradient="bg-gradient-to-br from-amber-500 via-orange-500 to-pink-500" />

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-bold text-lg">Trip Details</p>
          <StatusBadge status={(data.paymentStatus as string) || 'PENDING'} />
        </div>
        <div className="space-y-4">
          {!!data.trip && (
            <>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide">Destination</p>
                  <p className="text-white font-semibold">{String((data.trip as Record<string, unknown>).destination ?? '')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Zap size={15} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide">Trip</p>
                  <p className="text-white font-semibold">{String((data.trip as Record<string, unknown>).title ?? '')}</p>
                </div>
              </div>
            </>
          )}
          {!!data.travelDate && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Travel Date</p>
                <p className="text-white font-semibold">{new Date(String(data.travelDate)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          )}
          {data.numberOfGuests != null && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Users size={15} className="text-amber-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Guests</p>
                <p className="text-white font-semibold">{Number(data.numberOfGuests)}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-wide">Amount Paid</p>
            <p className="text-2xl font-black text-amber-400">₹{fmt(total)}</p>
          </div>
        </div>
      </GlassCard>

      <Timeline steps={steps} />

      <PaymentReceipt
        receiptId={ref}
        lines={[{ label: 'Trip Package', amount: total }]}
        total={total}
        paymentMethod={data.paymentMode as string | undefined}
        paymentStatus={(data.paymentStatus as string) || 'PENDING'}
        paidAt={(data.createdAt || data.bookingDate) as string | undefined}
      />
    </div>
  );
}

/* ─── Event Booking Card ─── */
function EventBookingCard({ data }: { data: Record<string, unknown> }) {
  const ref = (data.bookingReference as string) || '';
  const total = Number(data.finalAmount || data.totalAmount || 0);
  const ticketCount = Number(data.numberOfTickets || 1);
  const perTicket = ticketCount > 0 ? Math.round(total / ticketCount) : total;
  const receiptLines = ticketCount > 1
    ? [{ label: `Ticket × ${ticketCount}`, amount: total }, { label: `  ₹${fmt(perTicket)} per ticket`, amount: perTicket * ticketCount, sub: true }]
    : [{ label: 'Ticket', amount: total }];

  return (
    <div className="space-y-5">
      <RefCard ref={ref} label="Event Booking Reference" gradient="bg-gradient-to-br from-purple-500 via-violet-500 to-pink-500" />

      <GlassCard>
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-bold text-lg">Event Details</p>
          <StatusBadge status={(data.paymentStatus as string) || 'PENDING'} />
        </div>
        <div className="space-y-4">
          {!!data.event && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Ticket size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Event</p>
                <p className="text-white font-semibold">{String((data.event as Record<string, unknown>).title ?? '')}</p>
              </div>
            </div>
          )}
          {!!data.eventDate && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Calendar size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Date</p>
                <p className="text-white font-semibold">{new Date(String(data.eventDate)).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          )}
          {data.numberOfTickets != null && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Ticket size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide">Tickets</p>
                <p className="text-white font-semibold">{ticketCount}</p>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <p className="text-white/40 text-xs uppercase tracking-wide">Amount Paid</p>
            <p className="text-2xl font-black text-purple-400">₹{fmt(total)}</p>
          </div>
        </div>
      </GlassCard>

      <PaymentReceipt
        receiptId={ref}
        lines={receiptLines}
        total={total}
        paymentMethod={data.paymentMode as string | undefined}
        paymentStatus={(data.paymentStatus as string) || 'PENDING'}
        paidAt={data.createdAt as string | undefined}
      />
    </div>
  );
}

/* ─── Flight Booking Card ─── */
function FlightBookingCard({ data }: { data: Record<string, unknown> }) {
  const ref = (data.txnid as string) || '';
  const flight = data.flight as Record<string, unknown> | undefined;
  const passengers = (data.passengers as Record<string, unknown>[]) || [];
  const contact = data.contact as Record<string, unknown> | undefined;
  const total = Number(flight?.price || 0);
  const baseFare = Math.round(total * 0.82);
  const taxes = Math.round(total * 0.18);
  const convFee = 249;

  const steps = [
    { label: 'Booking Received 📥', done: true },
    { label: 'Payment Confirmed 💳', done: (data.status as string)?.toUpperCase() !== 'PENDING' },
    { label: 'Ticket Issued 🎟️', done: ['TICKET_ISSUED', 'CONFIRMED'].includes((data.status as string)?.toUpperCase()) },
    { label: 'Bon Voyage! ✈️', done: false },
  ];

  return (
    <div className="space-y-5">
      <RefCard ref={ref} label="Flight Booking Reference" gradient="bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500" />

      {/* Boarding pass style */}
      {flight && (
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <p className="text-white font-bold">Flight Info</p>
            <StatusBadge status={(data.status as string) || 'CONFIRMED'} />
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4">
            <div className="text-center">
              <p className="text-4xl font-black text-white">{flight.from as string}</p>
              <p className="text-white/40 text-xs mt-1">{flight.dep as string}</p>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <p className="text-white/40 text-xs mb-2">{flight.dur as string}</p>
              <div className="w-full flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border-2 border-white/40" />
                <div className="flex-1 h-px bg-white/20 relative">
                  <Plane size={12} className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-sky-400" />
                </div>
                <div className="w-2 h-2 rounded-full border-2 border-white/40" />
              </div>
              <p className="text-white/40 text-xs mt-2">{(flight.stops as number) === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-white">{flight.to as string}</p>
              <p className="text-white/40 text-xs mt-1">{flight.arr as string}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Airline', value: flight.airline as string },
              { label: 'Flight No.', value: flight.flightNum as string },
              { label: 'Date', value: flight.date as string },
              { label: 'Passengers', value: String(passengers.length) },
            ].map(item => (
              <div key={item.label} className="bg-white/5 rounded-xl p-3">
                <p className="text-white/40 text-xs uppercase tracking-wide">{item.label}</p>
                <p className="text-white font-semibold mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Passengers */}
      {passengers.length > 0 && (
        <GlassCard>
          <p className="text-white font-bold mb-3">Passengers</p>
          <div className="space-y-2">
            {passengers.map((p, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400 font-black text-sm shrink-0">{i + 1}</div>
                <div>
                  <p className="font-semibold text-white text-sm">{p.title as string} {p.firstName as string} {p.lastName as string}</p>
                  <p className="text-white/40 text-xs">{p.gender as string} · {p.nationality as string}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <Timeline steps={steps} />

      <PaymentReceipt
        receiptId={ref}
        lines={[
          { label: 'Base Fare', amount: baseFare },
          { label: 'Taxes & Fees', amount: taxes },
          { label: 'Convenience Fee', amount: convFee },
        ]}
        total={total + convFee}
        paymentMethod={data.paymentMethod as string | undefined}
        paymentStatus={(data.status as string) || 'CONFIRMED'}
        paidAt={data.savedAt as string | undefined}
      />

      {/* E-ticket CTA */}
      <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="font-bold text-sky-300 text-sm">E-Ticket 🎫</p>
          <p className="text-sky-400/60 text-xs mt-0.5">Will be sent to {contact?.email as string || 'your email'} within 30 min</p>
        </div>
        <a
          href={`https://wa.me/918427831127?text=Hi!%20I%20booked%20flight%20${encodeURIComponent(ref)}.%20Please%20send%20my%20e-ticket.`}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-xs font-bold rounded-xl hover:bg-sky-400 transition-colors"
        >
          <MessageCircle size={14} />
          Get Ticket
        </a>
      </div>
    </div>
  );
}

/* ─── Main Content ─── */
function MyBookingContent() {
  const searchParams = useSearchParams();
  const prefillRef = searchParams.get('ref') || '';

  const [reference, setReference] = useState(prefillRef);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'trip' | 'event' | 'flight'; data: Record<string, unknown> } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !email.trim()) { setError('Enter your booking reference and email.'); return; }
    setLoading(true); setError(null); setResult(null);
    const ref = reference.trim().toUpperCase();

    try {
      if (ref.startsWith('FLT-')) {
        const res = await fetch(`/api/admin/flight-bookings?txnid=${encodeURIComponent(ref)}`);
        const json = await res.json();
        if (!json.data) { setError('Booking not found. Check your reference and try again.'); return; }
        if ((json.data.contact?.email as string || '').toLowerCase() !== email.trim().toLowerCase()) {
          setError('Email doesn\'t match our records.'); return;
        }
        setResult({ type: 'flight', data: json.data });

      } else if (ref.startsWith('EVT-')) {
        const flightRes = await fetch(`/api/admin/flight-bookings?evtRef=${encodeURIComponent(ref)}`);
        const flightJson = await flightRes.json();
        if (flightJson.data) {
          const b = flightJson.data as Record<string, unknown>;
          if (((b.contact as Record<string, unknown>)?.email as string || '').toLowerCase() !== email.trim().toLowerCase()) {
            setError('Email doesn\'t match our records.'); return;
          }
          setResult({ type: 'flight', data: b }); return;
        }
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/event-bookings/${encodeURIComponent(ref)}`);
        if (!res.ok) { setError('Booking not found. Check your reference.'); return; }
        const booking = await res.json();
        if ((booking.customerEmail as string || '').toLowerCase() !== email.trim().toLowerCase()) {
          setError('Email doesn\'t match our records.'); return;
        }
        setResult({ type: 'event', data: booking });

      } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/bookings/${encodeURIComponent(ref)}`);
        if (!res.ok) { setError('Booking not found. Check your reference.'); return; }
        const booking = await res.json();
        if ((booking.customerEmail as string || '').toLowerCase() !== email.trim().toLowerCase()) {
          setError('Email doesn\'t match our records.'); return;
        }
        setResult({ type: 'trip', data: booking });
      }
    } catch {
      setError('Something went wrong. Try again or WhatsApp us.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(null); setReference(''); setEmail(''); };

  return (
    <div className="min-h-screen bg-[#0a0a0f]" style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(245,158,11,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(139,92,246,0.1), transparent)' }}>
      {/* Nav */}
      <div className="border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-white">Yloo<span className="text-amber-400">Trips</span></Link>
          <Link href="/" className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors">
            <Home size={14} /> Home
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 md:py-16">
        {!result ? (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center space-y-4">
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                  <Plane size={36} className="text-white" />
                </div>
                <span className="absolute -top-2 -right-2 text-2xl">✈️</span>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white leading-tight">
                  Track Your<br /><span className="text-amber-400">Booking</span>
                </h1>
                <p className="text-white/40 text-sm mt-3 leading-relaxed">
                  No account needed — just your reference & email
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLookup} className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-5 backdrop-blur-sm">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Booking Reference</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="BK-123456 · EVT-ABC123 · FLT-123456"
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 font-mono text-sm transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email used when booking"
                  className="w-full px-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/30 text-sm transition-all"
                  required
                />
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <AlertCircle size={17} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <><RefreshCw size={18} className="animate-spin" />Looking up...</> : <><Search size={18} />Find My Booking</>}
              </button>
            </form>

            {/* Reference type hints */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { prefix: 'BK-', label: 'Trip', emoji: '🗺️', color: 'border-amber-500/20 text-amber-400 bg-amber-500/5' },
                { prefix: 'EVT-', label: 'Event', emoji: '🎟️', color: 'border-purple-500/20 text-purple-400 bg-purple-500/5' },
                { prefix: 'FLT-', label: 'Flight', emoji: '✈️', color: 'border-sky-500/20 text-sky-400 bg-sky-500/5' },
              ].map(h => (
                <div key={h.prefix} className={`${h.color} border rounded-2xl p-3 text-center`}>
                  <p className="text-xl mb-1">{h.emoji}</p>
                  <p className="text-xs font-black font-mono">{h.prefix}</p>
                  <p className="text-xs mt-0.5 opacity-70">{h.label}</p>
                </div>
              ))}
            </div>

            {/* WhatsApp */}
            <a
              href="https://wa.me/918427831127?text=Hi!%20I%20need%20help%20with%20my%20booking."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-[0.98]"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Need help? Chat on WhatsApp
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            <button onClick={reset} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 font-medium transition-colors">
              <ArrowLeft size={16} />Search another booking
            </button>

            {result.type === 'trip' && <TripBookingCard data={result.data} />}
            {result.type === 'event' && <EventBookingCard data={result.data} />}
            {result.type === 'flight' && <FlightBookingCard data={result.data} />}

            <a
              href="https://wa.me/918427831127?text=Hi!%20I%20need%20help%20with%20my%20booking."
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-2xl transition-all"
            >
              <MessageCircle size={18} />Need help? Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
          <p className="text-white/40">Loading...</p>
        </div>
      </div>
    }>
      <MyBookingContent />
    </Suspense>
  );
}
