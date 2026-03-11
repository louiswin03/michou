import type { Metadata } from "next"
export const revalidate = 60

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import {
  Bed,
  Users,
  Maximize2,
  Tv,
  Wind,
  Wifi,
  Bath,
  Home,
  Sparkles,
  Car,
  Utensils,
  WashingMachine,
  Shirt,
  Coffee,
  Zap,
  PartyPopper,
  TreePine,
  LucideIcon,
} from "lucide-react"
import { getGitePage, urlFor, type GitePage } from "@/lib/sanity"

// Mapping des icônes
const iconMap: Record<string, LucideIcon> = {
  Bed, Users, Maximize2, Tv, Wind, Wifi, Bath, Home, Sparkles, Car, Utensils,
  WashingMachine, Shirt, Coffee, Zap, PartyPopper, TreePine,
}

// Valeurs par défaut
const defaultData = {
  hero: {
    badge: 'Le Gîte',
    title: 'Un Appartement Pensé pour Votre Confort',
    subtitle: 'Prestations haut de gamme dans un cadre enchanteur avec vue sur le vignoble',
  },
  descriptionSection: {
    title: 'Un Écrin au Cœur du Vignoble',
    paragraph1: "l'écrin du vignoble est prévu pour 4 personnes et idéal pour une famille. Situé à Wettolsheim au cœur du vignoble et à 10 minutes à pied d'Eguisheim, un des plus beaux villages de France. Vous êtes à 5 km du centre de Colmar.",
    paragraph2: "L'appartement est attenant au logement du propriétaire avec une entrée indépendante au premier étage dans un parc de 2500 m² au calme absolu. Profitez de vues imprenables sur le vignoble, le village et la Forêt Noire.",
    features: [
      { icon: 'Bed', label: '2 chambres + canapé-lit', desc: '4 personnes max' },
      { icon: 'Users', label: '4 personnes', desc: '' },
      { icon: 'Maximize2', label: 'Grand espace', desc: 'Confort optimal' },
      { icon: 'Sparkles', label: 'Jacuzzi privatif', desc: '6 places' },
    ],
  },
  roomsSection: {
    badge: 'Les Espaces',
    title: 'Chambres et Pièces de Vie',
    rooms: [
      { title: 'Cuisine', size: 'Équipée', description: 'Tout le nécessaire fourni : vaisselle, électroménager, condiments', imageSrc: '/images/cuisine.jpeg', alt: 'Cuisine moderne entièrement équipée avec hublot design' },
      { title: 'Salon', size: 'Spacieux', description: 'TV Samsung 50 pouces, canapé convertible 160 cm', imageSrc: '/images/salon.webp', alt: 'Salon chaleureux avec TV 50 pouces et poutres apparentes' },
      { title: 'Chambre 1', size: '12 m²', description: 'Lit double 160 cm avec TV Samsung Frame', imageSrc: '/images/chambre1.jpeg', alt: 'Chambre principale avec lit double 160 cm et TV Samsung Frame' },
      { title: 'Chambre 2', size: 'Sous combles', description: 'Deux lits de 90 cm pouvant former un grand lit double', imageSrc: '/images/chambre2.jpeg', alt: 'Chambre sous combles avec deux lits simples modulables' },
      { title: 'Salle de bain', size: 'Moderne', description: "Salle de bain spacieuse avec douche à l'italienne", imageSrc: '/images/SDB.jpeg', alt: 'Salle de bain moderne avec douche' },
    ],
  },
  servicesSection: {
    badge: 'Prestations',
    title: "Équipements d'Exception",
    services: [
      { icon: 'Sparkles', title: 'Jacuzzi Extérieur', subtitle: "6 places - Ouvert toute l'année", description: "Profitez d'un jacuzzi privatif 6 places intégré dans une terrasse aménagée dans le parc. Ouvert toute l'année pour des moments de détente inoubliables.", imageSrc: '/images/jaccuzi.jpeg', highlight: true },
      { icon: 'Wind', title: 'Climatisation Haut de Gamme', subtitle: '2 cassettes DAIKIN', description: 'Le gîte est climatisé par deux cassettes haut de gamme DAIKIN pour garantir votre confort en toutes saisons, été comme hiver.', imageSrc: '/images/clim.jpg', highlight: false },
      { icon: 'Utensils', title: 'Terrasse avec Barbecue', subtitle: 'Mobilier de jardin', description: 'Terrasse équipée avec table et chaises pour profiter de la vue sur le vignoble. Barbecue électrique à disposition pour vos repas en plein air.', imageSrc: '/images/table.jpg', highlight: false },
      { icon: 'Car', title: 'Parking Privatif', subtitle: 'Borne de recharge électrique', description: 'Aucun problème de stationnement. Parking privatif pouvant accueillir plusieurs voitures. Borne de recharge pour véhicules électriques à disposition.', imageSrc: '/images/garage.jpeg', highlight: false },
    ],
  },
  detailsSection: {
    chambresTitle: 'Les Chambres',
    chambresParagraphs: [
      'Une première chambre de 12 m² comporte un lit de 160 cm avec une TV Samsung Frame pour vos moments de détente. De nombreux rangements sont disponibles.',
      'Une deuxième chambre très grande comporte deux lits de 90 cm formant un seul grand lit pour les couples. Elle est située sous comble et n\'est pas adaptée pour les personnes de très grande taille. Elle comporte également un téléviseur.',
      'Il est possible de dormir dans la partie salon sur le canapé convertible de 160 cm pour ceux qui préfèrent.',
    ],
    chambresHighlight: 'Les lits sont faits à votre arrivée, le linge de toilette et de maison sont fournis.',
    cuisineTitle: 'Cuisine & Commodités',
    cuisineParagraphs: [
      'La cuisine entièrement équipée dispose de tout le nécessaire : vaisselle complète, électroménager, ustensiles de cuisine.',
      'Nous avons prévu le vinaigre, huile, sel et poivre, moutarde et ketchup pour simplifier votre logistique.',
      'Également à disposition : sèche-cheveux, set de nettoyage de dépannage, nombreux équipements pour rendre votre séjour le plus confortable possible.',
    ],
  },
  amenitiesSection: {
    badge: 'Tout Compris',
    title: 'Tous les Équipements',
    subtitle: 'Tout a été pensé pour votre confort et pour simplifier votre séjour',
    amenities: [
      { icon: 'Wifi', label: 'WiFi Fibre', desc: 'Très haut débit gratuit' },
      { icon: 'Tv', label: '3 Téléviseurs', desc: "Samsung Frame & 50'" },
      { icon: 'Wind', label: 'Climatisation', desc: '2 cassettes Daikin' },
      { icon: 'WashingMachine', label: 'Lave-linge', desc: 'Et sèche-linge' },
      { icon: 'Shirt', label: 'Linge fourni', desc: 'Maison et toilette' },
      { icon: 'Bath', label: 'Lits faits', desc: "À l'arrivée" },
      { icon: 'Coffee', label: 'Condiments', desc: 'Huile, sel, vinaigre...' },
      { icon: 'Zap', label: 'Fer à repasser', desc: 'Table et fer' },
      { icon: 'PartyPopper', label: 'Jeux de société', desc: 'Pour toute la famille' },
      { icon: 'TreePine', label: 'Parc 2500 m²', desc: 'Calme absolu' },
      { icon: 'Home', label: 'Ménage inclus', desc: 'Fin de séjour' },
      { icon: 'Sparkles', label: 'Jacuzzi 6 places', desc: "Ouvert toute l'année" },
    ],
  },
  includedSection: {
    title: 'Services Inclus',
    subtitle: 'Pour un séjour sans surprise, ces prestations sont comprises dans le tarif',
    services: ['Ménage de fin de séjour', 'Taxe de séjour', 'Linge de maison et de toilette', "Lits faits à l'arrivée", 'Accueil par les hôtes', 'Set de nettoyage de dépannage'],
  },
  infoSection: {
    title: 'Informations Importantes',
    paragraphs: [
      "L'accueil se fait par les hôtes de la maison. L'appartement garantit un très bon niveau de confort.",
      "Cependant, il n'est pas adapté aux personnes ayant de grosses difficultés à monter les escaliers pour accéder au gîte (entrée au premier étage).",
    ],
  },
  ctaSection: {
    title: 'Prêt à Réserver ?',
    subtitle: 'Découvrez la région alsacienne ou demandez directement votre devis personnalisé',
    button1Text: 'Découvrir la Région',
    button1Link: '/tourisme',
    button2Text: 'Demander un Devis',
    button2Link: '/contact',
  },
  seo: {
    metaTitle: "Le Gîte - l'écrin du vignoble | Appartement 4 Personnes avec Jacuzzi en Alsace",
    metaDescription: "Découvrez notre gîte haut de gamme de 4 personnes à Wettolsheim : 2 chambres confortables, salon spacieux avec TV 50', cuisine équipée, jacuzzi extérieur 6 places, climatisation Daikin, WiFi fibre. Linge fourni, lits faits à l'arrivée.",
    keywords: ['gîte 4 personnes Alsace', 'appartement Wettolsheim', 'location meublée Colmar', 'gîte 2 chambres Alsace', 'hébergement familial Route des Vins', 'gîte jacuzzi Alsace'],
  },
}

