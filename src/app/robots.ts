import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // ── All crawlers: allow public content, block private paths ──────
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/checkout/',
                    '/payment/',
                    '/events/checkout',
                    '/events/*/tickets',
                    '/my-booking',
                ],
            },
            // ── AI Answer Engines — ALLOW (GEO: helps ChatGPT/Gemini recommend us) ──
            { userAgent: 'GPTBot',          allow: ['/'] },   // ChatGPT / OpenAI
            { userAgent: 'OAI-SearchBot',   allow: ['/'] },   // ChatGPT Search
            { userAgent: 'Google-Extended', allow: ['/'] },   // Gemini / AI Overviews
            { userAgent: 'PerplexityBot',   allow: ['/'] },   // Perplexity AI
            { userAgent: 'anthropic-ai',    allow: ['/'] },   // Claude
            { userAgent: 'ClaudeBot',       allow: ['/'] },   // Claude
            { userAgent: 'YouBot',          allow: ['/'] },   // You.com AI
            { userAgent: 'cohere-ai',       allow: ['/'] },   // Cohere
            // ── Block pure scrapers/training-data harvesters ──────────────────
            { userAgent: 'CCBot',           disallow: ['/'] }, // Common Crawl (training only)
            { userAgent: 'Bytespider',      disallow: ['/'] }, // ByteDance scraper
            { userAgent: 'AmazonBot',       disallow: ['/'] }, // Amazon scraper
        ],
        sitemap: 'https://www.ylootrips.com/sitemap.xml',
        host: 'https://www.ylootrips.com',
    };
}
