
import { MetadataRoute } from 'next'
import { createClient } from 'next-sanity'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

// We use a simpler client config here as this runs at build time/request time on server
const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false, // We want fresh data for sitemap
    token // Token might be needed if pages are private, but usually public read is enough. Including just in case.
})

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://lecrinduvignoble.fr' // Updated to the domain user mentioned/implied. Or fallback to Vercel URL.

    // Static routes
    const routes = [
        '',
        '/gite',
        '/tourisme',
        '/contact',
        '/galerie',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic routes from Sanity (Legal Pages)
    // We fetch only the slug
    const legalPages = await client.fetch(`*[_type == "legalPage"]{ "slug": slug.current }`)

    const legalRoutes = legalPages.map((page: any) => ({
        url: `${baseUrl}/legal/${page.slug}`,
        lastModified: new Date(),
        changeFrequency: 'yearly' as const,
        priority: 0.3,
    }))

    return [...routes, ...legalRoutes]
}
