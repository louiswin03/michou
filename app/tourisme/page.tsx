import type { Metadata } from "next"
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

export const metadata: Metadata = {
  title: "Tourisme & Région - L'Écrin du Vignoble | Route des Vins, Colmar, Eguisheim",
  description:
    "Découvrez l'Alsace depuis Wettolsheim : à 10 min d'Eguisheim (plus beau village de France), 5 km de Colmar, sur la Route des Vins. Châteaux, vignobles, gastronomie, randonnées.",
  keywords: [
    "Route des Vins Alsace",
    "Eguisheim",
    "Colmar tourisme",
    "villages alsaciens",
    "vignoble Alsace",
    "activités Alsace",
    "randonnée Alsace",
    "châteaux Alsace",
  ],
  openGraph: {
    title: "Tourisme & Région - L'Écrin du Vignoble | Découvrez l'Alsace",
    description:
      "Position idéale sur la Route des Vins : Eguisheim à 10 min, Colmar à 5 km. Vignobles, châteaux, gastronomie.",
    type: "website",
  },
}

const highlights = [
  {
    icon: MapPin,
    title: "Emplacement Idéal",
    description: "Au cœur du vignoble alsacien, à 10 min à pied d'Eguisheim et 5 km de Colmar",
    color: "gold",
  },
  {
    icon: Wine,
    title: "Route des Vins",
    description: "Sur la célèbre Route des Vins d'Alsace, entouré de vignobles et domaines viticoles",
    color: "gold",
  },
  {
    icon: Castle,
    title: "Villages de Charme",
    description: "Eguisheim, Riquewihr, Kaysersberg... Les plus beaux villages de France à proximité",
    color: "gold",
  },
  {
    icon: Mountain,
    title: "Nature & Randonnées",
    description: "Accès direct aux sentiers viticoles et aux Vosges pour les amateurs de nature",
    color: "gold",
  },
]

const villages = [
  {
    name: "Eguisheim",
    distance: "10 min à pied",
    description: "L'un des plus beaux villages de France, avec ses ruelles circulaires et ses maisons à colombages",
    image: "/images/eguisheim.jpg",
  },
  {
    name: "Colmar",
    distance: "5 km",
    description: "La capitale des Vins d'Alsace, la Petite Venise, musées et architecture exceptionnelle",
    image: "/images/colmar.jpg",
  },
  {
    name: "Riquewihr",
    distance: "15 km",
    description: "Village médiéval fortifié classé parmi les plus beaux villages de France",
    image: "/images/riquewir.jpg",
  },
  {
    name: "Kaysersberg",
    distance: "20 km",
    description: "Village natal d'Albert Schweitzer, marché de Noël réputé, architecture remarquable",
    image: "/images/kaysersberg.jpg",
  },
]

const activities = [
  {
    icon: Wine,
    title: "Dégustation de Vins",
    description: "Visitez les caves et domaines viticoles environnants. Découvrez les Grands Crus d'Alsace.",
  },
  {
    icon: TentTree,
    title: "Randonnées",
    description: "Sentiers balisés dans les vignes et les Vosges. Du GR5 aux balades familiales.",
  },
  {
    icon: Bike,
    title: "Vélo & Cyclotourisme",
    description: "Parcourez la Route des Vins à vélo. Pistes cyclables et circuits aménagés.",
  },
  {
    icon: Castle,
    title: "Châteaux & Patrimoine",
    description: "Haut-Koenigsbourg, châteaux d'Eguisheim, patrimoine médiéval exceptionnel.",
  },
  {
    icon: UtensilsCrossed,
    title: "Gastronomie",
    description: "Restaurants étoilés, winstubs traditionnels, spécialités alsaciennes authentiques.",
  },
  {
    icon: Camera,
    title: "Marchés de Noël",
    description: "Colmar, Riquewihr, Kaysersberg... Les plus beaux marchés de Noël d'Europe (décembre).",
  },

  {
    icon: TreePine,
    title: "Nature & Forêts",
    description: "Parc naturel des Ballons des Vosges, forêts, lacs et panoramas exceptionnels.",
  },
  {
    icon: Car,
    title: "Musées & Loisirs",
    description: "Musée de l'Automobile, Cité du Train (Mulhouse), ou Europa-Park à proximité.",
  },
]

const seasons = [
  {
    season: "Printemps",
    months: "Mars - Mai",
    description: "Floraison des vignes, températures douces, nature en éveil",
    activities: ["Randonnées", "Visites de caves", "Balades à vélo"],
  },
  {
    season: "Été",
    months: "Juin - Août",
    description: "Vignes verdoyantes, festivals, terrasses ensoleillées",
    activities: ["Fêtes du vin", "Randonnées en montagne", "Baignade dans les lacs"],
  },
  {
    season: "Automne",
    months: "Septembre - Novembre",
    description: "Vendanges, couleurs flamboyantes, douceur automnale",
    activities: ["Vendanges", "Dégustation vin nouveau", "Cueillette champignons"],
  },
  {
    season: "Hiver",
    months: "Décembre - Février",
    description: "Marchés de Noël magiques, gastronomie réconfortante",
    activities: ["Marchés de Noël", "Ski dans les Vosges", "Gastronomie d'hiver"],
  },
]

