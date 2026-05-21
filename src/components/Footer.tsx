'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Instagram, Facebook, ShieldCheck, Lock, Star, Phone, Mail, MapPin } from 'lucide-react';
import AdminLoginModal from './AdminLoginModal';

export default function Footer() {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: 'All Destinations', href: '/destinations' },
      { name: 'Hidden Gems', href: '/hidden-spots' },
      { name: 'The Journal', href: '/blogs' },
      { name: 'Group Travel', href: '/group-travel' },
      { name: 'Travel Insurance', href: '/travel-insurance' },
      { name: 'Visa Guide', href: '/visa' },
      { name: 'Packing Checklist', href: '/packing-checklist' },
      { name: 'Best Time to Travel', href: '/best-time-to-travel' },
    ],
    tours: [
      { name: 'All India Tours', href: '/tours' },
      { name: 'Kashmir Package', href: '/kashmir-tour-package' },
      { name: 'Manali Package', href: '/manali-tour-package' },
      { name: 'Goa Package', href: '/goa-tour-package' },
      { name: 'Kerala Package', href: '/kerala-tour-package' },
      { name: 'Rajasthan Package', href: '/rajasthan-tour-package' },
      { name: 'Himachal Package', href: '/himachal-tour-package' },
      { name: 'Uttarakhand Package', href: '/uttarakhand-tour-package' },
      { name: 'Ladakh Package', href: '/ladakh-tour-package' },
      { name: 'Andaman Package', href: '/andaman-tour-package' },
      { name: 'Spiti Valley Package', href: '/spiti-valley-tour-package' },
      { name: 'Dubai Package', href: '/dubai-tour-package-from-delhi' },
      { name: 'Bali Package', href: '/bali-honeymoon-package' },
      { name: 'Thailand Package', href: '/thailand-budget-trip' },
      { name: 'Singapore Package', href: '/singapore-tour-package' },
      { name: 'Vietnam Package', href: '/vietnam-tour-package' },
      { name: 'Sri Lanka Package', href: '/sri-lanka-tour-package' },
      { name: 'Nepal Package', href: '/nepal-tour-package' },
      { name: 'Europe Package', href: '/europe-tour-package-from-india' },
    ],
    company: [
      { name: 'Our Story', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Partnerships', href: '/partnerships' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Cancellation & Refunds', href: '/terms#cancellation' },
    ],
  };

  const handleLoginSuccess = () => {
    setShowAdminModal(false);
    router.push('/admin');
  };

  return (
    <>
      <footer className="bg-primary text-cream">


        {/* Main content */}
        <div className="section-container py-8 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">

            {/* Brand column */}
            <div className="lg:col-span-4 space-y-5">
              <Link href="/" className="inline-block">
                <img src="/logo.png" alt="YlooTrips — India Travel Experts" className="h-12 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-cream/55 text-sm leading-relaxed">
                We believe in slow travel and meaningful connections. Curated journeys for those who seek authentic experiences and lasting memories.
              </p>

              {/* Contact info */}
              <div className="space-y-2.5">
                <a href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-cream/50 hover:text-white/80 transition-colors text-sm group">
                  <Phone className="w-3.5 h-3.5 group-hover:text-white/80" />
                  <span>+91 84278 31127 (WhatsApp)</span>
                </a>
                <a href="mailto:hello@ylootrips.com"
                  className="flex items-center gap-2.5 text-cream/50 hover:text-white/80 transition-colors text-sm group">
                  <Mail className="w-3.5 h-3.5 group-hover:text-white/80" />
                  <span>hello@ylootrips.com</span>
                </a>
                <div className="flex items-start gap-2.5 text-cream/40 text-sm">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <span>New Delhi, India · Serving travelers worldwide</span>
                </div>
              </div>

              {/* GST / Registration */}
              <div className="border border-white/8 rounded px-4 py-3 space-y-1">
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/40">Company Details</p>
                <p className="text-[10px] text-cream/35">MSME: UDYAM-HR-05-0141455</p>
                <p className="text-[10px] text-cream/35">GST: 07BATPV1942C1ZF</p>
                <p className="text-[10px] text-cream/35">New Delhi, India · Est. 2022</p>
              </div>

              {/* Newsletter */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">Travel Inspiration Weekly</p>
                <form className="flex gap-0">
                  <input type="email" placeholder="your@email.com"
                    className="flex-1 min-w-0 bg-white/5 border border-white/10 px-4 py-3 text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-white/30 transition-colors" />
                  <button type="submit" className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0 border border-white/10">
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[9px] text-cream/25 mt-1.5">No spam. Unsubscribe any time.</p>
              </div>
            </div>

            {/* Links */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-12 gap-6 md:gap-8">
                {/* Explore */}
                <div className="md:col-span-3">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Explore</h4>
                  <ul className="space-y-2">
                    {footerLinks.explore.map(l => (
                      <li key={l.name}>
                        <Link href={l.href} className="text-cream/50 hover:text-cream transition-colors text-sm">
                          {l.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tours — 2-column list to halve height */}
                <div className="md:col-span-5">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Tours</h4>
                  <ul className="columns-2 gap-x-4 space-y-0">
                    {footerLinks.tours.map(l => (
                      <li key={l.name} className="mb-2 break-inside-avoid">
                        <Link href={l.href} className="text-cream/50 hover:text-cream transition-colors text-sm">
                          {l.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div className="md:col-span-2">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Company</h4>
                  <ul className="space-y-2">
                    {footerLinks.company.map(l => (
                      <li key={l.name}>
                        <Link href={l.href} className="text-cream/50 hover:text-cream transition-colors text-sm">
                          {l.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div className="md:col-span-2">
                  <h4 className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-4">Legal</h4>
                  <ul className="space-y-2">
                    {footerLinks.legal.map(l => (
                      <li key={l.name}>
                        <Link href={l.href} className="text-cream/50 hover:text-cream transition-colors text-sm">
                          {l.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8">
          {/* Social icons row — always visible on mobile above sticky nav */}
          <div className="section-container pt-5 pb-2">
            <div className="flex items-center justify-center sm:justify-end gap-6">
              <a href="https://www.instagram.com/ylootrips/" target="_blank" rel="noopener noreferrer"
                className="text-cream/50 hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61574908545709" target="_blank" rel="noopener noreferrer"
                className="text-cream/50 hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/company/ylootrips" target="_blank" rel="noopener noreferrer"
                className="text-cream/50 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@ylootrips" target="_blank" rel="noopener noreferrer"
                className="text-cream/50 hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="section-container py-4 pb-28 sm:pb-5">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
              <div className="space-y-1">
                <p className="text-[10px] text-cream/35 uppercase tracking-widest">
                  © {currentYear} YlooTrips · All rights reserved.
                </p>
                <p className="text-[9px] text-cream/20">
                  Prices are inclusive of all taxes · No hidden fees · Currency shown based on your selection
                </p>
              </div>
              {/* Admin button */}
              <button
                onClick={() => setShowAdminModal(true)}
                aria-label="Admin Portal"
                style={{
                  background: 'rgba(255,255,255,0.22)',
                  border: '2px solid rgba(255,255,255,0.45)',
                  borderRadius: 8,
                  padding: '6px 16px',
                  color: '#ffffff',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                ADMIN
              </button>
            </div>
          </div>
        </div>
      </footer>

      <AdminLoginModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
}
