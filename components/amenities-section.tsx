import {
  Wifi,
  Car,
  Wind,
  Waves,
  Tv,
  WashingMachine,
  UtensilsCrossed,
  Zap,
  ShowerHead,
  Gamepad2,
  Sun,
  Flame,
} from "lucide-react"

const amenities = [
  { icon: Wifi, label: "WiFi Fibre", desc: "Très haut débit gratuit" },
  { icon: Waves, label: "Jacuzzi", desc: "6 places, toute l'année" },
  { icon: Wind, label: "Climatisation", desc: "Daikin haut de gamme" },
  { icon: Car, label: "Parking Privé", desc: "Plusieurs places" },
  { icon: Zap, label: "Borne Électrique", desc: "Pour véhicule électrique" },
  { icon: Tv, label: "TV Samsung", desc: '50" + Samsung Frame' },
  { icon: WashingMachine, label: "Lave-linge", desc: "Sèche-linge inclus" },
  { icon: UtensilsCrossed, label: "Cuisine Équipée", desc: "Tout confort" },
  { icon: ShowerHead, label: "Linge Fourni", desc: "Toilette et maison" },
  { icon: Gamepad2, label: "Jeux de Société", desc: "Pour toute la famille" },
  { icon: Sun, label: "Terrasse", desc: "Table et chaises" },
  { icon: Flame, label: "Barbecue", desc: "Électrique à disposition" },
]

export default function AmenitiesSection() {
  return (
    <section id="services" className="py-24 lg:py-32 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Équipements & Services</span>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">Tout pour votre confort</h2>
          <p className="mt-6 text-taupe text-lg">
            Des prestations haut de gamme pour un séjour sans compromis. 
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {amenities.map((item) => (
            <div
              key={item.label}
              className="group p-6 bg-card rounded-2xl text-center hover:bg-gold/5 transition-colors"
            >
              <div className="w-14 h-14 mx-auto bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <item.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="mt-4 font-medium text-slate">{item.label}</h3>
              <p className="mt-1 text-sm text-taupe">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Jacuzzi Highlight */}
        <div className="mt-20 bg-anthracite rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2 items-center">
            <div className="p-10 lg:p-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Expérience Exclusive</span>
              <h3 className="mt-4 font-serif text-3xl md:text-4xl text-white">Jacuzzi Privatif</h3>
              <p className="mt-6 text-white/80 text-lg leading-relaxed">
                Profitez de moments de détente absolue dans notre jacuzzi extérieur 6 places, ouvert toute l'année.
                Situé sur une terrasse supplémentaire dans le jardin, il offre une vue imprenable sur le vignoble.
              </p>
              <ul className="mt-8 space-y-3">
                {["6 places", "Ouvert toute l'année", "Vue sur le vignoble", "Accès privatif"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <div className="w-2 h-2 bg-gold rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-anthracite via-transparent to-transparent z-10 lg:block hidden" />
              <img
                src="/images/jaccuzi.jpeg"
                alt="Jacuzzi extérieur privatif avec vue sur le vignoble"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
