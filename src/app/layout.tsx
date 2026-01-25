import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, Playfair_Display } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: "YlooTrips | Curated Travel Experiences in India",
    template: "%s | YlooTrips"
  },
  description: "Book curated travel packages to Manali, Rishikesh, Himachal & more. Custom trips, EMI options, 24/7 support. Plan your dream vacation with YlooTrips.",
  keywords: "travel packages India, Manali trip, Rishikesh adventure, Himachal tour, custom trips, EMI travel, group tours, weekend getaway, YlooTrips",
  openGraph: {
    title: "YlooTrips | Curated Travel Experiences in India",
    description: "Book curated travel packages with EMI options. Custom trips to Manali, Rishikesh, Himachal & more.",
    type: "website",
    siteName: "YlooTrips",
  },
  twitter: {
    card: "summary_large_image",
    title: "YlooTrips | Curated Travel Experiences",
    description: "Book curated travel packages with EMI options.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Suspense fallback={<div className="h-24 bg-cream" />}>
          <Header />
        </Suspense>
        <main className="min-h-screen pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <WhatsAppButton phoneNumber="918427831127" />
        <MobileStickyCTA />
      </body>
    </html>
  );
}
