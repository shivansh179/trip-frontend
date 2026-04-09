'use client';

import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock, Users, Star, MapPin, Check, X, ChevronDown, Shield,
  RefreshCw, MessageCircle, Zap, Award, Eye, TrendingDown,
  Calendar, ChevronRight, Quote, Phone,
} from 'lucide-react';
import { TourJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

/* ─────────────────────────────────────────────────────────────────── */
/*  Types                                                              */
/* ─────────────────────────────────────────────────────────────────── */
export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string;
  hotel: string;
  activities?: string[];
  image?: string;
}

export interface Review {
  name: string;
  country: string;
  flag: string;
  rating: number;
  text: string;
  date: string;
  trip: string;
}

export interface PackageData {
  // Routing
  slug: string;
  canonicalUrl: string;

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;

  // Hero
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;

  // Quick stats
  duration: string;
  groupSize: string;
  difficulty: string;
  startLocation: string;

  // Pricing
  priceINR: number;
  priceUSD: number;
  originalPriceINR?: number;
  depositPercent?: number; // default 30

  // Content sections
  tagline: string;
  overview: string[];          // array of paragraphs
  highlights: string[];
  gallery: { src: string; alt: string; label: string }[];

  // Itinerary
  itinerary: ItineraryDay[];

  // Inclusions
  includes: string[];
  excludes: string[];

  // Reviews
  reviews: Review[];
  avgRating: number;
  reviewCount: number;

  // FAQ
  faqs: { question: string; answer: string }[];

  // Related packages
  related: { title: string; href: string; priceINR: number; image: string }[];

  // Booking
  whatsappMsg: string;
  bookingHref: string;

