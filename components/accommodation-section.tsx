import Image from "next/image"
import { Check } from "lucide-react"

const rooms = [
  {
    title: "Chambre Principale",
    subtitle: "12 m² de confort",
    image: "/images/img-8484.jpeg",
    features: ["Lit 160 cm", "TV Samsung Frame", "Éclairage d'ambiance"],
  },
  {
    title: "Chambre sous Combles",
    subtitle: "Espace généreux",
    image: "/images/img-8492-202.jpeg",
    features: ["2 lits 90 cm modulables", "Téléviseur", "Atmosphère cocooning"],
  },
  {
    title: "Salon avec Vue",
    subtitle: "Espace de vie lumineux",
    image: "/images/img-8494.jpeg",
    features: ['TV Samsung 50"', "Canapé convertible 160 cm", "Terrasse privée"],
  },
]

export default function AccommodationSection() {
  return (
    <section className="py-24 lg:py-32 bg-cream-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Hébergement</span>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">Des espaces pensés pour vous</h2>
          <p className="mt-6 text-taupe text-lg">
            Chaque pièce a été aménagée avec soin pour vous offrir un séjour inoubliable au cœur du vignoble alsacien.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <article
              key={room.title}
              className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={room.image || "/placeholder.svg"}
                  alt={room.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-slate">{room.title}</h3>
                <p className="text-gold text-sm mt-1">{room.subtitle}</p>
                <ul className="mt-4 space-y-2">
                  {room.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-taupe">
                      <Check className="w-4 h-4 text-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
