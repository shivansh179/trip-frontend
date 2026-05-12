'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Sparkles, MapPin } from 'lucide-react';

const DESTINATIONS = ['Manali', 'Goa', 'Kashmir', 'Bali', 'Dubai', 'Kerala', 'Thailand'];

export default function EmailCapturePopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show after 45 seconds if not already dismissed/submitted
    const dismissed = localStorage.getItem('ylooEmailPopupDismissed');
    const alreadySubmitted = localStorage.getItem('ylooEmailSubmitted');
    if (dismissed || alreadySubmitted) return;

    const timer = setTimeout(() => setShow(true), 45000);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('ylooEmailPopupDismissed', Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Send to backend or just store locally for now
      await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, destination, source: 'popup' }),
      }).catch(() => {}); // silent fail if endpoint doesn't exist yet
    } finally {
      setLoading(false);
      setSubmitted(true);
      localStorage.setItem('ylooEmailSubmitted', 'true');
      setTimeout(() => setShow(false), 3000);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) handleDismiss(); }}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" style={{ animation: 'slideUp 0.3s ease-out' }}>

        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

        {/* Close */}
        <button onClick={handleDismiss}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors z-10">
          <X size={15} />
        </button>

        <div className="p-6">
          {!submitted ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-lg leading-tight">Get Your Free Trip Plan</h2>
                  <p className="text-gray-500 text-xs">Personalized itinerary in your inbox</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                Tell us where you want to go — we&apos;ll send a <strong>free day-by-day itinerary</strong> with exact costs, best hotels, and insider tips. No spam, ever.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-700 bg-white focus:outline-none focus:border-amber-400 appearance-none"
                  >
                    <option value="">Where do you want to go?</option>
                    {DESTINATIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                    <option value="Other">Other / Not sure yet</option>
                  </select>
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send My Free Itinerary'}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-3">
                4.9★ rated · 25,000+ travelers served · No spam
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">You&apos;re all set!</h3>
              <p className="text-gray-500 text-sm">Your free itinerary is on its way. Check your inbox in the next few minutes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
