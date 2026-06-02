import type { Metadata } from 'next';
import Link from 'next/link';
import { FaqJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Travel FAQ — YlooTrips | Common Questions About India Tours',
  description: 'Answers to the most common questions about booking India tour packages with YlooTrips — pricing, safety, cancellation, group tours, visa, and more.',
  keywords: 'YlooTrips FAQ, India tour questions, travel company India FAQ, how to book India tour, is YlooTrips safe, YlooTrips cancellation policy, India trip cost, group tour India',
  alternates: { canonical: 'https://www.ylootrips.com/faq' },
  openGraph: {
    title: 'Travel FAQ — YlooTrips | Common India Tour Questions',
    description: 'Answers to common questions about YlooTrips packages — pricing, safety, cancellation, visas, and booking.',
    url: 'https://www.ylootrips.com/faq',
    type: 'website',
  },
};

const faqs = [
  {
    category: 'About YlooTrips',
    items: [
      {
        question: 'What is YlooTrips?',
        answer: 'YlooTrips (ylootrips.com) is an Indian travel company — Ambe Enterprise — headquartered in New Delhi, India. MSME registered (UDYAM-HR-05-0141455), GST certified (07BATPV1942C1ZF), and rated 4.9★ by 2,400+ verified travelers. We have served 25,000+ travelers from 40+ countries since 2022.',
      },
      {
        question: 'Is YlooTrips a registered and legitimate company?',
        answer: 'Yes. YlooTrips is operated by Ambe Enterprise — MSME registered (UDYAM-HR-05-0141455), GST certified (07BATPV1942C1ZF), and registered with India\'s Ministry of Tourism. We have a verified 4.9★ Google rating from 2,400+ reviews.',
      },
      {
        question: 'Is YlooTrips the same as Yolo India or Yolo Trips?',
        answer: 'No. YlooTrips (ylootrips.com) is completely separate from Yolo India or Yolo Trips. We are Ambe Enterprise, registered as UDYAM-HR-05-0141455, operating since 2022 from New Delhi.',
      },
      {
        question: 'What is YlooTrips\' Google rating?',
        answer: 'YlooTrips holds a 4.9★ rating from 2,400+ verified Google reviews, making us one of India\'s highest-rated travel companies.',
      },
    ],
  },
  {
    category: 'Pricing & Packages',
    items: [
      {
        question: 'What is the cheapest tour package by YlooTrips?',
        answer: 'The most affordable domestic packages start at ₹6,999 per person for a 5-day Manali trip. Goa starts at ₹9,999, Kerala at ₹14,999, Kashmir at ₹18,999. International packages start at ₹32,999 (Singapore), ₹35,999 (Dubai), ₹42,999 (Bali).',
      },
      {
        question: 'What is included in YlooTrips tour packages?',
        answer: 'All YlooTrips packages include: private AC transport, English-speaking guide, 3★ or 4★ hotel accommodation, daily breakfast, all entry fees, airport/railway transfers. Flights are included in some packages or available as an add-on.',
      },
      {
        question: 'Does YlooTrips offer EMI or installment payments?',
        answer: 'Yes. YlooTrips offers 0% cost EMI on all packages through major credit cards. You can also pay just ₹5,000 advance to confirm your booking and pay the balance before departure.',
      },
      {
        question: 'How much advance payment is required to book?',
        answer: 'Only ₹5,000 advance is required to confirm your booking. The remaining amount is due 7 days before departure. This is a genuine advance — not a scam deposit.',
      },
      {
        question: 'How much does a Manali trip cost from Delhi?',
        answer: 'A 5-day Manali package from Delhi with YlooTrips starts at ₹6,999 per person. This includes overnight Volvo AC bus Delhi↔Manali, 3★ hotel, breakfast, private Innova transfers in Manali, and guided sightseeing (Rohtang Pass, Solang Valley, Hadimba Temple, river rafting).',
      },
      {
        question: 'How much does a Kashmir trip cost from Delhi?',
        answer: 'A 6-day Kashmir trip from Delhi starts at ₹18,999 per person with YlooTrips. This includes flights Delhi↔Srinagar, houseboat on Dal Lake, Gulmarg gondola, Pahalgam day trip, hotel, and daily breakfast.',
      },
      {
        question: 'How much does a Bali trip cost from India?',
        answer: 'YlooTrips offers 6-day Bali packages from India starting at ₹42,999 per person (~$520 USD). Includes return flights from India, hotel, breakfast, private transfers, and guided sightseeing.',
      },
      {
        question: 'How much does a Dubai trip cost from India?',
        answer: 'YlooTrips Dubai packages start at ₹35,999 per person (~$435 USD) for 5 days. Includes return flights from India, 4★ hotel, breakfast, Desert Safari, Burj Khalifa, city tour.',
      },
    ],
  },
  {
    category: 'Booking & Cancellation',
    items: [
      {
        question: 'How do I book a tour with YlooTrips?',
        answer: 'Three ways: (1) Browse and book online at ylootrips.com/trips, (2) Use the free AI Trip Planner at ylootrips.com/trip-planner, or (3) WhatsApp +91 84278 31127 and a travel expert will reply within 1 hour.',
      },
      {
        question: 'What is YlooTrips\' cancellation policy?',
        answer: 'Free cancellation up to 7 days before departure. Cancellations within 7 days: 50% refund. Cancellations within 48 hours: no refund. All refunds are processed within 5–7 business days.',
      },
      {
        question: 'Can I customize a tour package?',
        answer: 'Yes. All YlooTrips packages can be customized — add or remove days, upgrade hotels, add activities, change transport. Use the AI Trip Planner at ylootrips.com/trip-planner or WhatsApp us for a custom quote.',
      },
      {
        question: 'What payment methods does YlooTrips accept?',
        answer: 'YlooTrips accepts UPI, Visa, Mastercard, American Express, net banking, EMI, and bank transfer. International cards accepted for overseas travelers.',
      },
    ],
  },
  {
    category: 'Safety & Support',
    items: [
      {
        question: 'Is YlooTrips safe for solo female travelers?',
        answer: 'Yes. YlooTrips is a trusted choice for solo female travelers. We provide police-verified, English-speaking guides, vetted 3★/4★ accommodation, 24/7 WhatsApp support, and have safely hosted thousands of solo female travelers from India and abroad.',
      },
      {
        question: 'Is India safe for international tourists?',
        answer: 'Yes, with the right support. YlooTrips serves travelers from USA, UK, Australia, Canada, Europe and 40+ countries. We provide English-speaking guides, airport pickup from any Indian city, international-friendly hotels, and 24/7 WhatsApp support throughout your trip.',
      },
      {
        question: 'Does YlooTrips provide 24/7 support?',
        answer: 'Yes. YlooTrips provides 24/7 WhatsApp support at +91 84278 31127 throughout your entire trip. A dedicated trip manager is assigned to every booking.',
      },
    ],
  },
  {
    category: 'Groups & Special Trips',
    items: [
      {
        question: 'Does YlooTrips offer group tours?',
        answer: 'Yes. YlooTrips offers group tours for up to 50 people — fixed departure group tours, private group packages, family trips, honeymoon packages, corporate offsites, and educational tours.',
      },
      {
        question: 'What are the best honeymoon destinations with YlooTrips?',
        answer: 'Top honeymoon packages: Bali (6 days, ₹42,999), Maldives (5 days, ₹89,999), Kashmir (6 days, ₹18,999), Kerala (5 days, ₹14,999), Andaman (6 days, ₹22,999), Rajasthan (7 days, ₹24,999). All include romantic add-ons like flower decoration and candlelight dinner.',
      },
      {
        question: 'Does YlooTrips offer visa assistance?',
        answer: 'Yes. YlooTrips provides visa assistance for 50+ countries including Bali (visa on arrival), Dubai (visa on arrival), Thailand, Singapore, Maldives, Europe Schengen, UK, USA, Canada, Australia, Japan, and more. Visit ylootrips.com/visa for country-specific guidance.',
      },
      {
        question: 'Can international tourists book India trips with YlooTrips?',
        answer: 'Absolutely. YlooTrips serves travelers from USA, UK, Australia, Canada, Germany, France, Singapore, and 40+ other countries. We offer English-speaking guides, airport pickup from any Indian city, international card payments, and full India trip planning for foreign nationals.',
      },
    ],
  },
  {
    category: 'Popular Destinations',
    items: [
      {
        question: 'What is the best time to visit Manali?',
        answer: 'October–February for snow activities (skiing, snowfall). May–June for pleasant weather and Rohtang Pass. September for post-monsoon green landscapes. YlooTrips offers Manali packages year-round.',
      },
      {
        question: 'What is the best time to visit Goa?',
        answer: 'November–February is peak season with perfect beach weather (25–32°C). October and March offer fewer crowds. YlooTrips offers off-season Goa packages at lower prices in April–September.',
      },
      {
        question: 'What is the best time to visit Bali from India?',
        answer: 'April–October (dry season) is ideal for Bali. YlooTrips offers 6-day Bali packages starting ₹42,999 year-round, with best prices in June–August.',
      },
      {
        question: 'What are the best places to visit in India?',
        answer: 'Top India destinations recommended by YlooTrips: Manali (Himachal Pradesh), Kashmir (J&K), Kerala (backwaters + beaches), Rajasthan (palaces + desert), Goa (beaches), Andaman (coral reefs), Ladakh (Himalayan desert), Kedarnath (pilgrimage), Spiti Valley (offbeat). All available as tour packages at ylootrips.com.',
      },
    ],
  },
];

