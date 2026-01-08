'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowUpRight, Filter, Search, Loader2 } from 'lucide-react';
import TripCard from '@/components/TripCard';
import { api } from '@/lib/api';
import { Trip } from '@/types';

// Default categories (will be replaced by dynamic ones from API)
const defaultCategories = ['All', 'Trekking', 'Tour', 'Adventure', 'Camping', 'International', 'Beach', 'Honeymoon'];

export default function TripsContent() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);

    // Dynamic categories from API
    const [categories, setCategories] = useState<string[]>(defaultCategories);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

    const PAGE_SIZE = 12;

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.getCategories();
                if (response.data.categories && response.data.categories.length > 0) {
                    setCategories(['All', ...response.data.categories]);
                    setCategoryCounts(response.data.counts || {});
                }
            } catch (err) {
                console.error('Error fetching categories:', err);
                // Keep default categories on error
            }
        };
        fetchCategories();
    }, []);

    // Fetch trips with pagination
    const fetchTrips = useCallback(async (pageNum: number, append: boolean = false) => {
        try {
            if (!append) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            let response;

            if (searchQuery) {
                // Search doesn't support pagination yet, get all results
                response = await api.searchTrips(searchQuery);
                setTrips(response.data);
                setHasMore(false);
                setTotalElements(response.data.length);
            } else {
                // Use paginated endpoint
                const params: Record<string, unknown> = {
                    page: pageNum,
                    size: PAGE_SIZE,
                };

                if (activeCategory !== 'All') {
                    params.category = activeCategory;
                }

                response = await api.getTripsPaginated(params);
                const pageData = response.data;

                if (append) {
                    setTrips(prev => [...prev, ...pageData.content]);
                } else {
                    setTrips(pageData.content);
                }

                setHasMore(!pageData.last);
                setTotalElements(pageData.totalElements);
            }

            setError(null);
        } catch (err) {
            console.error('Error fetching trips:', err);
            setError('Unable to load trips. Please ensure the backend is running.');
            if (!append) {
                setTrips([]);
            }
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeCategory, searchQuery]);

    // Initial fetch and when category/search changes
    useEffect(() => {
        setPage(0);
        fetchTrips(0, false);
    }, [activeCategory, searchQuery, fetchTrips]);

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

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchTrips(nextPage, true);
    };

    return (
        <>
            {/* Filters Section */}
            <section className="py-8 border-b border-primary/10 bg-cream sticky top-20 z-30">
                <div className="section-container">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Categories - Scrollable on mobile */}
                        <div className="flex flex-wrap gap-2 md:gap-3 max-w-full overflow-x-auto pb-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-caption uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeCategory === category
                                        ? 'bg-primary text-cream'
                                        : 'bg-cream-dark text-primary hover:bg-primary/10'
                                        }`}
                                >
                                    <span>{category}</span>
                                    {category !== 'All' && categoryCounts[category] !== undefined && (
                                        <span className="text-xs opacity-60">
                                            ({categoryCounts[category]})
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex items-center gap-4 shrink-0">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                                <input
                                    type="text"
                                    name="search"
                                    placeholder="Search experiences..."
                                    className="pl-11 pr-5 py-3 bg-cream-dark text-primary placeholder:text-primary/40 focus:outline-none focus:ring-1 focus:ring-secondary w-48 md:w-64"
                                />
                            </div>
                            <button type="submit" className="flex items-center gap-2 px-5 py-3 bg-primary text-cream hover:bg-primary-light transition-colors">
                                <Filter className="w-4 h-4" />
                                <span className="text-caption uppercase tracking-widest hidden md:inline">Search</span>
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
                                <>
                                    Showing <span className="font-medium text-primary">{trips.length}</span>
                                    {totalElements > trips.length && (
                                        <> of <span className="font-medium text-primary">{totalElements}</span></>
                                    )}
                                    {' '}experiences
                                </>
                            )}
                        </p>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="h-[500px] bg-cream-dark animate-pulse rounded-lg" />
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
                    {trips.length > 0 && hasMore && (
                        <div className="text-center mt-16">
                            <button
                                onClick={handleLoadMore}
                                disabled={loadingMore}
                                className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingMore ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Load More Experiences</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* All loaded indicator */}
                    {trips.length > 0 && !hasMore && trips.length === totalElements && (
                        <div className="text-center mt-16">
                            <p className="text-primary/40 text-sm">All experiences loaded</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
