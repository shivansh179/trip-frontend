import { NextResponse } from 'next/server';

// Public-facing list — intentionally shown to users in the promo picker UI
const PUBLIC_PROMOS = [
  { code: 'WELCOME10',   title: '10% Off First Booking',    desc: 'Welcome offer for new travelers',               type: 'percent', value: 10,   minOrder: 2000,  validTill: '31 Dec 2026' },
  { code: 'TRIPFIVE',    title: '₹500 Off',                 desc: 'Flat ₹500 off on bookings above ₹5,000',        type: 'flat',    value: 500,  minOrder: 5000,  validTill: '30 Jun 2026' },
  { code: 'HOLIDAY15',   title: '15% Off Holiday Packages', desc: 'Special discount on packages above ₹25,000',    type: 'percent', value: 15,   minOrder: 25000, validTill: '15 Aug 2026' },
  { code: 'INDIATRAVEL', title: '₹1,000 Off India Tours',   desc: 'Flat ₹1,000 off on curated India tours',        type: 'flat',    value: 1000, minOrder: 15000, validTill: '31 Mar 2027' },
];

export async function GET() {
  return NextResponse.json(
    { promos: PUBLIC_PROMOS },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  );
}