  // Schema
  schemaHighlights?: string[];
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Helpers                                                            */
/* ─────────────────────────────────────────────────────────────────── */
function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}
function fmtUSD(n: number) {
  return '$' + n.toLocaleString('en-US');
}
function spotsLeft(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffffffff;
  const v = (Math.abs(h) % 9) + 1;
  return v <= 5 ? v : null;
}
function viewers(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 17 + slug.charCodeAt(i)) & 0xffffffff;
  return (Math.abs(h) % 20) + 4;
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Sticky Booking Sidebar                                             */
/* ─────────────────────────────────────────────────────────────────── */
function BookingSidebar({ pkg }: { pkg: PackageData }) {
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState('');
  const slots = spotsLeft(pkg.slug);
  const live = viewers(pkg.slug);
  const total = pkg.priceINR * guests;
  const emi = Math.ceil(total / 6);
  const deposit = Math.ceil(total * (pkg.depositPercent ?? 30) / 100);

  return (
    <div className="space-y-4">
      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary px-6 py-5">
          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Starting from</p>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl text-white">{fmt(pkg.priceINR)}</span>
            <span className="text-white/55 text-sm">/ person</span>
          </div>
          {pkg.originalPriceINR && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/40 text-xs line-through">{fmt(pkg.originalPriceINR)}</span>
              <span className="bg-terracotta text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {Math.round((1 - pkg.priceINR / pkg.originalPriceINR) * 100)}% OFF
              </span>
            </div>
          )}
          <p className="text-white/50 text-xs mt-1">≈ {fmtUSD(pkg.priceUSD)} for international travelers</p>
        </div>

        <div className="p-5 space-y-4">
          {/* Live signals */}
          <div className="flex items-center gap-2 text-xs text-primary/55">
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span><strong className="text-primary">{live} people</strong> viewing this package right now</span>
          </div>
          {slots && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shrink-0" />
              <span className="text-red-700 text-xs font-semibold">Only {slots} slots left for this month!</span>
            </div>
          )}

          {/* Guests */}
          <div>
            <label className="text-[10px] text-primary/50 uppercase tracking-widest font-semibold mb-1.5 block">
              <Users className="w-3 h-3 inline mr-1" />Travelers
            </label>
            <select
              value={guests}
              onChange={e => setGuests(+e.target.value)}
              className="w-full p-3 border border-primary/15 bg-cream/40 text-primary rounded-xl text-sm focus:outline-none focus:border-secondary"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Traveler' : 'Travelers'}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-[10px] text-primary/50 uppercase tracking-widest font-semibold mb-1.5 block">
              <Calendar className="w-3 h-3 inline mr-1" />Travel Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-primary/15 bg-cream/40 text-primary rounded-xl text-sm focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Price breakdown */}
          <div className="bg-cream/60 rounded-xl p-4 border border-primary/8 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-primary/55">{fmt(pkg.priceINR)} × {guests}</span>
              <span className="font-medium">{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-700">
              <span>10% WanderLoot cashback</span>
              <span>+{fmt(Math.ceil(total * 0.1))}</span>
            </div>
            <div className="border-t border-primary/10 pt-2 flex justify-between font-semibold">
              <span className="text-primary">Total</span>
              <span className="font-display text-xl text-primary">{fmt(total)}</span>
            </div>
            <div className="text-xs text-primary/40 text-right">
              Advance: {fmt(deposit)} · Balance on arrival
            </div>
          </div>

          {/* EMI */}
          <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
            <TrendingDown className="w-4 h-4 text-violet-600 shrink-0" />
            <p className="text-xs text-violet-800">
              <strong>No-cost EMI</strong> from <strong>{fmt(emi)}/mo</strong> for 6 months
            </p>
          </div>

          {/* Book button */}
          <Link
            href={`${pkg.bookingHref}${date ? `&date=${date}` : ''}&guests=${guests}`}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-secondary text-cream py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            <Zap className="w-4 h-4" />
            {date ? 'Proceed to Booking' : 'Book Now'}
          </Link>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/918427831127?text=${encodeURIComponent(pkg.whatsappMsg + (date ? ` Date: ${date}.` : '') + ` Guests: ${guests}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp
          </a>

          {/* Trust row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Shield, label: 'Secure Pay', color: 'text-blue-600' },
              { icon: RefreshCw, label: 'Free Cancel', color: 'text-green-600' },
              { icon: Award, label: '4.9★ Rated', color: 'text-amber-600' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 text-center">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-[10px] text-primary/45 uppercase tracking-wide leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Details card */}
      <div className="bg-white rounded-2xl border border-primary/10 p-5 space-y-3">
        <p className="text-xs font-bold text-primary uppercase tracking-widest">Package Details</p>
        {[
          { label: 'Duration', value: pkg.duration },
          { label: 'Group Size', value: pkg.groupSize },
          { label: 'Difficulty', value: pkg.difficulty },
          { label: 'Starts At', value: pkg.startLocation },
          { label: 'Cancellation', value: 'Free up to 14 days' },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-primary/50">{label}</span>
            <span className="font-medium text-primary text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Help */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
        <p className="text-xs font-bold text-amber-800 mb-1">Need help planning?</p>
        <p className="text-xs text-amber-700 mb-3">Our experts reply in under 1 hour</p>
        <a
          href="https://wa.me/918427831127"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#25D366] hover:bg-[#1ebe5d] px-4 py-2 rounded-full transition-colors"
        >
          <Phone className="w-3 h-3" /> +91 84278 31127
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Mobile Sticky Bar                                                  */
/* ─────────────────────────────────────────────────────────────────── */
function MobileBar({ pkg }: { pkg: PackageData }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-primary/10 shadow-2xl px-4 py-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-primary/50 uppercase tracking-wider">Starting from</p>
        <p className="font-display text-xl text-primary leading-none">{fmt(pkg.priceINR)}<span className="text-sm font-sans text-primary/40"> /person</span></p>
      </div>
      <a
        href={`https://wa.me/918427831127?text=${encodeURIComponent(pkg.whatsappMsg)}`}
        target="_blank" rel="noopener noreferrer"
        className="shrink-0 px-3 py-2.5 border border-[#25D366] text-[#25D366] text-xs font-bold rounded-xl hover:bg-green-50 transition-colors"
      >
        WhatsApp
      </a>
      <Link
        href={pkg.bookingHref}
        className="shrink-0 flex items-center gap-1.5 bg-primary text-cream px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-secondary transition-colors"
      >
        <Zap className="w-3.5 h-3.5" />
        Book Now
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Main Layout                                                        */
/* ─────────────────────────────────────────────────────────────────── */
export default function PackagePageLayout({ pkg }: { pkg: PackageData }) {
  const [openDay, setOpenDay] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const slots = spotsLeft(pkg.slug);

  return (
    <>
      {/* Schema */}
      <TourJsonLd
        name={pkg.heroTitle}
        description={pkg.metaDescription}
        url={pkg.canonicalUrl}
        image={pkg.ogImage}
        price={pkg.priceINR.toString()}
        currency="INR"
        duration={pkg.duration}
        startLocation={pkg.startLocation}
        destination={pkg.heroTitle.split(' from')[0].split(' Package')[0].trim()}
        highlights={pkg.schemaHighlights ?? pkg.highlights.slice(0, 6)}
        rating={pkg.avgRating}
        reviewCount={pkg.reviewCount}
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'Tour Packages', url: 'https://www.ylootrips.com/trips' },
        { name: pkg.heroTitle, url: pkg.canonicalUrl },
      ]} />
      <FaqJsonLd faqs={pkg.faqs} />

      {/* ── HERO ── */}
      <section className="relative h-[62vh] min-h-[420px] overflow-hidden">
        <Image src={pkg.heroImage} alt={pkg.heroTitle} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" />

        {/* Urgency badge */}
        {slots && (
          <div className="absolute top-6 right-6 bg-red-500 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full animate-pulse shadow-lg">
            Only {slots} slots left!
          </div>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="section-container pb-12 w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-white/60 text-xs uppercase tracking-wider mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/trips" className="hover:text-white transition-colors">Packages</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/90">{pkg.heroTitle}</span>
            </nav>
            <p className="text-accent text-xs uppercase tracking-[0.3em] mb-2">{pkg.tagline}</p>
            <h1 className="font-display text-display-xl text-white max-w-3xl">{pkg.heroTitle}</h1>
            <p className="text-white/75 text-body-lg mt-3 max-w-2xl">{pkg.heroSubtitle}</p>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-4 mt-5 text-white/90 text-sm">
              {[
                { icon: Clock, text: pkg.duration },
                { icon: MapPin, text: pkg.startLocation },
                { icon: Users, text: pkg.groupSize },
                { icon: Star, text: `${pkg.avgRating}★ (${pkg.reviewCount} reviews)` },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-accent" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden bg-white border-b border-primary/10 sticky top-0 z-30 shadow-sm px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] text-primary/50 uppercase tracking-wider">Starting from</p>
          <p className="font-display text-xl text-primary">{fmt(pkg.priceINR)}<span className="text-xs font-sans text-primary/40"> /person</span></p>
        </div>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/918427831127?text=${encodeURIComponent(pkg.whatsappMsg)}`}
            target="_blank" rel="noopener noreferrer"
            className="px-3 py-2 border border-primary/15 text-primary text-xs rounded-lg hover:bg-cream transition-colors font-semibold"
          >
            WhatsApp
          </a>
          <Link href={pkg.bookingHref} className="flex items-center gap-1.5 bg-primary text-cream px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-secondary transition-colors">
            <Zap className="w-3 h-3" /> Book
          </Link>
        </div>
      </div>

      {/* ── MAIN CONTENT + SIDEBAR ── */}
      <div className="section-container py-12 md:py-16 pb-32 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* ── Left: Content ── */}
          <div className="lg:col-span-2 space-y-14">

            {/* Gallery */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {pkg.gallery.map((img, i) => (
                  <div
                    key={i}
                    className={`relative overflow-hidden rounded-xl group ${i === 0 ? 'col-span-2 md:col-span-1 row-span-2 md:row-span-1' : ''}`}
                    style={{ minHeight: i === 0 ? '260px' : '140px' }}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-white text-[11px] font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">
                        {img.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Overview */}
            <section id="overview">
              <h2 className="font-display text-3xl text-primary mb-5">Package Overview</h2>
              <div className="space-y-4">
                {pkg.overview.map((para, i) => (
                  <p key={i} className="text-primary/70 leading-relaxed text-base">{para}</p>
                ))}
              </div>

              {/* Highlights */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-cream-light border border-primary/8 p-3 rounded-xl">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-primary/80">{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Itinerary */}
            <section id="itinerary">
              <h2 className="font-display text-3xl text-primary mb-2">Day-by-Day Itinerary</h2>
              <p className="text-primary/50 text-sm mb-6">Detailed plan — every day planned to perfection</p>
              <div className="space-y-3">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="border border-primary/10 bg-cream-light rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-cream-dark/50 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-full bg-primary text-cream text-sm font-bold flex items-center justify-center shrink-0">
                        {day.day}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-primary text-sm">Day {day.day}: {day.title}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-primary/45">
                          {day.meals && <span>🍽 {day.meals}</span>}
                          {day.hotel && day.hotel !== 'Departure' && <span>🏨 {day.hotel}</span>}
                        </div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-primary/40 shrink-0 transition-transform duration-300 ${openDay === day.day ? 'rotate-180' : ''}`} />
                    </button>
                    {openDay === day.day && (
                      <div className="px-5 pb-5 border-t border-primary/8">
                        <p className="text-primary/70 text-sm leading-relaxed mt-4">{day.description}</p>
                        {day.activities && day.activities.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {day.activities.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-primary/65">
                                <ChevronRight className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Includes / Excludes */}
            <section id="inclusions">
              <h2 className="font-display text-3xl text-primary mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Included
                  </h3>
                  <ul className="space-y-2.5">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-primary/75">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <X className="w-4 h-4" /> Not Included
                  </h3>
                  <ul className="space-y-2.5">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-primary/75">
                        <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section id="reviews">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-3xl text-primary">Traveler Reviews</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`w-5 h-5 ${i <= Math.round(pkg.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`} />
                      ))}
                    </div>
                    <span className="font-bold text-primary">{pkg.avgRating}</span>
                    <span className="text-primary/45 text-sm">({pkg.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pkg.reviews.map((r, i) => (
                  <div key={i} className="bg-cream-light border border-primary/8 rounded-2xl p-5 relative">
                    <Quote className="absolute top-4 right-4 w-6 h-6 text-accent/30" />
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-lg shrink-0">
                        {r.flag}
                      </div>
                      <div>
                        <div className="font-semibold text-primary text-sm">{r.name}</div>
                        <div className="text-xs text-primary/45">{r.country} · {r.date}</div>
                      </div>
                      <div className="ml-auto flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-primary/65 text-sm leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                    <p className="text-[10px] text-accent uppercase tracking-wider mt-2 font-medium">{r.trip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Mid-page CTA */}
            <section className="bg-primary rounded-2xl p-8 text-center text-cream">
              <p className="text-accent text-xs uppercase tracking-[0.3em] mb-3">Ready to Book?</p>
              <h3 className="font-display text-2xl md:text-3xl mb-3">{pkg.heroTitle}</h3>
              <p className="text-cream/60 text-sm mb-6 max-w-md mx-auto">
                Secure your spot today. Only {slots ?? 8} slots available this season.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href={pkg.bookingHref} className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-warm text-primary px-8 py-3.5 text-sm font-bold uppercase tracking-widest rounded-xl transition-all">
                  <Zap className="w-4 h-4" /> Book Now — {fmt(pkg.priceINR)}/person
                </Link>
                <a
                  href={`https://wa.me/918427831127?text=${encodeURIComponent(pkg.whatsappMsg)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-3.5 text-sm font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq">
              <h2 className="font-display text-3xl text-primary mb-2">Frequently Asked Questions</h2>
              <p className="text-primary/50 text-sm mb-6">Everything you need to know before booking</p>
              <div className="space-y-3">
                {pkg.faqs.map((faq, i) => (
                  <div key={i} className="border border-primary/10 bg-cream-light rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-cream-dark/40 transition-colors"
                    >
                      <span className="font-semibold text-primary text-sm pr-4">{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-primary/40 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === i && (
                      <div className="px-6 pb-5 border-t border-primary/8">
                        <p className="pt-4 text-primary/65 text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Related packages */}
            {pkg.related.length > 0 && (
              <section>
                <h2 className="font-display text-3xl text-primary mb-6">You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {pkg.related.map((r, i) => (
                    <Link key={i} href={r.href} className="group bg-cream-light border border-primary/8 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                      <div className="relative h-36">
                        <Image src={r.image} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-primary/20" />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-semibold text-primary group-hover:text-secondary transition-colors line-clamp-2">{r.title}</h3>
                        <p className="text-xs text-secondary mt-1 font-medium">From {fmt(r.priceINR)}/person</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Right: Sidebar ── */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              <BookingSidebar pkg={pkg} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <MobileBar pkg={pkg} />
    </>
  );
}
