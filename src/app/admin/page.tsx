'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, FileText, MapPin, Compass, Building,
    MessageSquare, BookOpen, Settings, LogOut, ChevronRight,
    Save, RefreshCw, Plus, Trash2, Eye, ChevronDown, ChevronUp,
    ShoppingBag, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import ImagePreview from '@/components/ImagePreview';
import EditableList from '@/components/EditableList';
import { formatPrice } from '@/lib/utils';

interface PageData {
    id: number;
    pageKey: string;
    pageTitle: string;
    heroTitle: string;
    heroSubtitle: string;
    heroImageUrl: string;
}

interface Stat {
    id: number;
    value: string;
    label: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('destinations');
    const [pages, setPages] = useState<PageData[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [destinations, setDestinations] = useState<Record<string, unknown>[]>([]);
    const [trips, setTrips] = useState<Record<string, unknown>[]>([]); // Experiences
    const [hotels, setHotels] = useState<Record<string, unknown>[]>([]); // Stays
    const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([]);
    const [blogs, setBlogs] = useState<Record<string, unknown>[]>([]); // Journals
    const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
    const [destinationDetails, setDestinationDetails] = useState<Record<number, Record<string, unknown>>>({});
    const [tripItineraries, setTripItineraries] = useState<Record<number, Record<string, unknown>[]>>({});
    const [expandedDestinations, setExpandedDestinations] = useState<Record<number, boolean>>({});
    const [expandedTrips, setExpandedTrips] = useState<Record<number, boolean>>({});
    const [expandedHotels, setExpandedHotels] = useState<Record<number, boolean>>({});
    const [expandedBlogs, setExpandedBlogs] = useState<Record<number, boolean>>({});
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        // Check if admin is logged in
        const token = localStorage.getItem('adminToken');
        if (!token) {
            router.push('/');
            return;
        }

        // Verify token
        api.adminVerify(token).catch(() => {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminName');
            router.push('/');
        });

        fetchAllData();
    }, [router]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [pagesRes, statsRes, destRes, tripsRes, hotelsRes, testsRes, blogsRes, bookingsRes] = await Promise.all([
                api.admin.getPages().catch(() => ({ data: [] })),
                api.admin.getStats().catch(() => ({ data: [] })),
                api.admin.getDestinations().catch(() => ({ data: [] })),
                api.admin.getTrips().catch(() => ({ data: [] })),
                api.admin.getHotels().catch(() => ({ data: [] })),
                api.admin.getTestimonials().catch(() => ({ data: [] })),
                api.admin.getBlogs().catch(() => ({ data: [] })),
                api.admin.getBookings().catch(() => ({ data: [] })),
            ]);
            setPages(Array.isArray(pagesRes.data) ? pagesRes.data : []);
            setStats(Array.isArray(statsRes.data) ? statsRes.data : []);
            setDestinations(Array.isArray(destRes.data) ? destRes.data : []);
            setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
            setHotels(Array.isArray(hotelsRes.data) ? hotelsRes.data : []);
            setTestimonials(Array.isArray(testsRes.data) ? testsRes.data : []);
            setBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : []);
            setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
            
            // Fetch destination details and trip itineraries
            const destDetails: Record<number, Record<string, unknown>> = {};
            const tripItins: Record<number, Record<string, unknown>[]> = {};
            
            for (const dest of Array.isArray(destRes.data) ? destRes.data : []) {
                try {
                    const detailRes = await api.admin.getDestinationDetails(dest.id as number);
                    if (detailRes?.data) {
                        destDetails[dest.id as number] = detailRes.data;
                    }
                } catch (err: any) {
                    // Silently handle errors - destination might not have details yet
                    if (err.response?.status !== 404) {
                        console.error('Error fetching destination details:', err);
                    }
                }
            }
            
            for (const trip of Array.isArray(tripsRes.data) ? tripsRes.data : []) {
                try {
                    const itinRes = await api.admin.getTripItineraries(trip.id as number);
                    if (Array.isArray(itinRes.data)) {
                        tripItins[trip.id as number] = itinRes.data;
                    }
                } catch (err: any) {
                    // Silently handle errors - trip might not have itineraries yet
                    if (err.response?.status !== 404) {
                        console.error('Error fetching trip itineraries:', err);
                    }
                }
            }
            
            setDestinationDetails(destDetails);
            setTripItineraries(tripItins);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to load data. Make sure the backend is running and data is seeded.' });
        }
        setLoading(false);
    };

    const handleLogout = () => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            api.adminLogout(token);
        }
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        router.push('/');
    };

    const handleSavePage = async (page: PageData) => {
        setSaving(true);
        try {
            await api.admin.updatePage(page.id, page as unknown as Record<string, unknown>);
            setMessage({ type: 'success', text: 'Page updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update page' });
        }
        setSaving(false);
    };

    const handleSaveStat = async (stat: Stat) => {
        setSaving(true);
        try {
            await api.admin.updateStat(stat.id, stat as unknown as Record<string, unknown>);
            setMessage({ type: 'success', text: 'Stat updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update stat' });
        }
        setSaving(false);
    };

    const handleSaveDestination = async (dest: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateDestination(dest.id as number, dest);
            // Save destination details if they exist
            const details = destinationDetails[dest.id as number];
            if (details) {
                await api.admin.updateDestinationDetails(dest.id as number, details).catch(() => {});
            }
            setMessage({ type: 'success', text: 'Destination updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update destination' });
        }
        setSaving(false);
    };
    
    const handleSaveDestinationDetails = async (destId: number, details: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateDestinationDetails(destId, details);
            setDestinationDetails({ ...destinationDetails, [destId]: details });
            setMessage({ type: 'success', text: 'Destination details updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update destination details' });
        }
        setSaving(false);
    };
    
    const toggleDestinationExpanded = (id: number) => {
        setExpandedDestinations({ ...expandedDestinations, [id]: !expandedDestinations[id] });
        // Load details if expanding for first time
        if (!expandedDestinations[id] && !destinationDetails[id]) {
            api.admin.getDestinationDetails(id).then(res => {
                if (res.data) {
                    setDestinationDetails({ ...destinationDetails, [id]: res.data });
                }
            }).catch(() => {});
        }
    };

    const handleSaveTrip = async (trip: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateTrip(trip.id as number, trip);
            setMessage({ type: 'success', text: 'Trip updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update trip' });
        }
        setSaving(false);
    };
    
    const toggleTripExpanded = (id: number) => {
        setExpandedTrips({ ...expandedTrips, [id]: !expandedTrips[id] });
        if (!expandedTrips[id] && !tripItineraries[id]) {
            api.admin.getTripItineraries(id).then(res => {
                if (Array.isArray(res.data)) {
                    setTripItineraries({ ...tripItineraries, [id]: res.data });
                }
            }).catch((err: any) => {
                // Silently handle errors - trip might not have itineraries yet
                if (err.response?.status !== 404) {
                    console.error('Error fetching trip itineraries:', err);
                }
            });
        }
    };
    
    const handleSaveItinerary = async (tripId: number, itinerary: Record<string, unknown>) => {
        setSaving(true);
        try {
            if (itinerary.id) {
                await api.admin.updateTripItinerary(itinerary.id as number, itinerary);
            } else {
                await api.admin.createTripItinerary(tripId, itinerary);
            }
            setMessage({ type: 'success', text: 'Itinerary saved!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to save itinerary' });
        }
        setSaving(false);
    };
    
    const handleDeleteItinerary = async (id: number) => {
        if (!confirm('Are you sure you want to delete this itinerary day?')) return;
        setSaving(true);
        try {
            await api.admin.deleteTripItinerary(id);
            setMessage({ type: 'success', text: 'Itinerary deleted!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete itinerary' });
        }
        setSaving(false);
    };
    
    const toggleHotelExpanded = (id: number) => {
        setExpandedHotels({ ...expandedHotels, [id]: !expandedHotels[id] });
    };
    
    const toggleBlogExpanded = (id: number) => {
        setExpandedBlogs({ ...expandedBlogs, [id]: !expandedBlogs[id] });
    };

    const handleSaveHotel = async (hotel: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateHotel(hotel.id as number, hotel);
            setMessage({ type: 'success', text: 'Hotel updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update hotel' });
        }
        setSaving(false);
    };

    const handleSaveTestimonial = async (test: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateTestimonial(test.id as number, test);
            setMessage({ type: 'success', text: 'Testimonial updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update testimonial' });
        }
        setSaving(false);
    };

    const handleCreateDestination = async () => {
        setSaving(true);
        try {
            const newDest = {
                name: 'New Destination',
                slug: 'new-destination',
                description: '',
                imageUrl: '',
                country: '',
                region: '',
                tripCount: 0,
                isFeatured: false,
            };
            await api.admin.createDestination(newDest);
            setMessage({ type: 'success', text: 'Destination created!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create destination' });
        }
        setSaving(false);
    };

    const handleCreateTrip = async () => {
        setSaving(true);
        try {
            const newTrip = {
                title: 'New Trip',
                description: '',
                shortDescription: '',
                destination: '',
                imageUrl: '',
                price: 0,
                originalPrice: 0,
                duration: '',
                difficulty: '',
                category: '',
                rating: 0,
                reviewCount: 0,
                maxGroupSize: 10,
                isFeatured: false,
                isPopular: false,
                isTrending: false,
            };
            await api.admin.createTrip(newTrip);
            setMessage({ type: 'success', text: 'Trip created!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create trip' });
        }
        setSaving(false);
    };

    const handleCreateHotel = async () => {
        setSaving(true);
        try {
            const newHotel = {
                name: 'New Hotel',
                description: '',
                imageUrl: '',
                location: '',
                city: '',
                country: '',
                rating: 0,
                reviewCount: 0,
                pricePerNight: 0,
                type: '',
                isBoutique: false,
                isFeatured: false,
            };
            await api.admin.createHotel(newHotel);
            setMessage({ type: 'success', text: 'Hotel created!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create hotel' });
        }
        setSaving(false);
    };

    const handleCreateTestimonial = async () => {
        setSaving(true);
        try {
            const newTest = {
                userName: 'New User',
                userTitle: '',
                comment: '',
                rating: 5,
                isFeatured: false,
            };
            await api.admin.createTestimonial(newTest);
            setMessage({ type: 'success', text: 'Testimonial created!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create testimonial' });
        }
        setSaving(false);
    };

    const handleDeleteDestination = async (id: number) => {
        if (!confirm('Are you sure you want to delete this destination?')) return;
        setSaving(true);
        try {
            await api.admin.deleteDestination(id);
            setMessage({ type: 'success', text: 'Destination deleted!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete destination' });
        }
        setSaving(false);
    };

    const handleDeleteTrip = async (id: number) => {
        if (!confirm('Are you sure you want to delete this trip?')) return;
        setSaving(true);
        try {
            await api.admin.deleteTrip(id);
            setMessage({ type: 'success', text: 'Trip deleted!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete trip' });
        }
        setSaving(false);
    };

    const handleDeleteHotel = async (id: number) => {
        if (!confirm('Are you sure you want to delete this hotel?')) return;
        setSaving(true);
        try {
            await api.admin.deleteHotel(id);
            setMessage({ type: 'success', text: 'Hotel deleted!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete hotel' });
        }
        setSaving(false);
    };

    const handleDeleteTestimonial = async (id: number) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;
        setSaving(true);
        try {
            await api.admin.deleteTestimonial(id);
            setMessage({ type: 'success', text: 'Testimonial deleted!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete testimonial' });
        }
        setSaving(false);
    };

    const handleSaveBlog = async (blog: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateBlog(blog.id as number, blog);
            setMessage({ type: 'success', text: 'Blog updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update blog' });
        }
        setSaving(false);
    };

    const handleCreateBlog = async () => {
        setSaving(true);
        try {
            const newBlog = {
                title: 'New Blog Post',
                content: '',
                shortDescription: '',
                imageUrl: '',
                slug: 'new-blog-post',
                authorName: '',
                publishedDate: new Date().toISOString().split('T')[0],
                category: '',
                readTime: '5 min',
                isFeatured: false,
            };
            await api.admin.createBlog(newBlog);
            setMessage({ type: 'success', text: 'Blog created!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create blog' });
        }
        setSaving(false);
    };

    const handleDeleteBlog = async (id: number) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;
        setSaving(true);
        try {
            await api.admin.deleteBlog(id);
            setMessage({ type: 'success', text: 'Blog deleted!' });
            fetchAllData();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete blog' });
        }
        setSaving(false);
    };

    const sidebarItems = [
        { id: 'destinations', icon: MapPin, label: 'Destinations' },
        { id: 'experiences', icon: Compass, label: 'Experiences' },
        { id: 'stays', icon: Building, label: 'Stays' },
        { id: 'journals', icon: BookOpen, label: 'Journals' },
        { id: 'pages', icon: FileText, label: 'Page Content' },
        { id: 'stats', icon: LayoutDashboard, label: 'Statistics' },
        { id: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
        { id: 'bookings', icon: ShoppingBag, label: 'Bookings' },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-cream-dark flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-secondary mx-auto mb-4" />
                    <p className="text-primary/60">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-dark flex">
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-cream fixed h-full">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="font-display text-2xl">Wanderlust</Link>
                    <p className="text-caption text-cream/50 mt-1">Admin Panel</p>
                </div>

                <nav className="p-4">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 mb-1 transition-colors ${activeTab === item.id
                                ? 'bg-accent text-primary'
                                : 'text-cream/60 hover:bg-white/5 hover:text-cream'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm">{item.label}</span>
                            {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-cream/60 hover:bg-white/5 hover:text-cream transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-display text-3xl text-primary capitalize">{activeTab}</h1>
                        <p className="text-primary/50 text-sm mt-1">Manage your {activeTab} content</p>
                    </div>
                    <button
                        onClick={fetchAllData}
                        className="flex items-center gap-2 px-4 py-2 bg-cream text-primary hover:bg-white transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Refresh</span>
                    </button>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-6 p-4 ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                        } border`}>
                        {message.text}
                    </div>
                )}

                {/* Content */}
                <div className="bg-cream p-6 shadow-sm">

                    {/* Pages Tab */}
                    {activeTab === 'pages' && (
                        <div className="space-y-8">
                            {pages.map((page) => (
                                <div key={page.id} className="border-b border-primary/10 pb-8 last:border-0">
                                    <h3 className="font-display text-xl text-primary mb-4 capitalize">{page.pageKey} Page</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Image Preview */}
                                        <div className="lg:col-span-1">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Image Preview</label>
                                            <ImagePreview
                                                imageUrl={page.heroImageUrl || ''}
                                                className="w-full h-48 rounded"
                                            />
                                        </div>
                                        
                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Title</label>
                                            <input
                                                type="text"
                                                value={page.heroTitle || ''}
                                                onChange={(e) => setPages(pages.map(p => p.id === page.id ? { ...p, heroTitle: e.target.value } : p))}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Subtitle</label>
                                                <textarea
                                                    value={page.heroSubtitle || ''}
                                                    onChange={(e) => setPages(pages.map(p => p.id === page.id ? { ...p, heroSubtitle: e.target.value } : p))}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Image URL</label>
                                                <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={page.heroImageUrl || ''}
                                                onChange={(e) => setPages(pages.map(p => p.id === page.id ? { ...p, heroImageUrl: e.target.value } : p))}
                                                        className="flex-1 px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                    {page.heroImageUrl && (
                                                        <a
                                                            href={page.heroImageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-3 border border-primary/20 bg-cream hover:bg-cream-dark transition-colors flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                    )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSavePage(page)}
                                        disabled={saving}
                                                className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stats Tab */}
                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {stats.map((stat) => (
                                <div key={stat.id} className="p-4 border border-primary/10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Value</label>
                                            <input
                                                type="text"
                                                value={stat.value}
                                                onChange={(e) => setStats(stats.map(s => s.id === stat.id ? { ...s, value: e.target.value } : s))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Label</label>
                                            <input
                                                type="text"
                                                value={stat.label}
                                                onChange={(e) => setStats(stats.map(s => s.id === stat.id ? { ...s, label: e.target.value } : s))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSaveStat(stat)}
                                        disabled={saving}
                                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-cream hover:bg-primary-light transition-colors text-sm disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Destinations Tab */}
                    {activeTab === 'destinations' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Destinations</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage travel destinations</p>
                                </div>
                                <button
                                    onClick={handleCreateDestination}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Destination</span>
                                </button>
                            </div>
                            {destinations.map((dest) => (
                                <div key={dest.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Image Preview */}
                                        <div className="lg:col-span-1">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image Preview</label>
                                            <ImagePreview
                                                imageUrl={dest.imageUrl as string || ''}
                                                className="w-full h-48 rounded"
                                            />
                                        </div>
                                        
                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={dest.name as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, name: e.target.value } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Slug</label>
                                                    <input
                                                        type="text"
                                                        value={dest.slug as string || ''}
                                                        onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, slug: e.target.value } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Trip Count</label>
                                                    <input
                                                        type="number"
                                                        value={dest.tripCount as number || 0}
                                                        onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, tripCount: Number(e.target.value) } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Region</label>
                                            <input
                                                type="text"
                                                value={dest.region as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, region: e.target.value } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Country</label>
                                            <input
                                                type="text"
                                                value={dest.country as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, country: e.target.value } : d))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                                <div className="flex items-center gap-4 pt-6">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={dest.isFeatured as boolean || false}
                                                            onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, isFeatured: e.target.checked } : d))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Featured</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                            <textarea
                                                value={dest.description as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, description: e.target.value } : d))}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image URL</label>
                                                <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={dest.imageUrl as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, imageUrl: e.target.value } : d))}
                                                        className="flex-1 px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                    {typeof dest.imageUrl === "string" && dest.imageUrl.trim() !== "" ? (
                                                        <a
                                                            href={dest.imageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-3 border border-primary/20 bg-cream hover:bg-cream-dark transition-colors flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                    ) : null}
                                        </div>
                                    </div>
                                            <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSaveDestination(dest)}
                                        disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save</span>
                                    </button>
                                                <button
                                                    onClick={() => handleDeleteDestination(dest.id as number)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                    </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Destination Details Section - Expandable */}
                                    <div className="mt-4 border-t border-primary/10 pt-4">
                                        <button
                                            onClick={() => toggleDestinationExpanded(dest.id as number)}
                                            className="w-full flex items-center justify-between px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-primary">Destination Details & Content</span>
                                            {expandedDestinations[dest.id as number] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        
                                        {expandedDestinations[dest.id as number] && (
                                            <div className="mt-4 p-4 bg-cream space-y-4">
                                                {(() => {
                                                    const details = destinationDetails[dest.id as number] || {};
                                                    return (
                                                        <>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="md:col-span-2">
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Overview</label>
                                                                    <textarea
                                                                        value={details.overview as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, overview: e.target.value } })}
                                                                        rows={4}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Best Time to Visit</label>
                                                                    <textarea
                                                                        value={details.bestTimeToVisit as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, bestTimeToVisit: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Climate</label>
                                                                    <textarea
                                                                        value={details.climate as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, climate: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Culture</label>
                                                                    <textarea
                                                                        value={details.culture as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, culture: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Cuisine</label>
                                                                    <textarea
                                                                        value={details.cuisine as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, cuisine: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Visa Info</label>
                                                                    <textarea
                                                                        value={details.visaInfo as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, visaInfo: e.target.value } })}
                                                                        rows={3}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Currency</label>
                                                                    <input
                                                                        type="text"
                                                                        value={details.currency as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, currency: e.target.value } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Language</label>
                                                                    <input
                                                                        type="text"
                                                                        value={details.language as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, language: e.target.value } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Time Zone</label>
                                                                    <input
                                                                        type="text"
                                                                        value={details.timeZone as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, timeZone: e.target.value } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Safety Rating</label>
                                                                    <input
                                                                        type="number"
                                                                        step="0.1"
                                                                        min="0"
                                                                        max="5"
                                                                        value={details.safetyRating as number || 0}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, safetyRating: Number(e.target.value) } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Budget Range</label>
                                                                    <input
                                                                        type="text"
                                                                        value={details.budgetRange as string || ''}
                                                                        onChange={(e) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, budgetRange: e.target.value } })}
                                                                        className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                    />
                                                                </div>
                                                            </div>
                                                            
                                                            <EditableList
                                                                items={Array.isArray(details.highlights) ? details.highlights : []}
                                                                onChange={(items) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, highlights: items } })}
                                                                label="Highlights"
                                                                placeholder="Add highlight..."
                                                            />
                                                            
                                                            <EditableList
                                                                items={Array.isArray(details.galleryImages) ? details.galleryImages : []}
                                                                onChange={(items) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, galleryImages: items } })}
                                                                label="Gallery Images (URLs)"
                                                                placeholder="Add image URL..."
                                                            />
                                                            
                                                            <EditableList
                                                                items={Array.isArray(details.popularActivities) ? details.popularActivities : []}
                                                                onChange={(items) => setDestinationDetails({ ...destinationDetails, [dest.id as number]: { ...details, popularActivities: items } })}
                                                                label="Popular Activities"
                                                                placeholder="Add activity..."
                                                            />
                                                            
                                                            <button
                                                                onClick={() => handleSaveDestinationDetails(dest.id as number, details)}
                                                                disabled={saving}
                                                                className="flex items-center gap-2 px-6 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                                <span>Save Details</span>
                                                            </button>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Experiences Tab (Trips) */}
                    {activeTab === 'experiences' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Experiences</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage travel experiences and trips</p>
                                </div>
                                <button
                                    onClick={handleCreateTrip}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Experience</span>
                                </button>
                            </div>
                            {trips.map((trip) => (
                                <div key={trip.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Image Preview */}
                                        <div className="lg:col-span-1">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image Preview</label>
                                            <ImagePreview
                                                imageUrl={trip.imageUrl as string || ''}
                                                className="w-full h-48 rounded"
                                            />
                                        </div>
                                        
                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={trip.title as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, title: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={trip.price as number || 0}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, price: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                                    {(trip.price && typeof trip.price === 'number' && trip.price > 0) ? (
                                                        <p className="text-xs text-primary/50 mt-1">{formatPrice(trip.price)}</p>
                                                    ) : null}
                                        </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Original Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        value={trip.originalPrice as number || 0}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, originalPrice: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Duration</label>
                                            <input
                                                type="text"
                                                value={trip.duration as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, duration: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., 5 Days"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Difficulty</label>
                                                    <input
                                                        type="text"
                                                        value={trip.difficulty as string || ''}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, difficulty: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., Easy, Moderate, Hard"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Category</label>
                                            <input
                                                type="text"
                                                value={trip.category as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, category: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., Luxury, Adventure, Cultural"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Rating</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        value={trip.rating as number || 0}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, rating: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Review Count</label>
                                                    <input
                                                        type="number"
                                                        value={trip.reviewCount as number || 0}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, reviewCount: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Max Group Size</label>
                                                    <input
                                                        type="number"
                                                        value={trip.maxGroupSize as number || 10}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, maxGroupSize: Number(e.target.value) } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Destination</label>
                                                    <input
                                                        type="text"
                                                        value={trip.destination as string || ''}
                                                        onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, destination: e.target.value } : t))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., Santorini, Greece"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-6 pt-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={trip.isFeatured as boolean || false}
                                                            onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, isFeatured: e.target.checked } : t))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Featured</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={trip.isPopular as boolean || false}
                                                            onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, isPopular: e.target.checked } : t))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Popular</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={trip.isTrending as boolean || false}
                                                            onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, isTrending: e.target.checked } : t))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Trending</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Short Description</label>
                                                <textarea
                                                    value={trip.shortDescription as string || ''}
                                                    onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, shortDescription: e.target.value } : t))}
                                                    rows={2}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Full Description</label>
                                                <textarea
                                                    value={trip.description as string || ''}
                                                    onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, description: e.target.value } : t))}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image URL</label>
                                                <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={trip.imageUrl as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, imageUrl: e.target.value } : t))}
                                                        className="flex-1 px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                    {(trip.imageUrl && typeof trip.imageUrl === 'string' && trip.imageUrl.trim() !== '') ? (
                                                        <a
                                                            href={trip.imageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-3 border border-primary/20 bg-cream hover:bg-cream-dark transition-colors flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                    ) : null}
                                        </div>
                                    </div>
                                            <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSaveTrip(trip)}
                                        disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save</span>
                                    </button>
                                                <button
                                                    onClick={() => handleDeleteTrip(trip.id as number)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                    </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Trip Itineraries Section - Expandable */}
                                    <div className="mt-4 border-t border-primary/10 pt-4">
                                        <button
                                            onClick={() => toggleTripExpanded(trip.id as number)}
                                            className="w-full flex items-center justify-between px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-primary">Trip Itinerary (Day-by-Day)</span>
                                            {expandedTrips[trip.id as number] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        
                                        {expandedTrips[trip.id as number] && (
                                            <div className="mt-4 space-y-4">
                                                {(tripItineraries[trip.id as number] || []).map((itin: Record<string, unknown>, idx: number) => (
                                                    <div key={idx} className="p-4 bg-cream border border-primary/10">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Day Number</label>
                                                                <input
                                                                    type="number"
                                                                    value={itin.dayNumber as number || 0}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], dayNumber: Number(e.target.value) };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Day Title</label>
                                                                <input
                                                                    type="text"
                                                                    value={itin.dayTitle as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], dayTitle: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-3">
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                                                <textarea
                                                                    value={itin.description as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], description: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    rows={4}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Accommodation</label>
                                                                <input
                                                                    type="text"
                                                                    value={itin.accommodation as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], accommodation: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Meals</label>
                                                                <input
                                                                    type="text"
                                                                    value={itin.meals as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], meals: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image URL</label>
                                                                <input
                                                                    type="text"
                                                                    value={itin.imageUrl as string || ''}
                                                                    onChange={(e) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], imageUrl: e.target.value };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    className="w-full px-4 py-3 border border-primary/20 bg-white focus:outline-none focus:border-secondary"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-3">
                                                                <EditableList
                                                                    items={Array.isArray(itin.activities) ? itin.activities : []}
                                                                    onChange={(items) => {
                                                                        const updated = [...(tripItineraries[trip.id as number] || [])];
                                                                        updated[idx] = { ...updated[idx], activities: items };
                                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: updated });
                                                                    }}
                                                                    label="Activities"
                                                                    placeholder="Add activity..."
                                                                />
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => handleSaveItinerary(trip.id as number, itin)}
                                                                    disabled={saving}
                                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                                                >
                                                                    <Save className="w-4 h-4" />
                                                                    <span>Save Day</span>
                                                                </button>
                                                                {(itin.id && typeof itin.id === 'number') ? (
                                                                    <button
                                                                        onClick={() => handleDeleteItinerary(itin.id as number)}
                                                                        disabled={saving}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                        <span>Delete</span>
                                                                    </button>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    onClick={() => {
                                                        const newItin = { dayNumber: (tripItineraries[trip.id as number]?.length || 0) + 1, dayTitle: '', description: '', activities: [] };
                                                        setTripItineraries({ ...tripItineraries, [trip.id as number]: [...(tripItineraries[trip.id as number] || []), newItin] });
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    <span>Add New Day</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Stays Tab (Hotels) */}
                    {activeTab === 'stays' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Stays</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage hotels and accommodations</p>
                                </div>
                                <button
                                    onClick={handleCreateHotel}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Stay</span>
                                </button>
                            </div>
                            {hotels.map((hotel) => (
                                <div key={hotel.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Image Preview */}
                                        <div className="lg:col-span-1">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image Preview</label>
                                            <ImagePreview
                                                imageUrl={hotel.imageUrl as string || ''}
                                                className="w-full h-48 rounded"
                                            />
                                        </div>
                                        
                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={hotel.name as string || ''}
                                                onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, name: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Type</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.type as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, type: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., Boutique, Resort, Villa"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={hotel.city as string || ''}
                                                onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, city: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Country</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.country as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, country: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Location</label>
                                                    <input
                                                        type="text"
                                                        value={hotel.location as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, location: e.target.value } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="Full address"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Price/Night (₹)</label>
                                            <input
                                                type="number"
                                                value={hotel.pricePerNight as number || 0}
                                                onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, pricePerNight: Number(e.target.value) } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                                    {(hotel.pricePerNight && typeof hotel.pricePerNight === 'number' && hotel.pricePerNight > 0) ? (
                                                        <p className="text-xs text-primary/50 mt-1">{formatPrice(hotel.pricePerNight)} / night</p>
                                                    ) : null}
                                        </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Rating</label>
                                                    <input
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="5"
                                                        value={hotel.rating as number || 0}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, rating: Number(e.target.value) } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Review Count</label>
                                                    <input
                                                        type="number"
                                                        value={hotel.reviewCount as number || 0}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, reviewCount: Number(e.target.value) } : h))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-6 pt-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={hotel.isFeatured as boolean || false}
                                                            onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, isFeatured: e.target.checked } : h))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Featured</span>
                                                    </label>
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={hotel.isBoutique as boolean || false}
                                                            onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, isBoutique: e.target.checked } : h))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Boutique</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                            <textarea
                                                value={hotel.description as string || ''}
                                                onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, description: e.target.value } : h))}
                                                    rows={4}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={hotel.imageUrl as string || ''}
                                                        onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, imageUrl: e.target.value } : h))}
                                                        className="flex-1 px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                    {(hotel.imageUrl && typeof hotel.imageUrl === 'string' && hotel.imageUrl.trim() !== '') ? (
                                                        <a
                                                            href={hotel.imageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-3 border border-primary/20 bg-cream hover:bg-cream-dark transition-colors flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                    ) : null}
                                    </div>
                                            </div>
                                            <div className="flex gap-2">
                                    <button
                                        onClick={() => handleSaveHotel(hotel)}
                                        disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save</span>
                                    </button>
                                                <button
                                                    onClick={() => handleDeleteHotel(hotel.id as number)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                    </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Hotel Amenities & Images Section - Expandable */}
                                    <div className="mt-4 border-t border-primary/10 pt-4">
                                        <button
                                            onClick={() => toggleHotelExpanded(hotel.id as number)}
                                            className="w-full flex items-center justify-between px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-primary">Amenities & Images</span>
                                            {expandedHotels[hotel.id as number] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        
                                        {expandedHotels[hotel.id as number] && (
                                            <div className="mt-4 p-4 bg-cream space-y-4">
                                                <EditableList
                                                    items={Array.isArray(hotel.amenities) ? hotel.amenities : []}
                                                    onChange={(items) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, amenities: items } : h))}
                                                    label="Amenities"
                                                    placeholder="Add amenity..."
                                                />
                                                
                                                <EditableList
                                                    items={Array.isArray(hotel.images) ? hotel.images : []}
                                                    onChange={(items) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, images: items } : h))}
                                                    label="Hotel Images (URLs)"
                                                    placeholder="Add image URL..."
                                                />
                                                
                                                <button
                                                    onClick={() => handleSaveHotel(hotel)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save Amenities & Images</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Journals Tab (Blogs) */}
                    {activeTab === 'journals' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Journals</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage travel journals and blog posts</p>
                                </div>
                                <button
                                    onClick={handleCreateBlog}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Journal</span>
                                </button>
                            </div>
                            {blogs.map((blog) => (
                                <div key={blog.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Image Preview */}
                                        <div className="lg:col-span-1">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image Preview</label>
                                            <ImagePreview
                                                imageUrl={blog.imageUrl as string || ''}
                                                className="w-full h-48 rounded"
                                            />
                                        </div>
                                        
                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        value={blog.title as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, title: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Slug</label>
                                                    <input
                                                        type="text"
                                                        value={blog.slug as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, slug: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Category</label>
                                                    <input
                                                        type="text"
                                                        value={blog.category as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, category: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Author</label>
                                                    <input
                                                        type="text"
                                                        value={blog.authorName as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, authorName: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Published Date</label>
                                                    <input
                                                        type="date"
                                                        value={blog.publishedDate ? (blog.publishedDate as string).split('T')[0] : ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, publishedDate: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Read Time</label>
                                                    <input
                                                        type="text"
                                                        value={blog.readTime as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, readTime: e.target.value } : b))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., 5 min"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-4 pt-4">
                                                    <label className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={blog.isFeatured as boolean || false}
                                                            onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, isFeatured: e.target.checked } : b))}
                                                            className="w-4 h-4"
                                                        />
                                                        <span className="text-sm text-primary/70">Featured</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Short Description</label>
                                                <textarea
                                                    value={blog.shortDescription as string || ''}
                                                    onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, shortDescription: e.target.value } : b))}
                                                    rows={2}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Content</label>
                                                <textarea
                                                    value={blog.content as string || ''}
                                                    onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, content: e.target.value } : b))}
                                                    rows={6}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image URL</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={blog.imageUrl as string || ''}
                                                        onChange={(e) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, imageUrl: e.target.value } : b))}
                                                        className="flex-1 px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="https://images.unsplash.com/..."
                                                    />
                                                    {(blog.imageUrl && typeof blog.imageUrl === 'string' && blog.imageUrl.trim() !== '') ? (
                                                        <a
                                                            href={blog.imageUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="px-4 py-3 border border-primary/20 bg-cream hover:bg-cream-dark transition-colors flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </a>
                                                    ) : null}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveBlog(blog)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteBlog(blog.id as number)}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Blog Tags Section - Expandable */}
                                    <div className="mt-4 border-t border-primary/10 pt-4">
                                        <button
                                            onClick={() => toggleBlogExpanded(blog.id as number)}
                                            className="w-full flex items-center justify-between px-4 py-2 bg-primary/5 hover:bg-primary/10 transition-colors"
                                        >
                                            <span className="text-sm font-medium text-primary">Tags</span>
                                            {expandedBlogs[blog.id as number] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>
                                        
                                        {expandedBlogs[blog.id as number] && (
                                            <div className="mt-4 p-4 bg-cream">
                                                <EditableList
                                                    items={Array.isArray(blog.tags) ? blog.tags : []}
                                                    onChange={(items) => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, tags: items } : b))}
                                                    label="Blog Tags"
                                                    placeholder="Add tag..."
                                                />
                                                
                                                <button
                                                    onClick={() => handleSaveBlog(blog)}
                                                    disabled={saving}
                                                    className="mt-4 flex items-center gap-2 px-6 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>Save Tags</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Testimonials Tab */}
                    {activeTab === 'testimonials' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-medium text-primary">Testimonials</h2>
                                <button
                                    onClick={handleCreateTestimonial}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New</span>
                                </button>
                            </div>
                            {testimonials.map((test) => (
                                <div key={test.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">User Name</label>
                                            <input
                                                type="text"
                                                value={test.userName as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userName: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title/Trip</label>
                                            <input
                                                type="text"
                                                value={test.userTitle as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userTitle: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Rating</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max="5"
                                                value={test.rating as number || 5}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, rating: Number(e.target.value) } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4 pt-6">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={test.isFeatured as boolean || false}
                                                    onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, isFeatured: e.target.checked } : t))}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm text-primary/70">Featured</span>
                                            </label>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Comment</label>
                                            <textarea
                                                value={test.comment as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, comment: e.target.value } : t))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleSaveTestimonial(test)}
                                        disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save</span>
                                    </button>
                                        <button
                                            onClick={() => handleDeleteTestimonial(test.id as number)}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                    </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'bookings' && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-medium text-primary">Bookings</h2>
                            <div className="space-y-4">
                                {bookings.map((booking: any) => (
                                    <div 
                                        key={booking.id} 
                                        className={`p-6 border border-primary/10 bg-cream-light ${!booking.adminReviewed ? 'border-l-4 border-l-secondary' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-medium text-primary mb-1">
                                                    {booking.bookingReference}
                                                    {!booking.adminReviewed && (
                                                        <span className="ml-2 text-xs bg-secondary text-cream px-2 py-1 rounded">New</span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-text-secondary">
                                                    {booking.customerName} • {booking.customerEmail}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm ${
                                                    booking.paymentStatus === 'PAID' ? 'bg-success/20 text-success' :
                                                    booking.paymentStatus === 'FAILED' ? 'bg-error/20 text-error' :
                                                    'bg-warning/20 text-warning'
                                                }`}>
                                                    {booking.paymentStatus === 'PAID' && <CheckCircle size={16} />}
                                                    {booking.paymentStatus === 'FAILED' && <XCircle size={16} />}
                                                    {booking.paymentStatus === 'PENDING' && <Clock size={16} />}
                                                    {booking.paymentStatus}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-caption text-text-secondary">Trip</p>
                                                <p className="text-body-lg">{booking.trip?.title || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-caption text-text-secondary">Travel Date</p>
                                                <p className="text-body-lg">{new Date(booking.travelDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-caption text-text-secondary">Guests</p>
                                                <p className="text-body-lg">{booking.numberOfGuests}</p>
                                            </div>
                                            <div>
                                                <p className="text-caption text-text-secondary">Amount</p>
                                                <p className="text-body-lg font-medium">{formatPrice(booking.finalAmount || booking.totalAmount)}</p>
                                            </div>
                                        </div>
                                        
                                        {booking.discountAmount > 0 && (
                                            <div className="mb-4 p-3 bg-success/10 rounded">
                                                <p className="text-sm text-success">
                                                    Discount: {booking.discountPercentage}% ({formatPrice(booking.discountAmount)})
                                                </p>
                                            </div>
                                        )}
                                        
                                        {booking.paymentMethod && (
                                            <div className="mb-4">
                                                <p className="text-caption text-text-secondary">Payment Method</p>
                                                <p className="text-body-lg">{booking.paymentMethod.toUpperCase()}</p>
                                            </div>
                                        )}
                                        
                                        {booking.specialRequests && (
                                            <div className="mb-4">
                                                <p className="text-caption text-text-secondary">Special Requests</p>
                                                <p className="text-body-sm">{booking.specialRequests}</p>
                                            </div>
                                        )}
                                        
                                        <div className="flex gap-2 mt-4">
                                            {!booking.adminReviewed && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.admin.markBookingAsReviewed(booking.bookingReference);
                                                            setBookings(bookings.map((b: any) => 
                                                                b.id === booking.id ? { ...b, adminReviewed: true } : b
                                                            ));
                                                            setMessage({ type: 'success', text: 'Booking marked as reviewed!' });
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to update booking' });
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Mark as Reviewed</span>
                                                </button>
                                            )}
                                            {booking.adminReviewed && (
                                                <span className="flex items-center gap-2 px-4 py-2 bg-cream border border-primary/20 text-text-secondary">
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Reviewed</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {bookings.length === 0 && (
                                    <div className="text-center py-12 text-text-secondary">
                                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p>No bookings yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

