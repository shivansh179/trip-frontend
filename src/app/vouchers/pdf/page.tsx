'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, Download, Phone, Mail, Globe } from 'lucide-react';

const DEST_THEMES: Record<string, { emoji: string; from: string; to: string }> = {
  Manali:    { emoji: '🏔️', from: '#1e3a5f', to: '#2563eb' },
  Kashmir:   { emoji: '❄️', from: '#312e81', to: '#7c3aed' },
  Goa:       { emoji: '🌊', from: '#0e7490', to: '#0d9488' },
  Kerala:    { emoji: '🌿', from: '#14532d', to: '#16a34a' },
  Rajasthan: { emoji: '🏜️', from: '#78350f', to: '#d97706' },
  Bali:      { emoji: '🌺', from: '#581c87', to: '#065f46' },
  Dubai:     { emoji: '🌆', from: '#713f12', to: '#b45309' },
  Singapore: { emoji: '🦁', from: '#1e3a5f', to: '#0284c7' },
  Maldives:  { emoji: '🐬', from: '#164e63', to: '#06b6d4' },
  Thailand:  { emoji: '🐘', from: '#7c2d12', to: '#ea580c' },
  Vietnam:   { emoji: '🛵', from: '#14532d', to: '#dc2626' },
  Europe:    { emoji: '🏰', from: '#1e3a5f', to: '#475569' },
};
const DEFAULT_THEME = { emoji: '🎁', from: '#1c1c1c', to: '#c9a96e' };

interface VoucherData {
  code: string;
  amount: number;
  validUntil: string;
  status: string;
  destination: string;
  tripName: string;
  tripDates: string;
  hotel: string;
  inclusions: string;
  holderName: string;
  holderEmail: string;
  pdfUrl: string;
  createdAt: string;
}

