import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer id="contact" className="bg-anthracite text-white">
      {/* Contact Section */}
      <div className="py-20 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <h2 className="font-serif text-3xl text-white">L'Écrin du Vignoble</h2>
              <p className="mt-6 text-white/70 max-w-md leading-relaxed">
                Gîte luxueux avec jacuzzi au cœur du vignoble alsacien.
                À 10 minutes d'Eguisheim, l'un des
                plus beaux villages de France.
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-serif text-xl mb-6">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <span className="text-white/70">
                    L'Écrin du Vignoble
                    <br />
                    68920 Wettolsheim
                    <br />
                    Alsace, France
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gold flex-shrink-0" />
                  <a href="tel:+33681842554" className="text-white/70 hover:text-gold transition-colors">
                    +33 6 81 84 25 54
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gold flex-shrink-0" />
                  <a
                    href="mailto:contact@ecrin-vignoble.fr"
                    className="text-white/70 hover:text-gold transition-colors"
                  >
                    contact@ecrin-vignoble.fr
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-serif text-xl mb-6">Liens rapides</h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Accueil" },
                  { href: "/gite", label: "Le Gîte" },
                  { href: "/tourisme", label: "La Région" },
                  { href: "/contact", label: "Contact & Réservation" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/70 hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm">
              © {new Date().getFullYear()} L'Écrin du Vignoble. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/mentions-legales" className="text-white/50 hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="text-white/50 hover:text-white transition-colors">
                Confidentialité
              </Link>
              <Link href="/plan-du-site" className="text-white/50 hover:text-white transition-colors">
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
