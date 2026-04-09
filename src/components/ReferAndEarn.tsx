'use client';

import { useState } from 'react';
import { Copy, Check, Gift, Users, Wallet, ArrowRight } from 'lucide-react';

const steps = [
  { icon: '🔗', title: 'Share your link', desc: 'Send it to any friend planning a trip' },
  { icon: '✅', title: 'They book a trip', desc: 'Friend gets ₹1,000 off their first booking' },
  { icon: '💰', title: 'You earn ₹1,000', desc: 'Credited to your WanderLoot wallet instantly' },
];

export default function ReferAndEarn() {
  const [copied, setCopied] = useState(false);

  const referralLink = 'https://ylootrips.com';
  const whatsappMessage = encodeURIComponent(
    "Hey! Found this amazing travel company — YlooTrips. Use my link to get ₹1,000 off your first trip: https://ylootrips.com 🌍"
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch {
      const el = document.createElement('textarea');
      el.value = referralLink;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/3" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #c4a77d 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="section-container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6">
              <Gift size={12} />
              Refer &amp; Earn
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream leading-tight mb-4">
              Share travel joy.<br />
              <span className="text-accent italic">Earn ₹1,000.</span>
            </h2>

            <p className="text-cream/50 text-base leading-relaxed mb-10 max-w-md">
              For every friend who books with YlooTrips, you both get ₹1,000 in WanderLoot wallet credit. No limit on referrals.
            </p>

            {/* Steps */}
            <div className="space-y-5">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cream/5 border border-cream/10 flex items-center justify-center text-xl shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-cream font-semibold text-sm">{s.title}</p>
                    <p className="text-cream/40 text-sm mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mt-10 pt-8 border-t border-cream/8">
              <div>
                <div className="flex items-center gap-1.5 text-accent">
                  <Users size={16} />
                  <span className="text-2xl font-bold text-cream">2,400+</span>
                </div>
                <p className="text-cream/35 text-xs mt-1">Successful referrals</p>
              </div>
              <div className="w-px bg-cream/8" />
              <div>
                <div className="flex items-center gap-1.5 text-accent">
                  <Wallet size={16} />
                  <span className="text-2xl font-bold text-cream">₹24L+</span>
                </div>
                <p className="text-cream/35 text-xs mt-1">Rewards given out</p>
              </div>
            </div>
          </div>

          {/* RIGHT — Card */}
          <div className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl scale-90" />

            <div className="relative bg-cream/[0.04] border border-cream/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center">
                  <Gift size={22} className="text-accent" />
                </div>
                <div>
                  <p className="text-cream font-bold text-base">Your referral link</p>
                  <p className="text-cream/40 text-xs">Share this to earn ₹1,000 per booking</p>
                </div>
              </div>

              {/* Link display */}
              <div className="flex items-center gap-3 bg-cream/[0.06] border border-cream/10 rounded-2xl px-4 py-3.5 mb-5">
                <span className="text-accent text-sm font-mono flex-1 truncate">
                  ylootrips.com/ref/YOU
                </span>
                <button
                  onClick={handleCopy}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                    copied
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-cream/10 text-cream/60 hover:bg-cream/15 border border-cream/10'
                  }`}
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Share buttons */}
              <div className="space-y-3 mb-6">
                <a
                  href={`https://wa.me/?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Share on WhatsApp
                </a>

                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2.5 w-full bg-cream/8 hover:bg-cream/12 text-cream/70 hover:text-cream font-semibold py-3.5 rounded-xl text-sm transition-all border border-cream/10"
                >
                  <Copy size={15} />
                  Copy Referral Link
                </button>
              </div>

              {/* Reward preview */}
              <div className="flex items-center justify-between bg-accent/10 border border-accent/15 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Wallet size={16} className="text-accent" />
                  <span className="text-cream/70 text-sm">Your reward per referral</span>
                </div>
                <span className="text-accent font-bold text-base">₹1,000</span>
              </div>

              <p className="text-cream/20 text-[10px] text-center mt-4">
                T&amp;C apply · Valid for new customers only · No expiry on wallet credits
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
