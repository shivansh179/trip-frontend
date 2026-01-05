import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { api } from '@/lib/api';
import TripsContent from './TripsContent';

interface PageContent {
    hero: {
        eyebrow: string;
        title: string;
        subtitle: string;
        imageUrl: string;
    };
}

async function getPageContent(): Promise<PageContent | null> {
    try {
        const response = await api.getPageContent('trips');
        return response.data;
    } catch (err) {
        console.error('Error fetching page content:', err);
        return null;
    }
}

export default async function TripsPage() {
    const pageContent = await getPageContent();

    return (
        <>
            {/* Hero Section - CMS Driven (Server-Side) */}
            <PageHero
                title={pageContent?.hero?.title || "Curated Experiences"}
                subtitle={pageContent?.hero?.subtitle || "Each journey is thoughtfully designed to immerse you in authentic moments, local cultures, and transformative adventures."}
                breadcrumb={pageContent?.hero?.eyebrow || "Experiences"}
                backgroundImage={pageContent?.hero?.imageUrl}
            />

            {/* Client-Side Interactive Content */}
            <TripsContent />

            {/* CTA Section */}
            <section className="py-20 bg-primary text-cream">
                <div className="section-container text-center">
                    <h2 className="font-display text-display-lg mb-6">
                        Can&apos;t find what you&apos;re looking for?
                    </h2>
                    <p className="text-cream/60 text-body-lg max-w-2xl mx-auto mb-10">
                        Let our travel experts design a bespoke journey tailored to your preferences, interests, and travel style.
                    </p>
                    <Link href="/contact" className="btn-primary bg-accent text-primary hover:bg-accent-warm">
                        <span>Plan Custom Journey</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </>
    );
}
