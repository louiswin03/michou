import type { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import QuoteCalculator from "@/components/quote-calculator"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact & Réservation - L'Écrin du Vignoble | Demandez votre Devis",
  description:
    "Contactez-nous pour réserver votre séjour au gîte L'Écrin du Vignoble à Wettolsheim. Calculateur de devis en ligne, réponse rapide. Gîte 4 personnes avec jacuzzi en Alsace.",
  keywords: [
    "réservation gîte Alsace",
    "devis location Wettolsheim",
    "contact gîte Colmar",
    "réserver hébergement Eguisheim",
    "tarifs gîte Alsace",
  ],
  openGraph: {
    title: "Contact & Réservation - L'Écrin du Vignoble",
    description: "Demandez votre devis personnalisé en ligne. Réponse rapide garantie.",
    type: "website",
  },
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative bg-anthracite py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-gold font-serif text-lg tracking-[0.3em] uppercase mb-4 block">Contact</span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white max-w-4xl mx-auto">
              Réservez Votre Séjour
            </h1>
            <p className="mt-6 text-lg text-white/90 max-w-2xl mx-auto">
              Calculez votre devis en ligne ou contactez-nous directement
            </p>
          </div>
        </section>

        {/* Quote Calculator Section */}
        <section id="devis" className="py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Devis en Ligne</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                Calculez Votre Estimation
              </h2>
              <p className="mt-4 text-taupe text-lg max-w-2xl mx-auto">
                Obtenez une estimation personnalisée en quelques clics. Tarif dégressif selon la durée de votre séjour.
              </p>
            </div>

            <QuoteCalculator />
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Nous Contacter</span>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">
                Informations de Contact
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-cream p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl text-slate mb-3">Adresse</h3>
                <p className="text-taupe leading-relaxed">
                  L'Écrin du Vignoble
                  <br />
                  68920 Wettolsheim
                  <br />
                  Alsace, France
                </p>
              </div>

              <div className="bg-cream p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl text-slate mb-3">Téléphone</h3>
                <a href="tel:+33681842554" className="text-taupe hover:text-gold transition-colors">
                  +33 6 81 84 25 54
                </a>
              </div>

              <div className="bg-cream p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl text-slate mb-3">Email</h3>
                <a
                  href="mailto:contact@ecrin-vignoble.fr"
                  className="text-taupe hover:text-gold transition-colors break-all"
                >
                  contact@ecrin-vignoble.fr
                </a>
              </div>

              <div className="bg-cream p-8 rounded-2xl text-center">
                <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-gold" />
                </div>
                <h3 className="font-serif text-xl text-slate mb-3">Horaires</h3>
                <p className="text-taupe leading-relaxed">
                  Arrivée : 16h00
                  <br />
                  Départ : 10h00
                  <br />
                  <span className="text-xs text-slate">(Modulable selon disponibilité)</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-cream">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl text-slate mb-4">Comment Nous Trouver</h2>
              <p className="text-taupe text-lg">
                Au cœur du vignoble alsacien, à 10 minutes à pied d'Eguisheim et 5 km de Colmar
              </p>
            </div>

            <div className="bg-white p-4 rounded-3xl shadow-lg">
              <div className="aspect-[16/9] bg-cream-dark rounded-2xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d21496.562287936!2d7.2775!3d48.0567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479163c3e64c3af9%3A0x40a5fb99a3b7c60!2s68920%20Wettolsheim%2C%20France!5e0!3m2!1sfr!2sfr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Carte de localisation de L'Écrin du Vignoble à Wettolsheim"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Access Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="font-serif text-3xl text-slate mb-6">Accès en Voiture</h2>
                <div className="space-y-4 text-taupe leading-relaxed">
                  <p>
                    <strong className="text-slate">Depuis Colmar</strong> : 5 km, environ 10 minutes par la D417
                  </p>
                  <p>
                    <strong className="text-slate">Depuis Strasbourg</strong> : 70 km, environ 1h par l'A35 puis D83
                  </p>
                  <p>
                    <strong className="text-slate">Depuis Mulhouse</strong> : 60 km, environ 50 min par l'A35
                  </p>
                  <p>
                    <strong className="text-slate">Depuis Bâle (Suisse)</strong> : 80 km, environ 1h par l'A35
                  </p>
                  <p className="text-gold font-medium">
                    Parking privé avec borne de recharge pour véhicules électriques
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-serif text-3xl text-slate mb-6">Transports en Commun</h2>
                <div className="space-y-4 text-taupe leading-relaxed">
                  <p>
                    <strong className="text-slate">Gare la plus proche</strong> : Colmar (5 km)
                    <br />
                    TGV depuis Paris Gare de l'Est (2h30)
                  </p>
                  <p>
                    <strong className="text-slate">Aéroports</strong> :
                    <br />
                    - EuroAirport Bâle-Mulhouse (60 km)
                    <br />
                    - Strasbourg-Entzheim (75 km)
                  </p>
                  <p>
                    <strong className="text-slate">Bus</strong> : Lignes régulières depuis Colmar vers Wettolsheim
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-anthracite text-white text-center">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Une Question ?</h2>
            <p className="text-white/80 text-lg mb-8">
              N'hésitez pas à nous contacter, nous vous répondrons dans les plus brefs délais
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+33681842554"
                className="px-8 py-4 border-2 border-white text-white font-medium tracking-wide rounded-full hover:bg-white hover:text-slate transition-all"
              >
                Nous Appeler
              </a>
              <a
                href="mailto:contact@ecrin-vignoble.fr"
                className="px-8 py-4 bg-gold text-cream font-medium tracking-wide rounded-full hover:bg-gold-dark transition-all"
              >
                Nous Écrire
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
