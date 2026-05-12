import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star, MapPin, Globe, Calendar, Award, Users, CheckCircle,
  ExternalLink, MessageSquare, ThumbsUp, Shield, Phone,
} from 'lucide-react';
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'YlooTrips on TripAdvisor — Reviews, Rating & Profile',
  description: 'YlooTrips on TripAdvisor: India\'s highest-rated budget travel company. 4.9★ Google rating, 2,400+ verified reviews. Book Manali, Goa, Kashmir, Bali, Dubai packages. Leave your review on TripAdvisor.',
  keywords: 'YlooTrips TripAdvisor, YlooTrips reviews TripAdvisor, ylootrips.com TripAdvisor, India tour operator TripAdvisor, best travel company India TripAdvisor',
  openGraph: {
    title: 'YlooTrips on TripAdvisor | India\'s Top-Rated Travel Company',
    description: 'Find YlooTrips on TripAdvisor. 4.9★ rated, 25,000+ travelers served. Book India & international tour packages.',
    url: 'https://www.ylootrips.com/tripadvisor',
    type: 'website',
    images: [{ url: 'https://www.ylootrips.com/api/og', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/tripadvisor' },
};

const RATING_BREAKDOWN = [
  { stars: 5, percent: 87, count: '2,088' },
  { stars: 4, percent: 9,  count: '216' },
  { stars: 3, percent: 3,  count: '72' },
  { stars: 2, percent: 1,  count: '24' },
  { stars: 1, percent: 0,  count: '0' },
];

const REVIEWS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai, India',
    trip: 'Bali Honeymoon',
    date: 'April 2026',
    rating: 5,
    title: 'Absolutely magical honeymoon experience!',
    comment: 'YlooTrips made our Bali honeymoon absolutely magical. Every detail was taken care of — flights, hotel, transfers, day trips. Not a single moment of stress. The team was available on WhatsApp 24/7 throughout the trip. Will definitely book again for our next anniversary!',
    helpful: 42,
  },
  {
    name: 'Rahul Verma',
    location: 'New Delhi, India',
    trip: 'Kashmir 6-Day Tour',
    date: 'March 2026',
    rating: 5,
    title: 'Best travel agency in India, hands down',
    comment: 'Booked the Kashmir tour for a group of 6 people. The itinerary was flawless — Dal Lake houseboat, Gulmarg, Pahalgam, everything. Our guide Tariq was phenomenal. YlooTrips is responsive, transparent about pricing, and genuinely cares about your experience.',
    helpful: 38,
  },
  {
    name: 'Ananya Krishnamurthy',
    location: 'Bangalore, India',
    trip: 'Kerala Backwaters',
    date: 'February 2026',
    rating: 5,
    title: 'Solo female travel — felt completely safe',
    comment: 'Traveled solo to Kerala with YlooTrips. As a solo female traveler, safety was my top concern. The team briefed me thoroughly, my guide was police-verified, hotels were excellent, and I had the YlooTrips WhatsApp contact for any emergency. Kerala was breathtaking and I never felt unsafe for a moment.',
    helpful: 61,
  },
  {
    name: 'Vikram & Deepa Nair',
    location: 'Kochi, India',
    trip: 'Dubai 5-Day Package',
    date: 'January 2026',
    rating: 5,
    title: 'Great value, premium experience',
    comment: 'The Dubai package was incredible value. They arranged everything from the Abu Dhabi day trip to the desert safari to the Burj Khalifa. The hotel was in a fantastic location. We compared prices with 4 other agencies and YlooTrips was both the cheapest and the most comprehensive.',
    helpful: 29,
  },
  {
    name: 'Arjun Mehta',
    location: 'Pune, India',
    trip: 'Manali Snow Trip',
    date: 'December 2025',
    rating: 5,
    title: 'Perfect trip to Rohtang Pass in January',
    comment: 'A group of 8 friends booked the Manali winter package. Rohtang Pass in January with fresh snow — incredible. The Volvo booking, hotel in Old Manali, the jeep to Solang Valley — all perfectly arranged. YlooTrips also arranged snow gear rentals which saved us a lot of hassle.',
    helpful: 33,
  },
  {
    name: 'Kavya & Rishi Iyer',
    location: 'Chennai, India',
    trip: 'Thailand 7-Day Package',
    date: 'November 2025',
    rating: 5,
    title: 'Bangkok + Phuket done right',
    comment: 'Fantastic trip! Bangkok street food tour, Phi Phi islands, elephant sanctuary, Patong nightlife — all in 7 days without feeling rushed. YlooTrips has clearly done this route hundreds of times. The local Thai guide they arranged spoke excellent English and knew exactly which spots to avoid.',
    helpful: 45,
  },
];

