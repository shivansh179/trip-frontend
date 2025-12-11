'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Filter, Search } from 'lucide-react';
import PageHero from '@/components/PageHero';
import TripCard from '@/components/TripCard';
import { api } from '@/lib/api';
import { Trip } from '@/types';

interface PageContent {
    hero: {
        eyebrow: string;
        title: string;
        subtitle: string;
        imageUrl: string;
    };
}

const categories = ['All', 'Cultural', 'Adventure', 'Culinary', 'Trekking', 'Beach', 'Wildlife'];

export default function TripsPage() {
    const [pageContent, setPageContent] = useState<PageContent | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await api.getPageContent('trips');
                setPageContent(response.data);
            } catch (err) {
                console.error('Error fetching page content:', err);
            }
        };
        fetchContent();
    }, []);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setLoading(true);
                let response;

                if (searchQuery) {
                    response = await api.searchTrips(searchQuery);
                } else if (activeCategory !== 'All') {
                    response = await api.getTrips({ category: activeCategory });
                } else {
                    response = await api.getTrips();
                }

                setTrips(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching trips:', err);
                setError('Unable to load trips. Please ensure the backend is running.');
                setTrips([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [activeCategory, searchQuery]);

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category);
        setSearchQuery('');
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setSearchQuery(formData.get('search') as string);
        setActiveCategory('All');
    };

    return (
        <>
            {/* Hero Section - CMS Driven */}
            <PageHero
                title={pageContent?.hero?.title || "Curated Experiences"}
                subtitle={pageContent?.hero?.subtitle || "Each journey is thoughtfully designed to immerse you in authentic moments, local cultures, and transformative adventures."}
                breadcrumb={pageContent?.hero?.eyebrow || "Experiences"}
                backgroundImage={pageContent?.hero?.imageUrl}
            />

            {/* Filters Section */}
            <section className="py-8 border-b border-primary/10 bg-cream sticky top-20 z-30">
                <div className="section-container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-3">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-5 py-2.5 text-caption uppercase tracking-widest transition-all ${activeCategory === category
                                            ? 'bg-primary text-cream'
                                            : 'bg-cream-dark text-primary hover:bg-primary/10'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search experiences..."
                                    className="pl-11 pr-5 py-3 bg-cream-dark text-primary placeholder:text-primary/40 focus:outline-none focus:ring-1 focus:ring-secondary w-64"
                                />
                            </div>
                            <button type="submit" className="flex items-center gap-2 px-5 py-3 bg-primary text-cream hover:bg-primary-light transition-colors">
                                <Filter className="w-4 h-4" />
                                <span className="text-caption uppercase tracking-widest">Search</span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Error Banner */}
            {error && (
                <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
                    <div className="section-container">
                        <p className="text-terracotta text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Trips Grid */}
            <section className="py-16 md:py-24 bg-cream">
                <div className="section-container">
                    {/* Results Count */}
                    <div className="flex items-center justify-between mb-10">
                        <p className="text-primary/60">
                            {loading ? 'Loading...' : (
                                <>Showing <span className="font-medium text-primary">{trips.length}</span> experiences</>
                            )}
                        </p>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-[500px] bg-cream-dark animate-pulse" />
                            ))}
                        </div>
                    ) : trips.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {trips.map((trip, index) => (
                                <TripCard key={trip.id} trip={trip} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-primary/60 mb-4">No experiences found.</p>
                            <p className="text-sm text-primary/40">
                                Try a different category or{' '}
                                <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="text-secondary hover:underline">
                                    clear filters
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Load More */}
                    {trips.length > 0 && (
                        <div className="text-center mt-16">
                            <button className="btn-outline">
                                <span>Load More Experiences</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

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
