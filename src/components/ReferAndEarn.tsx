'use client';

import { useState } from 'react';
import { Copy, Share2, Check, Gift } from 'lucide-react';

export default function ReferAndEarn() {
  const [copied, setCopied] = useState(false);

  const referralLink = 'https://ylootrips.com';
  const displayLink = 'ylootrips.com/ref/YOU';

  const whatsappMessage = encodeURIComponent(
    "Hey! I found this amazing travel company YlooTrips. Use my referral link to get ₹1,000 off your first trip: https://ylootrips.com. Let's travel together! 🌍"
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = referralLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50 border-y border-amber-100 py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT SIDE */}
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-sm font-medium px-3 py-1.5 rounded-full mb-5">
              <Gift className="w-4 h-4" />
              Refer &amp; Earn
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Share the joy of travel.{' '}
              <span className="text-orange-500">Earn ₹1,000.</span>
            </h2>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              For every friend who books a trip with YlooTrips, you both get ₹1,000 off your next
              booking. No limits on referrals.
            </p>

            <ul className="space-y-4">
              {[
                "Your friend gets ₹1,000 off their first trip",
                "You get ₹1,000 credited after their booking",
                "No limit — refer 10 friends, save ₹10,000",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SIDE — Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-5">Share your referral link</h3>

            {/* Link display */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4">
              <span className="text-orange-500 font-medium text-sm flex-1 truncate">
                {displayLink}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* WhatsApp share */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium px-5 py-3 rounded-xl transition-colors flex-1"
              >
                <Share2 className="w-4 h-4" />
                Share on WhatsApp
              </a>

              {/* Copy link */}
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-medium px-5 py-3 rounded-xl transition-colors flex-1"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-5 text-center">
              T&amp;C apply. Valid for new customers only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