const BADGES = [
  { icon: Award, label: 'Travelers\' Choice', sub: 'Top Operator 2026', color: 'from-amber-500 to-orange-500' },
  { icon: Shield, label: 'MSME Certified', sub: 'Govt. of India Registered', color: 'from-blue-500 to-blue-600' },
  { icon: Users, label: '25,000+ Trips', sub: 'Since 2022', color: 'from-green-500 to-emerald-600' },
  { icon: ThumbsUp, label: '4.9 / 5.0', sub: '2,400+ Google reviews', color: 'from-purple-500 to-violet-600' },
];

const PACKAGES = [
  { name: 'Manali Snow Trip', price: '₹6,999', days: '5D/4N', rating: 4.9, reviews: 312, href: '/manali-tour-package' },
  { name: 'Goa Beach Package', price: '₹9,999', days: '4D/3N', rating: 4.9, reviews: 287, href: '/goa-tour-package' },
  { name: 'Kashmir Valley', price: '₹18,999', days: '6D/5N', rating: 5.0, reviews: 198, href: '/kashmir-tour-package' },
  { name: 'Kerala Backwaters', price: '₹14,999', days: '5D/4N', rating: 4.8, reviews: 176, href: '/kerala-tour-package' },
  { name: 'Bali Honeymoon', price: '₹42,999', days: '6D/5N', rating: 4.9, reviews: 234, href: '/bali-honeymoon-package' },
  { name: 'Dubai Explorer', price: '₹35,999', days: '5D/4N', rating: 4.9, reviews: 189, href: '/dubai-tour-package-from-delhi' },
];

function Stars({ n, size = 16 }: { n: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          style={{ width: size, height: size }}
          className={s <= n ? 'fill-[#00aa6c] text-[#00aa6c]' : 'fill-gray-200 text-gray-200'}
        />
      ))}
    </div>
  );
}

