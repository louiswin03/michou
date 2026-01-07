import { MapPin, Clock, Wine, Mountain, Castle, Church } from "lucide-react"

const attractions = [
  {
    icon: Castle,
    name: "Eguisheim",
    distance: "10 min à pied",
    desc: "Un des plus beaux villages de France",
  },
  {
    icon: Wine,
    name: "Colmar",
    distance: "5 km",
    desc: "Petite Venise et marchés de Noël",
  },
  {
    icon: Church,
    name: "Kaysersberg",
    distance: "15 km",
    desc: "Village préféré des Français 2017",
  },
  {
    icon: Mountain,
    name: "Route des Vins",
    distance: "Sur place",
    desc: "170 km de vignobles",
  },
  {
    icon: Castle,
    name: "Haut-Koenigsbourg",
    distance: "25 km",
    desc: "Château médiéval emblématique",
  },
  {
    icon: Wine,
    name: "Caves viticoles",
    distance: "Alentours",
    desc: "Dégustations et visites",
  },
]

export default function TourismSection() {
  return (
    <section id="tourisme" className="py-24 lg:py-32 bg-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Map / Image */}
          <div className="relative">
            <div className="aspect-square rounded-3xl overflow-hidden bg-cream-dark">
              <img
                src="/aerial-view-of-alsace-wine-route-vineyards-with-tr.jpg"
                alt="Vue aérienne de la Route des Vins d'Alsace"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Location Badge */}
            <div className="absolute -bottom-6 -right-6 bg-card rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-serif text-xl text-slate">Wettolsheim</p>
                  <p className="text-sm text-taupe">Cœur du vignoble</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">À Découvrir</span>
            <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
              Au cœur de l'Alsace touristique
            </h2>
            <p className="mt-6 text-taupe text-lg leading-relaxed">
              Profitez d'un emplacement privilégié pour explorer les trésors de l'Alsace. Villages pittoresques,
              vignobles à perte de vue, gastronomie et marchés de Noël féeriques vous attendent.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {attractions.map((item) => (
                <div key={item.name} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate">{item.name}</h3>
                    <p className="text-sm text-gold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.distance}
                    </p>
                    <p className="text-sm text-taupe mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