// Génération dynamique des métadonnées
export async function generateMetadata(): Promise<Metadata> {
  const data = await getGitePage()
  const seo = data?.seo || defaultData.seo

  return {
    title: seo.metaTitle,
    description: seo.metaDescription,
    keywords: seo.keywords,
    alternates: {
      canonical: "https://lecrinduvignoble.fr/gite",
    },
    openGraph: {
      title: seo.metaTitle?.split(' - ')[0] || "Le Gîte - l'écrin du vignoble",
      description: seo.metaDescription,
      type: "website",
      url: "https://lecrinduvignoble.fr/gite",
      siteName: "l'écrin du vignoble",
      locale: "fr_FR",
      images: [
        {
          url: "https://lecrinduvignoble.fr/images/salon_nuit.webp",
          width: 1200,
          height: 630,
          alt: "Intérieur chaleureux du gîte l'écrin du vignoble en Alsace",
        },
        {
          url: "https://lecrinduvignoble.fr/images/jaccuzi.jpeg",
          width: 1200,
          height: 630,
          alt: "Jacuzzi privatif 6 places du gîte",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.metaTitle?.split(' - ')[0] || "Le Gîte - l'écrin du vignoble",
      description: seo.metaDescription,
      images: ["https://lecrinduvignoble.fr/images/salon_nuit.webp"],
    },
  }
}

export default async function GitePage() {
  const data = await getGitePage()

  // Merge avec les valeurs par défaut
  const hero = data?.hero || defaultData.hero
  const descSection = data?.descriptionSection || defaultData.descriptionSection
  const roomsSection = data?.roomsSection || defaultData.roomsSection
  const servicesSection = data?.servicesSection || defaultData.servicesSection
  const detailsSection = data?.detailsSection || defaultData.detailsSection
  const amenitiesSection = data?.amenitiesSection || defaultData.amenitiesSection
  const includedSection = data?.includedSection || defaultData.includedSection
  const infoSection = data?.infoSection || defaultData.infoSection
  const ctaSection = data?.ctaSection || defaultData.ctaSection

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section - Image hardcodée */}
        <section className="relative h-[60vh] min-h-[400px] sm:min-h-[500px] bg-anthracite">
          <div className="absolute inset-0">
            <Image
              src="/images/salon_nuit.webp"
              alt="Intérieur du gîte l'écrin du vignoble - Salon lumineux avec vue sur le vignoble alsacien"
              fill
              className="object-cover opacity-40"
              priority
              quality={60}
              sizes="100vw"
            />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
            <span className="text-white drop-shadow-md font-serif text-base sm:text-lg tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4">
              {hero.badge}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white max-w-4xl px-2">
              {hero.title}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-white/90 max-w-2xl px-4">
              {hero.subtitle}
            </p>
          </div>
        </section>

        {/* Description Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate mb-4 sm:mb-6 px-4">
                {descSection.title}
              </h2>
              <p className="text-taupe text-lg leading-relaxed mb-4">
                {descSection.paragraph1}
              </p>
              <p className="text-taupe text-lg leading-relaxed">
                {descSection.paragraph2}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12 md:mb-16">
              {(descSection.features || defaultData.descriptionSection.features).map((feature, index) => {
                const IconComponent = iconMap[feature.icon] || Home
                return (
                  <div key={index} className="bg-white p-5 sm:p-6 rounded-2xl text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                    </div>
                    <h3 className="font-medium text-slate mb-1 text-sm sm:text-base">{feature.label}</h3>
                    <p className="text-xs sm:text-sm text-taupe">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Rooms Grid */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">{roomsSection.badge}</span>
              <h2 className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate px-4">
                {roomsSection.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {(roomsSection.rooms || defaultData.roomsSection.rooms).map((room, index) => {
                const isBathroom = room.title === "Salle de bain"
                const imageSrc = room.image?.asset
                  ? urlFor(room.image).width(800).height(isBathroom ? 1000 : 600).url()
                  : defaultData.roomsSection.rooms[index]?.imageSrc || '/images/salon.webp'
                const imageAlt = room.image?.alt || room.title

                return (
                  <article
                    key={index}
                    className={`group bg-cream rounded-3xl overflow-hidden ${isBathroom ? "md:col-span-2 md:max-w-2xl md:mx-auto" : ""}`}
                  >
                    <div className={`relative ${isBathroom ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                      <Image
                        src={imageSrc}
                        alt={imageAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 sm:p-8">
                      <div className="flex justify-between items-start mb-2 sm:mb-3">
                        <h3 className="font-serif text-xl sm:text-2xl text-slate">{room.title}</h3>
                        <span className="text-xs sm:text-sm text-gold font-medium">{room.size}</span>
                      </div>
                      <p className="text-taupe leading-relaxed text-sm sm:text-base">{room.description}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Main Services Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">{servicesSection.badge}</span>
              <h2 className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate px-4">
                {servicesSection.title}
              </h2>
            </div>

            <div className="space-y-10 sm:space-y-12">
              {(servicesSection.services || defaultData.servicesSection.services).map((service, index) => {
                const IconComponent = iconMap[service.icon] || Sparkles
                const imageSrc = service.image?.asset
                  ? urlFor(service.image).width(800).height(600).url()
                  : defaultData.servicesSection.services[index]?.imageSrc || '/images/jaccuzi.jpeg'
                const isHighlight = service.highlight ?? false

                return (
                  <article
                    key={index}
                    className={`grid lg:grid-cols-2 gap-6 sm:gap-8 items-center ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
                  >
                    <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                      <Image
                        src={imageSrc}
                        alt={`${service.title} - ${service.subtitle}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-700"
                      />
                    </div>

                    <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6 ${isHighlight ? "bg-gold" : "bg-gold/10"}`}>
                        <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${isHighlight ? "text-cream" : "text-gold"}`} />
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate mb-2 sm:mb-3">{service.title}</h3>
                      <p className="text-gold font-medium mb-3 sm:mb-4 text-sm sm:text-base">{service.subtitle}</p>
                      <p className="text-taupe text-base sm:text-lg leading-relaxed">{service.description}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-slate mb-4 sm:mb-6">{detailsSection.chambresTitle}</h2>
                <div className="space-y-4 text-taupe leading-relaxed">
                  {(detailsSection.chambresParagraphs || defaultData.detailsSection.chambresParagraphs).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                  {detailsSection.chambresHighlight && (
                    <p className="text-gold font-medium">{detailsSection.chambresHighlight}</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-slate mb-4 sm:mb-6">{detailsSection.cuisineTitle}</h2>
                <div className="space-y-4 text-taupe leading-relaxed">
                  {(detailsSection.cuisineParagraphs || defaultData.detailsSection.cuisineParagraphs).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Amenities Grid */}
        <section className="py-12 sm:py-16 md:py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 md:mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">{amenitiesSection.badge}</span>
              <h2 className="mt-4 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate px-4">
                {amenitiesSection.title}
              </h2>
              <p className="mt-4 text-taupe text-base sm:text-lg max-w-2xl mx-auto px-4">
                {amenitiesSection.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {(amenitiesSection.amenities || defaultData.amenitiesSection.amenities).map((amenity, index) => {
                const IconComponent = iconMap[amenity.icon] || Home
                return (
                  <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl text-center hover:bg-gold/10 transition-colors">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                    </div>
                    <h3 className="font-medium text-slate mb-1 text-xs sm:text-sm md:text-base">{amenity.label}</h3>
                    <p className="text-xs sm:text-sm text-taupe">{amenity.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Included Services */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="bg-cream p-6 sm:p-8 md:p-12 rounded-3xl">
              <div className="text-center mb-8 sm:mb-10 md:mb-12">
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate mb-3 sm:mb-4 px-4">{includedSection.title}</h2>
                <p className="text-taupe text-lg">{includedSection.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {(includedSection.services || defaultData.includedSection.services).map((service, index) => (
                  <div key={index} className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-gold rounded-full flex items-center justify-center mt-0.5 sm:mt-1">
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 text-cream"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-slate font-medium text-sm sm:text-base">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Important Info */}
        <section className="py-10 sm:py-12 md:py-16 bg-gold/10">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl">
              <h3 className="font-serif text-xl sm:text-2xl text-slate mb-4 sm:mb-6 text-center px-4">{infoSection.title}</h3>
              <div className="space-y-4 text-taupe text-center max-w-3xl mx-auto">
                {(infoSection.paragraphs || defaultData.infoSection.paragraphs).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 bg-anthracite text-white text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6 px-4">{ctaSection.title}</h2>
            <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 px-4">{ctaSection.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Link
                href={ctaSection.button1Link || '/tourisme'}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-medium tracking-wide rounded-full hover:bg-white hover:text-slate transition-all text-center"
              >
                {ctaSection.button1Text}
              </Link>
              <Link
                href={ctaSection.button2Link || '/contact'}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gold text-cream font-medium tracking-wide rounded-full hover:bg-gold-dark transition-all text-center"
              >
                {ctaSection.button2Text}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
