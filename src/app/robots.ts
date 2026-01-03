import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/api/',
                    '/checkout/',
                    '/payment/',
                ],
            },
        ],
        sitemap: 'https://www.ylootrips.com/sitemap.xml',
    };
}