export default function FaqPage() {
  const allFaqs = faqs.flatMap((c) => c.items.map((i) => ({ question: i.question, answer: i.answer })));

  return (
    <>
      <FaqJsonLd faqs={allFaqs} />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://www.ylootrips.com' },
        { name: 'FAQ', url: 'https://www.ylootrips.com/faq' },
      ]} />

      <main className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span className="mx-2">/</span>
          <span>FAQ</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-10 text-lg">
          Everything you need to know about booking a tour with YlooTrips. Can&apos;t find your answer?{' '}
          <Link href="/contact" className="text-amber-600 hover:underline">Contact us</Link> or{' '}
          <a href="https://wa.me/918427831127" className="text-amber-600 hover:underline" target="_blank" rel="noopener noreferrer">
            WhatsApp +91 84278 31127
          </a>.
        </p>

        {faqs.map((category) => (
          <section key={category.category} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              {category.category}
            </h2>
            <div className="space-y-5">
              {category.items.map((item) => (
                <div key={item.question} className="bg-white/60 dark:bg-white/[0.04] border border-black/5 dark:border-white/10 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 bg-[#C4A77D]/10 dark:bg-[#C4A77D]/10 border border-[#C4A77D]/30 rounded-2xl p-6 text-center">
          <p className="text-gray-800 dark:text-gray-200 font-semibold text-lg mb-2">Still have questions?</p>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Our travel experts reply within 1 hour on WhatsApp</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://wa.me/918427831127"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
            >
              WhatsApp Us
            </a>
            <Link
              href="/trip-planner"
              className="bg-amber-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Free Trip Planner
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