function PDFContent() {
  const sp = useSearchParams();
  const code = sp.get('code')?.toUpperCase() || '';

  const [voucher, setVoucher] = useState<VoucherData | null>(null);
  const [error, setError]     = useState('');

  useEffect(() => {
    if (!code) { setError('No voucher code provided.'); return; }
    fetch(`/api/vouchers/validate?code=${encodeURIComponent(code)}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setVoucher(d as VoucherData);
      })
      .catch(() => setError('Failed to load voucher.'));
  }, [code]);

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800 mb-2">Voucher not found</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    </div>
  );

  if (!voucher) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );

  const theme = DEST_THEMES[voucher.destination] || DEFAULT_THEME;
  const emoji = theme.emoji;
  const validDate = new Date(voucher.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const issuedDate = new Date(voucher.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const inclList = voucher.inclusions ? voucher.inclusions.split(/,|\n/).map(s => s.trim()).filter(Boolean) : [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ylootrips.com';

  return (
    <>
      {/* Download button — hidden in print */}
      <div className="print:hidden fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg hover:bg-gray-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* ─── PDF Page ─────────────────────────────────────────── */}
      <div
        id="voucher-pdf"
        className="min-h-screen bg-gray-100 flex items-start justify-center py-8 print:py-0 print:bg-white"
      >
        <div
          className="w-[210mm] min-h-[297mm] bg-white shadow-2xl print:shadow-none"
          style={{ fontFamily: "'Segoe UI', Arial, sans-serif" }}
        >

          {/* ── Header band ─────────────────────────── */}
          <div
            className="relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`, padding: '36px 40px 28px' }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />

            <div className="relative z-10 flex items-start justify-between">
              {/* Branding */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-black text-2xl tracking-tight">Yloo</span>
                  <span className="text-white/70 font-light text-2xl">Trips</span>
                </div>
                <p className="text-white/60 text-xs tracking-widest uppercase">Gift Voucher</p>
              </div>

              {/* Destination emoji */}
              <div className="text-center">
                <p className="text-5xl">{emoji}</p>
                {voucher.destination && (
                  <p className="text-white/80 text-xs mt-1 font-medium">{voucher.destination}</p>
                )}
              </div>
            </div>

            {/* Voucher code — large */}
            <div className="relative z-10 mt-6">
              <p className="text-white/60 text-[10px] uppercase tracking-[0.25em] mb-1">Voucher Code</p>
              <p className="text-white font-mono font-black text-4xl tracking-[0.18em]">{voucher.code}</p>
            </div>
          </div>

          {/* ── Main body ───────────────────────────── */}
          <div className="px-10 py-8">
            <div className="flex gap-8">

              {/* Left column */}
              <div className="flex-1 space-y-6">

                {/* Recipient */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-1">Prepared for</p>
                  <p className="text-2xl font-bold text-gray-900">{voucher.holderName || 'Valued Guest'}</p>
                  {voucher.holderEmail && (
                    <p className="text-sm text-gray-500 mt-0.5">{voucher.holderEmail}</p>
                  )}
                </div>

                {/* Value */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: `linear-gradient(135deg, ${theme.from}15, ${theme.to}20)`, border: `1.5px solid ${theme.from}30` }}
                >
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Voucher Value</p>
                  <p className="text-4xl font-black text-gray-900">
                    ₹{voucher.amount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Valid until {validDate}</p>
                </div>

                {/* Trip details */}
                {(voucher.tripName || voucher.tripDates || voucher.hotel) && (
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Trip Details</p>

                    {voucher.tripName && (
                      <div>
                        <p className="text-xs text-gray-400">Package</p>
                        <p className="font-bold text-gray-800 text-base">{voucher.tripName}</p>
                      </div>
                    )}

                    {voucher.tripDates && (
                      <div>
                        <p className="text-xs text-gray-400">Travel Dates</p>
                        <p className="font-semibold text-gray-800">{voucher.tripDates}</p>
                      </div>
                    )}

                    {voucher.hotel && (
                      <div>
                        <p className="text-xs text-gray-400">Stay</p>
                        <p className="font-semibold text-gray-800">{voucher.hotel}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Inclusions */}
                {inclList.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">What&apos;s Included</p>
                    <ul className="space-y-1.5">
                      {inclList.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                          <span
                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                            style={{ background: theme.from }}
                          >✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right column — QR + details */}
              <div className="w-44 flex-shrink-0 space-y-5">

                {/* QR Code */}
                <div className="text-center">
                  <div className="inline-block p-2.5 border-2 border-gray-200 rounded-xl bg-white">
                    <QRCodeSVG
                      value={`${siteUrl}/vouchers/pdf?code=${voucher.code}`}
                      size={120}
                      level="M"
                      fgColor={theme.from}
                      bgColor="#ffffff"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1.5">Scan to view voucher</p>
                </div>

                {/* Issue details */}
                <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400">Issued on</p>
                    <p className="text-xs font-semibold text-gray-700">{issuedDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400">Valid until</p>
                    <p className="text-xs font-semibold text-gray-700">{validDate}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400">Status</p>
                    <p className="text-xs font-semibold text-green-600 capitalize">{voucher.status}</p>
                  </div>
                </div>

                {/* PDF Itinerary link */}
                {voucher.pdfUrl && (
                  <a
                    href={voucher.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-xs font-semibold py-2 px-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 print:hidden"
                  >
                    View Itinerary PDF
                  </a>
                )}
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="my-7 flex items-center gap-3">
              <div className="flex-1 border-t border-dashed border-gray-200" />
              <span className="text-gray-300 text-sm">✂</span>
              <div className="flex-1 border-t border-dashed border-gray-200" />
            </div>

            {/* ── How to use ── */}
            <div className="grid grid-cols-3 gap-4 mb-7">
              {[
                { n: '1', t: 'Choose your trip', d: 'Browse any trip or package at ylootrips.com' },
                { n: '2', t: 'Enter code at checkout', d: `Apply code ${voucher.code} in the promo/voucher field` },
                { n: '3', t: 'Enjoy the saving!', d: `₹${voucher.amount.toLocaleString('en-IN')} deducted from your booking` },
              ].map(s => (
                <div key={s.n} className="flex gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: theme.from }}
                  >{s.n}</div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{s.t}</p>
                    <p className="text-[11px] text-gray-500 leading-tight mt-0.5">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Terms ── */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mb-2">Terms &amp; Conditions</p>
              <ul className="space-y-0.5">
                {[
                  'This voucher can be used for any trip or package booking on YlooTrips.',
                  'Valid for a single use only. Partially used balance is non-refundable.',
                  'Cannot be combined with other promotional codes.',
                  `This voucher expires on ${validDate} and cannot be extended.`,
                  'YlooTrips reserves the right to cancel this voucher if misused.',
                  'For assistance, contact hello@ylootrips.com or WhatsApp +91 84278 31127.',
                ].map((t, i) => (
                  <li key={i} className="text-[11px] text-gray-500 flex gap-1.5">
                    <span className="text-gray-300 flex-shrink-0">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Footer ─────────────────────────────── */}
          <div
            className="px-10 py-5 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
          >
            <div>
              <p className="text-white font-black text-lg tracking-tight">YlooTrips</p>
              <p className="text-white/60 text-[10px]">Explore. Experience. Remember.</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-white/80 text-xs flex items-center justify-end gap-1.5">
                <Globe className="w-3 h-3" />ylootrips.com
              </p>
              <p className="text-white/80 text-xs flex items-center justify-end gap-1.5">
                <Mail className="w-3 h-3" />hello@ylootrips.com
              </p>
              <p className="text-white/80 text-xs flex items-center justify-end gap-1.5">
                <Phone className="w-3 h-3" />+91 84278 31127
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { margin: 0; }
          #voucher-pdf { padding: 0 !important; background: white !important; }
          #voucher-pdf > div { box-shadow: none !important; width: 210mm !important; min-height: 297mm !important; }
        }
        @page { size: A4 portrait; margin: 0; }
      `}</style>
    </>
  );
}

export default function VoucherPDFPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    }>
      <PDFContent />
    </Suspense>
  );
}
