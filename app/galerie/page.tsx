"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

const photos = [
  { src: "/images/salon.jpeg", alt: "Salon lumineux avec poutres en bois et canapé confortable", category: "Salon" },
  { src: "/images/salon_nuit.jpeg", alt: "Salon de nuit avec éclairage d'ambiance", category: "Salon" },
  { src: "/images/salon2.jpeg", alt: "Vue alternative du salon", category: "Salon" },
  { src: "/images/cuisine.jpeg", alt: "Cuisine moderne équipée avec hublot design", category: "Cuisine" },
  { src: "/images/chambre1.jpeg", alt: "Chambre 1 cosy avec lit double et éclairage tamisé", category: "Chambres" },
  { src: "/images/chambre2.jpeg", alt: "Chambre 2 avec deux lits simples", category: "Chambres" },
  { src: "/images/télé_chambre1.jpg", alt: "Télévision dans la chambre 1", category: "Chambres" },
  { src: "/images/SDB.jpeg", alt: "Salle de bain moderne", category: "Salle de bain" },
  { src: "/images/douche.jpeg", alt: "Douche spacieuse", category: "Salle de bain" },
  { src: "/images/toilettes.jpeg", alt: "Toilettes", category: "Salle de bain" },
  { src: "/images/couloir.jpeg", alt: "Couloir et rangements", category: "Intérieur" },
  { src: "/images/jaccuzi.jpeg", alt: "Jacuzzi extérieur 6 places", category: "Extérieur" },
  { src: "/images/jaccuzi2.jpeg", alt: "Jacuzzi de nuit", category: "Extérieur" },
  { src: "/images/garage.jpeg", alt: "Parking privé sécurisé", category: "Extérieur" },
  { src: "/images/table.jpg", alt: "Espace repas", category: "Cuisine" },
  { src: "/images/télé.jpg", alt: "Écran plat salon", category: "Salon" },
  { src: "/images/lave_linge.jpeg", alt: "Lave-linge et sèche-linge", category: "Équipements" },
  { src: "/images/clim.jpg", alt: "Climatisation Daikin", category: "Équipements" },
]

export default function GaleriePage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-slate text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl">Galerie Photos</h1>
          <p className="mt-4 text-lg text-white/80">Découvrez notre gîte de charme en Alsace</p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium">{photo.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gold transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[selectedImage].src}
              alt={photos[selectedImage].alt}
              fill
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-lg">{photos[selectedImage].alt}</p>
              <p className="text-white/60 text-sm mt-1">{photos[selectedImage].category}</p>
            </div>
          </div>
          {/* Navigation buttons */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage((prev) => (prev === 0 ? photos.length - 1 : prev! - 1))
            }}
          >
            ←
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage((prev) => (prev === photos.length - 1 ? 0 : prev! + 1))
            }}
          >
            →
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selectedImage + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  )
}
