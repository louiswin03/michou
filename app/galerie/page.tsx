import type { Metadata } from "next"
import GalleryGrid from "@/components/gallery-grid"

export const metadata: Metadata = {
  title: "Galerie Photos - l'écrin du vignoble | Gîte de Charme en Alsace",
  description:
    "Explorez en images notre gîte de charme à Wettolsheim. Salon spacieux, chambres confortables, jacuzzi privatif, cuisine équipée et extérieurs verdoyants.",
  keywords: ["photos gîte alsace", "galerie photo location vacances", "images jacuzzi wettolsheim", "intérieur gîte charme"],
  alternates: {
    canonical: "https://lecrinduvignoble.fr/galerie",
  },
  openGraph: {
    title: "Galerie Photos - l'écrin du vignoble",
    description: "Découvrez l'atmosphère unique de notre gîte en images : salon, chambres, jacuzzi et plus encore.",
    type: "website",
    url: "https://lecrinduvignoble.fr/galerie",
    siteName: "l'écrin du vignoble",
    locale: "fr_FR",
    images: [
      {
        url: "https://lecrinduvignoble.fr/images/salon.webp",
        width: 1200,
        height: 630,
        alt: "Salon lumineux du gîte l'écrin du vignoble avec poutres apparentes",
      },
      {
        url: "https://lecrinduvignoble.fr/images/jaccuzi.jpeg",
        width: 1200,
        height: 630,
        alt: "Jacuzzi privatif du gîte en Alsace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galerie Photos - l'écrin du vignoble",
    description: "Découvrez l'atmosphère unique de notre gîte en images.",
    images: ["https://lecrinduvignoble.fr/images/salon.webp"],
  },
}

export default function GaleriePage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-slate text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-center sm:text-left">Galerie Photos</h1>
          <p className="mt-4 text-lg text-white/80 text-center sm:text-left">Découvrez notre gîte de charme en Alsace</p>
        </div>
      </div>

      <GalleryGrid />
    </div>
  )
}
