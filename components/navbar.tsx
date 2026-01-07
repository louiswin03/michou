"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/gite", label: "Le Gîte" },
  { href: "/tourisme", label: "Région" },
  { href: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-cream/95 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative z-50">
              <span className={`font-serif text-2xl font-bold transition-colors ${
                isMobileMenuOpen ? "text-white" : isScrolled ? "text-slate" : "text-white"
              }`}>
                L'Écrin du Vignoble
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors hover:text-gold ${
                    pathname === link.href
                      ? "text-gold"
                      : isScrolled
                        ? "text-slate"
                        : "text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center px-6 py-2.5 bg-gold text-cream text-sm font-medium tracking-wide rounded-full hover:bg-gold-dark transition-colors"
            >
              Réserver / Devis
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 relative z-50 ${isMobileMenuOpen ? "text-white" : isScrolled ? "text-slate" : "text-white"}`}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Full Screen Overlay */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-slate/95 backdrop-blur-md"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 p-2 text-white hover:text-gold transition-colors z-50"
          aria-label="Fermer le menu"
        >
          <X size={32} />
        </button>

        {/* Menu Content */}
        <div className="relative h-full flex flex-col items-center justify-center px-8">
          <div className="flex flex-col gap-8 text-center">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-serif text-3xl transition-all duration-300 ${
                  pathname === link.href ? "text-gold" : "text-white hover:text-gold"
                } ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mt-8 px-8 py-4 bg-gold text-cream font-medium text-lg rounded-full hover:bg-gold/90 transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: isMobileMenuOpen ? `${navLinks.length * 50}ms` : "0ms",
              }}
            >
              Réserver / Devis
            </Link>
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <p className="text-white/50 text-sm tracking-widest uppercase">L'Écrin du Vignoble</p>
          </div>
        </div>
      </div>
    </>
  )
}
