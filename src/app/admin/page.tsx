'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, FileText, MapPin, Compass, Building,
    MessageSquare, BookOpen, Settings, LogOut, ChevronRight,
    Save, RefreshCw, Plus, Trash2, Eye, ChevronDown, ChevronUp,
    ShoppingBag, CheckCircle, XCircle, Clock, Mail, User, Calendar, Phone,
    Megaphone, Star, Activity, Upload, Copy, Link2, X, ExternalLink, Zap, Tag, Gift, CreditCard
} from 'lucide-react';
import { api } from '@/lib/api';
import ImagePreview from '@/components/ImagePreview';
import EditableList from '@/components/EditableList';
import { formatPrice } from '@/lib/utils';
import InlineImageUploader from '@/components/InlineImageUploader';
import { getDestinationImageUrl } from '@/lib/destinationImages';

interface CustomTripRecord {
    tripId: number;
    title: string;
    clientName: string;
    destination: string;
    numPersons: number;
    totalAmount: number;
    link: string;
    createdAt: string;
}

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
    const [events, setEvents] = useState<Record<string, unknown>[]>([]);
    const [bookings, setBookings] = useState<Record<string, unknown>[]>([]);
    const [eventBookings, setEventBookings] = useState<Record<string, unknown>[]>([]);
    const [destinationDetails, setDestinationDetails] = useState<Record<number, Record<string, unknown>>>({});
    const [tripItineraries, setTripItineraries] = useState<Record<number, Record<string, unknown>[]>>({});
    const [expandedDestinations, setExpandedDestinations] = useState<Record<number, boolean>>({});
    const [expandedTrips, setExpandedTrips] = useState<Record<number, boolean>>({});
    const [expandedHotels, setExpandedHotels] = useState<Record<number, boolean>>({});
    const [expandedBlogs, setExpandedBlogs] = useState<Record<number, boolean>>({});
    const [inquiries, setInquiries] = useState<Record<string, unknown>[]>([]);
    const [reviews, setReviews] = useState<Record<string, unknown>[]>([]);
    const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [reviewActing, setReviewActing] = useState<string | null>(null);
    const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
    const [reviewExpanded, setReviewExpanded] = useState<string | null>(null);
    const [ads, setAds] = useState<Record<string, unknown>[]>([]);
    const [packagePrices, setPackagePrices] = useState<Record<string, unknown>[]>([]);
    const [savingPrice, setSavingPrice] = useState<string | null>(null);
    const [priceEdits, setPriceEdits] = useState<Record<string, { priceINR: string; originalPriceINR: string }>>({});
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadFolder, setUploadFolder] = useState('admin');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Vouchers
    const [vouchers, setVouchers] = useState<Record<string, unknown>[]>([]);
    const [voucherForm, setVoucherForm] = useState({ amount: '', validDays: '365', name: '', email: '', phone: '', note: '', destination: '', pdfUrl: '' });
    const [voucherSaving, setVoucherSaving] = useState(false);
    const [voucherMsg, setVoucherMsg] = useState({ type: '', text: '' });
    const [voucherCreated, setVoucherCreated] = useState<{ code: string; amount: number; validUntil: string } | null>(null);
    const [voucherCopied, setVoucherCopied] = useState(false);
    const [voucherPayLink, setVoucherPayLink] = useState('');
    const [voucherPayLoading, setVoucherPayLoading] = useState(false);
    const [voucherPayCopied, setVoucherPayCopied] = useState(false);

    // Collect Payment (advance)
    const [payForm, setPayForm] = useState({ clientName: '', email: '', phone: '', amount: '', description: '', pdfUrl: '', note: '', sendEmail: true });
    const [paySaving, setPaySaving] = useState(false);
    const [payMsg, setPayMsg] = useState({ type: '', text: '' });
    const [payLink, setPayLink] = useState('');
    const [payCopied, setPayCopied] = useState(false);

    // Custom Trip Creator
    const [itineraryMode, setItineraryMode] = useState<'builder' | 'paste'>('builder');
    const [itineraryPasteText, setItineraryPasteText] = useState('');

    const parseItineraryText = (text: string) => {
        const lines = text.split('\n');
        const days: { dayTitle: string; description: string; activities: string }[] = [];
        let current: { dayTitle: string; description: string; activities: string } | null = null;
        let dayCount = 0;

        // Matches: "Day 1:", "Day1 -", "20 May:", "21st May:", "May 20:", "22nd May:", "23 may" etc.
        const MONTHS = 'jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec';
        const dayHeaderRegex = new RegExp(
            `^(?:` +
            `day\\s*\\d+` +                                                     // Day 1, Day2
            `|\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MONTHS})\\w*` +                 // 20 May, 22nd May
            `|(?:${MONTHS})\\w*\\s+\\d{1,2}(?:st|nd|rd|th)?` +                 // May 20, May 22nd
            `)\\s*[:\\-–]?`,
            'i'
        );

        for (const raw of lines) {
            const line = raw.trim();
            if (!line) continue;

            if (dayHeaderRegex.test(line)) {
                if (current) days.push(current);
                dayCount++;
                // Title = text after the day/date header marker
                const title = line.replace(dayHeaderRegex, '').trim();
                current = { dayTitle: title || `Day ${dayCount}`, description: '', activities: '' };
            } else if (current) {
                // First non-header line = description; subsequent lines = activities
                if (!current.description) {
                    current.description = line;
                } else {
                    current.activities += (current.activities ? '\n' : '') + line;
                }
            }
        }
        if (current) days.push(current);
        return days.length ? days : [{ dayTitle: '', description: text.trim(), activities: '' }];
    };

    const [customTrip, setCustomTrip] = useState({
        title: '', destination: '', duration: '', price: '',
        imageUrl: '', shortDescription: '', description: '',
        category: 'Custom', difficulty: 'Easy',
        highlights: [''], includes: [''], excludes: [''],
        clientName: '', clientPhone: '', clientEmail: '', clientDate: '', numPersons: '1', totalAmount: '',
    });
    const [customItinerary, setCustomItinerary] = useState([
        { dayTitle: '', description: '', activities: '' },
    ]);
    const [createdTripLink, setCreatedTripLink] = useState('');

    // Custom Trip Records (persisted in localStorage)
    const [customTripRecords, setCustomTripRecords] = useState<CustomTripRecord[]>([]);
    const [recordBookings, setRecordBookings] = useState<Record<number, { bookingReference?: string; paymentStatus?: string; customerEmail?: string; customerPhone?: string }[]>>({});
    const [loadingRecordBookings, setLoadingRecordBookings] = useState(false);

    // Itinerary editor for existing trips
    const [editingItinTripId, setEditingItinTripId] = useState<number | null>(null);
    const [editItinerary, setEditItinerary] = useState<{ id?: number; dayTitle: string; description: string; activities: string }[]>([{ dayTitle: '', description: '', activities: '' }]);
    const [savingItin, setSavingItin] = useState(false);

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

        // Load custom trip records from localStorage
        try {
            const stored = localStorage.getItem('ylootrips-custom-trip-records');
            if (stored) setCustomTripRecords(JSON.parse(stored));
        } catch { /* ignore */ }

        // Load only destinations on initial load for fast startup
        fetchTabData('destinations');
    }, [router]);

    // Load bookings for custom trip records when tab is active
    useEffect(() => {
        if (activeTab === 'custom-trips' && customTripRecords.length > 0) {
            fetchRecordBookings();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, customTripRecords.length]);

    // Track which tabs have been loaded
    const [loadedTabs, setLoadedTabs] = useState<Record<string, boolean>>({ destinations: false });
    const [tabLoading, setTabLoading] = useState<Record<string, boolean>>({});

    // Pagination
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

    // Fetch data for a specific tab
    const fetchTabData = async (tab: string, forceRefresh = false) => {
        if (loadedTabs[tab] && !forceRefresh) return;

        setTabLoading(prev => ({ ...prev, [tab]: true }));

        try {
            switch (tab) {
                case 'destinations':
                    const destRes = await api.admin.getDestinations();
                    setDestinations(Array.isArray(destRes.data) ? destRes.data : []);
                    break;
                case 'experiences':
                    const tripsRes = await api.admin.getTrips();
                    setTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
                    break;
                case 'stays':
                    const hotelsRes = await api.admin.getHotels();
                    setHotels(Array.isArray(hotelsRes.data) ? hotelsRes.data : []);
                    break;
                case 'journals':
                    const blogsRes = await api.admin.getBlogs();
                    setBlogs(Array.isArray(blogsRes.data) ? blogsRes.data : []);
                    break;
                case 'events':
                    const eventsRes = await api.admin.getEvents();
                    setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
                    break;
                case 'pages':
                    const pagesRes = await api.admin.getPages();
                    setPages(Array.isArray(pagesRes.data) ? pagesRes.data : []);
                    break;
                case 'stats':
                    const statsRes = await api.admin.getStats();
                    setStats(Array.isArray(statsRes.data) ? statsRes.data : []);
                    break;
                case 'testimonials':
                    const testsRes = await api.admin.getTestimonials();
                    setTestimonials(Array.isArray(testsRes.data) ? testsRes.data : []);
                    break;
                case 'bookings':
                    const [bookingsRes, eventBookingsRes] = await Promise.all([
                        api.admin.getBookings(),
                        api.admin.getEventBookings(),
                    ]);
                    setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : []);
                    setEventBookings(Array.isArray(eventBookingsRes.data) ? eventBookingsRes.data : []);
                    break;
                case 'inquiries':
                    const inquiriesRes = await api.admin.getInquiries();
                    setInquiries(Array.isArray(inquiriesRes.data) ? inquiriesRes.data : []);
                    break;
                case 'reviews': {
                    const tok = localStorage.getItem('adminToken') || '';
                    const rRes = await fetch(`/api/admin/reviews?status=all`, { headers: { Authorization: `Bearer ${tok}` } });
                    const rJson = await rRes.json();
                    setReviews(Array.isArray(rJson.reviews) ? rJson.reviews : []);
                    break;
                }
                case 'ads':
                    const adsRes = await api.admin.getAds();
                    setAds(Array.isArray(adsRes.data) ? adsRes.data : []);
                    break;
                case 'package-prices': {
                    const ppRes = await fetch('/api/admin/package-prices', { headers: { 'x-admin-token': 'admin' } });
                    const ppJson = await ppRes.json();
                    const prices = Array.isArray(ppJson.data) ? ppJson.data : [];
                    setPackagePrices(prices);
                    const edits: Record<string, { priceINR: string; originalPriceINR: string }> = {};
                    prices.forEach((p: Record<string, unknown>) => {
                        edits[p.slug as string] = {
                            priceINR: String(p.priceINR),
                            originalPriceINR: String(p.originalPriceINR),
                        };
                    });
                    setPriceEdits(edits);
                    break;
                }
            }
            setLoadedTabs(prev => ({ ...prev, [tab]: true }));
            setCurrentPage(prev => ({ ...prev, [tab]: 1 }));
        } catch (error) {
            setMessage({ type: 'error', text: `Failed to load ${tab} data` });
        }

        setTabLoading(prev => ({ ...prev, [tab]: false }));
        setLoading(false);
    };

    // Handle tab change - lazy load data
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        fetchTabData(tab);
    };

    // Pagination helper
    const getPaginatedData = <T,>(data: T[], tab: string): T[] => {
        const page = currentPage[tab] || 1;
        const start = (page - 1) * ITEMS_PER_PAGE;
        return data.slice(start, start + ITEMS_PER_PAGE);
    };

    const getTotalPages = (dataLength: number): number => {
        return Math.ceil(dataLength / ITEMS_PER_PAGE);
    };

    // Refresh current tab
    const refreshCurrentTab = () => {
        fetchTabData(activeTab, true);
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
                await api.admin.updateDestinationDetails(dest.id as number, details).catch(() => { });
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
            }).catch(() => { });
        }
    };

    const handleSaveTrip = async (trip: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateTrip(trip.id as number, trip);
            await fetchTabData('experiences', true);
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
            }).catch(() => {
                // silently handle - trip might not have itineraries yet
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
            refreshCurrentTab();
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
            refreshCurrentTab();
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
            await fetchTabData('testimonials', true);
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
            refreshCurrentTab();
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
            refreshCurrentTab();
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
            refreshCurrentTab();
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
                userImage: '',
                photoGallery: '[]',
                comment: '',
                isFeatured: false,
                displayOrder: 0,
            };
            await api.admin.createTestimonial(newTest);
            setMessage({ type: 'success', text: 'Testimonial created!' });
            refreshCurrentTab();
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
            refreshCurrentTab();
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
            refreshCurrentTab();
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
            refreshCurrentTab();
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
            refreshCurrentTab();
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
            refreshCurrentTab();
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
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete blog' });
        }
        setSaving(false);
    };

    const handleAdminImageUpload = async () => {
        if (!uploadFile) {
            setMessage({ type: 'error', text: 'Please choose an image file first.' });
            return;
        }
        setUploadingImage(true);
        try {
            const res = await api.admin.uploadImage(uploadFile, uploadFolder || 'admin');
            const url = res.data?.url || '';
            setUploadedImageUrl(url);
            setMessage({ type: 'success', text: 'Image uploaded successfully. Copy URL and paste in any image field.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err?.response?.data?.error || 'Image upload failed' });
        }
        setUploadingImage(false);
    };

    const parseStringArrayField = (value: unknown): string[] => {
        if (Array.isArray(value)) {
            return value
                .map((item) => String(item).trim())
                .filter(Boolean);
        }
        if (typeof value !== 'string') return [];
        const trimmed = value.trim();
        if (!trimmed) return [];
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed
                    .map((item) => String(item).trim())
                    .filter(Boolean);
            }
            return [];
        } catch {
            return trimmed
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
    };

    const serializeStringArrayField = (items: string[]): string =>
        JSON.stringify(items.map((item) => item.trim()).filter(Boolean));

    const handleUploadTestimonialImages = async (testimonialId: number, files: FileList | null) => {
        if (!files || files.length === 0) return;
        setSaving(true);
        try {
            const uploadResults = await Promise.all(
                Array.from(files).map((file) => api.admin.uploadImage(file, 'testimonials'))
            );
            const newUrls = uploadResults
                .map((res) => (typeof res.data?.url === 'string' ? res.data.url.trim() : ''))
                .filter(Boolean);

            setTestimonials((prev) =>
                prev.map((testimonial) => {
                    if ((testimonial.id as number) !== testimonialId) return testimonial;
                    const existingUrls = parseStringArrayField(testimonial.photoGallery);
                    const merged = Array.from(new Set([...existingUrls, ...newUrls]));
                    const currentUserImage =
                        typeof testimonial.userImage === 'string' ? testimonial.userImage.trim() : '';

                    return {
                        ...testimonial,
                        photoGallery: serializeStringArrayField(merged),
                        userImage: currentUserImage || merged[0] || '',
                    };
                })
            );
            setMessage({ type: 'success', text: `${newUrls.length} image(s) uploaded for testimonial.` });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err: unknown) {
            const errorText =
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
                    ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
                    : 'Failed to upload testimonial images';
            setMessage({ type: 'error', text: errorText || 'Failed to upload testimonial images' });
        } finally {
            setSaving(false);
        }
    };

    const parseListField = (value: unknown): string => {
        if (Array.isArray(value)) return value.join('\n');
        if (typeof value !== 'string') return '';
        const trimmed = value.trim();
        if (!trimmed) return '';
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed.join('\n');
            return trimmed;
        } catch {
            return trimmed;
        }
    };

    const toJsonListString = (value: string): string => {
        const items = value
            .split('\n')
            .map((x) => x.trim())
            .filter(Boolean);
        return JSON.stringify(items);
    };

    const handleSaveEvent = async (event: Record<string, unknown>) => {
        setSaving(true);
        try {
            await api.admin.updateEvent(event.id as number, event);
            setMessage({ type: 'success', text: 'Event updated!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to update event' });
        }
        setSaving(false);
    };

    const handleCreateEvent = async () => {
        setSaving(true);
        try {
            const today = new Date().toISOString().split('T')[0];
            const newEvent = {
                title: 'New Event',
                slug: `new-event-${Date.now()}`,
                description: '',
                shortDescription: '',
                longDescription: '',
                imageUrl: '',
                venueName: '',
                venueAddress: '',
                city: '',
                eventDate: today,
                eventTime: '18:00',
                price: 0,
                originalPrice: 0,
                category: '',
                capacity: 100,
                isFeatured: false,
                status: 'ACTIVE',
                highlights: '[]',
                faq: '[]',
                galleryUrls: '[]',
                includes: '[]',
                ageRestriction: '',
                importantInfo: '',
                duration: '',
                languages: '',
                bannerHighlights: '',
                aboutTagline: '',
                ticketTypes: [],
            };
            await api.admin.createEvent(newEvent);
            setMessage({ type: 'success', text: 'Event created!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to create event' });
        }
        setSaving(false);
    };

    const handleDeleteEvent = async (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        setSaving(true);
        try {
            await api.admin.deleteEvent(id);
            setMessage({ type: 'success', text: 'Event deleted!' });
            refreshCurrentTab();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch {
            setMessage({ type: 'error', text: 'Failed to delete event' });
        }
        setSaving(false);
    };

    const saveCustomTripRecord = (record: CustomTripRecord) => {
        setCustomTripRecords(prev => {
            const updated = [record, ...prev];
            try { localStorage.setItem('ylootrips-custom-trip-records', JSON.stringify(updated)); } catch { /* ignore */ }
            return updated;
        });
    };

    const fetchRecordBookings = async () => {
        if (customTripRecords.length === 0) return;
        setLoadingRecordBookings(true);
        try {
            const token = localStorage.getItem('adminToken') || '';
            const allBookingsRes = await fetch('/api/admin/trip-bookings', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!allBookingsRes.ok) return;
            const allBookings: Record<string, unknown>[] = await allBookingsRes.json();
            const byTrip: typeof recordBookings = {};
            for (const b of allBookings) {
                const tid = (b.trip as Record<string, unknown>)?.id as number;
                if (tid) {
                    if (!byTrip[tid]) byTrip[tid] = [];
                    byTrip[tid].push({
                        bookingReference: b.bookingReference as string,
                        paymentStatus: b.paymentStatus as string,
                        customerEmail: b.customerEmail as string,
                        customerPhone: b.customerPhone as string,
                    });
                }
            }
            setRecordBookings(byTrip);
        } catch { /* non-fatal */ }
        setLoadingRecordBookings(false);
    };

    const openItineraryEditor = async (tripId: number) => {
        if (editingItinTripId === tripId) {
            setEditingItinTripId(null);
            return;
        }
        setEditingItinTripId(tripId);
        try {
            const token = localStorage.getItem('adminToken') || '';
            const res = await api.admin.getTripItineraries(tripId);
            const days = Array.isArray(res.data) ? res.data : [];
            if (days.length > 0) {
                setEditItinerary(days.map((d: Record<string, unknown>) => ({
                    id: d.id as number | undefined,
                    dayTitle: (d.dayTitle as string) || '',
                    description: (d.description as string) || '',
                    activities: Array.isArray(d.activities) ? (d.activities as string[]).join('\n') : (d.activities as string) || '',
                })));
            } else {
                setEditItinerary([{ dayTitle: '', description: '', activities: '' }]);
            }
            void token; // used implicitly via api client
        } catch {
            setEditItinerary([{ dayTitle: '', description: '', activities: '' }]);
        }
    };

    const saveItineraryForTrip = async (tripId: number) => {
        setSavingItin(true);
        try {
            const token = localStorage.getItem('adminToken') || '';
            // Delete existing days then re-create
            const existingRes = await api.admin.getTripItineraries(tripId);
            const existing = Array.isArray(existingRes.data) ? existingRes.data : [];
            for (const d of existing) {
                await api.admin.deleteTripItinerary((d as Record<string, unknown>).id as number).catch(() => {});
            }
            // Save new days
            for (let i = 0; i < editItinerary.length; i++) {
                const day = editItinerary[i];
                if (!day.dayTitle.trim()) continue;
                await api.admin.createTripItinerary(tripId, {
                    dayNumber: i + 1,
                    dayTitle: day.dayTitle.trim(),
                    description: day.description.trim(),
                    activities: day.activities.split('\n').map(a => a.trim()).filter(Boolean),
                    accommodation: '',
                    meals: '',
                    imageUrl: '',
                });
            }
            void token;
            setMessage({ type: 'success', text: 'Itinerary saved! Client will now see it on checkout.' });
            setEditingItinTripId(null);
        } catch {
            setMessage({ type: 'error', text: 'Failed to save itinerary. Please try again.' });
        } finally {
            setSavingItin(false);
        }
    };

    const handleCreateCustomTrip = async () => {
        if (!customTrip.title || !customTrip.destination || !customTrip.price || !customTrip.duration) {
            setMessage({ type: 'error', text: 'Title, destination, price, and duration are required.' });
            return;
        }
        setSaving(true);
        setCreatedTripLink('');
        try {
            const tripPayload = {
                title: customTrip.title,
                destination: customTrip.destination,
                duration: customTrip.duration,
                price: parseFloat(customTrip.price),
                originalPrice: parseFloat(customTrip.price),
                imageUrl: customTrip.imageUrl || '',
                shortDescription: customTrip.shortDescription || customTrip.title,
                description: customTrip.description || customTrip.title,
                category: customTrip.category || 'Custom',
                difficulty: customTrip.difficulty || 'Easy',
                rating: 5.0,
                reviewCount: 0,
                maxGroupSize: 20,
                isFeatured: false,
                isPopular: false,
                isTrending: false,
            };
            const tripRes = await api.admin.createTrip(tripPayload);
            const tripId = tripRes.data?.id;
            if (!tripId) throw new Error('No trip ID returned');

            // Create itinerary days
            for (let i = 0; i < customItinerary.length; i++) {
                const day = customItinerary[i];
                if (!day.dayTitle) continue;
                await api.admin.createTripItinerary(tripId, {
                    dayNumber: i + 1,
                    dayTitle: day.dayTitle,
                    description: day.description,
                    activities: day.activities ? day.activities.split('\n').filter(Boolean) : [],
                    accommodation: '',
                    meals: '',
                    imageUrl: '',
                });
            }

            const numPersons = parseInt(customTrip.numPersons) || 1;
            const totalAmt = customTrip.totalAmount ? parseFloat(customTrip.totalAmount) : null;
            const computedTotal = totalAmt || (parseFloat(customTrip.price) * numPersons);
            const perPersonForUrl = totalAmt ? Math.ceil(totalAmt / numPersons) : parseFloat(customTrip.price);
            const qs = new URLSearchParams({
                tripId: String(tripId),
                guests: String(numPersons),
                price: String(perPersonForUrl),
                ...(customTrip.clientName ? { name: customTrip.clientName } : {}),
                ...(customTrip.clientPhone ? { phone: customTrip.clientPhone } : {}),
                ...(customTrip.clientEmail ? { email: customTrip.clientEmail } : {}),
                ...(customTrip.clientDate ? { date: customTrip.clientDate } : {}),
            });
            const link = `${window.location.origin}/checkout?${qs.toString()}`;
            setCreatedTripLink(link);

            // Save record for tracking
            saveCustomTripRecord({
                tripId,
                title: customTrip.title,
                clientName: customTrip.clientName || '—',
                destination: customTrip.destination,
                numPersons,
                totalAmount: computedTotal,
                link,
                createdAt: new Date().toISOString(),
            });

            setMessage({ type: 'success', text: `Trip created! Share the link with your client.` });
        } catch (err: any) {
            setMessage({ type: 'error', text: err?.response?.data?.error || err?.message || 'Failed to create trip' });
        }
        setSaving(false);
    };

    const sidebarItems = [
        { id: 'collect-payment', icon: CreditCard, label: 'Collect Payment' },
        { id: 'vouchers', icon: Gift, label: 'Gift Vouchers' },
        { id: 'package-prices', icon: Tag, label: 'Package Prices' },
        { id: 'custom-trips', icon: Zap, label: 'Custom Trip Link' },
        { id: 'destinations', icon: MapPin, label: 'Destinations' },
        { id: 'experiences', icon: Compass, label: 'Experiences' },
        { id: 'stays', icon: Building, label: 'Stays' },
        { id: 'journals', icon: BookOpen, label: 'Journals' },
        { id: 'events', icon: Calendar, label: 'Events' },
        { id: 'pages', icon: FileText, label: 'Page Content' },
        { id: 'stats', icon: LayoutDashboard, label: 'Statistics' },
        { id: 'testimonials', icon: MessageSquare, label: 'Testimonials' },
        { id: 'bookings', icon: ShoppingBag, label: 'Bookings', href: '/admin/bookings' },
        { id: 'reviews', icon: Star, label: 'Client Reviews' },
        { id: 'health', icon: Activity, label: 'Website Health', href: '/admin/health' },
        { id: 'inquiries', icon: Mail, label: 'Inquiries' },
        { id: 'ads', icon: Megaphone, label: 'Ads' },
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
            <aside className="w-64 bg-primary text-cream fixed h-full flex flex-col">
                <div className="p-6 border-b border-white/10 shrink-0">
                    <Link href="/" className="font-display text-2xl">YlooTrips</Link>
                    <p className="text-caption text-cream/50 mt-1">Admin Panel</p>
                </div>

                <nav className="p-4 flex-1 overflow-y-auto">
                    {sidebarItems.map((item) => (
                        (item as { href?: string }).href ? (
                            <Link
                                key={item.id}
                                href={(item as { href: string }).href}
                                className={`w-full flex items-center gap-3 px-4 py-3 mb-1 transition-colors text-cream/60 hover:bg-white/5 hover:text-cream`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                                <ChevronRight className="w-4 h-4 ml-auto" />
                            </Link>
                        ) : (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 mb-1 transition-colors ${activeTab === item.id
                                    ? 'bg-accent text-primary'
                                    : 'text-cream/60 hover:bg-white/5 hover:text-cream'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                                {tabLoading[item.id] && <RefreshCw className="w-4 h-4 ml-auto animate-spin" />}
                                {activeTab === item.id && !tabLoading[item.id] && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </button>
                        )
                    ))}
                </nav>

                <div className="shrink-0 p-4 border-t border-white/10">
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
                        onClick={refreshCurrentTab}
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

                {/* Global Image Upload Tool */}
                <div className="mb-6 p-4 border border-primary/10 bg-cream-light">
                    <div className="flex items-center gap-2 mb-3">
                        <Upload className="w-4 h-4 text-secondary" />
                        <h3 className="text-sm font-medium text-primary">Upload Image to Cloud Bucket</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                            className="px-3 py-2 border border-primary/20 bg-cream"
                        />
                        <input
                            type="text"
                            value={uploadFolder}
                            onChange={(e) => setUploadFolder(e.target.value)}
                            placeholder="Folder (e.g. trips, events, testimonials)"
                            className="px-3 py-2 border border-primary/20 bg-cream"
                        />
                        <button
                            onClick={handleAdminImageUpload}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark disabled:opacity-50"
                        >
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                        </button>
                        <button
                            onClick={async () => {
                                if (!uploadedImageUrl) return;
                                await navigator.clipboard.writeText(uploadedImageUrl);
                                setMessage({ type: 'success', text: 'Image URL copied to clipboard.' });
                            }}
                            disabled={!uploadedImageUrl}
                            className="px-4 py-2 bg-primary text-cream hover:bg-primary-light disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            <span>Copy URL</span>
                        </button>
                    </div>
                    {uploadedImageUrl && (
                        <div className="mt-3 p-3 border border-primary/10 bg-cream">
                            <div className="flex items-center gap-2 text-xs text-primary/70 mb-2">
                                <Link2 className="w-3 h-3" />
                                Uploaded URL
                            </div>
                            <div className="text-xs break-all text-primary">{uploadedImageUrl}</div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="bg-cream p-6 shadow-sm">

                    {/* ── CUSTOM TRIP LINK TAB ── */}
                    {activeTab === 'custom-trips' && (
                        <div className="space-y-8">

                        {/* ── RECORDS TABLE ── */}
                        {customTripRecords.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-display text-xl text-primary">All Custom Trip Links</h2>
                                    <button onClick={fetchRecordBookings} disabled={loadingRecordBookings}
                                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-cream border border-primary/20 hover:bg-white text-primary">
                                        <RefreshCw className={`w-3 h-3 ${loadingRecordBookings ? 'animate-spin' : ''}`} /> Refresh Bookings
                                    </button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm border-collapse">
                                        <thead>
                                            <tr className="bg-primary text-cream text-xs uppercase tracking-wider">
                                                <th className="px-3 py-2 text-left">Client</th>
                                                <th className="px-3 py-2 text-left">Trip</th>
                                                <th className="px-3 py-2 text-left">Dest.</th>
                                                <th className="px-3 py-2 text-right">Persons</th>
                                                <th className="px-3 py-2 text-right">Total (₹)</th>
                                                <th className="px-3 py-2 text-left">Booking Ref</th>
                                                <th className="px-3 py-2 text-center">Status</th>
                                                <th className="px-3 py-2 text-left">Created</th>
                                                <th className="px-3 py-2 text-left">Link</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {customTripRecords.map((rec, i) => {
                                                const bkgs = recordBookings[rec.tripId] || [];
                                                const latestBkg = bkgs[0];
                                                const isPaid = bkgs.some(b => b.paymentStatus === 'SUCCESS' || b.paymentStatus === 'PAID' || b.paymentStatus === 'paid');
                                                const isPending = bkgs.some(b => b.paymentStatus === 'PENDING' || b.paymentStatus === 'pending');
                                                return (
                                                    <tr key={i} className={`border-b border-primary/10 ${i % 2 === 0 ? 'bg-white' : 'bg-cream-light'} hover:bg-accent/10 transition-colors`}>
                                                        <td className="px-3 py-2.5 font-medium text-primary">{rec.clientName}</td>
                                                        <td className="px-3 py-2.5 text-primary/80 max-w-[160px] truncate" title={rec.title}>{rec.title}</td>
                                                        <td className="px-3 py-2.5 text-primary/60">{rec.destination}</td>
                                                        <td className="px-3 py-2.5 text-right text-primary/70">{rec.numPersons}</td>
                                                        <td className="px-3 py-2.5 text-right font-semibold text-primary">{rec.totalAmount.toLocaleString('en-IN')}</td>
                                                        <td className="px-3 py-2.5">
                                                            {latestBkg?.bookingReference ? (
                                                                <span className="font-mono text-xs text-primary bg-primary/5 px-1.5 py-0.5">{latestBkg.bookingReference}</span>
                                                            ) : (
                                                                <span className="text-primary/30 text-xs">Not yet booked</span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-center">
                                                            {bkgs.length === 0 ? (
                                                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500">Link Sent</span>
                                                            ) : isPaid ? (
                                                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 font-semibold">✓ Paid</span>
                                                            ) : isPending ? (
                                                                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700">Pending</span>
                                                            ) : (
                                                                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600">{latestBkg?.paymentStatus || 'Failed'}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2.5 text-primary/40 text-xs whitespace-nowrap">
                                                            {new Date(rec.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                                        </td>
                                                        <td className="px-3 py-2.5">
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => openItineraryEditor(rec.tripId)}
                                                                    className={`p-1 rounded ${editingItinTripId === rec.tripId ? 'bg-amber-100' : 'hover:bg-amber-50'}`}
                                                                    title="Edit Itinerary">
                                                                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                                                                </button>
                                                                <button onClick={() => { navigator.clipboard.writeText(rec.link); setMessage({ type: 'success', text: 'Link copied!' }); }}
                                                                    className="p-1 hover:bg-primary/10 rounded" title="Copy link">
                                                                    <Copy className="w-3.5 h-3.5 text-primary/60" />
                                                                </button>
                                                                <a href={rec.link} target="_blank" rel="noopener noreferrer"
                                                                    className="p-1 hover:bg-primary/10 rounded" title="Open link">
                                                                    <ExternalLink className="w-3.5 h-3.5 text-secondary" />
                                                                </a>
                                                                <button onClick={() => {
                                                                    if (!confirm('Remove this record? (The trip in backend is not deleted)')) return;
                                                                    setCustomTripRecords(prev => {
                                                                        const updated = prev.filter((_, idx) => idx !== i);
                                                                        try { localStorage.setItem('ylootrips-custom-trip-records', JSON.stringify(updated)); } catch { /* ignore */ }
                                                                        return updated;
                                                                    });
                                                                }} className="p-1 hover:bg-red-50 rounded" title="Remove record">
                                                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-xs text-primary/40 mt-2">Records stored locally on this browser. Booking status fetched live from backend.</p>
                            </div>
                        )}

                        {/* ── INLINE ITINERARY EDITOR ── */}
                        {editingItinTripId !== null && (
                            <div className="border border-amber-300 bg-amber-50 p-5 rounded-xl space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-primary">Edit Itinerary — {customTripRecords.find(r => r.tripId === editingItinTripId)?.title}</h3>
                                        <p className="text-xs text-primary/50 mt-0.5">This itinerary will show on the client's checkout page.</p>
                                    </div>
                                    <button onClick={() => setEditingItinTripId(null)} className="p-1 hover:bg-amber-100 rounded">
                                        <X className="w-4 h-4 text-primary/40" />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {editItinerary.map((day, idx) => (
                                        <div key={idx} className="bg-white border border-amber-200 p-4 rounded-lg relative space-y-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Day {idx + 1}</span>
                                                {editItinerary.length > 1 && (
                                                    <button onClick={() => setEditItinerary(p => p.filter((_, i) => i !== idx))}
                                                        className="text-red-400 hover:text-red-600">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                value={day.dayTitle}
                                                onChange={e => setEditItinerary(p => p.map((d, i) => i === idx ? { ...d, dayTitle: e.target.value } : d))}
                                                placeholder="Day title (e.g. Arrive in Manali · Explore Mall Road)"
                                                className="w-full px-3 py-2 border border-primary/20 bg-cream-light text-sm rounded"
                                            />
                                            <textarea rows={2}
                                                value={day.description}
                                                onChange={e => setEditItinerary(p => p.map((d, i) => i === idx ? { ...d, description: e.target.value } : d))}
                                                placeholder="Brief description of the day..."
                                                className="w-full px-3 py-2 border border-primary/20 bg-cream-light text-sm rounded resize-none"
                                            />
                                            <textarea rows={3}
                                                value={day.activities}
                                                onChange={e => setEditItinerary(p => p.map((d, i) => i === idx ? { ...d, activities: e.target.value } : d))}
                                                placeholder={"Activities — one per line\nHadimba Temple visit\nMall Road stroll\nRohtang Pass excursion"}
                                                className="w-full px-3 py-2 border border-primary/20 bg-cream-light text-xs rounded resize-none font-mono"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setEditItinerary(p => [...p, { dayTitle: '', description: '', activities: '' }])}
                                        className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-800 font-semibold border border-amber-300 px-3 py-1.5 rounded"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Day
                                    </button>
                                    <button
                                        onClick={() => saveItineraryForTrip(editingItinTripId)}
                                        disabled={savingItin}
                                        className="flex items-center gap-2 px-5 py-2 bg-primary text-cream text-sm font-semibold rounded hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        {savingItin ? 'Saving...' : 'Save Itinerary'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── CREATE FORM ── */}
                        <div className="space-y-8 max-w-3xl">
                            <div>
                                <h2 className="font-display text-2xl text-primary mb-1">Create a Custom Trip Link</h2>
                                <p className="text-sm text-primary/55">Fill in the trip details, add an itinerary, and get a shareable booking link with full payment gateway, promo codes, and trust badges built in.</p>
                            </div>

                            {/* Created link banner */}
                            {createdTripLink && (
                                <div className="p-5 bg-green-50 border border-green-200 rounded-xl flex flex-col gap-3">
                                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                                        <CheckCircle className="w-5 h-5" /> Trip created! Share this link with your client:
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-white border border-green-200 px-3 py-2 text-sm break-all rounded">{createdTripLink}</code>
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(createdTripLink); setMessage({ type: 'success', text: 'Link copied!' }); }}
                                            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center gap-1 shrink-0"
                                        >
                                            <Copy className="w-4 h-4" /> Copy
                                        </button>
                                        <a href={createdTripLink} target="_blank" rel="noopener noreferrer"
                                            className="px-3 py-2 bg-primary text-cream rounded hover:bg-primary/80 text-sm flex items-center gap-1 shrink-0">
                                            <ExternalLink className="w-4 h-4" /> Open
                                        </a>
                                    </div>
                                    {customTrip.clientName && (
                                        <p className="text-xs text-green-700 font-medium">
                                            Client: {customTrip.clientName}
                                            {customTrip.clientPhone ? ` · ${customTrip.clientPhone}` : ''}
                                            {customTrip.clientEmail ? ` · ${customTrip.clientEmail}` : ''}
                                            {' · '}{customTrip.numPersons} person{parseInt(customTrip.numPersons) > 1 ? 's' : ''} · ₹{(customTrip.totalAmount ? parseFloat(customTrip.totalAmount) : parseFloat(customTrip.price || '0') * parseInt(customTrip.numPersons || '1')).toLocaleString('en-IN')} total
                                        </p>
                                    )}
                                    <p className="text-xs text-green-600">{'Link opens directly to checkout with guests & price pre-filled → promo codes, EMI, UPI discount, trust badges, and Easebuzz PG.'}</p>
                                </div>
                            )}

                            {/* ── CLIENT INFO ── */}
                            <div className="border-2 border-secondary/30 p-6 space-y-4 bg-accent/10">
                                <h3 className="font-semibold text-primary text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-secondary" /> Client Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Client Name</label>
                                        <input
                                            value={customTrip.clientName}
                                            onChange={e => setCustomTrip(p => ({ ...p, clientName: e.target.value }))}
                                            placeholder="e.g. Rahul Sharma"
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Client Phone</label>
                                        <input
                                            type="tel"
                                            value={customTrip.clientPhone}
                                            onChange={e => setCustomTrip(p => ({ ...p, clientPhone: e.target.value }))}
                                            placeholder="e.g. 9876543210"
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Client Email</label>
                                        <input
                                            type="email"
                                            value={customTrip.clientEmail}
                                            onChange={e => setCustomTrip(p => ({ ...p, clientEmail: e.target.value }))}
                                            placeholder="e.g. rahul@gmail.com"
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Travel Date</label>
                                        <input
                                            type="date"
                                            value={customTrip.clientDate}
                                            onChange={e => setCustomTrip(p => ({ ...p, clientDate: e.target.value }))}
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Number of Persons</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={customTrip.numPersons}
                                            onChange={e => {
                                                const n = e.target.value;
                                                setCustomTrip(p => {
                                                    const total = p.totalAmount ? p.totalAmount : p.price && n ? String(parseFloat(p.price) * parseInt(n)) : '';
                                                    return { ...p, numPersons: n, totalAmount: total };
                                                });
                                            }}
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">
                                            Total Amount (₹)
                                            <span className="ml-1 text-primary/40 normal-case font-normal">auto = price × persons</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={customTrip.totalAmount}
                                            onChange={e => setCustomTrip(p => ({ ...p, totalAmount: e.target.value }))}
                                            placeholder={customTrip.price && customTrip.numPersons ? String(parseFloat(customTrip.price || '0') * parseInt(customTrip.numPersons || '1')) : 'e.g. 90000'}
                                            className="w-full px-3 py-2 border border-secondary/40 bg-cream text-sm font-semibold"
                                        />
                                        {customTrip.price && customTrip.numPersons && !customTrip.totalAmount && (
                                            <p className="text-xs text-secondary mt-1">
                                                Auto: ₹{(parseFloat(customTrip.price || '0') * parseInt(customTrip.numPersons || '1')).toLocaleString('en-IN')}
                                            </p>
                                        )}
                                        {customTrip.totalAmount && (
                                            <p className="text-xs text-secondary mt-1">
                                                ₹{parseFloat(customTrip.totalAmount).toLocaleString('en-IN')} total · ₹{Math.ceil(parseFloat(customTrip.totalAmount) / (parseInt(customTrip.numPersons) || 1)).toLocaleString('en-IN')} per person
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── TRIP DETAILS ── */}
                            <div className="border border-primary/10 p-6 space-y-4 bg-cream-light">
                                <h3 className="font-semibold text-primary text-lg">Trip Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Trip Title *</label>
                                        <input
                                            value={customTrip.title}
                                            onChange={e => {
                                                const title = e.target.value;
                                                setCustomTrip(p => {
                                                    const autoImg = !p.imageUrl ? getDestinationImageUrl(undefined, title) : p.imageUrl;
                                                    return { ...p, title, imageUrl: autoImg };
                                                });
                                            }}
                                            placeholder="e.g. Exclusive Rajasthan Heritage Tour"
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Destination *</label>
                                        <input
                                            value={customTrip.destination}
                                            onChange={e => {
                                                const destination = e.target.value;
                                                setCustomTrip(p => {
                                                    const autoImg = getDestinationImageUrl(undefined, destination);
                                                    return { ...p, destination, imageUrl: autoImg };
                                                });
                                            }}
                                            placeholder="e.g. Rajasthan, India"
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Duration *</label>
                                        <input
                                            value={customTrip.duration}
                                            onChange={e => setCustomTrip(p => ({ ...p, duration: e.target.value }))}
                                            placeholder="e.g. 7 Days / 6 Nights"
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Price per person (₹) *</label>
                                        <input
                                            type="number"
                                            value={customTrip.price}
                                            onChange={e => setCustomTrip(p => ({ ...p, price: e.target.value }))}
                                            placeholder="e.g. 45000"
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Category</label>
                                        <input
                                            value={customTrip.category}
                                            onChange={e => setCustomTrip(p => ({ ...p, category: e.target.value }))}
                                            placeholder="e.g. Heritage, Adventure, Honeymoon"
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Difficulty</label>
                                        <select
                                            value={customTrip.difficulty}
                                            onChange={e => setCustomTrip(p => ({ ...p, difficulty: e.target.value }))}
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        >
                                            <option>Easy</option>
                                            <option>Moderate</option>
                                            <option>Challenging</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">
                                        Cover Image URL
                                        <span className="ml-1 text-secondary font-normal normal-case">— auto-filled from destination</span>
                                    </label>
                                    <div className="flex gap-3 items-start">
                                        <input
                                            value={customTrip.imageUrl}
                                            onChange={e => setCustomTrip(p => ({ ...p, imageUrl: e.target.value }))}
                                            placeholder="Auto-loaded from destination, or paste custom URL"
                                            className="flex-1 px-3 py-2 border border-primary/20 bg-cream text-sm"
                                        />
                                        {customTrip.imageUrl && (
                                            <img src={customTrip.imageUrl} alt="preview" className="w-20 h-12 object-cover border border-primary/20 shrink-0 rounded" />
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Short Description (shown on cards)</label>
                                    <input
                                        value={customTrip.shortDescription}
                                        onChange={e => setCustomTrip(p => ({ ...p, shortDescription: e.target.value }))}
                                        placeholder="One-line summary for the client"
                                        className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-primary/60 uppercase tracking-wider mb-1 block">Full Description</label>
                                    <textarea
                                        rows={4}
                                        value={customTrip.description}
                                        onChange={e => setCustomTrip(p => ({ ...p, description: e.target.value }))}
                                        placeholder="Detailed description of the trip experience..."
                                        className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm resize-none"
                                    />
                                </div>
                            </div>

                            {/* ── HIGHLIGHTS / INCLUDES / EXCLUDES ── */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {(['highlights', 'includes', 'excludes'] as const).map((field) => (
                                    <div key={field} className="border border-primary/10 p-4 bg-cream-light">
                                        <h4 className="font-medium text-primary text-sm capitalize mb-3">{field}</h4>
                                        {customTrip[field].map((item, idx) => (
                                            <div key={idx} className="flex gap-2 mb-2">
                                                <input
                                                    value={item}
                                                    onChange={e => setCustomTrip(p => {
                                                        const arr = [...p[field]];
                                                        arr[idx] = e.target.value;
                                                        return { ...p, [field]: arr };
                                                    })}
                                                    placeholder={`Add ${field.slice(0, -1)}...`}
                                                    className="flex-1 px-2 py-1.5 border border-primary/20 bg-cream text-xs"
                                                />
                                                <button
                                                    onClick={() => setCustomTrip(p => {
                                                        const arr = p[field].filter((_, i) => i !== idx);
                                                        return { ...p, [field]: arr.length ? arr : [''] };
                                                    })}
                                                    className="text-red-400 hover:text-red-600 px-1"
                                                ><X className="w-3 h-3" /></button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setCustomTrip(p => ({ ...p, [field]: [...p[field], ''] }))}
                                            className="text-xs text-secondary hover:text-secondary/70 flex items-center gap-1 mt-1"
                                        ><Plus className="w-3 h-3" /> Add</button>
                                    </div>
                                ))}
                            </div>

                            {/* ── ITINERARY BUILDER ── */}
                            <div className="border border-primary/10 p-6 bg-cream-light space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <h3 className="font-semibold text-primary text-lg">Day-by-Day Itinerary</h3>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setItineraryMode('builder')}
                                            className={`text-xs px-3 py-1.5 border ${itineraryMode === 'builder' ? 'bg-primary text-cream border-primary' : 'bg-cream text-primary border-primary/20 hover:bg-cream-dark'}`}
                                        >Builder</button>
                                        <button
                                            onClick={() => setItineraryMode('paste')}
                                            className={`text-xs px-3 py-1.5 border ${itineraryMode === 'paste' ? 'bg-primary text-cream border-primary' : 'bg-cream text-primary border-primary/20 hover:bg-cream-dark'}`}
                                        >Paste / PDF Text</button>
                                        {itineraryMode === 'builder' && (
                                            <button
                                                onClick={() => setCustomItinerary(p => [...p, { dayTitle: '', description: '', activities: '' }])}
                                                className="flex items-center gap-1 text-xs px-3 py-1.5 bg-secondary text-cream hover:bg-secondary/80"
                                            ><Plus className="w-3 h-3" /> Add Day</button>
                                        )}
                                    </div>
                                </div>

                                {/* PASTE MODE */}
                                {itineraryMode === 'paste' && (
                                    <div className="space-y-3">
                                        <p className="text-xs text-primary/50">Paste your itinerary text below (from PDF, Word doc, email, etc.). Each line starting with <strong>Day 1</strong>, <strong>Day 2</strong> etc. becomes a separate day card.</p>
                                        <textarea
                                            rows={12}
                                            value={itineraryPasteText}
                                            onChange={e => setItineraryPasteText(e.target.value)}
                                            placeholder={`Day 1: Arrive in Jaipur\nCheck in to hotel. Evening at leisure.\nHawa Mahal visit\nCity Palace tour\n\nDay 2: Amber Fort & Local Markets\nFull day heritage tour.\nAmber Fort elephant ride\nJohri Bazaar shopping\n\nDay 3: Departure\nBreakfast and transfer to airport.`}
                                            className="w-full px-3 py-2 border border-primary/20 bg-cream text-sm font-mono resize-none"
                                        />
                                        <button
                                            onClick={() => {
                                                const parsed = parseItineraryText(itineraryPasteText);
                                                setCustomItinerary(parsed);
                                                setItineraryMode('builder');
                                                setMessage({ type: 'success', text: `Parsed ${parsed.length} day${parsed.length !== 1 ? 's' : ''} from your text. Review and edit below.` });
                                                setTimeout(() => setMessage({ type: '', text: '' }), 4000);
                                            }}
                                            disabled={!itineraryPasteText.trim()}
                                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary/80 disabled:opacity-40 text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Parse into Days
                                        </button>
                                    </div>
                                )}

                                {/* BUILDER MODE */}
                                {itineraryMode === 'builder' && customItinerary.map((day, idx) => (
                                    <div key={idx} className="border border-primary/10 p-4 bg-cream relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-xs font-semibold text-secondary uppercase tracking-widest">Day {idx + 1}</span>
                                            {customItinerary.length > 1 && (
                                                <button
                                                    onClick={() => setCustomItinerary(p => p.filter((_, i) => i !== idx))}
                                                    className="text-red-400 hover:text-red-600"
                                                ><Trash2 className="w-3.5 h-3.5" /></button>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <input
                                                value={day.dayTitle}
                                                onChange={e => setCustomItinerary(p => p.map((d, i) => i === idx ? { ...d, dayTitle: e.target.value } : d))}
                                                placeholder="Day title (e.g. Arrive in Jaipur · Pink City tour)"
                                                className="w-full px-3 py-2 border border-primary/20 bg-cream-light text-sm"
                                            />
                                            <textarea
                                                rows={2}
                                                value={day.description}
                                                onChange={e => setCustomItinerary(p => p.map((d, i) => i === idx ? { ...d, description: e.target.value } : d))}
                                                placeholder="Brief description of the day..."
                                                className="w-full px-3 py-2 border border-primary/20 bg-cream-light text-sm resize-none"
                                            />
                                            <textarea
                                                rows={2}
                                                value={day.activities}
                                                onChange={e => setCustomItinerary(p => p.map((d, i) => i === idx ? { ...d, activities: e.target.value } : d))}
                                                placeholder="Activities — one per line (e.g. Amber Fort visit&#10;City Palace tour)"
                                                className="w-full px-3 py-2 border border-primary/20 bg-cream-light text-xs resize-none font-mono"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ── CREATE BUTTON ── */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleCreateCustomTrip}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-8 py-3 bg-secondary text-cream hover:bg-secondary/80 disabled:opacity-50 font-medium"
                                >
                                    <Zap className="w-4 h-4" />
                                    {saving ? 'Creating...' : 'Create Trip & Get Shareable Link'}
                                </button>
                                <p className="text-xs text-primary/40">{'Client opens the link → sees full trip page with itinerary → pays via Easebuzz (UPI, cards, EMI, part-payment)'}</p>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* Pages Tab */}
                    {activeTab === 'pages' && (
                        <div className="space-y-8">
                            {pages.map((page) => (
                                <div key={page.id} className="border-b border-primary/10 pb-8 last:border-0">
                                    <h3 className="font-display text-xl text-primary mb-4 capitalize">{page.pageKey} Page</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Image Upload */}
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Hero Image"
                                                value={page.heroImageUrl || ''}
                                                onChange={url => setPages(pages.map(p => p.id === page.id ? { ...p, heroImageUrl: url } : p))}
                                                folder="pages"
                                                previewHeight="h-48"
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
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Destination Image"
                                                value={dest.imageUrl as string || ''}
                                                onChange={url => setDestinations(destinations.map(d => d.id === dest.id ? { ...d, imageUrl: url } : d))}
                                                folder="destinations"
                                                previewHeight="h-48"
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
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Trip Image"
                                                value={trip.imageUrl as string || ''}
                                                onChange={url => setTrips(trips.map(t => t.id === trip.id ? { ...t, imageUrl: url } : t))}
                                                folder="trips"
                                                previewHeight="h-48"
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
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">{'Discount (%) → auto-calculates MRP'}</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="99"
                                                        value={(() => {
                                                            const p = Number(trip.price) || 0;
                                                            const op = Number(trip.originalPrice) || 0;
                                                            if (op > 0 && p > 0 && op > p) return Math.round((1 - p / op) * 100);
                                                            return 0;
                                                        })()}
                                                        onChange={(e) => {
                                                            const discount = Math.min(99, Math.max(0, Number(e.target.value)));
                                                            const price = Number(trip.price) || 0;
                                                            const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : 0;
                                                            setTrips(trips.map(t => t.id === trip.id ? { ...t, originalPrice } : t));
                                                        }}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                    {Number(trip.originalPrice) > 0 && (
                                                        <p className="text-xs text-primary/50 mt-1">MRP: {formatPrice(Number(trip.originalPrice))}</p>
                                                    )}
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
                                            <EditableList
                                                label="Gallery Images (URLs)"
                                                items={Array.isArray(trip.images) ? trip.images : []}
                                                onChange={(items) => setTrips(trips.map(t => t.id === trip.id ? { ...t, images: items } : t))}
                                                placeholder="https://..."
                                            />
                                            <EditableList
                                                label="Highlights"
                                                items={Array.isArray(trip.highlights) ? trip.highlights : []}
                                                onChange={(items) => setTrips(trips.map(t => t.id === trip.id ? { ...t, highlights: items } : t))}
                                                placeholder="Add highlight..."
                                            />
                                            <EditableList
                                                label="Includes"
                                                items={Array.isArray(trip.includes) ? trip.includes : []}
                                                onChange={(items) => setTrips(trips.map(t => t.id === trip.id ? { ...t, includes: items } : t))}
                                                placeholder="Add include..."
                                            />
                                            <EditableList
                                                label="Excludes"
                                                items={Array.isArray(trip.excludes) ? trip.excludes : []}
                                                onChange={(items) => setTrips(trips.map(t => t.id === trip.id ? { ...t, excludes: items } : t))}
                                                placeholder="Add exclude..."
                                            />
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
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Hotel Image"
                                                value={hotel.imageUrl as string || ''}
                                                onChange={url => setHotels(hotels.map(h => h.id === hotel.id ? { ...h, imageUrl: url } : h))}
                                                folder="hotels"
                                                previewHeight="h-48"
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
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Blog Image"
                                                value={blog.imageUrl as string || ''}
                                                onChange={url => setBlogs(blogs.map(b => b.id === blog.id ? { ...b, imageUrl: url } : b))}
                                                folder="blogs"
                                                previewHeight="h-48"
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

                    {/* Events Tab */}
                    {activeTab === 'events' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Events</h2>
                                    <p className="text-sm text-primary/50 mt-1">Create and manage event page content and ticket types</p>
                                </div>
                                <button
                                    onClick={handleCreateEvent}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Event</span>
                                </button>
                            </div>
                            {events.map((event) => (
                                <div key={event.id as number} className="p-6 border border-primary/10 bg-cream-light space-y-4">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Event Image"
                                                value={event.imageUrl as string || ''}
                                                onChange={url => setEvents(events.map(ev => ev.id === event.id ? { ...ev, imageUrl: url } : ev))}
                                                folder="events"
                                                previewHeight="h-48"
                                            />
                                        </div>
                                        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                                <input type="text" value={event.title as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, title: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Slug</label>
                                                <input type="text" value={event.slug as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, slug: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Category</label>
                                                <input type="text" value={event.category as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, category: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Event Date</label>
                                                <input type="date" value={(event.eventDate as string || '').split('T')[0]} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, eventDate: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Event Time</label>
                                                <input type="text" value={event.eventTime as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, eventTime: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Price</label>
                                                <input type="number" value={event.price as number || 0} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, price: Number(e.target.value) } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">{'Discount (%) → auto-calculates MRP'}</label>
                                                <input type="number" min="0" max="99" value={(() => { const p = Number(event.price)||0; const op = Number(event.originalPrice)||0; if(op>0&&p>0&&op>p) return Math.round((1-p/op)*100); return 0; })()} onChange={(e) => { const discount = Math.min(99, Math.max(0, Number(e.target.value))); const price = Number(event.price)||0; const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : 0; setEvents(events.map(ev => ev.id === event.id ? { ...ev, originalPrice } : ev)); }} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                                {Number(event.originalPrice) > 0 && <p className="text-xs text-primary/50 mt-1">MRP: {formatPrice(Number(event.originalPrice))}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Capacity</label>
                                                <input type="number" value={event.capacity as number || 0} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, capacity: Number(e.target.value) } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Status</label>
                                                <select value={event.status as string || 'ACTIVE'} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, status: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary">
                                                    <option value="ACTIVE">ACTIVE</option>
                                                    <option value="SOLD_OUT">SOLD_OUT</option>
                                                    <option value="CANCELLED">CANCELLED</option>
                                                    <option value="COMPLETED">COMPLETED</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Venue Name</label>
                                                <input type="text" value={event.venueName as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, venueName: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">City</label>
                                                <input type="text" value={event.city as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, city: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Venue Address</label>
                                                <input type="text" value={event.venueAddress as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, venueAddress: e.target.value } : ev))} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Short Description</label>
                                        <textarea value={event.shortDescription as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, shortDescription: e.target.value } : ev))} rows={2} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                        <textarea value={event.description as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, description: e.target.value } : ev))} rows={3} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                    </div>
                                    <div>
                                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Long Description</label>
                                        <textarea value={event.longDescription as string || ''} onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, longDescription: e.target.value } : ev))} rows={5} className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Highlights (one per line)</label>
                                            <textarea
                                                value={parseListField(event.highlights)}
                                                onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, highlights: toJsonListString(e.target.value) } : ev))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Includes (one per line)</label>
                                            <textarea
                                                value={parseListField(event.includes)}
                                                onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, includes: toJsonListString(e.target.value) } : ev))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Gallery URLs (one per line)</label>
                                            <textarea
                                                value={parseListField(event.galleryUrls)}
                                                onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, galleryUrls: toJsonListString(e.target.value) } : ev))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">FAQ (JSON)</label>
                                            <textarea
                                                value={event.faq as string || '[]'}
                                                onChange={(e) => setEvents(events.map(ev => ev.id === event.id ? { ...ev, faq: e.target.value } : ev))}
                                                rows={4}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Ticket Types</label>
                                        <div className="space-y-3">
                                            {(Array.isArray(event.ticketTypes) ? event.ticketTypes : []).map((tt: any, idx: number) => (
                                                <div key={tt.id || idx} className="grid grid-cols-1 md:grid-cols-6 gap-2 p-3 border border-primary/10 bg-cream">
                                                    <input type="text" placeholder="Name" value={tt.name || ''} onChange={(e) => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                        arr[idx] = { ...arr[idx], name: e.target.value };
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <input type="number" placeholder="Price" value={tt.price || 0} onChange={(e) => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                        arr[idx] = { ...arr[idx], price: Number(e.target.value) };
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <input type="number" placeholder="Disc%" min="0" max="99" value={(() => { const p = Number(tt.price)||0; const op = Number(tt.originalPrice)||0; if(op>0&&p>0&&op>p) return Math.round((1-p/op)*100); return 0; })()} onChange={(e) => { const discount = Math.min(99, Math.max(0, Number(e.target.value))); const price = Number(tt.price)||0; const originalPrice = discount > 0 ? Math.round(price / (1 - discount / 100)) : 0; setEvents(events.map(ev => { if (ev.id !== event.id) return ev; const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : []; arr[idx] = { ...arr[idx], originalPrice }; return { ...ev, ticketTypes: arr }; })); }} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <input type="number" placeholder="Capacity" value={tt.capacity ?? 0} onChange={(e) => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                        arr[idx] = { ...arr[idx], capacity: Number(e.target.value) };
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <input type="number" placeholder="Sort" value={tt.sortOrder ?? idx} onChange={(e) => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                        arr[idx] = { ...arr[idx], sortOrder: Number(e.target.value) };
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 border border-primary/20 bg-white" />
                                                    <button onClick={() => setEvents(events.map(ev => {
                                                        if (ev.id !== event.id) return ev;
                                                        const arr = (Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : []).filter((_: any, i: number) => i !== idx);
                                                        return { ...ev, ticketTypes: arr };
                                                    }))} className="px-3 py-2 bg-red-500 text-white hover:bg-red-600">Remove</button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => setEvents(events.map(ev => {
                                                    if (ev.id !== event.id) return ev;
                                                    const arr = Array.isArray(ev.ticketTypes) ? [...ev.ticketTypes] : [];
                                                    arr.push({ name: '', description: '', price: 0, originalPrice: 0, capacity: 0, sortOrder: arr.length, isActive: true });
                                                    return { ...ev, ticketTypes: arr };
                                                }))}
                                                className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add Ticket Type</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button onClick={() => handleSaveEvent(event)} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50">
                                            <Save className="w-4 h-4" />
                                            <span>Save</span>
                                        </button>
                                        <button onClick={() => handleDeleteEvent(event.id as number)} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50">
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
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
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title / Role</label>
                                            <input
                                                type="text"
                                                value={test.userTitle as string || ''}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userTitle: e.target.value } : t))}
                                                className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                placeholder="e.g. Adventure Traveler"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Display Order</label>
                                            <input
                                                type="number"
                                                value={test.displayOrder as number ?? 0}
                                                onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, displayOrder: Number(e.target.value) } : t))}
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
                                            <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">User Image URL</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={test.userImage as string || ''}
                                                    onChange={(e) => setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, userImage: e.target.value } : t))}
                                                    className="flex-1 px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    placeholder="https://..."
                                                />
                                                {(test.userImage && typeof test.userImage === 'string' && test.userImage.trim() !== '') ? (
                                                    <a href={test.userImage as string} target="_blank" rel="noopener noreferrer" className="px-4 py-3 border border-primary/20 bg-cream hover:bg-cream-dark flex items-center"><Eye className="w-4 h-4" /></a>
                                                ) : null}
                                            </div>
                                            {(test.userImage && typeof test.userImage === 'string' && test.userImage.trim() !== '') ? (
                                                <div className="mt-2 w-24 h-24 rounded overflow-hidden border border-primary/10">
                                                    <ImagePreview imageUrl={test.userImage as string} className="w-full h-full" />
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="md:col-span-2">
                                            <div className="border border-primary/10 rounded-lg bg-cream/50 p-4">
                                                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                                    <div>
                                                        <label className="block text-caption uppercase tracking-widest text-primary/70">Travel Photos</label>
                                                        <p className="text-xs text-primary/50 mt-1">Upload photos shared by this traveler. These will be displayed in their testimonial.</p>
                                                    </div>
                                                    <label className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium bg-secondary text-cream hover:bg-secondary-dark transition-colors cursor-pointer rounded">
                                                        <Upload className="w-3.5 h-3.5" />
                                                        Upload Photos
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            disabled={saving}
                                                            onChange={(e) => {
                                                                void handleUploadTestimonialImages(test.id as number, e.target.files);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                </div>

                                                {parseStringArrayField(test.photoGallery).length > 0 ? (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                                        {parseStringArrayField(test.photoGallery).map((imageUrl, imageIdx) => (
                                                            <div key={`${test.id as number}-gallery-${imageIdx}`} className="relative group aspect-square rounded-lg overflow-hidden border border-primary/10 bg-cream">
                                                                <ImagePreview imageUrl={imageUrl} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                                                                <button
                                                                    type="button"
                                                                    className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                                    title="Remove photo"
                                                                    onClick={() => {
                                                                        const nextImages = parseStringArrayField(test.photoGallery).filter((_, idx) => idx !== imageIdx);
                                                                        setTestimonials(testimonials.map(t => t.id === test.id ? { ...t, photoGallery: serializeStringArrayField(nextImages) } : t));
                                                                    }}
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <span className="text-[10px] text-white/80">Photo {imageIdx + 1}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <label className="aspect-square rounded-lg border-2 border-dashed border-primary/20 hover:border-secondary/50 bg-cream flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
                                                            <Plus className="w-6 h-6 text-primary/30" />
                                                            <span className="text-[10px] text-primary/40 font-medium">Add More</span>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                className="hidden"
                                                                disabled={saving}
                                                                onChange={(e) => {
                                                                    void handleUploadTestimonialImages(test.id as number, e.target.files);
                                                                    e.target.value = '';
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <label className="flex flex-col items-center justify-center gap-3 py-10 border-2 border-dashed border-primary/15 rounded-lg bg-cream hover:border-secondary/40 cursor-pointer transition-colors">
                                                        <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center">
                                                            <Upload className="w-5 h-5 text-primary/30" />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-medium text-primary/50">No travel photos yet</p>
                                                            <p className="text-xs text-primary/35 mt-1">Click to upload or drag photos here</p>
                                                        </div>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="hidden"
                                                            disabled={saving}
                                                            onChange={(e) => {
                                                                void handleUploadTestimonialImages(test.id as number, e.target.files);
                                                                e.target.value = '';
                                                            }}
                                                        />
                                                    </label>
                                                )}

                                                {parseStringArrayField(test.photoGallery).length > 0 ? (
                                                    <p className="text-[11px] text-primary/40 mt-3">{parseStringArrayField(test.photoGallery).length} photo{parseStringArrayField(test.photoGallery).length !== 1 ? 's' : ''} uploaded</p>
                                                ) : null}
                                            </div>
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
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-medium text-primary">Bookings</h2>
                                <div className="flex gap-2">
                                    <select
                                        className="px-4 py-2 border border-primary/20 bg-cream text-sm"
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (value === 'all') {
                                                refreshCurrentTab();
                                            }
                                        }}
                                    >
                                        <option value="all">All Payments</option>
                                        <option value="FULL">Full Payment</option>
                                        <option value="EMI">EMI Payment</option>
                                        <option value="HALF_PAYMENT">Half Payment</option>
                                    </select>
                                </div>
                            </div>

                            {/* Event Bookings */}
                            {eventBookings.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium text-primary mb-3">Event Bookings</h3>
                                    <div className="space-y-4 mb-8">
                                        {eventBookings.map((booking: any) => (
                                            <div
                                                key={`evt-${booking.id}`}
                                                className="p-6 border border-primary/10 bg-cream-light"
                                            >
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-primary mb-1">
                                                            {booking.bookingReference}
                                                            <span className="ml-2 text-xs bg-secondary text-cream px-2 py-1 rounded">Event</span>
                                                        </h3>
                                                        <p className="text-sm text-text-secondary">
                                                            {booking.customerName} • {booking.customerEmail}
                                                        </p>
                                                    </div>
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm ${booking.paymentStatus === 'PAID' ? 'bg-success/20 text-success' :
                                                        booking.paymentStatus === 'FAILED' ? 'bg-error/20 text-error' :
                                                            'bg-warning/20 text-warning'
                                                    }`}>
                                                        {booking.paymentStatus === 'PAID' && <CheckCircle size={16} />}
                                                        {booking.paymentStatus === 'FAILED' && <XCircle size={16} />}
                                                        {booking.paymentStatus === 'PENDING' && <Clock size={16} />}
                                                        {booking.paymentStatus}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Event</p>
                                                        <p className="text-body-lg">{booking.event?.title || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Event Date</p>
                                                        <p className="text-body-lg">{booking.eventDate ? new Date(booking.eventDate).toLocaleDateString() : '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Tickets</p>
                                                        <p className="text-body-lg">{booking.numberOfTickets ?? '—'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-text-secondary">Amount</p>
                                                        <p className="text-body-lg font-medium">{formatPrice(booking.finalAmount || booking.totalAmount)}</p>
                                                    </div>
                                                </div>
                                                {booking.paymentMethod && (
                                                    <p className="text-caption text-text-secondary mt-2">Payment: {String(booking.paymentMethod).toUpperCase()}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trip Bookings */}
                            <h3 className="text-lg font-medium text-primary mb-3">Trip Bookings</h3>
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
                                                    {/* Payment Type Badge */}
                                                    {booking.paymentType === 'EMI' && (
                                                        <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded">EMI</span>
                                                    )}
                                                    {booking.paymentType === 'HALF_PAYMENT' && (
                                                        <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-1 rounded">50% Paid</span>
                                                    )}
                                                </h3>
                                                <p className="text-sm text-text-secondary">
                                                    {booking.customerName} • {booking.customerEmail}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm ${booking.paymentStatus === 'PAID' ? 'bg-success/20 text-success' :
                                                    booking.paymentStatus === 'HALF_PAID' ? 'bg-amber-100 text-amber-700' :
                                                        booking.paymentStatus === 'FAILED' ? 'bg-error/20 text-error' :
                                                            'bg-warning/20 text-warning'
                                                    }`}>
                                                    {booking.paymentStatus === 'PAID' && <CheckCircle size={16} />}
                                                    {booking.paymentStatus === 'HALF_PAID' && <Clock size={16} />}
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
                                                <p className="text-caption text-text-secondary">Total Amount</p>
                                                <p className="text-body-lg font-medium">{formatPrice(booking.finalAmount || booking.totalAmount)}</p>
                                            </div>
                                        </div>

                                        {/* Half Payment Info */}
                                        {booking.paymentType === 'HALF_PAYMENT' && (
                                            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-caption text-amber-700">Amount Paid</p>
                                                        <p className="text-body-lg font-medium text-green-600">{formatPrice(booking.amountPaid)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-amber-700">Remaining Amount</p>
                                                        <p className="text-body-lg font-medium text-red-600">{formatPrice(booking.remainingAmount)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-amber-700">Due By</p>
                                                        <p className="text-body-lg font-medium">
                                                            {booking.remainingPaymentDue
                                                                ? new Date(booking.remainingPaymentDue).toLocaleString()
                                                                : '2 hrs before travel'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {booking.remainingPaymentStatus === 'OVERDUE' && (
                                                    <p className="mt-2 text-sm font-bold text-red-600">⚠️ OVERDUE - Follow up required!</p>
                                                )}
                                            </div>
                                        )}

                                        {/* EMI Info */}
                                        {booking.emiEnabled && (
                                            <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded">
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-caption text-purple-700">EMI Tenure</p>
                                                        <p className="text-body-lg font-medium">{booking.emiTenure} months</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-purple-700">Monthly EMI</p>
                                                        <p className="text-body-lg font-medium">{formatPrice(booking.emiMonthlyAmount)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-caption text-purple-700">EMI Total</p>
                                                        <p className="text-body-lg font-medium">{formatPrice(booking.emiTotalAmount)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

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
                                {bookings.length === 0 && eventBookings.length === 0 && (
                                    <div className="text-center py-12 text-text-secondary">
                                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p>No bookings yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Inquiries Tab */}
                    {activeTab === 'inquiries' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Contact Inquiries</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage inquiries from the contact form</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-accent/20 text-primary text-sm rounded">
                                        {inquiries.filter((i: any) => !i.isRead).length} unread
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {inquiries.map((inquiry: any) => (
                                    <div key={inquiry.id} className={`p-6 border ${inquiry.isRead ? 'bg-cream border-primary/10' : 'bg-accent/5 border-accent/30'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${inquiry.isRead ? 'bg-primary/10' : 'bg-accent/20'}`}>
                                                    <User className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-primary">{inquiry.name}</h3>
                                                    <p className="text-sm text-primary/60">{inquiry.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={inquiry.status || 'NEW'}
                                                    onChange={async (e) => {
                                                        try {
                                                            await api.admin.updateInquiryStatus(inquiry.id, e.target.value);
                                                            setInquiries(inquiries.map((i: any) =>
                                                                i.id === inquiry.id ? { ...i, status: e.target.value } : i
                                                            ));
                                                            setMessage({ type: 'success', text: 'Status updated!' });
                                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to update status' });
                                                        }
                                                    }}
                                                    className={`px-3 py-1 text-sm border rounded cursor-pointer ${inquiry.status === 'NEW' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                                                        inquiry.status === 'CONTACTED' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                            inquiry.status === 'CONVERTED' ? 'bg-green-50 border-green-200 text-green-700' :
                                                                'bg-gray-50 border-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    <option value="NEW">New</option>
                                                    <option value="CONTACTED">Contacted</option>
                                                    <option value="CONVERTED">Converted</option>
                                                    <option value="CLOSED">Closed</option>
                                                </select>
                                                <span className="text-xs text-primary/40">
                                                    {new Date(inquiry.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                                            {inquiry.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-primary/40" />
                                                    <span>{inquiry.phone}</span>
                                                </div>
                                            )}
                                            {inquiry.destination && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary/40" />
                                                    <span>{inquiry.destination}</span>
                                                </div>
                                            )}
                                            {inquiry.travelers && (
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-primary/40" />
                                                    <span>{inquiry.travelers} travelers</span>
                                                </div>
                                            )}
                                            {inquiry.preferredDates && (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary/40" />
                                                    <span>{inquiry.preferredDates}</span>
                                                </div>
                                            )}
                                        </div>
                                        {inquiry.message && (
                                            <div className="bg-primary/5 p-4 rounded mb-4">
                                                <p className="text-sm text-primary/80">{inquiry.message}</p>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {!inquiry.isRead && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.admin.markInquiryAsRead(inquiry.id);
                                                            setInquiries(inquiries.map((i: any) =>
                                                                i.id === inquiry.id ? { ...i, isRead: true } : i
                                                            ));
                                                            setMessage({ type: 'success', text: 'Marked as read!' });
                                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to mark as read' });
                                                        }
                                                    }}
                                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    <span>Mark as Read</span>
                                                </button>
                                            )}
                                            <a
                                                href={`mailto:${inquiry.email}?subject=Re: Your Travel Inquiry - YlooTrips&body=Hi ${inquiry.name},%0D%0A%0D%0AThank you for your interest in traveling with YlooTrips.%0D%0A%0D%0A`}
                                                className="flex items-center gap-2 px-4 py-2 bg-primary text-cream hover:bg-primary-light transition-colors"
                                            >
                                                <Mail className="w-4 h-4" />
                                                <span>Reply</span>
                                            </a>
                                            <button
                                                onClick={async () => {
                                                    if (!confirm('Are you sure you want to delete this inquiry?')) return;
                                                    try {
                                                        await api.admin.deleteInquiry(inquiry.id);
                                                        setInquiries(inquiries.filter((i: any) => i.id !== inquiry.id));
                                                        setMessage({ type: 'success', text: 'Inquiry deleted!' });
                                                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                    } catch {
                                                        setMessage({ type: 'error', text: 'Failed to delete inquiry' });
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {inquiries.length === 0 && (
                                    <div className="text-center py-12 text-text-secondary">
                                        <Mail className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p>No inquiries yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Ads Tab */}
                    {activeTab === 'ads' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Ads Management</h2>
                                    <p className="text-sm text-primary/50 mt-1">Manage homepage carousel ads</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        setSaving(true);
                                        try {
                                            const newAd = {
                                                title: 'New Ad',
                                                description: 'Ad description',
                                                imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
                                                redirectUrl: '/trips',
                                                discountText: '10% OFF',
                                                isActive: true,
                                                displayOrder: ads.length + 1,
                                            };
                                            await api.admin.createAd(newAd);
                                            setMessage({ type: 'success', text: 'Ad created!' });
                                            refreshCurrentTab();
                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                        } catch {
                                            setMessage({ type: 'error', text: 'Failed to create ad' });
                                        }
                                        setSaving(false);
                                    }}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-cream hover:bg-secondary-dark transition-colors disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create New Ad</span>
                                </button>
                            </div>
                            {ads.map((ad) => (
                                <div key={ad.id as number} className="p-6 border border-primary/10 bg-cream-light">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <InlineImageUploader
                                                label="Ad Image"
                                                value={ad.imageUrl as string || ''}
                                                onChange={url => setAds(ads.map(a => a.id === ad.id ? { ...a, imageUrl: url } : a))}
                                                folder="ads"
                                                previewHeight="h-40"
                                            />
                                            {typeof ad.discountText === 'string' && ad.discountText && (
                                                <div className="mt-2 inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    🔥 {ad.discountText}
                                                </div>
                                            )}
                                        </div>

                                        {/* Form Fields */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Title</label>
                                                    <input
                                                        type="text"
                                                        value={ad.title as string || ''}
                                                        onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, title: e.target.value } : a))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Discount Text</label>
                                                    <input
                                                        type="text"
                                                        value={ad.discountText as string || ''}
                                                        onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, discountText: e.target.value } : a))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="e.g., 25% OFF, FLAT ₹5000 OFF"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Description</label>
                                                <textarea
                                                    value={ad.description as string || ''}
                                                    onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, description: e.target.value } : a))}
                                                    rows={2}
                                                    className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Redirect URL</label>
                                                    <input
                                                        type="text"
                                                        value={ad.redirectUrl as string || ''}
                                                        onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, redirectUrl: e.target.value } : a))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                        placeholder="/trips?category=Trekking"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-caption uppercase tracking-widest text-primary/70 mb-2">Display Order</label>
                                                    <input
                                                        type="number"
                                                        value={ad.displayOrder as number || 0}
                                                        onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, displayOrder: Number(e.target.value) } : a))}
                                                        className="w-full px-4 py-3 border border-primary/20 bg-cream focus:outline-none focus:border-secondary"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-6 pt-6">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={ad.isActive as boolean || false}
                                                            onChange={(e) => setAds(ads.map(a => a.id === ad.id ? { ...a, isActive: e.target.checked } : a))}
                                                            className="w-5 h-5"
                                                        />
                                                        <span className="text-sm text-primary/70 font-medium">Active</span>
                                                        {ad.isActive ? (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-red-500" />
                                                        )}
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 pt-2">
                                                <button
                                                    onClick={async () => {
                                                        setSaving(true);
                                                        try {
                                                            await api.admin.updateAd(ad.id as number, ad);
                                                            setMessage({ type: 'success', text: 'Ad updated!' });
                                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to update ad' });
                                                        }
                                                        setSaving(false);
                                                    }}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-6 py-2 bg-primary text-cream hover:bg-primary-light transition-colors disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (!confirm('Are you sure you want to delete this ad?')) return;
                                                        setSaving(true);
                                                        try {
                                                            await api.admin.deleteAd(ad.id as number);
                                                            setAds(ads.filter(a => a.id !== ad.id));
                                                            setMessage({ type: 'success', text: 'Ad deleted!' });
                                                            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                                                        } catch {
                                                            setMessage({ type: 'error', text: 'Failed to delete ad' });
                                                        }
                                                        setSaving(false);
                                                    }}
                                                    disabled={saving}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {ads.length === 0 && (
                                <div className="text-center py-12 text-primary/50">
                                    <Megaphone className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                    <p>No ads yet. Create your first ad!</p>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'package-prices' && (
                        <div className="space-y-6">
                            <div className="mb-4">
                                <h2 className="text-xl font-medium text-primary">Package Prices</h2>
                                <p className="text-sm text-primary/50 mt-1">Update the selling price shown on each featured trip page. Changes go live immediately.</p>
                            </div>

                            <div className="grid gap-4">
                                {packagePrices.map((pkg) => {
                                    const slug = pkg.slug as string;
                                    const edit = priceEdits[slug] || { priceINR: String(pkg.priceINR), originalPriceINR: String(pkg.originalPriceINR) };
                                    const isInt = slug === 'thailand-budget-trip' || slug === 'bali-honeymoon-package' || slug === 'dubai-tour-package-from-delhi' || slug === 'singapore-tour-package' || slug === 'maldives-luxury-package';
                                    return (
                                        <div key={slug} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isInt ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                                            {isInt ? 'International' : 'Domestic'}
                                                        </span>
                                                        <a href={`/${slug}`} target="_blank" rel="noreferrer" className="text-amber-600 hover:underline text-xs flex items-center gap-1">
                                                            View page <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    </div>
                                                    <p className="font-semibold text-gray-900 text-sm">{pkg.label as string}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">Default: ₹{(pkg.defaultPriceINR as number).toLocaleString('en-IN')}</p>
                                                </div>
                                                <div className="flex flex-wrap items-end gap-3">
                                                    <div>
                                                        <label className="text-xs text-gray-500 font-medium block mb-1">Sale Price (₹)</label>
                                                        <input
                                                            type="number"
                                                            value={edit.priceINR}
                                                            onChange={e => setPriceEdits(prev => ({ ...prev, [slug]: { ...edit, priceINR: e.target.value } }))}
                                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 font-medium block mb-1">Original / MRP (₹)</label>
                                                        <input
                                                            type="number"
                                                            value={edit.originalPriceINR}
                                                            onChange={e => setPriceEdits(prev => ({ ...prev, [slug]: { ...edit, originalPriceINR: e.target.value } }))}
                                                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-amber-400"
                                                        />
                                                    </div>
                                                    <button
                                                        disabled={savingPrice === slug}
                                                        onClick={async () => {
                                                            setSavingPrice(slug);
                                                            try {
                                                                const res = await fetch('/api/admin/package-prices', {
                                                                    method: 'PUT',
                                                                    headers: { 'Content-Type': 'application/json', 'x-admin-token': 'admin' },
                                                                    body: JSON.stringify({ slug, priceINR: Number(edit.priceINR), originalPriceINR: Number(edit.originalPriceINR) }),
                                                                });
                                                                if (res.ok) {
                                                                    setMessage({ type: 'success', text: `Price updated for ${pkg.label}` });
                                                                    setPackagePrices(prev => prev.map(p => p.slug === slug ? { ...p, priceINR: Number(edit.priceINR), originalPriceINR: Number(edit.originalPriceINR) } : p));
                                                                } else {
                                                                    setMessage({ type: 'error', text: 'Failed to update price' });
                                                                }
                                                            } catch {
                                                                setMessage({ type: 'error', text: 'Network error' });
                                                            }
                                                            setSavingPrice(null);
                                                        }}
                                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                                                    >
                                                        {savingPrice === slug ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                            {!!pkg.updatedAt && (
                                                <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-100">
                                                    Last updated: {new Date(pkg.updatedAt as string).toLocaleString('en-IN')}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                                {packagePrices.length === 0 && (
                                    <div className="text-center py-12 text-primary/50">
                                        <Tag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                        <p>Loading package prices...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h2 className="text-xl font-medium text-primary">Client Reviews</h2>
                                    <p className="text-sm text-primary/50 mt-1">Approve submissions before they go live on the website</p>
                                </div>
                            </div>
                            {/* Filter tabs */}
                            <div className="flex gap-2 mb-4">
                                {(['pending', 'approved', 'rejected', 'all'] as const).map((s) => (
                                    <button key={s} onClick={() => {
                                        setReviewFilter(s);
                                        const tok = localStorage.getItem('adminToken') || '';
                                        fetch(`/api/admin/reviews?status=${s}`, { headers: { Authorization: `Bearer ${tok}` } })
                                            .then(r => r.json()).then(d => setReviews(Array.isArray(d.reviews) ? d.reviews : []));
                                    }}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${reviewFilter === s ? 'bg-primary text-cream' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                                        {s}
                                        {s === 'pending' && reviews.filter(r => (r.status as string) === 'pending').length > 0 && (
                                            <span className="ml-1.5 bg-white/20 text-xs font-bold px-1.5 py-0.5 rounded-full">
                                                {reviews.filter(r => (r.status as string) === 'pending').length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {reviews.length === 0 ? (
                                <div className="text-center py-16 text-primary/40">No {reviewFilter} reviews.</div>
                            ) : (
                                <div className="space-y-4">
                                    {reviews.map((r) => {
                                        const id = r._id as string || r.id as string;
                                        const status = r.status as string;
                                        return (
                                            <div key={id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                                <div className="p-4 flex items-start gap-4">
                                                    {(r.avatarUrl as string | undefined) ? (
                                                        <img src={r.avatarUrl as string} alt={r.name as string} className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-cream font-bold shrink-0">
                                                            {(r.name as string).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-semibold text-gray-900">{r.name as string}</span>
                                                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>{status}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-0.5">{r.email as string} · {r.country as string} · Trip: <strong>{r.trip as string}</strong></p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{'★'.repeat(Number(r.rating))}{'☆'.repeat(5 - Number(r.rating))} · {new Date(r.createdAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                    <button onClick={() => setReviewExpanded(reviewExpanded === id ? null : id)} className="text-gray-400 hover:text-gray-600 shrink-0">
                                                        {reviewExpanded === id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                <div className="px-4 pb-3">
                                                    <p className={`text-sm text-gray-700 leading-relaxed ${reviewExpanded !== id ? 'line-clamp-2' : ''}`}>"{r.text as string}"</p>
                                                </div>
                                                {reviewExpanded === id && (
                                                    <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-3">
                                                        {/* Client photos */}
                                                        {(() => { const av = r.avatarUrl as string | undefined; const tp = r.tripPhotoUrl as string | undefined; return (av || tp) ? (
                                                            <div className="flex gap-3 mb-1">
                                                                {av && (
                                                                    <div>
                                                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Profile Photo</p>
                                                                        <img src={av} alt="profile" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                                                                    </div>
                                                                )}
                                                                {tp && (
                                                                    <div className="flex-1">
                                                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Trip Photo</p>
                                                                        <img src={tp} alt="trip" className="h-24 w-full max-w-xs rounded-xl object-cover border border-gray-200" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : null; })()}
                                                        <textarea placeholder="Optional admin note..." rows={2}
                                                            value={reviewNotes[id] || ''}
                                                            onChange={(e) => setReviewNotes({ ...reviewNotes, [id]: e.target.value })}
                                                            className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg resize-none outline-none focus:border-gray-400" />
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {status !== 'approved' && (
                                                                <button disabled={reviewActing === id} onClick={async () => {
                                                                    setReviewActing(id);
                                                                    const tok = localStorage.getItem('adminToken') || '';
                                                                    await fetch('/api/admin/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` }, body: JSON.stringify({ id, status: 'approved', adminNote: reviewNotes[id] || '' }) });
                                                                    const rRes = await fetch(`/api/admin/reviews?status=${reviewFilter}`, { headers: { Authorization: `Bearer ${tok}` } });
                                                                    const rJson = await rRes.json();
                                                                    setReviews(Array.isArray(rJson.reviews) ? rJson.reviews : []);
                                                                    setReviewActing(null);
                                                                }} className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-60 transition-colors">
                                                                    <CheckCircle className="w-3.5 h-3.5" />{reviewActing === id ? 'Saving…' : 'Approve & Publish'}
                                                                </button>
                                                            )}
                                                            {status !== 'rejected' && (
                                                                <button disabled={reviewActing === id} onClick={async () => {
                                                                    setReviewActing(id);
                                                                    const tok = localStorage.getItem('adminToken') || '';
                                                                    await fetch('/api/admin/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` }, body: JSON.stringify({ id, status: 'rejected', adminNote: reviewNotes[id] || '' }) });
                                                                    const rRes = await fetch(`/api/admin/reviews?status=${reviewFilter}`, { headers: { Authorization: `Bearer ${tok}` } });
                                                                    const rJson = await rRes.json();
                                                                    setReviews(Array.isArray(rJson.reviews) ? rJson.reviews : []);
                                                                    setReviewActing(null);
                                                                }} className="flex items-center gap-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-60 transition-colors">
                                                                    <XCircle className="w-3.5 h-3.5" />Reject
                                                                </button>
                                                            )}
                                                            <button disabled={reviewActing === id} onClick={async () => {
                                                                if (!confirm('Permanently delete this review?')) return;
                                                                setReviewActing(id);
                                                                const tok = localStorage.getItem('adminToken') || '';
                                                                await fetch('/api/admin/reviews', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` }, body: JSON.stringify({ id }) });
                                                                const rRes = await fetch(`/api/admin/reviews?status=${reviewFilter}`, { headers: { Authorization: `Bearer ${tok}` } });
                                                                const rJson = await rRes.json();
                                                                setReviews(Array.isArray(rJson.reviews) ? rJson.reviews : []);
                                                                setReviewActing(null);
                                                            }} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-semibold px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60 ml-auto">
                                                                <Trash2 className="w-3.5 h-3.5" />Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'collect-payment' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-medium text-primary">Collect Advance Payment</h2>
                                <p className="text-sm text-primary/50 mt-1">Generate a secure Easebuzz payment link to collect advance from a client. Optionally email the link directly.</p>
                            </div>

                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                {payLink ? (
                                    <div className="text-center py-4">
                                        <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                                        <p className="font-semibold text-gray-900 mb-1">Payment Link Generated!</p>
                                        {payForm.sendEmail && <p className="text-sm text-gray-500 mb-4">Email sent to {payForm.email}</p>}
                                        <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 text-left">
                                            <p className="text-xs text-gray-400 mb-1">Payment Link</p>
                                            <p className="text-xs font-mono text-gray-700 break-all">{payLink}</p>
                                        </div>
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => { navigator.clipboard.writeText(payLink); setPayCopied(true); setTimeout(() => setPayCopied(false), 2000); }}
                                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                                                <Copy className="w-3.5 h-3.5" />{payCopied ? 'Copied!' : 'Copy Link'}
                                            </button>
                                            <a href={payLink} target="_blank" rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                                                <ExternalLink className="w-3.5 h-3.5" />Open Link
                                            </a>
                                            <button onClick={() => { setPayLink(''); setPayMsg({ type: '', text: '' }); setPayForm({ clientName: '', email: '', phone: '', amount: '', description: '', pdfUrl: '', note: '', sendEmail: true }); }}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                                                <Plus className="w-3.5 h-3.5" />New Link
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        setPaySaving(true);
                                        setPayMsg({ type: '', text: '' });
                                        const tok = localStorage.getItem('adminToken') || '';
                                        try {
                                            const res = await fetch('/api/admin/payment-link', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'x-admin-secret': tok },
                                                body: JSON.stringify({
                                                    clientName: payForm.clientName,
                                                    email: payForm.email,
                                                    phone: payForm.phone,
                                                    amount: Number(payForm.amount),
                                                    description: payForm.description,
                                                    pdfUrl: payForm.pdfUrl,
                                                    note: payForm.note,
                                                    sendEmail: payForm.sendEmail,
                                                }),
                                            });
                                            const data = await res.json();
                                            if (res.ok && data.paymentUrl) {
                                                setPayLink(data.paymentUrl);
                                            } else {
                                                setPayMsg({ type: 'error', text: data.error || 'Failed to generate link.' });
                                            }
                                        } catch {
                                            setPayMsg({ type: 'error', text: 'Network error.' });
                                        }
                                        setPaySaving(false);
                                    }} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Client Name *</label>
                                                <input required type="text" placeholder="Full name"
                                                    value={payForm.clientName}
                                                    onChange={e => setPayForm(f => ({ ...f, clientName: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Email *</label>
                                                <input required type="email" placeholder="client@email.com"
                                                    value={payForm.email}
                                                    onChange={e => setPayForm(f => ({ ...f, email: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Phone *</label>
                                                <input required type="tel" placeholder="+91 XXXXXXXXXX"
                                                    value={payForm.phone}
                                                    onChange={e => setPayForm(f => ({ ...f, phone: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Amount (Rs.) *</label>
                                                <input required type="number" min="100" placeholder="e.g. 10000"
                                                    value={payForm.amount}
                                                    onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-gray-600 block mb-1">Description / Purpose *</label>
                                            <input required type="text" placeholder="e.g. Advance for Manali Trip — 5 Nights 6 Days"
                                                value={payForm.description}
                                                onChange={e => setPayForm(f => ({ ...f, description: e.target.value }))}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">PDF / Itinerary URL</label>
                                                <input type="url" placeholder="https://drive.google.com/..."
                                                    value={payForm.pdfUrl}
                                                    onChange={e => setPayForm(f => ({ ...f, pdfUrl: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Internal Note</label>
                                                <input type="text" placeholder="Optional note for records"
                                                    value={payForm.note}
                                                    onChange={e => setPayForm(f => ({ ...f, note: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2.5 cursor-pointer">
                                            <input type="checkbox" checked={payForm.sendEmail}
                                                onChange={e => setPayForm(f => ({ ...f, sendEmail: e.target.checked }))}
                                                className="w-4 h-4 rounded border-gray-300 text-primary" />
                                            <span className="text-sm text-gray-700">Send payment link to client&apos;s email automatically</span>
                                        </label>
                                        {payMsg.text && (
                                            <p className={`text-sm rounded-lg px-3 py-2 ${payMsg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                                {payMsg.text}
                                            </p>
                                        )}
                                        <button type="submit" disabled={paySaving}
                                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                                            {paySaving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Generating…</> : <><CreditCard className="w-3.5 h-3.5" />Generate Payment Link</>}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'vouchers' && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-medium text-primary">Gift Vouchers</h2>
                                <p className="text-sm text-primary/50 mt-1">Create voucher codes for clients to use at checkout. Set the amount and validity period.</p>
                            </div>

                            {/* Create Voucher Form */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Gift className="w-4 h-4 text-amber-500" /> Create New Voucher</h3>
                                {voucherCreated ? (
                                    <div className="py-4 space-y-5">
                                        {/* Voucher code card */}
                                        <div className="text-center">
                                            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                                            <p className="font-semibold text-gray-900 mb-1">Voucher Created!</p>
                                            <div className="inline-block bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl px-8 py-4 my-3">
                                                <p className="text-xs text-gray-500 mb-1">Voucher Code</p>
                                                <p className="font-mono text-2xl font-bold tracking-widest text-gray-900">{voucherCreated.code}</p>
                                                <p className="text-sm text-gray-600 mt-1">₹{voucherCreated.amount.toLocaleString('en-IN')} · Valid until {new Date(voucherCreated.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                            </div>
                                            <div className="flex gap-2 justify-center">
                                                <button onClick={() => { navigator.clipboard.writeText(voucherCreated.code); setVoucherCopied(true); setTimeout(() => setVoucherCopied(false), 2000); }}
                                                    className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                                                    <Copy className="w-3.5 h-3.5" />{voucherCopied ? 'Copied!' : 'Copy Code'}
                                                </button>
                                                <button onClick={() => { setVoucherCreated(null); setVoucherPayLink(''); setVoucherForm({ amount: '', validDays: '365', name: '', email: '', phone: '', note: '', destination: '', pdfUrl: '' }); }}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90">
                                                    <Plus className="w-3.5 h-3.5" />Create Another
                                                </button>
                                            </div>
                                        </div>

                                        {/* Payment link section */}
                                        <div className="border-t border-gray-100 pt-5">
                                            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-blue-500" />
                                                Collect Payment from Client
                                            </p>
                                            {voucherPayLink ? (
                                                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                                                    <p className="text-xs text-blue-500 mb-1.5 font-medium">Payment Link — share with {voucherForm.name || 'client'}</p>
                                                    <p className="text-xs font-mono text-blue-800 break-all mb-3">{voucherPayLink}</p>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { navigator.clipboard.writeText(voucherPayLink); setVoucherPayCopied(true); setTimeout(() => setVoucherPayCopied(false), 2000); }}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50">
                                                            <Copy className="w-3 h-3" />{voucherPayCopied ? 'Copied!' : 'Copy Link'}
                                                        </button>
                                                        <a href={voucherPayLink} target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50">
                                                            <ExternalLink className="w-3 h-3" />Open
                                                        </a>
                                                        <a href={`https://wa.me/${(voucherForm.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${voucherForm.name || ''},\n\nYour YlooTrips gift voucher is ready! Please complete the payment of ₹${voucherCreated.amount.toLocaleString('en-IN')} via the link below:\n\n${voucherPayLink}\n\nVoucher Code: ${voucherCreated.code}`)}`}
                                                            target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] rounded-lg text-xs font-semibold text-white hover:bg-[#1ebe5d]">
                                                            WhatsApp
                                                        </a>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={async () => {
                                                        setVoucherPayLoading(true);
                                                        const tok = localStorage.getItem('adminToken') || '';
                                                        try {
                                                            const res = await fetch('/api/admin/payment-link', {
                                                                method: 'POST',
                                                                headers: { 'Content-Type': 'application/json', 'x-admin-secret': tok },
                                                                body: JSON.stringify({
                                                                    clientName: voucherForm.name || 'Client',
                                                                    email: voucherForm.email,
                                                                    phone: voucherForm.phone || '9999999999',
                                                                    amount: voucherCreated.amount,
                                                                    description: `YlooTrips Gift Voucher ${voucherCreated.code}`,
                                                                    pdfUrl: voucherForm.pdfUrl,
                                                                    note: voucherForm.note,
                                                                    sendEmail: false,
                                                                }),
                                                            });
                                                            const data = await res.json();
                                                            if (data.paymentUrl) setVoucherPayLink(data.paymentUrl);
                                                        } catch { /* ignore */ }
                                                        setVoucherPayLoading(false);
                                                    }}
                                                    disabled={voucherPayLoading || !voucherForm.email}
                                                    className="flex items-center gap-2 px-4 py-2.5 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                                                >
                                                    {voucherPayLoading ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Generating…</> : <><Link2 className="w-3.5 h-3.5" />Generate Payment Link for Client</>}
                                                </button>
                                            )}
                                            {!voucherForm.email && <p className="text-xs text-gray-400 mt-1.5">Add recipient email in the form to generate a payment link.</p>}
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        setVoucherSaving(true);
                                        setVoucherMsg({ type: '', text: '' });
                                        const tok = localStorage.getItem('adminToken') || '';
                                        try {
                                            const res = await fetch('/api/vouchers/create', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'x-admin-secret': tok },
                                                body: JSON.stringify({
                                                    amount: Number(voucherForm.amount),
                                                    validDays: Number(voucherForm.validDays),
                                                    recipientName: voucherForm.name,
                                                    recipientEmail: voucherForm.email,
                                                    recipientPhone: voucherForm.phone,
                                                    note: voucherForm.note,
                                                    destination: voucherForm.destination,
                                                    pdfUrl: voucherForm.pdfUrl,
                                                }),
                                            });
                                            const data = await res.json();
                                            if (res.ok && data.voucher) {
                                                setVoucherCreated(data.voucher);
                                                setVouchers([]);
                                            } else {
                                                setVoucherMsg({ type: 'error', text: data.error || 'Failed to create voucher.' });
                                            }
                                        } catch {
                                            setVoucherMsg({ type: 'error', text: 'Network error.' });
                                        }
                                        setVoucherSaving(false);
                                    }} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Amount (₹) *</label>
                                                <input required type="number" min="100" placeholder="e.g. 5000"
                                                    value={voucherForm.amount}
                                                    onChange={e => setVoucherForm(f => ({ ...f, amount: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Valid for (days) *</label>
                                                <select value={voucherForm.validDays}
                                                    onChange={e => setVoucherForm(f => ({ ...f, validDays: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                                                    <option value="30">30 days (1 month)</option>
                                                    <option value="90">90 days (3 months)</option>
                                                    <option value="180">180 days (6 months)</option>
                                                    <option value="365">365 days (1 year)</option>
                                                    <option value="730">730 days (2 years)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Recipient Name *</label>
                                                <input required type="text" placeholder="Client full name"
                                                    value={voucherForm.name}
                                                    onChange={e => setVoucherForm(f => ({ ...f, name: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Recipient Email *</label>
                                                <input required type="email" placeholder="client@email.com"
                                                    value={voucherForm.email}
                                                    onChange={e => setVoucherForm(f => ({ ...f, email: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Phone</label>
                                                <input type="tel" placeholder="+91 XXXXXXXXXX"
                                                    value={voucherForm.phone}
                                                    onChange={e => setVoucherForm(f => ({ ...f, phone: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Internal Note</label>
                                                <input type="text" placeholder="Optional note"
                                                    value={voucherForm.note}
                                                    onChange={e => setVoucherForm(f => ({ ...f, note: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">Destination (for cover)</label>
                                                <select value={voucherForm.destination}
                                                    onChange={e => setVoucherForm(f => ({ ...f, destination: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                                                    <option value="">None / Generic</option>
                                                    {['Manali','Kashmir','Goa','Kerala','Rajasthan','Bali','Dubai','Singapore','Maldives','Thailand','Vietnam','Europe'].map(d => (
                                                        <option key={d} value={d}>{d}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-600 block mb-1">PDF / Itinerary URL</label>
                                                <input type="url" placeholder="https://..."
                                                    value={voucherForm.pdfUrl}
                                                    onChange={e => setVoucherForm(f => ({ ...f, pdfUrl: e.target.value }))}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
                                            </div>
                                        </div>
                                        {voucherMsg.text && (
                                            <p className={`text-sm rounded-lg px-3 py-2 ${voucherMsg.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                                                {voucherMsg.text}
                                            </p>
                                        )}
                                        <button type="submit" disabled={voucherSaving}
                                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                                            {voucherSaving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Creating…</> : <><Gift className="w-3.5 h-3.5" />Create Voucher</>}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Vouchers List */}
                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">All Vouchers</h3>
                                    <button onClick={async () => {
                                        const tok = localStorage.getItem('adminToken') || '';
                                        const res = await fetch('/api/vouchers/list', { headers: { 'x-admin-secret': tok } });
                                        const data = await res.json();
                                        setVouchers(Array.isArray(data.vouchers) ? data.vouchers : []);
                                    }} className="flex items-center gap-1.5 text-sm text-primary/60 hover:text-primary border border-gray-200 px-3 py-1.5 rounded-lg">
                                        <RefreshCw className="w-3.5 h-3.5" />Load
                                    </button>
                                </div>
                                {vouchers.length === 0 ? (
                                    <p className="text-center py-8 text-primary/40 text-sm">Click &quot;Load&quot; to fetch vouchers.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {vouchers.map((v: any) => {
                                            const statusColor = v.status === 'active' ? 'bg-green-100 text-green-700' : v.status === 'used' ? 'bg-blue-100 text-blue-700' : v.status === 'cancelled' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600';
                                            return (
                                                <div key={v.code as string} className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-mono font-bold text-primary text-sm tracking-wider">{v.code as string}</span>
                                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColor}`}>{v.status as string}</span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            ₹{(v.amount as number).toLocaleString('en-IN')} · {v.purchasedBy ? `${(v.purchasedBy as any).name} · ${(v.purchasedBy as any).email}` : ''}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            Valid until {new Date(v.validUntil as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            {v.usedFor ? ` · Used for: ${v.usedFor}` : ''}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { navigator.clipboard.writeText(v.code as string); }}
                                                            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500" title="Copy code">
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                        {v.status === 'active' && (
                                                            <button onClick={async () => {
                                                                const tok = localStorage.getItem('adminToken') || '';
                                                                await fetch('/api/vouchers/update', { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'x-admin-secret': tok }, body: JSON.stringify({ code: v.code, status: 'cancelled' }) });
                                                                setVouchers(prev => prev.map((vv: any) => vv.code === v.code ? { ...vv, status: 'cancelled' } : vv));
                                                            }} className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50">
                                                                Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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