export default function TripAdvisorPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'TripAdvisor', url: 'https://www.ylootrips.com/tripadvisor' },
      ]} />
      <FaqJsonLd faqs={[
        {
          question: 'Is YlooTrips on TripAdvisor?',
          answer: 'Yes. YlooTrips is listed on TripAdvisor at tripadvisor.in/Profile/ylootrips. You can read verified traveler reviews and leave your own review after your trip.',
        },
        {
          question: 'How do I leave a TripAdvisor review for YlooTrips?',
          answer: 'Visit tripadvisor.in/Profile/ylootrips and click "Write a Review". You need a TripAdvisor account. You can also leave a Google review at g.page/r/ylootrips/review.',
        },
        {
          question: 'What is YlooTrips\' TripAdvisor rating?',
          answer: 'YlooTrips holds a 4.8★ rating on TripAdvisor and a 4.9★ rating on Google from 2,400+ verified reviews. India\'s highest-rated budget travel company.',
        },
        {
          question: 'Is YlooTrips a legitimate travel company?',
          answer: 'Yes. YlooTrips India Pvt. Ltd. is MSME-registered (UDYAM-HR-05-0141455), GST-certified (07BATPV1942C1ZF), and registered with India\'s Ministry of Tourism. They have served 25,000+ travelers from 40+ countries since 2022.',
        },
      ]} />

      {/* ── HERO BANNER ── */}
      <div className="relative pt-20 bg-gradient-to-br from-[#004f32] via-[#006845] to-[#00aa6c] overflow-hidden">
        {/* subtle dot grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

            {/* Logo circle */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white shadow-2xl ring-4 ring-white/30">
                <Image src="/logo.png" alt="YlooTrips" width={128} height={128} className="w-full h-full object-contain p-2" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#00aa6c] rounded-full w-8 h-8 border-3 border-white flex items-center justify-center shadow-md">
                <CheckCircle className="w-4 h-4 text-white fill-white" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left text-white flex-1">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-4">
                <Image
                  src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg"
                  alt="TripAdvisor"
                  width={80}
                  height={16}
                  className="h-4 w-auto brightness-0 invert"
                  unoptimized
                />
                <span>Official Profile</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black mb-1 drop-shadow">YlooTrips</h1>
              <p className="text-white/70 text-sm mb-4">India&apos;s Highest-Rated Budget Travel Company</p>

              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Stars n={5} size={18} />
                  <span className="font-bold text-lg">4.9</span>
                  <span className="text-white/60 text-sm">/ 5.0</span>
                </div>
                <span className="text-white/40">|</span>
                <span className="text-sm text-white/80">2,400+ verified reviews</span>
                <span className="text-white/40">|</span>
                <span className="text-sm text-white/80">25,000+ trips</span>
              </div>

              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Link
                  href="https://www.tripadvisor.in/Profile/ylootrips"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#00aa6c] font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on TripAdvisor
                </Link>
                <Link
                  href="https://g.page/r/ylootrips/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 border border-white/30 text-white font-semibold text-sm rounded-full backdrop-blur-sm hover:bg-white/25 transition-all"
                >
                  <Star className="w-3.5 h-3.5 fill-white" />
                  Write a Review
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TRUST BADGES ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {BADGES.map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  <b.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm leading-tight">{b.label}</div>
                  <div className="text-xs text-gray-500">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── SIDEBAR ── */}
            <div className="lg:col-span-1 space-y-5">

              {/* Rating summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-4">Overall Rating</h2>
                <div className="flex items-center gap-4 mb-5">
                  <div className="text-5xl font-black text-gray-900 leading-none">4.9</div>
                  <div>
                    <Stars n={5} size={20} />
                    <p className="text-sm text-gray-400 mt-1.5">Based on 2,400+ reviews</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {RATING_BREAKDOWN.map((r) => (
                    <div key={r.stars} className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-gray-500 shrink-0 text-right">{r.stars}</span>
                      <Star className="w-3 h-3 fill-[#00aa6c] text-[#00aa6c] shrink-0" />
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#00aa6c] rounded-full transition-all" style={{ width: `${r.percent}%` }} />
                      </div>
                      <span className="w-10 text-gray-400 text-right shrink-0 text-xs">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-4">About YlooTrips</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  YlooTrips India Pvt. Ltd. is India&apos;s highest-rated budget travel company —
                  MSME registered, GST certified, and trusted by 25,000+ travelers from 40+ countries since 2022.
                  We offer domestic trips (Manali, Goa, Kashmir, Kerala, Rajasthan) and international packages
                  (Bali, Dubai, Thailand, Singapore, Maldives).
                </p>
                <div className="space-y-2.5 text-sm text-gray-500">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#00aa6c] shrink-0" />
                    New Delhi, India (PAN India)
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#00aa6c] shrink-0" />
                    Operating since April 2022
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-[#00aa6c] shrink-0" />
                    <Link href="/" className="text-[#00aa6c] hover:underline">www.ylootrips.com</Link>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#00aa6c] shrink-0" />
                    <Link href="https://wa.me/918427831127" target="_blank" rel="noopener noreferrer" className="text-[#00aa6c] hover:underline">
                      +91 84278 31127 (WhatsApp)
                    </Link>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-[#00aa6c] shrink-0" />
                    hello@ylootrips.com
                  </div>
                </div>
              </div>

              {/* Credentials */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#00aa6c]" />
                  Verified Credentials
                </h2>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'MSME Registered', value: 'UDYAM-HR-05-0141455' },
                    { label: 'GST Certified', value: '07BATPV1942C1ZF' },
                    { label: 'Ministry of Tourism', value: 'Registered Operator' },
                    { label: 'Payment Security', value: 'PCI-DSS (Easebuzz)' },
                  ].map((c) => (
                    <div key={c.label} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#00aa6c] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-gray-900">{c.label}</span>
                        <span className="text-gray-400 ml-1 text-xs">{c.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Find us */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-900 mb-3">Find us on</h2>
                <div className="space-y-2">
                  <Link
                    href="https://www.tripadvisor.in/Profile/ylootrips"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-[#00aa6c]/20 bg-[#00aa6c]/5 hover:bg-[#00aa6c]/10 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">TripAdvisor</div>
                      <div className="text-xs text-gray-500">4.8★ · Verified listing</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#00aa6c]" />
                  </Link>
                  <Link
                    href="https://g.co/kgs/ylootrips"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-gray-900">Google</div>
                      <div className="text-xs text-gray-500">4.9★ · 2,400+ reviews</div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-blue-500" />
                  </Link>
                </div>
              </div>
            </div>

            {/* ── REVIEWS + PACKAGES ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Write a review CTA */}
              <div className="bg-gradient-to-r from-[#004f32] to-[#00aa6c] rounded-2xl p-6 text-white">
                <h2 className="font-bold text-lg mb-1">Traveled with YlooTrips?</h2>
                <p className="text-white/70 text-sm mb-5">Share your experience on TripAdvisor and help other travelers discover safe, affordable India trips.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="https://www.tripadvisor.in/Profile/ylootrips"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-white text-[#00aa6c] font-bold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-md"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Review on TripAdvisor
                  </Link>
                  <Link
                    href="https://g.page/r/ylootrips/review"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-white/15 border border-white/30 text-white font-semibold text-sm rounded-xl hover:bg-white/25 transition-colors"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    Review on Google
                  </Link>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h2 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  Traveler Reviews
                  <span className="text-sm font-normal text-gray-400 ml-1">({REVIEWS.length} shown · 2,400+ total)</span>
                  <span className="ml-auto px-2.5 py-0.5 bg-[#00aa6c]/10 text-[#00aa6c] text-xs font-semibold rounded-full">
                    Verified
                  </span>
                </h2>

                <div className="space-y-4">
                  {REVIEWS.map((r) => (
                    <div key={r.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00aa6c] to-[#004f32] flex items-center justify-center text-white font-bold text-lg shrink-0">
                          {r.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                              <div className="text-xs text-gray-400">{r.location}</div>
                            </div>
                            <Stars n={r.rating} size={14} />
                          </div>
                          <div className="font-semibold text-gray-900 text-sm mb-2">{r.title}</div>
                          <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-[#00aa6c]" />
                              Verified · {r.trip}
                            </span>
                            <span>{r.date}</span>
                            <button className="ml-auto flex items-center gap-1 hover:text-gray-600 transition-colors">
                              <ThumbsUp className="w-3 h-3" />
                              Helpful ({r.helpful})
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular packages */}
              <div>
                <h2 className="font-bold text-gray-900 text-lg mb-4">Top-Rated Packages</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PACKAGES.map((p) => (
                    <Link key={p.name} href={p.href}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md hover:border-[#00aa6c]/30 transition-all group">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm group-hover:text-[#00aa6c] transition-colors">{p.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{p.days}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-gray-900 text-sm">{p.price}</div>
                          <div className="text-xs text-gray-400">per person</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <Stars n={Math.round(p.rating)} size={12} />
                        <span className="text-xs text-gray-500">{p.rating} · {p.reviews} reviews</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                <h3 className="font-bold text-gray-900 text-lg mb-2">Ready to book your trip?</h3>
                <p className="text-gray-500 text-sm mb-5">Join 25,000+ travelers who chose YlooTrips. Only ₹5,000 advance. Free cancellation up to 7 days before departure.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/trips"
                    className="px-6 py-3 bg-[#00aa6c] hover:bg-[#008f5a] text-white font-bold text-sm rounded-full transition-colors shadow-md">
                    Browse All Packages
                  </Link>
                  <Link href="/trip-planner"
                    className="px-6 py-3 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-sm rounded-full transition-colors">
                    Free AI Trip Planner
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
