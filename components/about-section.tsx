"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin, Users, Star, Sparkles, Images } from "lucide-react"
import GalleryModal from "./gallery-modal"

const highlights = [
  { icon: MapPin, label: "Emplacement idéal", desc: "À 5km de Colmar" },
  { icon: Users, label: "4 à 6 personnes", desc: "Idéal en famille" },
  { icon: Star, label: "Haut de gamme", desc: "Prestations luxe" },
  { icon: Sparkles, label: "Jacuzzi inclus", desc: "Ouvert toute l'année" },
]

export default function AboutSection() {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  return (
    <section id="gite" className="py-24 lg:py-32 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">En quelques mots</span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate leading-tight">
              Un écrin de douceur sur la Route des Vins
            </h2>
            <p className="mt-6 text-taupe text-lg leading-relaxed">
              Niché au cœur de Wettolsheim, notre gîte vous accueille dans un cadre enchanteur avec des vues imprenables
              sur le vignoble, le village et la Forêt Noire. Situé au premier étage avec entrée indépendante, dans un
              parc de 2500 m² au calme absolu.
            </p>
            <p className="mt-4 text-taupe text-lg leading-relaxed">
              Tout a été pensé pour votre confort : climatisation Daikin haut de gamme, WiFi fibre très haut débit,
              linge de maison fourni, lits faits à votre arrivée. Le ménage de fin de séjour et la taxe de séjour sont
              inclus.
            </p>

            {/* Highlights Grid */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              {highlights.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate">{item.label}</h3>
                    <p className="text-sm text-taupe">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/salon.jpeg"
                    alt="Salon lumineux avec poutres en bois et canapé confortable"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="/images/cuisine.jpeg"
                    alt="Cuisine moderne équipée avec hublot design"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src="/images/chambre1.jpeg"
                    alt="Chambre cosy avec lit double et éclairage tamisé"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/jaccuzi2.jpeg"
                    alt="Extérieur moderne du gîte L'Écrin du Vignoble"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Gallery Button */}
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
            >
              <Images className="w-5 h-5" />
              <span>Afficher toutes les photos</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
    </section>
  )
}
