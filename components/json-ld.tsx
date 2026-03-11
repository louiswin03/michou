
import { getFooterSettings } from "@/lib/sanity"

export default async function JsonLd() {
    const footer = await getFooterSettings()

    // LodgingBusiness schema - principal
    const lodgingBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "@id": "https://lecrinduvignoble.fr/#lodgingbusiness",
        name: footer?.brandTitle || "l'écrin du vignoble",
        description: footer?.brandDescription || "Gîte de charme haut de gamme avec jacuzzi privatif en Alsace, au cœur du vignoble à Wettolsheim.",
        url: "https://lecrinduvignoble.fr",
        logo: {
            "@type": "ImageObject",
            url: "https://lecrinduvignoble.fr/favicon-96x96.png",
            width: 96,
            height: 96
        },
        telephone: footer?.phone || "+33681842554",
        email: footer?.email || "lexcellent.michel@orange.fr",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Wettolsheim",
            postalCode: "68920",
            addressRegion: "Alsace",
            addressCountry: "FR"
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 48.0567,
            longitude: 7.2997
        },
        amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Jacuzzi Privatif 6 places", value: true },
            { "@type": "LocationFeatureSpecification", name: "Climatisation Daikin", value: true },
            { "@type": "LocationFeatureSpecification", name: "Parking Privé", value: true },
            { "@type": "LocationFeatureSpecification", name: "Borne de recharge électrique", value: true },
            { "@type": "LocationFeatureSpecification", name: "WiFi Fibre Gratuit", value: true },
            { "@type": "LocationFeatureSpecification", name: "Terrasse avec Barbecue", value: true },
            { "@type": "LocationFeatureSpecification", name: "Linge de maison fourni", value: true },
            { "@type": "LocationFeatureSpecification", name: "Ménage inclus", value: true }
        ],
        priceRange: "€€€",
        image: [
            "https://lecrinduvignoble.fr/images/salon.webp",
            "https://lecrinduvignoble.fr/images/jaccuzi.jpeg",
            "https://lecrinduvignoble.fr/images/chambre1.jpeg",
            "https://lecrinduvignoble.fr/images/cuisine.jpeg",
            "https://lecrinduvignoble.fr/images/salon_nuit.webp"
        ],
        starRating: {
            "@type": "Rating",
            ratingValue: "5"
        },
        numberOfRooms: 2,
        petsAllowed: false,
        checkinTime: "16:00",
        checkoutTime: "10:00"
    }

    // WebSite schema pour la recherche Google
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://lecrinduvignoble.fr/#website",
        name: "l'écrin du vignoble",
        url: "https://lecrinduvignoble.fr",
        description: "Gîte de charme avec jacuzzi privatif en Alsace, sur la Route des Vins",
        publisher: {
            "@id": "https://lecrinduvignoble.fr/#lodgingbusiness"
        },
        inLanguage: "fr-FR"
    }

    // BreadcrumbList schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://lecrinduvignoble.fr"
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Le Gîte",
                item: "https://lecrinduvignoble.fr/gite"
            },
            {
                "@type": "ListItem",
                position: 3,
                name: "Tourisme",
                item: "https://lecrinduvignoble.fr/tourisme"
            },
            {
                "@type": "ListItem",
                position: 4,
                name: "Galerie",
                item: "https://lecrinduvignoble.fr/galerie"
            },
            {
                "@type": "ListItem",
                position: 5,
                name: "Contact",
                item: "https://lecrinduvignoble.fr/contact"
            }
        ]
    }

    // LocalBusiness pour Google Maps
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://lecrinduvignoble.fr/#localbusiness",
        name: "l'écrin du vignoble - Gîte de Charme",
        image: "https://lecrinduvignoble.fr/images/salon.webp",
        logo: {
            "@type": "ImageObject",
            url: "https://lecrinduvignoble.fr/favicon-96x96.png",
            width: 96,
            height: 96
        },
        telephone: footer?.phone || "+33681842554",
        email: footer?.email || "lexcellent.michel@orange.fr",
        address: {
            "@type": "PostalAddress",
            addressLocality: "Wettolsheim",
            postalCode: "68920",
            addressRegion: "Grand Est",
            addressCountry: "FR"
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 48.0567,
            longitude: 7.2997
        },
        url: "https://lecrinduvignoble.fr",
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: "00:00",
            closes: "23:59"
        },
        priceRange: "€€€",
        currenciesAccepted: "EUR",
        paymentAccepted: "Cash, Credit Card",
        areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: {
                "@type": "GeoCoordinates",
                latitude: 48.0567,
                longitude: 7.2997
            },
            geoRadius: "50000"
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingBusinessSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
            />
        </>
    )
}
