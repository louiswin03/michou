import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/studio/',
                    '/api/',
                    '/test-calendar/',
                    '/test-lodgify/',
                    '/test-prices/',
                    '/ical-viewer/',
                    '/calendrier-lodgify/',
                ],
            },
            {
                userAgent: 'Googlebot-Image',
                allow: ['/favicon*', '/apple-touch-icon.png', '/images/'],
            },
        ],
        sitemap: 'https://lecrinduvignoble.fr/sitemap.xml',
    }
}
