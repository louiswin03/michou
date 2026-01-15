import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/studio/', // Disallow Sanity studio from indexing
        },
        sitemap: 'https://ecrin-vignoble.fr/sitemap.xml',
    }
}
