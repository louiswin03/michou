"use client"

import { useState } from "react"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"

const testimonials = [
  {
    name: "IChieh",
    location: "7 ans sur Airbnb",
    rating: 5,
    text: "Il s'agit d'une très belle maison avec un excellent éclairage, entièrement équipée et un stationnement facile ! Et Michel et sa femme sont des hôtes très sympathiques ! Le vignoble voisin est spectaculaire, et j'ai trouvé les lampadaires ici particulièrement beaux. Notre famille de quatre personnes y a séjourné quatre nuits pour explorer Colmar et Eguisheim, et nous avons adoré !",
    date: "Novembre 2025",
  },
  {
    name: "Madeleine",
    location: "Bonstetten, Suisse",
    rating: 5,
    text: "Notre séjour chez Michel et Anne était magnifique. Nous avons été très bien accueillis, nous avons même pu entrer dans l'appartement le matin. Ils nous ont expliqué tout ce qui était nécessaire pour l'appartement et l'équipement. Nous avons reçu de précieux conseils sur les environs et les restaurants. Ils nous ont gâtés avec une bouteille de Crémant d'Alsace et quelque chose de sucré. Après nos explorations de la journée, nous nous sommes réjouis du jacuzzi dans le jardin. L'appartement est vraiment un bijou et est équipé de tout ce que vous pouvez souhaiter.",
    date: "Octobre 2025",
  },
  {
    name: "Tanja",
    location: "1 an sur Airbnb",
    rating: 5,
    text: "Nous avons passé dix jours merveilleux dans l'appartement de Michel ! Nos hôtes étaient très accommodants et nous ont donné des conseils détaillés sur l'appartement et les restaurants et les vignobles de la région. On peut aussi laisser la voiture et faire des promenades, des randonnées et des balades à vélo dans les vignes, dans la forêt, à Eguisheim et Colmar. Une région très agréable et un hébergement accueillant, confortable et chaleureux. Nous reviendrons avec plaisir !",
    date: "Octobre 2025",
  },
  {
    name: "Adriana",
    location: "4 ans sur Airbnb",
    rating: 5,
    text: "Nous étions une famille de quatre personnes qui se sont senties comme à la maison et avons beaucoup apprécié de visiter la région de l'Alsace et plus encore à cette période de Noël. L'appartement de Michel & Anne est très agréable, moderne, entièrement équipé et tout à fait conforme aux photos de leur annonce. Ils ont été très gentils de nous accueillir et de nous expliquer en détail tout sur la maison, l'emplacement et les choses à faire dans la région.",
    date: "Décembre 2025",
  },
]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => setCurrentIndex((i) => (i + 1) % testimonials.length)
  const prev = () => setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  return (
    <section id="avis" className="py-24 lg:py-32 bg-anthracite">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full mb-8">
            <span className="text-white font-medium">5,0</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-white/70 text-sm">sur Airbnb • 24 avis</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white">Ce que disent nos hôtes</h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <Quote className="absolute -top-8 left-0 w-16 h-16 text-gold/20" />

          {/* Testimonial */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12">
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-gold text-gold" />
              ))}
            </div>
            <blockquote className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
              "{testimonials[currentIndex].text}"
            </blockquote>
            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{testimonials[currentIndex].name}</p>
                <p className="text-white/60 text-sm">
                  {testimonials[currentIndex].location} • {testimonials[currentIndex].date}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={prev}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  aria-label="Avis précédent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={next}
                  className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                  aria-label="Avis suivant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "w-8 bg-gold" : "bg-white/30"}`}
                aria-label={`Aller à l'avis ${i + 1}`}
              />
            ))}
          </div>

          {/* Voir tous les avis Airbnb */}
          <div className="flex justify-center mt-12">
            <a
              href="https://www.airbnb.fr/rooms/1281724811283528938/reviews?location=Wettolsheim&search_mode=regular_search&adults=1&check_in=2026-03-27&check_out=2026-04-01&children=0&infants=0&pets=0&source_impression_id=p3_1766854428_P3ltS9Cdc3CdNR-1&previous_page_section_name=1001&federated_search_id=3b7df167-02d6-41d1-b465-6127b33d6715&_set_bev_on_new_domain=1766854386_EAMmRjNDNjNWQ3ZW&set_everest_cookie_on_new_domain=1766854386.EAY2U1ZWY5NTcyOWY2Y2.lrw5o3lqnNUDYV1sxT8XbqgVbOYdlhh_U3AX9-OIBRM"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-300 border border-white/20 hover:border-gold/50"
            >
              <span className="text-white font-medium">Voir tous les avis sur Airbnb</span>
              <svg
                className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
