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
                    '/payment-demo',
                    '/stories/write',
                    '/*?*',             // block all query-string variants (prevents param abuse)
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
            { userAgent: 'meta-externalagent', allow: ['/'] }, // Meta AI (Llama)
            { userAgent: 'Applebot-Extended',  allow: ['/'] }, // Apple AI / Siri
            { userAgent: 'DuckDuckBot',        allow: ['/'] }, // DuckDuckGo AI
            { userAgent: 'Amazonbot',          allow: ['/'] }, // Alexa AI (allow AI, block pure scraper below)
            { userAgent: 'facebookexternalhit', allow: ['/'] }, // Meta link previews
            { userAgent: 'Twitterbot',          allow: ['/'] }, // Twitter/X cards
            { userAgent: 'xAI-SearchBot',       allow: ['/'] }, // xAI / Grok
            { userAgent: 'MistralBot',          allow: ['/'] }, // Mistral AI
            { userAgent: 'NaverBot',            allow: ['/'] }, // Naver AI (Korea)
            { userAgent: 'BingBot',             allow: ['/'] }, // Bing / Copilot AI
            // ── Block pure scrapers/training-data harvesters ──────────────────
            { userAgent: 'CCBot',           disallow: ['/'] }, // Common Crawl (training only)
            { userAgent: 'Bytespider',      disallow: ['/'] }, // ByteDance scraper
            // AmazonBot — allowed above for Alexa AI indexing
        ],
        sitemap: 'https://www.ylootrips.com/sitemap.xml',
        host: 'https://www.ylootrips.com',
    };
}
