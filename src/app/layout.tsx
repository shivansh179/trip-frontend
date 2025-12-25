import type { Metadata } from "next";
import { Inter, Playfair_Display } from 'next/font/google';
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  title: "YlooTrips | Curated Travel Experiences",
  description: "Discover extraordinary destinations and transformative journeys. We craft bespoke travel experiences for the modern explorer seeking authentic connections and unforgettable moments.",
  keywords: "luxury travel, curated experiences, boutique hotels, adventure travel, sustainable tourism",
  openGraph: {
    title: "YlooTrips | Curated Travel Experiences",
    description: "Discover extraordinary destinations and transformative journeys.",
    type: "website",
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
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
