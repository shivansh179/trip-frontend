import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Check, X, Phone, MessageCircle, Star, ChevronRight, AlertTriangle, Plane, Hospital, Luggage, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Travel Insurance for India & International Trips 2026 | YlooTrips',
  description: 'Get travel insurance from ₹399/trip. Covers trip cancellation, medical emergencies, flight delay, baggage loss, and adventure activities. Instant policy, 24/7 claim support.',
  keywords: 'travel insurance India, trip insurance, international travel insurance from India, travel medical insurance, trip cancellation insurance, travel insurance online India',
  openGraph: {
    title: 'Travel Insurance — From ₹399/Trip | YlooTrips',
    description: 'Trip cancellation, medical emergencies, flight delays, baggage loss. Instant policy online. Covers India and 150+ countries.',
    url: 'https://www.ylootrips.com/travel-insurance',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80', width: 1200, height: 630, alt: 'Travel insurance protection for trips' }],
  },
  alternates: { canonical: 'https://www.ylootrips.com/travel-insurance' },
};

const PLANS = [
  {
    name: 'Basic',
    price: '₹399',
    per: 'per trip',
    badge: null,
    color: 'bg-gray-50 border-gray-200',
    btnColor: 'bg-gray-900 text-white hover:bg-gray-700',
    features: [
      { label: 'Trip cancellation', val: '₹25,000', included: true },
      { label: 'Emergency medical', val: '₹5 Lakh', included: true },
      { label: 'Flight delay (4h+)', val: '₹2,000', included: true },
      { label: 'Baggage loss', val: '₹15,000', included: true },
      { label: 'Adventure activities', val: null, included: false },
      { label: 'Evacuation cover', val: null, included: false },
      { label: 'Pre-existing conditions', val: null, included: false },
    ],
  },
  {
    name: 'Essential',
    price: '₹699',
    per: 'per trip',
    badge: 'Most Popular',
    color: 'bg-white border-gray-900 shadow-xl',
    btnColor: 'bg-gray-900 text-white hover:bg-gray-700',
    features: [
      { label: 'Trip cancellation', val: '₹75,000', included: true },
      { label: 'Emergency medical', val: '₹20 Lakh', included: true },
      { label: 'Flight delay (2h+)', val: '₹5,000', included: true },
      { label: 'Baggage loss', val: '₹40,000', included: true },
      { label: 'Adventure activities', val: 'Trekking, rafting', included: true },
      { label: 'Evacuation cover', val: '₹10 Lakh', included: true },
      { label: 'Pre-existing conditions', val: null, included: false },
    ],
  },
  {
    name: 'Premium',
    price: '₹1,299',
    per: 'per trip',
    badge: 'Best Cover',
    color: 'bg-gray-50 border-gray-200',
    btnColor: 'bg-gray-900 text-white hover:bg-gray-700',
    features: [
      { label: 'Trip cancellation', val: '₹2 Lakh', included: true },
      { label: 'Emergency medical', val: '₹50 Lakh', included: true },
      { label: 'Flight delay (1h+)', val: '₹10,000', included: true },
      { label: 'Baggage loss', val: '₹1 Lakh', included: true },
      { label: 'Adventure activities', val: 'All activities', included: true },
      { label: 'Evacuation cover', val: '₹25 Lakh', included: true },
      { label: 'Pre-existing conditions', val: 'Covered', included: true },
    ],
  },
];

const COVERS = [
  { icon: Plane, title: 'Trip Cancellation', body: 'Get reimbursed if you must cancel due to illness, family emergency, or natural disaster.' },
  { icon: Hospital, title: 'Medical Emergency', body: 'Hospital bills, surgery, and emergency evacuation covered wherever you are in the world.' },
  { icon: Clock, title: 'Flight Delay & Miss', body: 'Compensation for meals, hotel, and transport if your flight is delayed or missed.' },
  { icon: Luggage, title: 'Baggage & Passport', body: 'Lost, stolen, or damaged luggage — and emergency assistance if your passport is stolen.' },
  { icon: AlertTriangle, title: 'Adventure Activities', body: 'Trekking, rafting, skiing, scuba, and 50+ adventure activities covered in Essential and Premium plans.' },
  { icon: Shield, title: 'Personal Liability', body: 'Covered if you accidentally injure someone or damage property during your trip.' },
];

