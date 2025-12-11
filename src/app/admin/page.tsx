'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, FileText, MapPin, Compass, Building,
    MessageSquare, BookOpen, Settings, LogOut, ChevronRight,
    Save, RefreshCw
} from 'lucide-react';
import { api } from '@/lib/api';

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
    const [activeTab, setActiveTab] = useState('pages');
    const [pages, setPages] = useState<PageData[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [destinations, setDestinations] = useState<Record<string, unknown>[]>([]);
    const [trips, setTrips] = useState<Record<string, unknown>[]>([]);
    const [hotels, setHotels] = useState<Record<string, unknown>[]>([]);
    const [testimonials, setTestimonials] = useState<Record<string, unknown>[]>([]);
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
            const [pagesRes, statsRes, destRes, tripsRes, hotelsRes, testsRes] = await Promise.all([
                api.admin.getPages().catch(() => ({ data: [] })),
                api.admin.getStats().catch(() => ({ data: [] })),
                api.admin.getDestinations().catch(() => ({ data: [] })),
                api.admin.getTrips().catch(() => ({ data: [] })),
                api.admin.getHotels().catch(() => ({ data: [] })),
                api.admin.getTestimonials().catch(() => ({ data: [] })),
            ]);
            setPages(Array.isArray(pagesRes.data) ? pagesRes.data : []);
            setStats(Array.isArray(statsRes.data) ? statsRes.data : []);
            setDestinations(Array.isArray(destRes.data) ? destRes.data : []);
            setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
            setHotels(Array.isArray(hotelsRes.data) ? hotelsRes.data : []);
            setTestimonials(Array.isArray(testsRes.data) ? testsRes.data : []);
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
            setMessage({ type: 'success', text: 'Destination updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update destination' });
        }
        setSaving(false);
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

    const sidebarItems = [
        { id: 'pages', icon: FileText, label: 'Page Content' },
        { id: 'stats', icon: LayoutDashboard, label: 'Statistics' },
        { id: 'destinations', icon: MapPin, label: 'Destinations' },
        { id: 'trips', icon: Compass, label: 'Trips' },
        { id: 'hotels', icon: Building, label: 'Hotels' },
        { id: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Title</label>
                                            <input
                                                type="text"
                                                value={page.heroTitle || ''}
                                                onChange={(e) => setPages(pages.map(p => p.id === page.id ? { ...p, heroTitle: e.target.value } : p))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Image URL</label>
                                            <input
                                                type="text"
                                                value={page.heroImageUrl || ''}
                                                onChange={(e) => setPages(pages.map(p => p.id === page.id ? { ...p, heroImageUrl: e.target.value } : p))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Hero Subtitle</label>
                                            <textarea
                                                value={page.heroSubtitle || ''}
                                                onChange={(e) => setPages(pages.map(p => p.id === page.id ? { ...p, heroSubtitle: e.target.value } : p))}
                                                rows={2}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSavePage(page)}
                                        disabled={saving}
                                        className="mt-4 flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
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
                            {destinations.map((dest) => (
                                <div key={dest.id as number} className="p-4 border border-primary/10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={dest.name as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, name: e.target.value } : d))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Region</label>
                                            <input
                                                type="text"
                                                value={dest.region as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, region: e.target.value } : d))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Country</label>
                                            <input
                                                type="text"
                                                value={dest.country as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, country: e.target.value } : d))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                            <textarea
                                                value={dest.description as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, description: e.target.value } : d))}
                                                rows={2}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image URL</label>
                                            <input
                                                type="text"
                                                value={dest.imageUrl as string || ''}
                                                onChange={(e) => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, imageUrl: e.target.value } : d))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSaveDestination(dest)}
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

                    {/* Trips Tab */}
                    {activeTab === 'trips' && (
                        <div className="space-y-6">
                            {trips.map((trip) => (
                                <div key={trip.id as number} className="p-4 border border-primary/10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                            <input
                                                type="text"
                                                value={trip.title as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, title: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Price</label>
                                            <input
                                                type="number"
                                                value={trip.price as number || 0}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, price: Number(e.target.value) } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Short Description</label>
                                            <textarea
                                                value={trip.shortDescription as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, shortDescription: e.target.value } : t))}
                                                rows={2}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Duration</label>
                                            <input
                                                type="text"
                                                value={trip.duration as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, duration: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Category</label>
                                            <input
                                                type="text"
                                                value={trip.category as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, category: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Image URL</label>
                                            <input
                                                type="text"
                                                value={trip.imageUrl as string || ''}
                                                onChange={(e) => setTrips(trips.map(t => t.id === trip.id ? { ...t, imageUrl: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSaveTrip(trip)}
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

                    {/* Hotels Tab */}
                    {activeTab === 'hotels' && (
                        <div className="space-y-6">
                            {hotels.map((hotel) => (
                                <div key={hotel.id as number} className="p-4 border border-primary/10">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Name</label>
                                            <input
                                                type="text"
                                                value={hotel.name as string || ''}
                                                onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, name: e.target.value } : h))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">City</label>
                                            <input
                                                type="text"
                                                value={hotel.city as string || ''}
                                                onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, city: e.target.value } : h))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Price/Night</label>
                                            <input
                                                type="number"
                                                value={hotel.pricePerNight as number || 0}
                                                onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, pricePerNight: Number(e.target.value) } : h))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                            <textarea
                                                value={hotel.description as string || ''}
                                                onChange={(e) => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, description: e.target.value } : h))}
                                                rows={2}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSaveHotel(hotel)}
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

                    {/* Testimonials Tab */}
                    {activeTab === 'testimonials' && (
                        <div className="space-y-6">
                            {testimonials.map((test) => (
                                <div key={test.id as number} className="p-4 border border-primary/10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">User Name</label>
                                            <input
                                                type="text"
                                                value={test.userName as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userName: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title/Trip</label>
                                            <input
                                                type="text"
                                                value={test.userTitle as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userTitle: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Comment</label>
                                            <textarea
                                                value={test.comment as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, comment: e.target.value } : t))}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream-light focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleSaveTestimonial(test)}
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
                </div>
            </main>
        </div>
    );
}
