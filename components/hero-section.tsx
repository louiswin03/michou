import Image from "next/image"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section id="accueil" className="relative h-screen min-h-[600px] sm:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/salon.webp"
          alt="Salon chaleureux du gîte l'écrin du vignoble avec poutres apparentes et vue sur le vignoble"
          fill
          className="object-cover"
          priority
          quality={60}
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAQMDBAMBAAAAAAAAAAAAAQIDBAAFEQYSITETQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEEEP/oAfMf0K"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 sm:px-6">
        <span className="text-white drop-shadow-md font-serif text-base sm:text-lg md:text-xl tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-3 sm:mb-4 animate-fade-in">
          Wettolsheim — Alsace
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white max-w-4xl leading-tight px-2">
          Gîte luxueux avec jacuzzi au Cœur du Vignoble
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl px-4">
          À 10 minutes à pied d'Eguisheim, l'un des plus beaux villages de France, découvrez un havre de paix avec jacuzzi inclus et
          prestations haut de gamme
        </p>

        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 px-4 sm:px-0">
          <Link
            href="/contact"
            className="px-8 py-4 bg-gold text-cream font-medium tracking-wide rounded-full hover:bg-gold-dark transition-all hover:scale-105"
          >
            Demander un Devis
          </Link>
          <Link
            href="/gite"
            className="px-8 py-4 border-2 border-white text-white font-medium tracking-wide rounded-full hover:bg-white hover:text-slate transition-all"
          >
            Découvrir le Gîte
          </Link>
        </div>

        <p className="mt-6 text-sm sm:text-base text-white/90 font-medium bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm animate-fade-in-up">
          💎 Réservez en direct et économisez 20% (sans frais de plateforme, meilleur tarif garanti)
        </p>


      </div>
    </section>
  )
}
