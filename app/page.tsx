import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import AmenitiesSection from "@/components/amenities-section"
import TestimonialsSection from "@/components/testimonials-section"
import Footer from "@/components/footer"
import Link from "next/link"
import { Home, Sparkles, Map, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "L'Écrin du Vignobl | Gîte de Charme avec Jacuzzi en Alsace - Wettolsheim",
  description:
    "Gîte haut de gamme 4 personnes avec jacuzzi privatif au cœur du vignoble alsacien. À 10 min d'Eguisheim, 5 km de Colmar. Prestations luxe, vue vignoble, parking privé.",
  keywords: [
    "gîte Alsace",
    "location vacances Colmar",
    "gîte avec jacuzzi Alsace",
    "hébergement Eguisheim",
    "Route des Vins",
    "gîte de charme Wettolsheim",
    "location haut de gamme Alsace",
  ],
  openGraph: {
    title: "L'Écrin du Vignobl | Gîte de Charme avec Jacuzzi en Alsace",
    description:
      "Gîte haut de gamme 4 personnes avec jacuzzi privatif. Vue imprenable sur le vignoble alsacien.",
    type: "website",
  },
}

const features = [
  {
    icon: Home,
    title: "Le Gîte",
    description: "2 chambres, jacuzzi 6 places, salon spacieux, cuisine équipée, 4 personnes",
    href: "/gite",
  },
  {
    icon: Map,
    title: "La Région",
    description: "Route des Vins, Colmar, Eguisheim, activités en Alsace",
    href: "/tourisme",
  },
  {
    icon: Calendar,
    title: "Réserver",
    description: "Demandez votre devis personnalisé en quelques clics",
    href: "/contact",
  },
]

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />

        {/* Features Overview */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Découvrez</span>
              <h2 className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate px-4">
                Votre séjour en Alsace
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature) => (
                <Link
                  key={feature.href}
                  href={feature.href}
                  className="group p-6 sm:p-8 bg-cream rounded-2xl hover:bg-gold/10 transition-all hover:scale-105 duration-300"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gold/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-gold group-hover:scale-110 transition-all">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold group-hover:text-cream transition-colors" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl text-slate mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-taupe text-sm leading-relaxed">{feature.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AmenitiesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  )
}
