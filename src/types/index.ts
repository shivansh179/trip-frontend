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

export interface EventTicketType {
    id: number;
    name: string;
    description?: string;
    price: number | string;
    originalPrice?: number | string;
    capacity?: number | null;
    sortOrder: number;
    isActive?: boolean;
}

export interface Event {
    id: number;
    title: string;
    slug: string;
    description?: string;
    shortDescription?: string;
    longDescription?: string;
    imageUrl?: string;
    venueName?: string;
    venueAddress?: string;
    city?: string;
    eventDate: string;
    eventTime?: string;
    price: number | string;
    originalPrice?: number | string;
    category?: string;
    capacity?: number;
    isFeatured?: boolean;
    status?: string;
    /** JSON string array */
    highlights?: string | string[];
    /** JSON string */
    termsAndConditions?: string;
    /** JSON string */
    faq?: string | { question: string; answer: string }[];
    /** JSON string array */
    galleryUrls?: string | string[];
    ageRestriction?: string;
    /** JSON string array */
    includes?: string | string[];
    importantInfo?: string;
    ticketTypes?: EventTicketType[];
    duration?: string;
    languages?: string;
    bannerHighlights?: string;
    aboutTagline?: string;
}

export interface TicketLineItem {
    ticketTypeId: number;
    quantity: number;
}

export interface CreateEventBookingRequest {
    eventId: number;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    eventDate: string;
    paymentMethod: string;
    specialRequests?: string;
    ticketLines?: TicketLineItem[];
    numberOfTickets?: number;
}

export interface EventBooking {
    id?: number;
    bookingReference?: string;
    event: Event;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    numberOfTickets: number;
    eventDate: string;
    totalAmount: number | string;
    finalAmount?: number | string;
    status?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    cardSurchargeAmount?: number | string;
    cardSurchargePercentage?: number;
    bookingTickets?: { ticketTypeName: string; quantity: number; unitPrice: number | string; lineTotal: number | string }[];
}
