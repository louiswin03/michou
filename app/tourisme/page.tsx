import type { Metadata } from "next"
export const revalidate = 60

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Wine,
  Mountain,
  Castle,
  Church,
  UtensilsCrossed,
  Heart,
  Camera,
  TentTree,
  Bike,
  TramFront,
  TreePine,
  Car,
} from "lucide-react"
import { getRegionPage, urlFor, type RegionPage } from "@/lib/sanity"

// Fallback Data & Configuration
const FALLBACK_IMAGES: Record<string, string> = {
  "Eguisheim": "/images/eguisheim.jpg",
  "Colmar": "/images/colmar.jpg",
  "Riquewihr": "/images/riquewir.jpg",
  "Kaysersberg": "/images/kaysersberg.jpg",
  "Route des Vins": "/images/vin.jpg",
}

const ICON_MAP: Record<string, any> = {
  MapPin,
  Wine,
  Castle,
  Mountain,
  TentTree, // Rando
  Bike,
  UtensilsCrossed, // Gastronomie
  Camera, // Photo
  TreePine, // Nature
  Car, // Musées
  Church,
  TramFront,
  Heart,
}

// Generate Metadata
export async function generateMetadata(): Promise<Metadata> {
  const page = await getRegionPage()

  const title = page?.seo?.metaTitle || "Tourisme & Région - l'écrin du vignoble | Route des Vins, Colmar, Eguisheim"
  const description = page?.seo?.metaDescription || "Découvrez l'Alsace depuis Wettolsheim : à 10 min d'Eguisheim (plus beau village de France), 5 km de Colmar, sur la Route des Vins. Châteaux, vignobles, gastronomie, randonnées."

  return {
    title,
    description,
    keywords: page?.seo?.keywords || [
      "Route des Vins Alsace",
      "Eguisheim",
      "Colmar tourisme",
      "villages alsaciens",
      "vignoble Alsace",
      "activités Alsace",
      "randonnée Alsace",
      "châteaux Alsace",
    ],
    alternates: {
      canonical: "https://lecrinduvignoble.fr/tourisme",
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://lecrinduvignoble.fr/tourisme",
      siteName: "l'écrin du vignoble",
      locale: "fr_FR",
      images: [
        {
          url: "https://lecrinduvignoble.fr/images/fall.webp",
          width: 1200,
          height: 630,
          alt: "Vue panoramique sur le vignoble alsacien en automne",
        },
        {
          url: "https://lecrinduvignoble.fr/images/eguisheim.jpg",
          width: 1200,
          height: 630,
          alt: "Village d'Eguisheim sur la Route des Vins d'Alsace",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://lecrinduvignoble.fr/images/fall.webp"],
    },
  }
}

export default async function TourismePage() {
  const page = await getRegionPage()

  // Use Sanity data or Fallback to hardcoded constants if strictly necessary (though initialValue handles text)
  // For images, we use fallbacks if asset is missing.

  // For images, we use fallbacks if asset is missing.

  const hero = page?.heroSection
  const position = page?.positionSection
  const villages = page?.villagesSection?.villages
  const activities = page?.activitiesSection?.activities
  const seasons = page?.seasonsSection?.seasons
  const wineRoute = page?.wineRouteSection
  const cta = page?.ctaSection

  // Hardcoded Fallbacks for empty arrays (just in case)
  // Note: Only needed if the user clears the array in Sanity. 
  // Given initialValue, these should be populated.

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] bg-anthracite">
          <div className="absolute inset-0">
            <Image
              src="/images/fall.webp"
              alt="Vue panoramique sur le vignoble alsacien depuis Wettolsheim avec vue sur la Forêt Noire"
              fill
              className="object-cover opacity-40"
              priority
              quality={60}
              sizes="100vw"
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <span className="text-white drop-shadow-md font-serif text-lg tracking-[0.3em] uppercase mb-4">
              {hero?.badge || "La Région"}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white max-w-4xl">
              {hero?.title || "Découvrez l'Alsace Authentique"}
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl">
              {hero?.subtitle || "Au cœur de la Route des Vins, entre Vosges et Forêt Noire, explorez un territoire d'exception"}
            </p>
          </div>
        </section>

        {/* Position Section */}
        <section className="py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">
                {position?.badge || "Situation"}
              </span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                {position?.title || "Un Emplacement Privilégié"}
              </h2>
              <p className="mt-4 text-taupe text-lg max-w-3xl mx-auto">
                {position?.description || "Le gîte l'écrin du vignoble est situé à Wettolsheim, au cœur du vignoble alsacien..."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {position?.highlights?.map((highlight, idx) => {
                const Icon = ICON_MAP[highlight.icon] || MapPin
                return (
                  <div key={idx} className="bg-white p-8 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="font-serif text-xl text-slate mb-3">{highlight.title}</h3>
                    <p className="text-taupe leading-relaxed">{highlight.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Villages Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">
                {page?.villagesSection?.badge || "À Proximité"}
              </span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                {page?.villagesSection?.title || "Villages & Villes à Visiter"}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {villages?.map((village, idx) => {
                const imageSrc = village.image?.asset
                  ? urlFor(village.image).url()
                  : (FALLBACK_IMAGES[village.name] || "/images/placeholder.jpg")

                return (
                  <article key={idx} className="group bg-cream rounded-3xl overflow-hidden">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={imageSrc}
                        alt={village.name || "Village"}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4 bg-gold text-cream px-4 py-2 rounded-full text-sm font-medium">
                        {village.distance}
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-serif text-2xl text-slate mb-3">{village.name}</h3>
                      <p className="text-taupe leading-relaxed">{village.description}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">
                {page?.activitiesSection?.badge || "Activités"}
              </span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                {page?.activitiesSection?.title || "Que Faire en Alsace ?"}
              </h2>
              <p className="mt-4 text-taupe text-lg max-w-2xl mx-auto">
                {page?.activitiesSection?.description || "Une multitude d'activités vous attend..."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities?.map((activity, idx) => {
                const Icon = ICON_MAP[activity.icon] || Wine
                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl hover:bg-gold/10 transition-colors">
                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-gold" />
                    </div>
                    <h3 className="font-medium text-slate mb-2">{activity.title}</h3>
                    <p className="text-sm text-taupe leading-relaxed">{activity.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Seasons Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">
                {page?.seasonsSection?.badge || "Toute l'Année"}
              </span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                {page?.seasonsSection?.title || "L'Alsace au Fil des Saisons"}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {seasons?.map((period, idx) => (
                <div key={idx} className="bg-cream p-8 rounded-3xl">
                  <h3 className="font-serif text-2xl text-slate mb-2">{period.season}</h3>
                  <p className="text-gold font-medium mb-4">{period.months}</p>
                  <p className="text-taupe mb-6 leading-relaxed">{period.description}</p>
                  <ul className="space-y-2">
                    {period.activities?.map((activity, j) => (
                      <li key={j} className="flex items-center gap-2 text-slate text-sm">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Route des Vins Section */}
        <section className="py-20 bg-anthracite text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">
                  {wineRoute?.badge || "Route des Vins"}
                </span>
                <h2 className="mt-4 font-serif text-3xl md:text-4xl mb-6">
                  {wineRoute?.title || "Sur la Légendaire Route des Vins d'Alsace"}
                </h2>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  {wineRoute?.paragraphs?.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  {wineRoute?.stats?.map((stat, idx) => (
                    <div key={idx} className="bg-white/10 p-4 rounded-xl">
                      <p className="text-3xl font-serif text-gold mb-1">{stat.value}</p>
                      <p className="text-white/70 text-sm">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src={
                    wineRoute?.image?.asset
                      ? urlFor(wineRoute.image).url()
                      : (FALLBACK_IMAGES["Route des Vins"] || "/images/vin.jpg")
                  }
                  alt="Vignoble alsacien au coucher du soleil sur la Route des Vins"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-cream text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Heart className="w-16 h-16 text-gold mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-slate mb-6">
              {cta?.title || "Prêt à Découvrir l'Alsace ?"}
            </h2>
            <p className="text-taupe text-lg mb-8">
              {cta?.text || "Réservez votre séjour au cœur du vignoble et vivez une expérience inoubliable"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={cta?.button1Link || "/gite"}
                className="px-8 py-4 border-2 border-slate text-slate font-medium tracking-wide rounded-full hover:bg-slate hover:text-white transition-all"
              >
                {cta?.button1Text || "Découvrir le Gîte"}
              </Link>
              <Link
                href={cta?.button2Link || "/contact"}
                className="px-8 py-4 bg-gold text-cream font-medium tracking-wide rounded-full hover:bg-gold-dark transition-all"
              >
                {cta?.button2Text || "Demander un Devis"}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
