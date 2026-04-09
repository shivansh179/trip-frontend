'use client';

import { useEffect, useState } from 'react';
import { CreditCard, Lock, ShieldCheck, Clock, Star, Phone } from 'lucide-react';

// Deterministic "booked today" — changes daily, same value for all SSR/CSR
function bookedToday(): number {
  const day = new Date().getDate() + new Date().getMonth() * 31;
  return 18 + (day % 14); // 18–31 range
}

export default function TrustBanner() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const target = bookedToday();
    let current = 0;
    const step = Math.ceil(target / 18);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 55);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-cream-light border-b border-primary/8">

      {/* Live booking counter — top micro-bar */}
      <div className="bg-primary py-1.5">
        <div className="section-container">
          <p className="text-center text-[10px] text-cream/60 uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block shrink-0" />
            <span>
              <span className="text-cream font-bold">{count} trips</span> booked in the last 24 hours
            </span>
            <span className="hidden md:inline text-cream/30">·</span>
            <span className="hidden md:inline">Slots filling fast — book to secure your dates</span>
          </p>
        </div>
      </div>

      {/* Trust badges row */}
      <div className="section-container py-3.5 border-b border-primary/6">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary/80 uppercase tracking-wider leading-none">Govt. Registered</div>
              <div className="text-[9px] text-primary/40 leading-none mt-0.5">MSME Certified</div>
            </div>
          </div>

          <div className="w-px h-6 bg-primary/8 hidden md:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary/80 uppercase tracking-wider leading-none">256-bit SSL</div>
              <div className="text-[9px] text-primary/40 leading-none mt-0.5">PCI-DSS Compliant</div>
            </div>
          </div>

          <div className="w-px h-6 bg-primary/8 hidden md:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary/80 uppercase tracking-wider leading-none">Reply in &lt; 1 Hr</div>
              <div className="text-[9px] text-primary/40 leading-none mt-0.5">7 days a week</div>
            </div>
          </div>

          <div className="w-px h-6 bg-primary/8 hidden md:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary/80 uppercase tracking-wider leading-none">24/7 Support</div>
              <div className="text-[9px] text-primary/40 leading-none mt-0.5">On-trip emergency line</div>
            </div>
          </div>

          <div className="w-px h-6 bg-primary/8 hidden md:block" />

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
              <Star className="w-3.5 h-3.5 fill-[#FBBC05] text-[#FBBC05]" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold text-primary/80">4.9</span>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-2.5 h-2.5 fill-[#FBBC05] text-[#FBBC05]" />
                  ))}
                </div>
              </div>
              <div className="text-[9px] text-primary/40 leading-none mt-0.5">2,400+ Google reviews</div>
            </div>
          </div>

        </div>
      </div>

      {/* Payment methods row */}
      <div className="section-container py-2.5">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
          <CreditCard className="w-3.5 h-3.5 text-primary/30 shrink-0" />
          <span className="text-[9px] uppercase tracking-widest text-primary/30 shrink-0 mr-1">Secure payments via</span>
          {[
            { label: 'Visa',        cls: 'text-blue-700   bg-blue-50   border-blue-200'   },
            { label: 'Mastercard',  cls: 'text-red-600    bg-red-50    border-red-200'    },
            { label: 'Amex',        cls: 'text-blue-800   bg-blue-50   border-blue-200'   },
            { label: 'UPI',         cls: 'text-green-700  bg-green-50  border-green-200'  },
            { label: 'RuPay',       cls: 'text-orange-600 bg-orange-50 border-orange-200' },
            { label: 'Net Banking', cls: 'text-gray-700   bg-gray-100  border-gray-200'   },
            { label: '0% EMI',      cls: 'text-purple-700 bg-purple-50 border-purple-200' },
          ].map(({ label, cls }) => (
            <span key={label} className={`${cls} text-[9px] font-bold px-2.5 py-1 rounded border whitespace-nowrap`}>
              {label}
            </span>
          ))}
          <span className="text-[9px] text-primary/25 hidden md:inline ml-1">· No card details stored</span>
        </div>
      </div>

    </div>
  );
}
