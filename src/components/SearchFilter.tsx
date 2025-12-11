'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface SearchFilterProps {
    onSearch?: (query: string) => void;
    onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
    category?: string;
    destination?: string;
    priceRange?: { min: number; max: number };
    duration?: string;
    difficulty?: string;
}

export default function SearchFilter({ onSearch, onFilterChange }: SearchFilterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({});

    const categories = ['All', 'Adventure', 'Trekking', 'Camping', 'Cultural', 'Wildlife', 'Beach', 'Mountain'];
    const difficulties = ['All', 'Easy', 'Moderate', 'Challenging', 'Difficult'];
    const durations = ['All', '1-2 Days', '3-5 Days', '6-10 Days', '10+ Days'];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(searchQuery);
    };

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value === 'All' ? undefined : value };
        setFilters(newFilters);
        onFilterChange?.(newFilters);
    };

    const clearFilters = () => {
        setFilters({});
        onFilterChange?.({});
    };

    const activeFilterCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

    return (
        <div className="w-full space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for trips, destinations..."
                    className="w-full pl-12 pr-40 py-4 rounded-full border-2 border-border focus:border-primary outline-none transition-all text-base shadow-sm"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-full flex items-center gap-2 font-medium transition-all ${showFilters || activeFilterCount > 0
                            ? 'bg-primary text-white'
                            : 'bg-surface text-foreground hover:bg-gray-200'
                            }`}
                    >
                        <SlidersHorizontal size={18} />
                        <span>Filters</span>
                        {activeFilterCount > 0 && (
                            <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-linear-to-r from-primary to-accent text-white rounded-full font-semibold hover:shadow-lg transition-all hover:scale-105"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-border animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-foreground">Refine Your Search</h3>
                        <div className="flex gap-2">
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary hover:text-primary-dark font-medium"
                                >
                                    Clear All
                                </button>
                            )}
                            <button
                                onClick={() => setShowFilters(false)}
                                className="text-text-secondary hover:text-foreground transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Category Filter */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => handleFilterChange('category', cat)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(filters.category === cat || (cat === 'All' && !filters.category))
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-surface text-foreground hover:bg-gray-200'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Filter */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground">Difficulty</label>
                            <div className="flex flex-wrap gap-2">
                                {difficulties.map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => handleFilterChange('difficulty', diff)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(filters.difficulty === diff || (diff === 'All' && !filters.difficulty))
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-surface text-foreground hover:bg-gray-200'
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Duration Filter */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-foreground">Duration</label>
                            <div className="flex flex-wrap gap-2">
                                {durations.map((dur) => (
                                    <button
                                        key={dur}
                                        onClick={() => handleFilterChange('duration', dur)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${(filters.duration === dur || (dur === 'All' && !filters.duration))
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-surface text-foreground hover:bg-gray-200'
                                            }`}
                                    >
                                        {dur}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
