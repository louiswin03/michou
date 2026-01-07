import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "L'Écrin du Vignoble | Gîte de Charme et Spa en Alsace - Wettolsheim",
  description:
    "Découvrez notre gîte haut de gamme 4 personnes avec jacuzzi privatif au cœur du vignoble alsacien. À 10 min d'Eguisheim, 5 km de Colmar. Prestations luxe, vue vignoble.",
  keywords: [
    "gîte Alsace",
    "location vacances Colmar",
    "gîte avec jacuzzi",
    "Route des Vins Alsace",
    "hébergement Eguisheim",
    "gîte de charme",
    "Wettolsheim",
  ],
  authors: [{ name: "L'Écrin du Vignoble" }],
  openGraph: {
    title: "L'Écrin du Vignoble | Gîte de Charme et Spa en Alsace",
    description:
      "Gîte haut de gamme 4 personnes avec jacuzzi privatif au cœur du vignoble alsacien. Vue imprenable, prestations luxe.",
    url: "https://ecrin-vignoble.fr",
    siteName: "L'Écrin du Vignoble",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "L'Écrin du Vignoble",
  description:
    "Gîte de charme 4 personnes avec jacuzzi privatif au cœur du vignoble alsacien, à 10 minutes d'Eguisheim.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Wettolsheim",
    addressLocality: "Wettolsheim",
    postalCode: "68920",
    addressRegion: "Alsace",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 48.0567,
    longitude: 7.2997,
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Jacuzzi", value: true },
    { "@type": "LocationFeatureSpecification", name: "WiFi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Climatisation", value: true },
  ],
  priceRange: "€€€",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
