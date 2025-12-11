export interface Trip {
    id: number;
    title: string;
    description: string;
    shortDescription?: string;
    destination: string;
    imageUrl: string;
    images?: string[];
    price: number | string | any; // Can be number or BigDecimal from backend
    originalPrice?: number | string | any;
    duration: string;
    difficulty?: 'Easy' | 'Moderate' | 'Challenging' | 'Difficult' | string;
    maxGroupSize?: number;
    rating: number;
    reviewCount: number;
    category: string;
    highlights?: string[];
    includes?: string[];
    excludes?: string[];
    itinerary?: ItineraryDay[];
    location?: Location;
    availableDates?: string[];
    featured?: boolean;
    isFeatured?: boolean;
    popular?: boolean;
    isPopular?: boolean;
    trending?: boolean;
    isTrending?: boolean;
}

export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    activities?: string[];
}

export interface Location {
    city: string;
    state?: string;
    country: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

export interface Destination {
    id: number;
    name: string;
    slug: string;
    imageUrl: string;
    tripCount: number;
    description?: string;
    region?: string;
    country?: string;
    isFeatured?: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon?: string;
}

export interface Review {
    id: number;
    tripId: number;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    helpful?: number;
}