export default function TourismePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] bg-anthracite">
          <div className="absolute inset-0">
            <Image
              src="/images/fall.jpg"
              alt="Vue panoramique sur le vignoble alsacien depuis Wettolsheim avec vue sur la Forêt Noire"
              fill
              className="object-cover opacity-40"
              priority
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <span className="text-gold font-serif text-lg tracking-[0.3em] uppercase mb-4">La Région</span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white max-w-4xl">
              Découvrez l'Alsace Authentique
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl">
              Au cœur de la Route des Vins, entre Vosges et Forêt Noire, explorez un territoire d'exception
            </p>
          </div>
        </section>

        {/* Position Section */}
        <section className="py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Situation</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                Un Emplacement Privilégié
              </h2>
              <p className="mt-4 text-taupe text-lg max-w-3xl mx-auto">
                Le gîte L'Écrin du Vignoble est situé à Wettolsheim, au cœur du vignoble alsacien, dans un cadre
                enchanteur avec des vues sur le vignoble, le village et la Forêt Noire.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {highlights.map((highlight) => (
                <div key={highlight.title} className="bg-white p-8 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <highlight.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-serif text-xl text-slate mb-3">{highlight.title}</h3>
                  <p className="text-taupe leading-relaxed">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Villages Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">À Proximité</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                Villages & Villes à Visiter
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {villages.map((village) => (
                <article key={village.name} className="group bg-cream rounded-3xl overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={village.image}
                      alt={`${village.name} - Village alsacien à ${village.distance} de Wettolsheim`}
                      fill
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
              ))}
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Activités</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                Que Faire en Alsace ?
              </h2>
              <p className="mt-4 text-taupe text-lg max-w-2xl mx-auto">
                Une multitude d'activités vous attend pour découvrir la richesse de notre région
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((activity) => (
                <div key={activity.title} className="bg-white p-6 rounded-2xl hover:bg-gold/10 transition-colors">
                  <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                    <activity.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-medium text-slate mb-2">{activity.title}</h3>
                  <p className="text-sm text-taupe leading-relaxed">{activity.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seasons Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Toute l'Année</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                L'Alsace au Fil des Saisons
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {seasons.map((period) => (
                <div key={period.season} className="bg-cream p-8 rounded-3xl">
                  <h3 className="font-serif text-2xl text-slate mb-2">{period.season}</h3>
                  <p className="text-gold font-medium mb-4">{period.months}</p>
                  <p className="text-taupe mb-6 leading-relaxed">{period.description}</p>
                  <ul className="space-y-2">
                    {period.activities.map((activity) => (
                      <li key={activity} className="flex items-center gap-2 text-slate text-sm">
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
                <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Route des Vins</span>
                <h2 className="mt-4 font-serif text-3xl md:text-4xl mb-6">
                  Sur la Légendaire Route des Vins d'Alsace
                </h2>
                <div className="space-y-4 text-white/80 leading-relaxed">
                  <p>
                    Le gîte est <strong className="text-white">idéalement situé sur la Route des Vins d'Alsace</strong>
                    , itinéraire touristique mythique qui s'étend sur 170 km à travers les plus beaux villages viticoles.
                  </p>
                  <p>
                    Découvrez les <strong className="text-white">7 cépages alsaciens</strong> : Riesling, Gewurztraminer,
                    Pinot Gris, Muscat, Sylvaner, Pinot Blanc et Pinot Noir. Visitez les caves, rencontrez les vignerons
                    passionnés.
                  </p>
                  <p>
                    De nombreux <strong className="text-white">domaines viticoles renommés</strong> vous accueillent pour
                    des dégustations et des visites de caves dans un rayon de quelques kilomètres.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-3xl font-serif text-gold mb-1">51</p>
                    <p className="text-white/70 text-sm">Grands Crus</p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-xl">
                    <p className="text-3xl font-serif text-gold mb-1">170 km</p>
                    <p className="text-white/70 text-sm">Route des Vins</p>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="/images/vin.jpg"
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
              Prêt à Découvrir l'Alsace ?
            </h2>
            <p className="text-taupe text-lg mb-8">
              Réservez votre séjour au cœur du vignoble et vivez une expérience inoubliable
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gite"
                className="px-8 py-4 border-2 border-slate text-slate font-medium tracking-wide rounded-full hover:bg-slate hover:text-white transition-all"
              >
                Découvrir le Gîte
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-gold text-cream font-medium tracking-wide rounded-full hover:bg-gold-dark transition-all"
              >
                Demander un Devis
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