export default function TravelInsurancePage() {
  const whatsapp = "https://wa.me/918427831127?text=Hi%20I%20want%20to%20buy%20travel%20insurance";

  return (
    <main className="min-h-screen bg-white pt-20">

      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-900 via-teal-800 to-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider mb-6">
            <Shield size={13} /> Travel Protection
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Travel Without Worry.<br className="hidden sm:block" />
            From ₹399/Trip.
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
            Medical emergencies, trip cancellations, flight delays, lost baggage. One policy covers it all — get instant cover in 2 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={whatsapp} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-sm">
              <MessageCircle size={16} /> Get Insurance Now
            </Link>
            <Link href="#plans"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors text-sm">
              View Plans <ChevronRight size={15} />
            </Link>
          </div>
          <p className="text-white/50 text-xs mt-5">Covers India and 150+ countries · Instant policy · IRDAI licensed partner</p>
        </div>
      </section>

      {/* What we cover */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 text-center mb-2">Coverage</p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-10">What&apos;s Covered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {COVERS.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                  <c.icon size={18} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{c.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 text-center mb-2">Pricing</p>
          <h2 className="font-serif text-3xl font-bold text-gray-900 text-center mb-10">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`rounded-2xl border p-6 ${plan.color} relative`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
                <div className="mb-5">
                  <span className="text-3xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-xs ml-1">{plan.per}</span>
                </div>
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((f) => (
                    <div key={f.label} className="flex items-center justify-between text-sm">
                      <span className={`flex items-center gap-2 ${f.included ? 'text-gray-700' : 'text-gray-300'}`}>
                        {f.included ? <Check size={13} className="text-green-500 shrink-0" /> : <X size={13} className="text-gray-300 shrink-0" />}
                        {f.label}
                      </span>
                      {f.val && f.included && <span className="text-xs text-gray-500 font-medium">{f.val}</span>}
                    </div>
                  ))}
                </div>
                <Link href={whatsapp} target="_blank" rel="noopener noreferrer"
                  className={`block w-full text-center py-3 rounded-xl text-sm font-bold transition-colors ${plan.btnColor}`}>
                  Get {plan.name} Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: '50,000+', label: 'Policies issued' },
            { val: '98%', label: 'Claims settled' },
            { val: '24h', label: 'Claim processing' },
            { val: '4.9★', label: 'Customer rating' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl font-black text-gray-900">{s.val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">Common Questions</h2>
          <div className="space-y-5">
            {[
              { q: 'When should I buy travel insurance?', a: 'Buy as soon as you book your trip — this protects you against pre-departure cancellations. You can buy up to 24 hours before departure, but earlier is better.' },
              { q: 'Does it cover COVID-related cancellations?', a: 'Yes. Our Essential and Premium plans cover trip cancellations and medical treatment related to COVID-19, including quarantine hotel costs.' },
              { q: 'Are adventure activities like trekking covered?', a: 'Basic plan excludes adventure activities. Essential covers trekking, white-water rafting, and most adventure sports. Premium covers everything including high-altitude mountaineering.' },
              { q: 'How do I make a claim?', a: 'WhatsApp or call us immediately when an incident happens. We guide you through documentation and submit the claim on your behalf. Most claims are settled within 24–48 hours.' },
              { q: 'Is this available for international travel?', a: 'Yes — covers 150+ countries. Our Essential and Premium plans are ideal for Bali, Dubai, Thailand, Europe, and other international destinations.' },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-5">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.q}</h3>
                <p className="text-sm text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto bg-gray-900 rounded-3xl p-10 text-center text-white">
          <Shield className="w-10 h-10 mx-auto mb-4 text-teal-400" />
          <h2 className="font-serif text-2xl font-bold mb-3">Get Covered in 2 Minutes</h2>
          <p className="text-white/70 text-sm mb-6">Starting from ₹399. Instant policy on WhatsApp. No paperwork.</p>
          <Link href={whatsapp} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-bold px-8 py-3.5 rounded-full hover:bg-gray-100 transition-colors text-sm">
            <MessageCircle size={15} /> WhatsApp for Instant Policy
          </Link>
        </div>
      </section>

    </main>
  );
}
