import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "l'écrin du vignoble - Gîte de Charme en Alsace",
        short_name: "l'écrin du vignoble",
        description: "Gîte haut de gamme 4 personnes avec jacuzzi privatif au cœur du vignoble alsacien à Wettolsheim.",
        start_url: '/',
        display: 'standalone',
        background_color: '#FAF8F5',
        theme_color: '#B8860B',
        lang: 'fr',
        icons: [
            {
                src: '/favicon-48x48.png',
                sizes: '48x48',
                type: 'image/png',
            },
            {
                src: '/favicon-96x96.png',
                sizes: '96x96',
                type: 'image/png',
            },
            {
                src: '/favicon-144x144.png',
                sizes: '144x144',
                type: 'image/png',
            },
            {
                src: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    }
}
