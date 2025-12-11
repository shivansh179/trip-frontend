// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// API Client
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Functions
export const api = {
  // CMS Content
  getSiteSettings: () => apiClient.get('/content/settings'),
  getPageContent: (pageKey: string) => apiClient.get(`/content/page/${pageKey}`),
  getPageSections: (pageKey: string) => apiClient.get(`/content/page/${pageKey}/sections`),
  getPageStats: (pageKey: string) => apiClient.get(`/content/page/${pageKey}/stats`),
  getPageFeatures: (pageKey: string) => apiClient.get(`/content/page/${pageKey}/features`),

  // Destinations
  getDestinations: () => apiClient.get('/destinations'),
  getFeaturedDestinations: () => apiClient.get('/destinations/featured'),
  getPopularDestinations: () => apiClient.get('/destinations/popular'),
  getDestinationBySlug: (slug: string) => apiClient.get(`/destinations/slug/${slug}`),

  // Trips
  getTrips: (params?: { category?: string; destination?: string; destinationId?: number }) =>
    apiClient.get('/trips', { params }),
  getFeaturedTrips: () => apiClient.get('/trips/featured'),
  getPopularTrips: () => apiClient.get('/trips/popular'),
  getTrendingTrips: () => apiClient.get('/trips/trending'),
  searchTrips: (query: string) => apiClient.get('/trips/search', { params: { q: query } }),
  getTripById: (id: number) => apiClient.get(`/trips/${id}`),

  // Hotels
  getHotels: (destinationId?: number) =>
    apiClient.get('/hotels', { params: destinationId ? { destinationId } : {} }),
  getBoutiqueHotels: () => apiClient.get('/hotels/boutique'),
  getFeaturedHotels: () => apiClient.get('/hotels/featured'),
  getHotelById: (id: number) => apiClient.get(`/hotels/${id}`),

  // Testimonials
  getTestimonials: () => apiClient.get('/testimonials'),
  getFeaturedTestimonials: () => apiClient.get('/testimonials/featured'),

  // Blogs
  getBlogs: () => apiClient.get('/blogs'),
  getFeaturedBlogs: () => apiClient.get('/blogs/featured'),
  getRecentBlogs: () => apiClient.get('/blogs/recent'),
  getBlogById: (id: number) => apiClient.get(`/blogs/${id}`),
  getBlogBySlug: (slug: string) => apiClient.get(`/blogs/slug/${slug}`),

  // Seed Data
  seedData: () => apiClient.post('/seed/data'),

  // Admin Authentication
  adminLogin: (username: string, password: string) =>
    apiClient.post('/admin/login', { username, password }),
  adminLogout: (token: string) =>
    apiClient.post('/admin/logout', {}, { headers: { Authorization: `Bearer ${token}` } }),
  adminVerify: (token: string) =>
    apiClient.get('/admin/verify', { headers: { Authorization: `Bearer ${token}` } }),

  // Admin CRUD Operations
  admin: {
    // Settings
    getSettings: () => apiClient.get('/admin/settings'),
    updateSettings: (settings: Record<string, unknown>) => apiClient.put('/admin/settings', settings),

    // Pages
    getPages: () => apiClient.get('/admin/pages'),
    getPage: (id: number) => apiClient.get(`/admin/pages/${id}`),
    updatePage: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/pages/${id}`, data),

    // Stats
    getStats: () => apiClient.get('/admin/stats'),
    updateStat: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/stats/${id}`, data),

    // Sections
    getSections: () => apiClient.get('/admin/sections'),
    updateSection: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/sections/${id}`, data),

    // Features
    getFeatures: () => apiClient.get('/admin/features'),
    updateFeature: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/features/${id}`, data),

    // Destinations
    getDestinations: () => apiClient.get('/admin/destinations'),
    updateDestination: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/destinations/${id}`, data),
    createDestination: (data: Record<string, unknown>) => apiClient.post('/admin/destinations', data),
    deleteDestination: (id: number) => apiClient.delete(`/admin/destinations/${id}`),

    // Trips
    getTrips: () => apiClient.get('/admin/trips'),
    updateTrip: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/trips/${id}`, data),
    createTrip: (data: Record<string, unknown>) => apiClient.post('/admin/trips', data),
    deleteTrip: (id: number) => apiClient.delete(`/admin/trips/${id}`),

    // Hotels
    getHotels: () => apiClient.get('/admin/hotels'),
    updateHotel: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/hotels/${id}`, data),
    createHotel: (data: Record<string, unknown>) => apiClient.post('/admin/hotels', data),
    deleteHotel: (id: number) => apiClient.delete(`/admin/hotels/${id}`),

    // Testimonials
    getTestimonials: () => apiClient.get('/admin/testimonials'),
    updateTestimonial: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/testimonials/${id}`, data),
    createTestimonial: (data: Record<string, unknown>) => apiClient.post('/admin/testimonials', data),
    deleteTestimonial: (id: number) => apiClient.delete(`/admin/testimonials/${id}`),

    // Blogs
    getBlogs: () => apiClient.get('/admin/blogs'),
    updateBlog: (id: number, data: Record<string, unknown>) => apiClient.put(`/admin/blogs/${id}`, data),
    createBlog: (data: Record<string, unknown>) => apiClient.post('/admin/blogs', data),
    deleteBlog: (id: number) => apiClient.delete(`/admin/blogs/${id}`),
  },
};
