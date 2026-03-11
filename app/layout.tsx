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
  title: {
    default: "l'écrin du vignoble | Gîte de Charme et Spa en Alsace - Wettolsheim",
    template: "%s | l'écrin du vignoble",
  },
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
    "location gîte Colmar",
    "vacances Alsace",
    "spa privatif Alsace",
    "hébergement Route des Vins",
  ],
  authors: [{ name: "l'écrin du vignoble" }],
  openGraph: {
    title: "l'écrin du vignoble | Gîte de Charme et Spa en Alsace",
    description:
      "Gîte haut de gamme 4 personnes avec jacuzzi privatif au cœur du vignoble alsacien. Vue imprenable, prestations luxe.",
    url: "https://lecrinduvignoble.fr",
    siteName: "l'écrin du vignoble",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: "https://lecrinduvignoble.fr/images/salon.webp",
        width: 1200,
        height: 630,
        alt: "Salon lumineux du gîte l'écrin du vignoble avec vue sur le vignoble alsacien",
      },
      {
        url: "https://lecrinduvignoble.fr/images/jaccuzi.jpeg",
        width: 1200,
        height: 630,
        alt: "Jacuzzi privatif du gîte l'écrin du vignoble en Alsace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "l'écrin du vignoble | Gîte de Charme et Spa en Alsace",
    description:
      "Gîte haut de gamme 4 personnes avec jacuzzi privatif au cœur du vignoble alsacien. Vue imprenable, prestations luxe.",
    images: ["https://lecrinduvignoble.fr/images/salon.webp"],
  },
  metadataBase: new URL("https://lecrinduvignoble.fr"),
  alternates: {
    canonical: "https://lecrinduvignoble.fr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
}

import JsonLd from "@/components/json-ld"



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Favicon is handled by metadata, but we can add specific tracking scripts here if needed */}
      </head>
      <body className="font-sans antialiased">
        <JsonLd />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
