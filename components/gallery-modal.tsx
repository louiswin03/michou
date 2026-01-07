"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

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

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative h-full overflow-y-auto">
        {/* Header with close button */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl text-white">Galerie Photos</h2>
                <p className="mt-2 text-white/70">Découvrez notre gîte de charme</p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Fermer la galerie"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 pb-20">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  loading={index < 8 ? "eager" : "lazy"}
                  priority={index < 4}
                  quality={85}
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
      </div>

      {/* Lightbox for individual photo */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black/98 z-[60] flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            onClick={() => setSelectedImage(null)}
            aria-label="Fermer l'image"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photos[selectedImage].src}
              alt={photos[selectedImage].alt}
              fill
              sizes="(max-width: 768px) 100vw, 90vw"
              quality={90}
              priority
              className="object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pointer-events-none">
              <p className="text-white text-lg font-medium">{photos[selectedImage].alt}</p>
              <p className="text-white/70 text-sm mt-1">{photos[selectedImage].category}</p>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage((prev) => (prev === 0 ? photos.length - 1 : prev! - 1))
            }}
            aria-label="Photo précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage((prev) => (prev === photos.length - 1 ? 0 : prev! + 1))
            }}
            aria-label="Photo suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-full">
            {selectedImage + 1} / {photos.length}
          </div>
        </div>
      )}
    </div>
  )
}
