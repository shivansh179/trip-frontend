import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self), payment=(self)' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Scripts: self + inline (Next.js needs it) + GA + Easebuzz
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ebz-static.s3.ap-south-1.amazonaws.com",
      // Styles: self + inline (Tailwind/CSS-in-JS)
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      // Fonts
      "font-src 'self' https://fonts.gstatic.com",
      // Images: self + data URIs + known CDNs
      "img-src 'self' data: blob: https:",
      // Connect: self + analytics + backend + Resend + Upstash
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://trip-backend-65232427280.asia-south1.run.app https://api.resend.com https://*.upstash.io",
      // Frames: Easebuzz payment iframe
      "frame-src 'self' https://pay.easebuzz.in https://ebz-static.s3.ap-south-1.amazonaws.com",
      // Media
      "media-src 'self' https:",
      // Workers
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://pay.easebuzz.in",
      "upgrade-insecure-requests",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  serverExternalPackages: ['@google-cloud/storage'],

  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      // Cache static assets aggressively
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // Cache images
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'www.captureatrip.com' },
      { protocol: 'https', hostname: 'd1zvcmhypeawxj.cloudfront.net' },
      { protocol: 'https', hostname: '*.bmscdn.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'serpapi.com' },
      { protocol: 'https', hostname: 'trip-backend-65232427280.asia-south1.run.app' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react', '@tiptap/react', '@tiptap/starter-kit'],
  },
};

export default nextConfig;
